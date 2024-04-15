const mongodb = require('mongodb');
const mongoose = require('mongoose');
const validator = require('validator');

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
    id: Number,
    name: String
});

//creation du model
const teamA = mongoose.model('TeamA', teamSchema);

// Données au format JSON
teamSchema.methods.toJSON = function () {
    const pokemon = this.toObject();

    return pokemon;
};

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

