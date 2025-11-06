import { Request, Response } from "express";
import bcrypt from "bcrypt";
import pool from "../database/config";
import { Usuario } from "../types";

export const getAllUsuarios = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT usuario_id, nome, email, data_criacao, data_atualizacao FROM usuarios ORDER BY usuario_id"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching usuarios:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUsuarioById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT usuario_id, nome, email, data_criacao, data_atualizacao FROM usuarios WHERE usuario_id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuario not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching usuario:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createUsuario = async (req: Request, res: Response) => {
  try {
    const { nome, email, senha }: Usuario = req.body;

    if (!nome || !email || !senha) {
      return res
        .status(400)
        .json({ error: "Nome, email, and senha are required" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(senha, 10);

    const result = await pool.query(
      "INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING usuario_id, nome, email, data_criacao, data_atualizacao",
      [nome, email, hashedPassword]
    );

    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    console.error("Error creating usuario:", error);
    if (error.code === "23505") {
      return res.status(409).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateUsuario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nome, email, senha }: Usuario = req.body;

    let query: string;
    let params: any[];

    if (senha) {
      const hashedPassword = await bcrypt.hash(senha, 10);
      query =
        "UPDATE usuarios SET nome = $1, email = $2, senha = $3, data_atualizacao = CURRENT_TIMESTAMP WHERE usuario_id = $4 RETURNING usuario_id, nome, email, data_criacao, data_atualizacao";
      params = [nome, email, hashedPassword, id];
    } else {
      query =
        "UPDATE usuarios SET nome = $1, email = $2, data_atualizacao = CURRENT_TIMESTAMP WHERE usuario_id = $3 RETURNING usuario_id, nome, email, data_criacao, data_atualizacao";
      params = [nome, email, id];
    }

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuario not found" });
    }

    res.json(result.rows[0]);
  } catch (error: any) {
    console.error("Error updating usuario:", error);
    if (error.code === "23505") {
      return res.status(409).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteUsuario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM usuarios WHERE usuario_id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuario not found" });
    }

    res.json({ message: "Usuario deleted successfully" });
  } catch (error) {
    console.error("Error deleting usuario:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
