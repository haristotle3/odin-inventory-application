import { Router } from "express";
import { trainerDefaultController, trainerIDController } from "../controllers/trainerController.js";

const trainerRouter = Router();

trainerRouter.get("/", trainerDefaultController);
trainerRouter.get("/:id", trainerIDController);

export default trainerRouter;