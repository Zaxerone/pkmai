import json
import os
import sys
import numpy as np
import tensorflow as tf
import requests

sys.stdout.reconfigure(encoding='utf-8')

def download_file(url, filename):
    response = requests.get(url)
    if response.status_code == 200:
        with open(filename, "wb") as f:
            f.write(response.content)
        print(f"Downloaded {filename}")
    else:
        print(f"Failed to download {filename}: {response.status_code}")

data_dir = "./data/"
pokedex_url = "https://play.pokemonshowdown.com/data/pokedex.json"
moves_url = "https://play.pokemonshowdown.com/data/moves.json"
abilities_url = "https://play.pokemonshowdown.com/data/text/abilities.json"

os.makedirs(data_dir, exist_ok=True)

download_file(pokedex_url, os.path.join(data_dir, "pokedex.json"))
download_file(moves_url, os.path.join(data_dir, "moves.json"))
download_file(abilities_url, os.path.join(data_dir, "abilities.json"))

pokedex_filename = os.path.join(data_dir, "pokedex.json")
moves_filename = os.path.join(data_dir, "moves.json")
abilities_filename = os.path.join(data_dir, "abilities.json")

dirname = os.path.dirname(os.path.abspath(__file__))
pokedex_path = os.path.join(dirname, data_dir, "pokedex.json")

with open(pokedex_path, 'r', encoding='utf-8') as f:
    pokedex = json.load(f)

stats = np.array([[pokemon_data["baseStats"]["hp"], pokemon_data["baseStats"]["atk"], pokemon_data["baseStats"]["def"], pokemon_data["baseStats"]["spa"], pokemon_data["baseStats"]["spd"], pokemon_data["baseStats"]["spe"]] for pokemon_name, pokemon_data in pokedex.items()])
stats = stats / stats.max(axis=0)

data_list = []
for pokemon_name, pokemon_data in pokedex.items():
    pokemon_stats = [pokemon_data["baseStats"]["hp"], pokemon_data["baseStats"]["atk"], pokemon_data["baseStats"]["def"], pokemon_data["baseStats"]["spa"], pokemon_data["baseStats"]["spd"], pokemon_data["baseStats"]["spe"]]
    data_list.append({"name": pokemon_name, "stats": pokemon_stats})

with open(os.path.join(dirname, "data/pokedex.json"), "w", encoding="utf-8") as f:
    json.dump(data_list, f, indent=4)

model = tf.keras.Sequential([
    tf.keras.layers.Dense(64, activation='relu'),
    tf.keras.layers.Dense(32, activation='relu'),
    tf.keras.layers.Dense(1, activation='sigmoid')
])

model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
model.fit(stats, stats[:, 0], epochs=100, batch_size=32, verbose=0)

predictions = model.predict(stats)
sorted_indices = np.argsort(-predictions.flatten())

print("The top 10 of pokemons with the highest base stats are :")
for i in range(10):
    pokemon_name = list(pokedex.keys())[sorted_indices[i]]
    print(f'{i+1}. {pokemon_name}')