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
    id: {
        type: String,
        required: true,
        unique: true,
    },
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
        const pokemon = await teamA.findOne({ id: pokemonId });
        if (!pokemon) return res.status(404).send(`Le Pokémon n'a pas été trouvé`)
        res.send(pokemon);
    } catch (e) {
        res.status(500).send(e);
    }
});

// create 
app.post('/pokemon', async (req, res) => {
    const pokemon = new teamA(req.body);
    try {
        await pokemon.save();
        console.log(pokemon);
        res.status(201).send(pokemon);
    } catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
});

// update

// delete par id (pour supprimer une équipe précise)

app.listen(port, () => {
    console.log(`Lancé sur le http://localhost:${port}`);
});

