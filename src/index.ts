require("./data/DataManager");
import { spawn } from "child_process";
import { writeFileSync } from "node:fs";
const { getData } = require("./data/GetData");
const colors = require("../debug/colors.js");

getData("abilities")
  .then((abilities: Ability[]) => {
    console.log(`✅ ${colors.green}Fetched abilities successfully.`);
  })
  .catch((error: any) => {
    console.error("Error fetching abilities:", error);
  });

async function pokedexData() {
  const pokedex = await getData("pokedex");

  const pokedexData = await JSON.stringify(pokedex.data);

  await writeFileSync(`${"./pokemon/" + pokedex.fileName}`, pokedexData);

  console.log(`✅ ${colors.green}Fetched pokemons successfully`);
  await runPythonScript("processing/main.py");
}

pokedexData();

async function runPythonScript(scriptPath: string) {
  const pythonProcess = spawn("python", [scriptPath]);

  return new Promise((resolve, reject) => {
    let output = "";
    pythonProcess.stdout.on("data", (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on("data", (error) => {
      console.error("Python error:", error.toString());
    });

    pythonProcess.on("close", (code) => {
      if (code === 0) {
        resolve(output.trim());
      } else {
        reject(new Error(`Python process exited with code ${code}`));
      }
    });
  }).catch((error) => {
    console.error("Error running Python script:", error);
  });
}
