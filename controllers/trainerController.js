import db from "../models/db.js";

export async function trainerDefaultController(req, res) {
  const rows = await db.getAllTrainers();
  res.render("trainers", { trainers: rows });
}

export async function trainerIDController(req, res) {
  const trainerID = req.params.id
  const row = await db.getTrainerByID(trainerID);
  res.render("trainers", { trainers: row });
}
