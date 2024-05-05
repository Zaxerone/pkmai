import json
import os
import sys
import numpy as np
import tensorflow as tf

sys.stdout.reconfigure(encoding='utf-8')

dirname = os.path.dirname(os.path.abspath(__file__))
pokedex_path = os.path.join(dirname, '../pokemon/pokedex.json')

with open(pokedex_path, 'r', encoding='utf-8') as f:
    pokedex = json.load(f)

stats = np.array([[pokemon_data["hp"], pokemon_data["atk"], pokemon_data["def"], pokemon_data["spa"], pokemon_data["spd"], pokemon_data["spe"]] for pokemon_name, pokemon_data in pokedex.items()])
stats = stats / stats.max(axis=0)

data_list = []

for pokemon_name, pokemon_data in pokedex.items():
    pokemon_stats = [pokemon_data["hp"], pokemon_data["atk"], pokemon_data["def"], pokemon_data["spa"], pokemon_data["spd"], pokemon_data["spe"]]
    data_list.append({"name": pokemon_name, "stats": pokemon_stats})

with open("processing/pokemon_data.json", "w", encoding="utf-8") as f:
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

print("Le top 10 des pokémons ayant les statistiques de base les plus hautes de tous les tiers sont :")
for i in range(10):
    pokemon_name = list(pokedex.keys())[sorted_indices[i]]
    print(f'{i+1}. {pokemon_name}')