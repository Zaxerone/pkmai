const VALID_DATA_TYPES = ["pokedex", "moves", "abilities"];

/**
 * Fetch and return Pokémon Showdown API specified data
 * @param {"pokedex" | "moves" | "abilities"} dataType - Choose the data type
 * @returns {object} Object containing data
 */
export async function getData(dataType: "pokedex" | "moves" | "abilities") {
  if (!VALID_DATA_TYPES.includes(dataType)) {
    return Promise.reject(
      console.error("[ERROR] Invalid data type:", dataType)
    );
  }

  let filePath;

  switch (dataType) {
    case "abilities":
      filePath = "text/abilities.json5";
      break;
    case "moves":
      filePath = "moves.json";
      break;
    case "pokedex":
      filePath = "pokedex.json";
      break;
  }

  const dataUrl = `https://play.pokemonshowdown.com/data/${filePath}`;

  try {
    const response = await fetch(dataUrl);

    if (!response.ok) {
      throw new Error(`[ERROR] Failed to fetch data: ${response.status}`);
    }

    let isJson5 = dataUrl.endsWith("5");

    const data = await response.text();

    const fileName = isJson5
      ? filePath.replace("text/", "").replace("5", "")
      : filePath.replace("text/", "");

    const fileData = isJson5
      ? JSON.stringify(require("json5").parse(data))
      : data;

    const pokemonData = JSON.parse(fileData);
    const ouPokemon = Object.values(pokemonData).filter(
      (pokemon: any) => pokemon.tier !== "Illegal"
    );

    let PokemonObj: { [key: string]: object } = {};
    switch (dataType) {
      case "pokedex":
        ouPokemon.forEach((pokemon: any) => {
          const filteredStats = {
            hp: pokemon.baseStats.hp,
            atk: pokemon.baseStats.atk,
            def: pokemon.baseStats.def,
            spa: pokemon.baseStats.spa,
            spd: pokemon.baseStats.spd,
            spe: pokemon.baseStats.spe,
          };
          const pokemonName = pokemon.name;
          PokemonObj[pokemonName] = filteredStats;
        });
        break;
    }

    return { fileName: fileName, data: PokemonObj };
  } catch (error) {
    console.error("[ERROR]", error);
    return Promise.reject(error);
  }
}
