const mongodb = require('mongodb');
const mongoose = require('mongoose');
const validator = require('validator');
require('dotenv').config();

const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

main().catch(err => console.log(err));

//connection à la db
async function main() {
    await mongoose.connect(process.env.MONGO_URL);
    console.log(`connecté à la db`);
};

// création du schema
const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    }
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

// => faire une team 
// peut être créer un modèle de tableau avec 6 pokémon dedans ? || utiliser l'API directement au lieu d'insérer manuellement ?
// commencer par un tableau vide et insérer dedans avec une requête ?
// faut t'il une boucle pour appliquer à chaque création ?
// effectuer le validator


/* les routes (CRUD) */
// read
app.get('/', async (req, res) => {
    try {
        const readPokemon = await teamA.find({});
        console.log(readPokemon);
        res.send(readPokemon);
    } catch(e) {
        console.log(e);
        res.status(500).send(e);
    }
});

// read par id (pour récupérer une équipe précise)
app.get("/pokemon/:id", async (req, res) => {
    const pokemonId = req.params.id;
    try {
        const pokemon = await teamA.findById(pokemonId);
        if (!pokemon) return res.status(404).send(`Le Pokémon n'a pas été trouvé`)
        res.send(pokemon);
    } catch (e) {
        res.status(500).send(e);
    }
});

// read par name (pour récupérer par le nom)
app.get("/pokemon/name/:name", async (req, res) => {
    const pokemonName = req.params.name;
    console.log(pokemonName);
    try {
        const pokemonByName = await teamA.findOne({ name: pokemonName });
        console.log(pokemonByName);
        if (!pokemonByName) return res.status(404).send(`Le Pokémon n'a pas été trouvé`)
        res.send(pokemonByName);
} catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
});

// create 
app.post('/pokemon', async (req, res) => {
    const pokemon = new teamA(req.body);
    try {
        console.log(typeof pokemon.name);
        await pokemon.save();
        console.log(pokemon);
        res.status(201).send(pokemon);
    } catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
});

// update
app.patch("/pokemon/:id", async (req, res) => {
    const pokemonId = req.params.id; 
    try {
        const pokemon = await teamA.findByIdAndUpdate(pokemonId, req.body, {
            new: true, 
            runValidators: true,
        });
        console.log(pokemon);
        if (!pokemon) return res.status(404).send(`pokemon not found`);
        res.send(pokemon);
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
});

// delete par id (pour supprimer une équipe précise)
app.delete("/pokemon/:id", async (req, res) => {
    const pokemonId = req.params.id;
    try {
        const pokemon = await teamA.findByIdAndDelete(pokemonId);
        console.log(pokemon);
        if (!pokemon) return res.status(404).send(`Pokemon not found`)
        res.send(pokemon);
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
});

app.listen(port, () => {
    console.log(`Lancé sur le http://localhost:${port}`);
});