import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getImageFilePath(fileName) {
  let imageFilePath;
  if (/trainer_*/.test(fileName)) {
    imageFilePath = path.join(__dirname, "trainers", fileName);
  } else {
    imageFilePath = path.join(__dirname, "pokemon", fileName);
  }
  return imageFilePath;
}

export default getImageFilePath;
