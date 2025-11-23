import { Router } from "express";
import {
  trainerDefaultController,
  trainerIDController,
  addTrainerController,
  deleteTrainer,
} from "../controllers/trainerController.js";
import { verifyDestructiveAction } from "../controllers/passwordVerificationHelper.js";

import multer from "multer";

const trainerStorage = multer.diskStorage({
  destination: "public/images/trainers",
  filename: (req, file, cb) => {
    const { newTrainerName } = req.body;
    const extension = file.originalname.split(".").pop();
    cb(null, newTrainerName + "." + extension);
  },
});

const trainerUpload = multer({ storage: trainerStorage });
const trainerRouter = Router();

trainerRouter.get("/", trainerDefaultController);
trainerRouter.post("/", trainerUpload.single("trainerPhoto"), addTrainerController);

trainerRouter.get("/:id", trainerIDController);
trainerRouter.post("/:id", verifyDestructiveAction);
trainerRouter.delete("/:id", deleteTrainer);

export default trainerRouter;
