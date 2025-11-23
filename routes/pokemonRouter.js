import { Router } from "express";
import {
  pokemonIndexController,
  pokemonIDController,
  addPokemonController,
  deletePokemonController,
  updatePokemonController,
} from "../controllers/pokemonController.js";
import { verifyDestructiveAction } from "../controllers/passwordVerificationHelper.js";
import multer from "multer";

const pokemonStorage = multer.diskStorage({
  destination: "public/images/pokemon",

  filename: function (req, file, cb) {
    const { name } = req.body;
    const extension = file.originalname.split(".").pop();
    cb(null, name + "." + extension);
  },
});

const pokemonUpload = multer({ storage: pokemonStorage });
const pokemonRouter = Router();

pokemonRouter.get("/:id", pokemonIDController);
pokemonRouter.post("/:id", verifyDestructiveAction);
pokemonRouter.delete("/:id", deletePokemonController);
pokemonRouter.patch("/:id", updatePokemonController);

pokemonRouter.get("/", pokemonIndexController);
pokemonRouter.post("/", pokemonUpload.single("photo"), addPokemonController);

export default pokemonRouter;
