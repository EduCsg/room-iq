import { Router } from "express";
import blocosRoutes from "./blocosRoutes";
import salasRoutes from "./salasRoutes";
import equipamentosRoutes from "./equipamentosRoutes";
import usuariosRoutes from "./usuariosRoutes";
import reservasRoutes from "./reservasRoutes";

const router = Router();

router.use("/blocos", blocosRoutes);
router.use("/salas", salasRoutes);
router.use("/equipamentos", equipamentosRoutes);
router.use("/usuarios", usuariosRoutes);
router.use("/reservas", reservasRoutes);

export default router;
