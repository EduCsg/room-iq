import { Request, Response } from "express";
import pool from "../database/config";
import { Bloco } from "../types";

export const getAllBlocos = async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM blocos ORDER BY bloco_id");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching blocos:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getBlocoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM blocos WHERE bloco_id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Bloco not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching bloco:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createBloco = async (req: Request, res: Response) => {
  try {
    const { nome, descricao, andar }: Bloco = req.body;

    if (!nome) {
      return res.status(400).json({ error: "Nome is required" });
    }

    const result = await pool.query(
      "INSERT INTO blocos (nome, descricao, andar) VALUES ($1, $2, $3) RETURNING *",
      [nome, descricao, andar]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating bloco:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateBloco = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nome, descricao, andar }: Bloco = req.body;

    const result = await pool.query(
      "UPDATE blocos SET nome = $1, descricao = $2, andar = $3 WHERE bloco_id = $4 RETURNING *",
      [nome, descricao, andar, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Bloco not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating bloco:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteBloco = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM blocos WHERE bloco_id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Bloco not found" });
    }

    res.json({ message: "Bloco deleted successfully" });
  } catch (error) {
    console.error("Error deleting bloco:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
