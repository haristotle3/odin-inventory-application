import db from "../models/db.js";

export async function pokemonDefaultController(req, res) {
  const rows = await db.getAllPokemon();
  res.render("index", { pokemon: rows });
}

export async function pokemonIDController(req, res) {
  const row = await db.getPokemonByID(req.params.id);
  res.render("index", { pokemon: row });
}
