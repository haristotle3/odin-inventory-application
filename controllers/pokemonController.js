import db from "../models/db.js";
import { unlink } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

async function searchPokemonController(req, res) {
  const rows = await db.searchPokemon(req.query.search);
  const types = await db.getAllPokemonTypes();
  const trainerIDsNames = await db.getAllTrainerNameAndIDs();

  res.render("pokemon", {
    pokemon: rows,
    pokemonTypes: types,
    trainerIDsNames: trainerIDsNames,
    selected: req.query.type || "None",
  });
}

async function filterPokemonController(req, res) {
  const filterType = req.query.type === "None" ? undefined : req.query.type;
  const filterTrainerID =
    req.query.trainerID === "None" ? undefined : req.query.trainerID;
  const rows = await db.filterPokemon(filterType, filterTrainerID);
  const types = await db.getAllPokemonTypes();
  const trainerIDsNames = await db.getAllTrainerNameAndIDs();

  res.render("pokemon", {
    pokemon: rows,
    pokemonTypes: types,
    trainerIDsNames: trainerIDsNames,
    selected: req.query.type || "None",
  });
}

async function pokemonDefaultController(req, res) {
  const rows = await db.getAllPokemon();
  const types = await db.getAllPokemonTypes();
  const trainerIDsNames = await db.getAllTrainerNameAndIDs();

  res.render("pokemon", {
    pokemon: rows,
    pokemonTypes: types,
    trainerIDsNames: trainerIDsNames,
    selected: req.query.type || "None",
  });
}

export async function pokemonIndexController(req, res) {
  if (req.query.search) {
    await searchPokemonController(req, res);
  } else if (req.query.type || req.query.trainerID) {
    await filterPokemonController(req, res);
  } else {
    await pokemonDefaultController(req, res);
  }
}

export async function pokemonIDController(req, res) {
  const rows = await db.getPokemonByID(req.params.id);
  const types = await db.getAllPokemonTypes();
  const trainerIDsNames = await db.getAllTrainerNameAndIDs();

  res.render("individualPokemon", {
    pokemon: rows[0],
    pokemonTypes: types,
    trainerIDsNames: trainerIDsNames,
    selected: req.query.type || "None",
  });
}

export async function addPokemonController(req, res) {
  const { name, type, description, trainerID } = req.body;
  const photoName = req.file.filename;
  const imagePath = "/images/pokemon/" + photoName;

  await db.addNewPokemon(name, type, description, imagePath, trainerID);
  await pokemonDefaultController(req, res);

  return;
}

async function deleteImage(image_path) {
  const dependentPokemon = await db.pokemonImagePathDependents(image_path);
  if (dependentPokemon > 0) return;

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(path.dirname(__filename));
  const absolute_path = path.join(__dirname, "public", image_path);
  await unlink(absolute_path);
}

export async function deletePokemonController(req, res) {
  const pokemonID = req.params.id;
  const rows = await db.getPokemonByID(pokemonID);

  const image_path = rows[0].image_path;

  await db.deletePokemon(pokemonID);
  await deleteImage(image_path);

  res.sendStatus(204);
}

export async function updatePokemonController(req, res) {
  const pokemonID = req.params.id;
  const { pokemonName, type, description } = req.body;
  await db.updatePokemon(pokemonID, pokemonName, type, description);
  res.sendStatus(204);
}