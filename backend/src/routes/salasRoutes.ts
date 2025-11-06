import { Router } from "express";
import * as salasController from "../controllers/salasController";

const router = Router();

/**
 * @swagger
 * /api/salas:
 *   get:
 *     summary: Get all salas with bloco information
 *     tags: [Salas]
 *     responses:
 *       200:
 *         description: List of all salas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Sala'
 */
router.get("/", salasController.getAllSalas);

/**
 * @swagger
 * /api/salas/{id}:
 *   get:
 *     summary: Get sala by ID with bloco and equipamentos
 *     tags: [Salas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Sala ID
 *     responses:
 *       200:
 *         description: Sala details with equipamentos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sala'
 *       404:
 *         description: Sala not found
 */
router.get("/:id", salasController.getSalaById);

/**
 * @swagger
 * /api/salas:
 *   post:
 *     summary: Create a new sala
 *     tags: [Salas]
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
 *                 example: Sala 301
 *               descricao:
 *                 type: string
 *                 example: Conference room
 *               capacidade:
 *                 type: integer
 *                 example: 50
 *               bloco_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Sala created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sala'
 */
router.post("/", salasController.createSala);

/**
 * @swagger
 * /api/salas/{id}:
 *   put:
 *     summary: Update a sala
 *     tags: [Salas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Sala ID
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
 *               capacidade:
 *                 type: integer
 *               bloco_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Sala updated successfully
 *       404:
 *         description: Sala not found
 */
router.put("/:id", salasController.updateSala);

/**
 * @swagger
 * /api/salas/{id}:
 *   delete:
 *     summary: Delete a sala
 *     tags: [Salas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Sala ID
 *     responses:
 *       200:
 *         description: Sala deleted successfully
 *       404:
 *         description: Sala not found
 */
router.delete("/:id", salasController.deleteSala);

/**
 * @swagger
 * /api/salas/{id}/equipamentos:
 *   post:
 *     summary: Add equipamento to sala
 *     tags: [Salas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Sala ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - equipamento_id
 *             properties:
 *               equipamento_id:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Equipamento added to sala successfully
 *       400:
 *         description: Invalid input
 */
router.post("/:id/equipamentos", salasController.addEquipamentoToSala);

/**
 * @swagger
 * /api/salas/{id}/equipamentos/{equipamento_id}:
 *   delete:
 *     summary: Remove equipamento from sala
 *     tags: [Salas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Sala ID
 *       - in: path
 *         name: equipamento_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Equipamento ID
 *     responses:
 *       200:
 *         description: Equipamento removed from sala successfully
 *       404:
 *         description: Relationship not found
 */
router.delete(
  "/:id/equipamentos/:equipamento_id",
  salasController.removeEquipamentoFromSala
);

export default router;
