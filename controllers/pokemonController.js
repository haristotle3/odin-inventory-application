import db from "../models/db.js";

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

  console.log(rows)

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
  if(req.query.search) {
    await searchPokemonController(req, res);
  } else if (req.query.type || req.query.trainerID) {
    await filterPokemonController(req, res);
  } else {
    await pokemonDefaultController(req, res);
  }
}

export async function pokemonIDController(req, res) {
  const row = await db.getPokemonByID(req.params.id);
  const types = await db.getAllPokemonTypes();
  const trainerIDsNames = await db.getAllTrainerNameAndIDs();

  res.render("pokemon", {
    pokemon: row,
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
  res.render("index.ejs");
}
