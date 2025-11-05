import { Router } from "express";
import { pokemonDefaultController, pokemonIDController } from "../controllers/pokemonController.js";

const pokemonRouter = Router();

pokemonRouter.get("/", pokemonDefaultController)
pokemonRouter.get("/:id", pokemonIDController)

export default pokemonRouter;