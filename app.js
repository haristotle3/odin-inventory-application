import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import indexRouter from "./routes/indexRouter.js";
import trainerRouter from "./routes/trainerRouter.js";
import pokemonRouter from "./routes/pokemonRouter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", indexRouter);
app.use("/trainers", trainerRouter);
app.use("/pokemon", pokemonRouter);

app.listen(process.env.PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Server running on port ${process.env.PORT}`);
});
