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
    },
    members: [{
        name: String,
        id: {
            type: Number,
            validate: {
                validator: validator.isNumeric,
                message: `L'id doit être un chiffre`
            }
        }
    }]
});

// //creation du model
// const team = mongoose.model('Team', teamSchema);

// Données au format JSON
teamSchema.methods.toJSON = function () {
    const pokemon = this.toObject();

    return pokemon;
};

/*
const PokeAPI = async (name) => {
    return await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`)
        .then(res => res.json())
        .then(data => {
            const { name } = data;
            console.log(name);
            return { name };
        });
};
*/

// => faire une team 
// - créer le fetch pour que ça soit utilisable ok
// - ajouter un champ pour le nom d'équipe ok
// - créer un array ok
// - faire une boucle avec l'api pokemon et le pousser dans le tableau ok
// - nommer la team et la sauvegarder 


/* les routes (CRUD) */
// read
app.get('/', async (req, res) => {
    try {
        const readPokemon = await teamA.find({});
        console.log(readPokemon);
        res.send(readPokemon);
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
});

// read par id (pour récupérer une équipe précise)
app.get("/pokemon/:id", async (req, res) => {
    const pokemonId = req.params.id;
    try {
        const pokemon = await team.findById(pokemonId);
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
        const pokemonByName = await team.findOne({ name: pokemonName });
        console.log(pokemonByName);
        if (!pokemonByName) return res.status(404).send(`Le Pokémon n'a pas été trouvé`)
        res.send(pokemonByName);
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
});

// create 

// randomiser les pokémons
const randomPokemon = async () => {
    const pokemons = await fetch('https://pokeapi.co/api/v2/pokemon?limit=-1').then(rep => rep.json());
    const pokemonName = pokemons.results[Math.floor(Math.random() * pokemons.count)].name
    console.log(pokemonName);
    return await PokeAPI(pokemonName);
};

app.post('/pokemon', async (req, res) => {
    const teamName = req.body;
    try {
        const team = [];
        for (let i = 0; i < 0; i++) {
            const data = await randomPokemon();
            team.push(data);
            console.log(data);
        };
        const newTeam = new teamA({
            name: teamName,
            member: team,
        })
        await newTeam.save();
        console.log(newTeam);
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
        const pokemon = await team.findByIdAndUpdate(pokemonId, req.body, {
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
        const pokemon = await team.findByIdAndDelete(pokemonId);
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