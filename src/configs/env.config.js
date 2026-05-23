import dotenv from "dotenv";
import path from "node:path";
import fs from "node:fs";

let envFile = ".env";
const envFilesList = [".env.local", ".env.development", ".env.production"];
const rootProject = process.cwd();

for (const file of envFilesList) {
  const filePath = path.resolve(rootProject, file);
  if (fs.existsSync(filePath)) {
    envFile = file;
    break;
  }
}

console.log(`Loading environment from: ${envFile}`);

dotenv.config({
  path: path.resolve(rootProject, envFile),
});
