import { Router } from "express";
import * as reservasController from "../controllers/reservasController";

const router = Router();

/**
 * @swagger
 * /api/reservas:
 *   get:
 *     summary: Get all reservas with user, sala, and bloco information
 *     tags: [Reservas]
 *     responses:
 *       200:
 *         description: List of all reservas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reserva'
 */
router.get("/", reservasController.getAllReservas);

/**
 * @swagger
 * /api/reservas/{id}:
 *   get:
 *     summary: Get reserva by ID with detailed information
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Reserva ID
 *     responses:
 *       200:
 *         description: Reserva details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reserva'
 *       404:
 *         description: Reserva not found
 */
router.get("/:id", reservasController.getReservaById);

/**
 * @swagger
 * /api/reservas/usuario/{usuario_id}:
 *   get:
 *     summary: Get all reservas by usuario
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Usuario ID
 *     responses:
 *       200:
 *         description: List of reservas for the usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reserva'
 */
router.get("/usuario/:usuario_id", reservasController.getReservasByUsuario);

/**
 * @swagger
 * /api/reservas/sala/{sala_id}:
 *   get:
 *     summary: Get all reservas by sala
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: sala_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Sala ID
 *     responses:
 *       200:
 *         description: List of reservas for the sala
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reserva'
 */
router.get("/sala/:sala_id", reservasController.getReservasBySala);

/**
 * @swagger
 * /api/reservas:
 *   post:
 *     summary: Create a new reserva with conflict detection
 *     tags: [Reservas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *               - data_reserva
 *               - hora_inicio
 *               - usuario_id
 *               - sala_id
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pendente, confirmada, cancelada]
 *                 example: pendente
 *               data_reserva:
 *                 type: string
 *                 format: date
 *                 example: 2025-11-20
 *               hora_inicio:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-11-20T14:00:00
 *               hora_fim:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-11-20T16:00:00
 *               usuario_id:
 *                 type: integer
 *                 example: 1
 *               sala_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Reserva created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reserva'
 *       400:
 *         description: Invalid input
 *       409:
 *         description: Time slot already reserved
 */
router.post("/", reservasController.createReserva);

/**
 * @swagger
 * /api/reservas/{id}:
 *   put:
 *     summary: Update a reserva
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Reserva ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pendente, confirmada, cancelada]
 *               data_reserva:
 *                 type: string
 *                 format: date
 *               hora_inicio:
 *                 type: string
 *                 format: date-time
 *               hora_fim:
 *                 type: string
 *                 format: date-time
 *               usuario_id:
 *                 type: integer
 *               sala_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Reserva updated successfully
 *       404:
 *         description: Reserva not found
 */
router.put("/:id", reservasController.updateReserva);

/**
 * @swagger
 * /api/reservas/{id}/status:
 *   patch:
 *     summary: Update only the status of a reserva
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Reserva ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pendente, confirmada, cancelada]
 *                 example: cancelada
 *     responses:
 *       200:
 *         description: Reserva status updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Reserva not found
 */
router.patch("/:id/status", reservasController.updateReservaStatus);

/**
 * @swagger
 * /api/reservas/{id}:
 *   delete:
 *     summary: Delete a reserva
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Reserva ID
 *     responses:
 *       200:
 *         description: Reserva deleted successfully
 *       404:
 *         description: Reserva not found
 */
router.delete("/:id", reservasController.deleteReserva);

export default router;
