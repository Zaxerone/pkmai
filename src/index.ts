require("./data/DataManager");
import { spawn } from "child_process";
const { getData } = require("./data/GetData");

getData("abilities")
  .then((abilities: Ability[]) => {
    console.log(`✅ \x1b[32mFetched abilities successfully.`);
  })
  .catch((error: any) => {
    console.error("Error fetching abilities:", error);
  });

async function getPokemonData<T extends Pokemon | Ability>(
  dataType: "pokedex" | "moves" | "abilities"
): Promise<T[]> {
  const data = await getData(dataType);
  return data;
}

getPokemonData<Pokemon>("pokedex").then(async (pokemon) => {
  console.log(`✅ \x1b[32mFetched pokemons successfully`);
  await runPythonScript("processing/main.py");
});

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
