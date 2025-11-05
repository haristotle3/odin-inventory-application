import db from "../models/db.js";

export default async function trainerController(req, res) {
  const rows = await db.getAllTrainers();
  res.render("index", { trainers: rows });
}
