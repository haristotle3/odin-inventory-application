import db from "../models/db.js";
import { unlink } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

export async function trainerDefaultController(req, res) {
  let rows;

  if (req.query.trainerName) {
    rows = await db.searchTrainers(req.query.trainerName);
  } else {
    rows = await db.getAllTrainers();
  }
  res.render("trainers", { trainers: rows });
}

export async function trainerIDController(req, res) {
  const trainerID = req.params.id;
  const row = await db.getTrainerByID(trainerID);
  const trainersPokemon = await db.getAllPokemonOfTrainer(trainerID);
  res.render("individualTrainers", { trainers: row[0], trainersPokemon });
}

export async function addTrainerController(req, res) {
  const { newTrainerName, trainerDescription } = req.body;
  const imagePath = "/images/trainers/" + req.file.filename;
  await db.addNewTrainer(newTrainerName, trainerDescription, imagePath);
  await trainerDefaultController(req, res);

  return;
}

async function deleteImage(image_path) {
  const dependentTrainer = await db.trainerImagePathDependents(image_path);
  if (dependentTrainer > 0) return;

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(path.dirname(__filename));
  const absolute_path = path.join(__dirname, "public", image_path);
  await unlink(absolute_path);
}

export async function deleteTrainer(req, res) {
  const trainerID = req.params.id;
  const rows = await db.getTrainerByID(trainerID);

  const image_path = rows[0].image_path;

  await db.deleteTrainer(trainerID);
  await deleteImage(image_path);

  res.sendStatus(204);
}

export async function updateTrainer(req, res) {
  const trainerID = req.params.id;
  const { updatedTrainerName, updatedTrainerDescription } = req.body;
  await db.updateTrainer(
    trainerID,
    updatedTrainerName,
    updatedTrainerDescription
  );
  res.sendStatus(204);
}
