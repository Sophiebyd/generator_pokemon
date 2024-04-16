const mongodb = require('mongodb');
const mongoose = require('mongoose');
const validator = require('validator');
require('dotenv').config();

const express = require('express');
const app = express();
const port = 3000;

main().catch(err => console.log(err));

//connection à la db
async function main() {
    await mongoose.connect(process.env.MONGO_URL);
    console.log(`connecté à la db`);
};

// création du schema
const teamSchema = new mongoose.Schema({
    name: String
});

//creation du model
const teamA = mongoose.model('TeamA', teamSchema);

// Données au format JSON
teamSchema.methods.toJSON = function () {
    const pokemon = this.toObject();

    return pokemon;
};

/* randomiser les pokémons

const PokeAPI = async (name) => {
    return await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`)
        .then(res => res.json())
        .then(data => {
            const { name } = data;
            console.log(name);
            return { name };
        });
};

const randomPokemon = async () => {
    const pokemons = await fetch('https://pokeapi.co/api/v2/pokemon?limit=-1').then(rep => rep.json());

    const pokemonName = pokemons.results[Math.floor(Math.random() * pokemons.count)].name

    return await PokeAPI(pokemonName);
}; */

/* les routes (CRUD) */
// read
app.get('/', (req, res) => {
    const pokemon = new teamA;
    try {
    } catch(e) {
        res.status(400).send(e);
    }
});

// read par id (pour récupérer une équipe précise)

// read par name (pour rechercher et récupérer le pokémon)

// create 

// update

// delete par id (pour supprimer une équipe précise)

app.listen(port, () => {
    console.log(`Lancé sur le http://localhost:${port}`);
});

