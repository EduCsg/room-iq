import { Request, Response } from "express";
import pool from "../database/config";
import { Sala } from "../types";

export const getAllSalas = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT s.*, b.nome as bloco_nome 
      FROM salas s
      LEFT JOIN blocos b ON s.bloco_id = b.bloco_id
      ORDER BY s.sala_id
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching salas:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getSalaById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Get sala with bloco info
    const salaResult = await pool.query(
      `
      SELECT s.*, b.nome as bloco_nome 
      FROM salas s
      LEFT JOIN blocos b ON s.bloco_id = b.bloco_id
      WHERE s.sala_id = $1
    `,
      [id]
    );

    if (salaResult.rows.length === 0) {
      return res.status(404).json({ error: "Sala not found" });
    }

    // Get equipamentos for this sala
    const equipamentosResult = await pool.query(
      `
      SELECT e.* 
      FROM equipamentos e
      INNER JOIN sala_equipamento se ON e.equipamento_id = se.equipamento_id
      WHERE se.sala_id = $1
    `,
      [id]
    );

    const sala = salaResult.rows[0];
    sala.equipamentos = equipamentosResult.rows;

    res.json(sala);
  } catch (error) {
    console.error("Error fetching sala:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createSala = async (req: Request, res: Response) => {
  try {
    const { nome, descricao, capacidade, bloco_id }: Sala = req.body;

    if (!nome) {
      return res.status(400).json({ error: "Nome is required" });
    }

    const result = await pool.query(
      "INSERT INTO salas (nome, descricao, capacidade, bloco_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [nome, descricao, capacidade, bloco_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating sala:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateSala = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nome, descricao, capacidade, bloco_id }: Sala = req.body;

    const result = await pool.query(
      "UPDATE salas SET nome = $1, descricao = $2, capacidade = $3, bloco_id = $4 WHERE sala_id = $5 RETURNING *",
      [nome, descricao, capacidade, bloco_id, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Sala not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating sala:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteSala = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM salas WHERE sala_id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Sala not found" });
    }

    res.json({ message: "Sala deleted successfully" });
  } catch (error) {
    console.error("Error deleting sala:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const addEquipamentoToSala = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { equipamento_id } = req.body;

    if (!equipamento_id) {
      return res.status(400).json({ error: "equipamento_id is required" });
    }

    await pool.query(
      "INSERT INTO sala_equipamento (sala_id, equipamento_id) VALUES ($1, $2)",
      [id, equipamento_id]
    );

    res.status(201).json({ message: "Equipamento added to sala successfully" });
  } catch (error) {
    console.error("Error adding equipamento to sala:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const removeEquipamentoFromSala = async (
  req: Request,
  res: Response
) => {
  try {
    const { id, equipamento_id } = req.params;

    const result = await pool.query(
      "DELETE FROM sala_equipamento WHERE sala_id = $1 AND equipamento_id = $2 RETURNING *",
      [id, equipamento_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Relationship not found" });
    }

    res.json({ message: "Equipamento removed from sala successfully" });
  } catch (error) {
    console.error("Error removing equipamento from sala:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
