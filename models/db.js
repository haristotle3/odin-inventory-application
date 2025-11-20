import "dotenv/config";
import { Pool } from "pg";

class Database {
  constructor() {
    this.db = new Pool({
      user: process.env.LOCAL_DB_USER,
      password: process.env.LOCAL_DB_PASSWORD,
      host: process.env.LOCAL_DB_HOST,
      port: process.env.LOCAL_DB_PORT,
      database: process.env.LOCAL_DB_DATABASE,
    });
  }

  async getAllTrainers() {
    const query = "SELECT * FROM trainers;";
    const { rows } = await this.db.query(query);
    return rows;
  }

  async getAllTrainerNameAndIDs() {
    const query = "SELECT id, name FROM trainers;";
    const { rows } = await this.db.query(query);
    return rows;
  }

  async getTrainerByID(trainerID) {
    const query = "SELECT * FROM trainers WHERE id = $1;";
    const { rows } = await this.db.query(query, [trainerID]);
    return rows;
  }

  async getAllPokemon() {
    const query = "SELECT * FROM pokemon;";
    const { rows } = await this.db.query(query);
    return rows;
  }

  async getPokemonByID(pokemonID) {
    const query = "SELECT * FROM pokemon WHERE id = $1;";
    const { rows } = await this.db.query(query, [pokemonID]);
    return rows;
  }

  async filterPokemon(type, trainerID) {
    const query = "SELECT pokemon.* FROM pokemon JOIN trainers ON pokemon.trainer_id = trainers.id WHERE type = COALESCE($1, type) AND trainers.id = COALESCE($2, trainers.id);"
    const { rows } = await this.db.query(query, [type, trainerID]);
    return rows;
  }

  async searchPokemon(startPattern) {
    const query = "SELECT * FROM pokemon WHERE name ILIKE $1;";
    const { rows } = await this.db.query(query, [`${startPattern}%`]);
    return rows;
  }

  async getAllPokemonTypes() {
    const query = "SELECT DISTINCT type FROM pokemonTypes;";
    const { rows } = await this.db.query(query);
    return rows;
  }

  async addNewPokemon(name, type, description, imagePath, trainerID) {
    const query = "INSERT INTO pokemon (name, type, description, trainer_id, image_path) VALUES ($1, $2, $3, $4, $5);" 
    await this.db.query(query, [name, type, description, trainerID, imagePath]);
    return;
  }

  async deletePokemon(pokemonID) {
    const query = "DELETE FROM pokemon WHERE pokemon.id = $1;";
    await this.db.query(query, [pokemonID]);
    return;
  }

  async imagePathDependents(image_path) {
    const query = "SELECT COUNT(*) FROM pokemon WHERE image_path = $1;";
    const { rows } = await this.db.query(query, [image_path]);
    return rows[0].count;
  }

  async updatePokemon(pokemonID, name, type, description) {
    const query = "UPDATE pokemon SET name = $1, type = $2, description = $3 WHERE id = $4;";
    await this.db.query(query, [name, type, description, pokemonID]);
  }
}

const db = new Database();
export default db;
