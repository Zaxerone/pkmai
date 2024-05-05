const { getData } = require("./data/GetData");
const json5 = require("json5");
require("./data/DataManager");

getData("abilities")
  .then((abilities: Ability[]) => {
    console.log("Fetched abilities successfully.");
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

getPokemonData<Pokemon>("pokedex").then(async (pokemon) => {});
