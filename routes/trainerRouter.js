import { Router } from "express";
import {
  trainerDefaultController,
  trainerIDController,
  addTrainerController,
  deleteTrainer,
  updateTrainer
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

trainerRouter.get("/:id", trainerIDController);
trainerRouter.post("/:id", verifyDestructiveAction);
trainerRouter.delete("/:id", deleteTrainer);
trainerRouter.patch("/:id", updateTrainer);

trainerRouter.get("/", trainerDefaultController);
trainerRouter.post("/", trainerUpload.single("trainerPhoto"), addTrainerController);


export default trainerRouter;
