const express = require('express');
let pokemons = require('./db-pokemons');
let helper = require('./helper');

const app = express();
const PORT = process.env.PORT || 3003;

app.get('/', (req, res) => {
    res.send(`<h3>Hello, YBoosST TEAM !</h3>`);
});

app.get('/api/pokemons', (req, res) => {
    const message = `List of ${pokemons.length} * pokemons`;
    res.json( helper.success(message, pokemons) );    
});

app.get('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const pokemon = pokemons.find( pokemon => pokemon.id === id );
    const message = "One pokemon is founded !";
    res.json( helper.success(message, pokemon) );
});

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});