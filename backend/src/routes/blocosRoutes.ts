import { Router } from "express";
import * as blocosController from "../controllers/blocosController";

const router = Router();

/**
 * @swagger
 * /api/blocos:
 *   get:
 *     summary: Get all blocos
 *     tags: [Blocos]
 *     responses:
 *       200:
 *         description: List of all blocos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Bloco'
 */
router.get("/", blocosController.getAllBlocos);

/**
 * @swagger
 * /api/blocos/{id}:
 *   get:
 *     summary: Get bloco by ID
 *     tags: [Blocos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Bloco ID
 *     responses:
 *       200:
 *         description: Bloco details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bloco'
 *       404:
 *         description: Bloco not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", blocosController.getBlocoById);

/**
 * @swagger
 * /api/blocos:
 *   post:
 *     summary: Create a new bloco
 *     tags: [Blocos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Bloco D
 *               descricao:
 *                 type: string
 *                 example: New laboratory building
 *               andar:
 *                 type: string
 *                 example: 3º Andar
 *     responses:
 *       201:
 *         description: Bloco created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bloco'
 *       400:
 *         description: Invalid input
 */
router.post("/", blocosController.createBloco);

/**
 * @swagger
 * /api/blocos/{id}:
 *   put:
 *     summary: Update a bloco
 *     tags: [Blocos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Bloco ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               descricao:
 *                 type: string
 *               andar:
 *                 type: string
 *     responses:
 *       200:
 *         description: Bloco updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bloco'
 *       404:
 *         description: Bloco not found
 */
router.put("/:id", blocosController.updateBloco);

/**
 * @swagger
 * /api/blocos/{id}:
 *   delete:
 *     summary: Delete a bloco
 *     tags: [Blocos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Bloco ID
 *     responses:
 *       200:
 *         description: Bloco deleted successfully
 *       404:
 *         description: Bloco not found
 */
router.delete("/:id", blocosController.deleteBloco);

export default router;
