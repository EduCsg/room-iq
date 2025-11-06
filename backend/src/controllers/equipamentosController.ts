import { Request, Response } from "express";
import pool from "../database/config";
import { Equipamento } from "../types";

export const getAllEquipamentos = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT * FROM equipamentos ORDER BY equipamento_id"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching equipamentos:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getEquipamentoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM equipamentos WHERE equipamento_id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Equipamento not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching equipamento:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createEquipamento = async (req: Request, res: Response) => {
  try {
    const { nome, descricao, quantidade }: Equipamento = req.body;

    if (quantidade === undefined) {
      return res.status(400).json({ error: "Quantidade is required" });
    }

    const result = await pool.query(
      "INSERT INTO equipamentos (nome, descricao, quantidade) VALUES ($1, $2, $3) RETURNING *",
      [nome, descricao, quantidade]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating equipamento:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateEquipamento = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nome, descricao, quantidade }: Equipamento = req.body;

    const result = await pool.query(
      "UPDATE equipamentos SET nome = $1, descricao = $2, quantidade = $3 WHERE equipamento_id = $4 RETURNING *",
      [nome, descricao, quantidade, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Equipamento not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating equipamento:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteEquipamento = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM equipamentos WHERE equipamento_id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Equipamento not found" });
    }

    res.json({ message: "Equipamento deleted successfully" });
  } catch (error) {
    console.error("Error deleting equipamento:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
