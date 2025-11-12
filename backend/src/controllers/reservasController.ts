import { Request, Response } from "express";
import pool from "../database/config";
import { Reserva } from "../types";

export const getAllReservas = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT 
        r.*,
        u.nome as usuario_nome,
        s.nome as sala_nome,
        b.nome as bloco_nome
      FROM reservas r
      LEFT JOIN usuarios u ON r.usuario_id = u.usuario_id
      LEFT JOIN salas s ON r.sala_id = s.sala_id
      LEFT JOIN blocos b ON s.bloco_id = b.bloco_id
      ORDER BY r.data_reserva DESC, r.hora_inicio DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching reservas:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getReservaById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `
      SELECT 
        r.*,
        u.nome as usuario_nome,
        u.email as usuario_email,
        s.nome as sala_nome,
        s.capacidade as sala_capacidade,
        b.nome as bloco_nome
      FROM reservas r
      LEFT JOIN usuarios u ON r.usuario_id = u.usuario_id
      LEFT JOIN salas s ON r.sala_id = s.sala_id
      LEFT JOIN blocos b ON s.bloco_id = b.bloco_id
      WHERE r.reserva_id = $1
    `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Reserva not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching reserva:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getReservasByUsuario = async (req: Request, res: Response) => {
  try {
    const { usuario_id } = req.params;
    const result = await pool.query(
      `
      SELECT 
        r.*,
        s.nome as sala_nome,
        b.nome as bloco_nome
      FROM reservas r
      LEFT JOIN salas s ON r.sala_id = s.sala_id
      LEFT JOIN blocos b ON s.bloco_id = b.bloco_id
      WHERE r.usuario_id = $1
      ORDER BY r.data_reserva DESC, r.hora_inicio DESC
    `,
      [usuario_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching reservas by usuario:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getReservasBySala = async (req: Request, res: Response) => {
  try {
    const { sala_id } = req.params;
    const result = await pool.query(
      `
      SELECT 
        r.*,
        u.nome as usuario_nome
      FROM reservas r
      LEFT JOIN usuarios u ON r.usuario_id = u.usuario_id
      WHERE r.sala_id = $1
      ORDER BY r.data_reserva DESC, r.hora_inicio DESC
    `,
      [sala_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching reservas by sala:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createReserva = async (req: Request, res: Response) => {
  try {
    const {
      status,
      data_reserva,
      hora_inicio,
      hora_fim,
      usuario_id,
      sala_id,
    }: Reserva = req.body;

    if (!status || !data_reserva || !hora_inicio || !usuario_id || !sala_id) {
      return res.status(400).json({
        error:
          "status, data_reserva, hora_inicio, usuario_id, and sala_id are required",
      });
    }

    // Check for conflicting reservations
    const conflictCheck = await pool.query(
      `
      SELECT * FROM reservas
      WHERE sala_id = $1
        AND data_reserva = $2
        AND status != 'cancelada'
        AND (
          (hora_inicio <= $3 AND hora_fim > $3) OR
          (hora_inicio < $4 AND hora_fim >= $4) OR
          (hora_inicio >= $3 AND hora_fim <= $4)
        )
    `,
      [sala_id, data_reserva, hora_inicio, hora_fim]
    );

    if (conflictCheck.rows.length > 0) {
      return res.status(409).json({ error: "Time slot already reserved" });
    }

    const result = await pool.query(
      "INSERT INTO reservas (status, data_reserva, hora_inicio, hora_fim, usuario_id, sala_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [status, data_reserva, hora_inicio, hora_fim, usuario_id, sala_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating reserva:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateReserva = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      status,
      data_reserva,
      hora_inicio,
      hora_fim,
      usuario_id,
      sala_id,
    }: Reserva = req.body;

    const result = await pool.query(
      "UPDATE reservas SET status = $1, data_reserva = $2, hora_inicio = $3, hora_fim = $4, usuario_id = $5, sala_id = $6 WHERE reserva_id = $7 RETURNING *",
      [status, data_reserva, hora_inicio, hora_fim, usuario_id, sala_id, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Reserva not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating reserva:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateReservaStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const result = await pool.query(
      "UPDATE reservas SET status = $1 WHERE reserva_id = $2 RETURNING *",
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Reserva not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating reserva status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteReserva = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM reservas WHERE reserva_id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Reserva not found" });
    }

    res.json({ message: "Reserva deleted successfully" });
  } catch (error) {
    console.error("Error deleting reserva:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
