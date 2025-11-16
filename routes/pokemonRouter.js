import { Router } from "express";
import {
  addPokemonController,
  pokemonDefaultController,
  pokemonIDController,
} from "../controllers/pokemonController.js";
import multer from "multer";

const pokemonStorage = multer.diskStorage({
  destination: "public/images/pokemon",
  
  filename: function (req, file, cb) {
    const { name } = req.body;
    const extension = file.originalname.split(".").pop();
    cb(null, name + "." + extension)
  }
})

const pokemonUpload = multer({ storage: pokemonStorage })
const pokemonRouter = Router();

pokemonRouter.get("/", pokemonDefaultController);
pokemonRouter.get("/:id", pokemonIDController);
pokemonRouter.post("/", pokemonUpload.single("photo"), addPokemonController);

export default pokemonRouter;
