import { Pool } from "pg";
import { initTrainers, initPokemon } from "./initialData.js";
import getImageFilePath from "./fileHandler.js";

const pool = new Pool({
  user: process.env.LOCAL_DB_USER,
  password: process.env.LOCAL_DB_PASSWORD,
  host: process.env.LOCAL_DB_HOST,
  port: process.env.LOCAL_DB_PORT,
  database: process.env.LOCAL_DB_DATABASE,
});

pool.query("DELETE FROM trainers;");
pool.query("DELETE FROM pokemon;");

const queryTrainer = `INSERT INTO trainers (name, description, image_path) VALUES ($1, $2, $3);`;
const queryPokemon = `INSERT INTO pokemon (name, type, description, trainer_id, image_path) VALUES ($1, $2, $3, $4, $5);`;

for (let trainer of initTrainers) {
  const imagePath = getImageFilePath(trainer.imageName);
  await pool.query(queryTrainer, [
    trainer.name,
    trainer.description,
    imagePath,
  ]);
}

for (let pokemon of initPokemon) {
  const imagePath = getImageFilePath(pokemon.imageName);
  const { rows } = await pool.query(
    "SELECT id FROM trainers WHERE name = $1;",
    [pokemon.trainerName]
  );
  const trainerID = rows[0].id;

  await pool.query(queryPokemon, [
    pokemon.name,
    pokemon.type,
    pokemon.description,
    trainerID,
    imagePath,
  ]);
}
