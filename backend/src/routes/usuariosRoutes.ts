import { Router } from "express";
import * as usuariosController from "../controllers/usuariosController";

const router = Router();

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Get all usuarios (passwords excluded)
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: List of all usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 */
router.get("/", usuariosController.getAllUsuarios);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   get:
 *     summary: Get usuario by ID (password excluded)
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Usuario ID
 *     responses:
 *       200:
 *         description: Usuario details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: Usuario not found
 */
router.get("/:id", usuariosController.getUsuarioById);

/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     summary: Create a new usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - senha
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Carlos Mendes
 *               email:
 *                 type: string
 *                 format: email
 *                 example: carlos.mendes@email.com
 *               senha:
 *                 type: string
 *                 format: password
 *                 example: securePassword123
 *     responses:
 *       201:
 *         description: Usuario created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Invalid input
 *       409:
 *         description: Email already exists
 */
router.post("/", usuariosController.createUsuario);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   put:
 *     summary: Update a usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Usuario ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               senha:
 *                 type: string
 *                 format: password
 *                 description: Optional - only include if changing password
 *     responses:
 *       200:
 *         description: Usuario updated successfully
 *       404:
 *         description: Usuario not found
 *       409:
 *         description: Email already exists
 */
router.put("/:id", usuariosController.updateUsuario);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   delete:
 *     summary: Delete a usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Usuario ID
 *     responses:
 *       200:
 *         description: Usuario deleted successfully
 *       404:
 *         description: Usuario not found
 */
router.delete("/:id", usuariosController.deleteUsuario);

export default router;
