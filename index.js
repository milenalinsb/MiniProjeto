const express = require('express');
const app = express();
app.use(express.json());
const port = 3000;

app.listen(port, ()=>{
    console.log(`App running on port ${port}.`);
});

const db = require('./database');
const cache = require ('./cache');
const postagem = require ('./publi');
const amizade = require ('./seguir');

app.get('/usuarios', db.getUsuarios);
app.post('/usuarios', db.addUsuario);
app.put('/usuarios', db.atualizarUsuario);
app.delete('/usuario/:id', db.deletarUsuario);

app.get('/publicacoes', postagem.getPublis);
app.get('/publicacoes/:id', postagem.getPubliUsuario);
app.post('/publicacoes', postagem.addPubli);
app.put('/publicacoes', postagem.atualizarPubli);
app.delete('/publicacoes/:id', postagem.deletarPubli);
