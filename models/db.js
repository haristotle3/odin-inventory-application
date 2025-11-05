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
}

const db = new Database();
export default db;
