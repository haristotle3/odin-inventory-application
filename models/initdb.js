import "dotenv/config";
import { Pool } from "pg";
import { initTrainers, initPokemon } from "./initialData.js";
import process from "process";

try {
  let pool;
  if (process.argv[2] == "prod") {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  } else {
    pool = new Pool({
      user: process.env.LOCAL_DB_USER,
      password: process.env.LOCAL_DB_PASSWORD,
      host: process.env.LOCAL_DB_HOST,
      port: process.env.LOCAL_DB_PORT,
      database: process.env.LOCAL_DB_DATABASE,
    });
  }

  await pool.query("DROP TABLE IF EXISTS pokemonTypes;");
  await pool.query("DROP TABLE IF EXISTS pokemon;");
  await pool.query("DROP TABLE IF EXISTS trainers;");

  await pool.query(`
    CREATE TABLE IF NOT EXISTS trainers (
      id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      name VARCHAR(255) NOT NULL,
      description VARCHAR(1024) NOT NULL,
      image_path VARCHAR(255) NOT NULL
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS pokemon (
      id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      name VARCHAR(255) NOT NULL,
      type VARCHAR(32) NOT NULL,
      description VARCHAR(1024) NOT NULL,
      trainer_id INTEGER REFERENCES trainers(id),
      image_path VARCHAR(255) NOT NULL
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS pokemonTypes (
      type VARCHAR(32) NOT NULL
    );
  `);

  await pool.query("DELETE FROM trainers;");
  await pool.query("DELETE FROM pokemon;");
  await pool.query("DELETE FROM pokemonTypes;");

  const queryTrainer = `INSERT INTO trainers (name, description, image_path) VALUES ($1, $2, $3);`;
  const queryPokemon = `INSERT INTO pokemon (name, type, description, trainer_id, image_path) VALUES ($1, $2, $3, $4, $5);`;

  for (let trainer of initTrainers) {
    await pool.query(queryTrainer, [
      trainer.name,
      trainer.description,
      trainer.imagePath,
    ]);
  }

  for (let pokemon of initPokemon) {
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
      pokemon.imagePath,
    ]);
  }

  const pokemonTypes = [
    "Normal",
    "Fire",
    "Water",
    "Electric",
    "Grass",
    "Ice",
    "Fighting",
    "Poison",
    "Ground",
    "Flying",
    "Psychic",
    "Bug",
    "Rock",
    "Ghost",
    "Dragon",
    "Dark",
    "Steel",
    "Fairy",
    "Stellar",
  ];

  const queryPokemonType = "INSERT INTO pokemonTypes (type) VALUES ($1);";

  pokemonTypes.forEach(async (type) => {
    await pool.query(queryPokemonType, [type]);
  });

  console.log("Database successfully initialized.");
} catch (error) {
  console.log(error);
}
