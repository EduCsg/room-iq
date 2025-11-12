import { Router } from "express";
import * as equipamentosController from "../controllers/equipamentosController";

const router = Router();

/**
 * @swagger
 * /api/equipamentos:
 *   get:
 *     summary: Get all equipamentos
 *     tags: [Equipamentos]
 *     responses:
 *       200:
 *         description: List of all equipamentos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Equipamento'
 */
router.get("/", equipamentosController.getAllEquipamentos);

/**
 * @swagger
 * /api/equipamentos/{id}:
 *   get:
 *     summary: Get equipamento by ID
 *     tags: [Equipamentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Equipamento ID
 *     responses:
 *       200:
 *         description: Equipamento details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Equipamento'
 *       404:
 *         description: Equipamento not found
 */
router.get("/:id", equipamentosController.getEquipamentoById);

/**
 * @swagger
 * /api/equipamentos:
 *   post:
 *     summary: Create a new equipamento
 *     tags: [Equipamentos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantidade
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Notebook
 *               descricao:
 *                 type: string
 *                 example: Dell i5 Laptop
 *               quantidade:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       201:
 *         description: Equipamento created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Equipamento'
 *       400:
 *         description: Invalid input
 */
router.post("/", equipamentosController.createEquipamento);

/**
 * @swagger
 * /api/equipamentos/{id}:
 *   put:
 *     summary: Update an equipamento
 *     tags: [Equipamentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Equipamento ID
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
 *               quantidade:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Equipamento updated successfully
 *       404:
 *         description: Equipamento not found
 */
router.put("/:id", equipamentosController.updateEquipamento);

/**
 * @swagger
 * /api/equipamentos/{id}:
 *   delete:
 *     summary: Delete an equipamento
 *     tags: [Equipamentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Equipamento ID
 *     responses:
 *       200:
 *         description: Equipamento deleted successfully
 *       404:
 *         description: Equipamento not found
 */
router.delete("/:id", equipamentosController.deleteEquipamento);

export default router;
