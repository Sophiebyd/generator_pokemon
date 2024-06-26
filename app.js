const mongodb = require('mongodb');
const mongoose = require('mongoose');
const createValidation = require('./validations/create')
require('dotenv').config();

const cors = require('cors');

const express = require('express');
const { capitalize } = require('lodash');
const app = express();
const port = 3001;

app.use(cors())
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
        lowercase: true
    },
    members: [{
        name: String,
    }]
});

// //creation du model
const Team = mongoose.model('Team', teamSchema);

// Données au format JSON
teamSchema.methods.toJSON = function () {
    const pokemon = this.toObject();

    return pokemon;
};

// randomiser les pokémons
const pokeAPI = async (name) => {
    return await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`)
        .then(res => res.json())
        .then(data => {
            console.log(data); 
            const { name } = data;
            return { name };
        });
};

// => faire une team 
// dans le get appeler l'API pokémon
// créer un tableau
// while jusqu'à 6
// push dans le tableau

const randomPokemon = async () => {
    let array = []; // création d'un tableau vide pour insérer des nouvelles données 
    let i = 0; // permet d'initialiser i 
    try {
        while (i < 6) {
            const pokemons = await fetch('https://pokeapi.co/api/v2/pokemon?limit=-1').then(rep => rep.json());
            console.log("pokemons:", pokemons); 
            const pokemonName = pokemons.results[Math.floor(Math.random() * pokemons.results.length)].name;
            console.log("pokemonName:", pokemonName); 
            const pokemonData = await pokeAPI(pokemonName); // permet d'appeler l'API avec sa fonction randomiser
            array.push(pokemonData); // pousse dans l'array vide l'appel de l'API + la fonction randimser
            i++;
        }
        console.log("array:", array); 
        return array;
    } catch (error) {
        console.error("Erreur pendant la récupération:", error);
        throw error;
    }
};

/* les routes (CRUD) */

// read
app.get('/', async (req, res) => {
    try {
        const readPokemon = await Team.find();
        console.log(readPokemon);
        res.send(readPokemon);
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
});

//

// read par id (pour récupérer une équipe précise)
app.get("/pokemon/:id", async (req, res) => {
    const pokemonId = req.params.id;
    try {
        const pokemon = await Team.findById(pokemonId);
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
        const pokemonByName = await Team.findOne({ name: pokemonName });
        console.log(pokemonByName);
        if (!pokemonByName) return res.status(404).send(`Le Pokémon n'a pas été trouvé`)
        res.send(pokemonByName);
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
});

// create 
app.post('/pokemon/random', async (req, res) => {
    const teamName = req.body.name; // récupère le name 
    const errors = await createValidation(req.body, Team)
    console.log(Object.keys(errors));
    if (Object.keys(errors).length >= 1) {
        return res.status(400).send(errors)
    } 
    try {
    // permet d'utiliser la fonction randomiser
    // de sauvagarder dans une constante
    // pour que ces données soient appelé dans le squelette du model 
        const randomTeam = await randomPokemon(); 
        const newTeam = new Team({
            name: teamName, // on récupère le nom de la team dans le req.body
            members: randomTeam, // on génère les membres aléatoirement grâce aux données stockées dans la const
        });
        await newTeam.save();  // permet de sauvegarder la création dans la bdd
        console.log(newTeam);
        res.status(201).send(newTeam); 
    } catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
});

app.post('/pokemon', async (req, res) => {
    const pokemonData = req.body; 
    try {
        const newPokemon = new Team(pokemonData); // création manuelle d'une team avec le model 
        await newPokemon.save(); // permet de sauvegarder la création dans la bdd
        console.log(newPokemon);
        res.status(201).send(newPokemon);
    } catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
});

// update
app.patch("/pokemon/:id", async (req, res) => {
    const pokemonId = req.params.id;
    try {
        const pokemon = await Team.findByIdAndUpdate(pokemonId, req.body, {
            new: true,
            runValidators: true,
        });
        console.log(pokemon);
        if (!pokemon) return res.status(404).send(`pokemon non trouvé`);
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
        const pokemon = await Team.findByIdAndDelete(pokemonId);
        console.log(pokemon);
        if (!pokemon) return res.status(404).send(`Pokemon non trouvé`)
        res.send(pokemon);
        console.log(pokemon);
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
});

app.listen(port, () => {
    console.log(`Lancé sur le http://localhost:${port}`);
});