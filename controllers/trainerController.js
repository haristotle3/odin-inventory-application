import db from "../models/db.js";

export async function trainerDefaultController(req, res) {
  const rows = await db.getAllTrainers();
  res.render("trainers", { trainers: rows });
}

export async function trainerIDController(req, res) {
  const trainerID = req.params.id
  const row = await db.getTrainerByID(trainerID);
  const trainersPokemon = await db.getAllPokemonOfTrainer(trainerID)
  res.render("individualTrainers", { trainers: row, trainersPokemon });
}

export async function addTrainerController(req, res) {
  const { newTrainerName, trainerDescription } = req.body;
  const imagePath = "/images/trainers/" + req.file.filename;
  await db.addNewTrainer(newTrainerName, trainerDescription, imagePath)
  await trainerDefaultController(req, res);

  return;
}

export async function deleteTrainer(req, res) {
  const trainerID = req.params.id;
  await db.deleteTrainer(trainerID)
  res.sendStatus(204);
}

export async function updateTrainer(req, res) {
  const trainerID = req.params.id;
  const { updatedTrainerName, updatedTrainerDescription } = req.body;
  await db.updateTrainer(trainerID, updatedTrainerName, updatedTrainerDescription)
  res.sendStatus(204);
}