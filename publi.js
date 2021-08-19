require('dotenv').config();

const {MongoClient} = require('mongodb');

//Criando banco
const publicacao = new MongoClient(`mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`,
        { useUnifiedTopology: true });

//Verificando conexão
async function conectar (){
    await publicacao.connect()
}

conectar().then(console.log ("Conectado MongoDB!"));

//Função de adicionar uma nova publicação
async function addPubli(request, response){
    try{
        await publicacao.connect();
        const publi = publicacao.db(`${process.env.MONGO_DATABASE}`).collection('Publicacao');
        const {email,titulo,texto} = request.body;
        await publi.insertOne({email,titulo,texto})
        .then(result => response.status(200).send('Publicação Inserida'))
        .catch(error => response.status(400).send(error));

    }finally{
        await publicacao.close();
    }
}

//Função para retornar todas as publicações
async function getPublis(request, response){
    try{
        await publicacao.connect();
        const database = publicacao.db(`${process.env.MONGO_DATABASE}`);
        const publicacoes = database.collection('Publicacao');
        await publicacoes.find().forEach(publis => response.send(publis));
    } finally{
        await publicacao.close();
    }
}

//Função para retornar as publicações de um usuário
async function getPubliUsuario(request, response){
    try{
        await publicacao.connect();
        const database = publicacao.db(`${process.env.MONGO_DATABASE}`);
        const {email} = request.body;
        const publis = database.collection('Publicacao');
        const filter =  {email: email};
        await publis.find(filter).forEach(publicacao => response.send(publicacao));
    } finally{
        await publicacao.close();
    }
}

//Função para atualizar uma publicação
async function atualizarPubli(request, response){
    try{
        await publicacao.connect();
        const publi = publicacao.db(`${process.env.MONGO_DATABASE}`).collection('Publicacao');
        const {query, update} = request.body;
        await publi.updateOne({query, update})
        .then(result => response.status(200).send('Publicação Atualizada!'))
        .catch(error => response.status(400).send(error))
    }finally{
        await publicacao.close();
    }
}

//Função para deletar uma publicação
async function deletarPubli(request, response){
    try{
        await publicacao.connect();
        const usuario = publicacao.db(`${process.env.MONGO_DATABASE}`).collection('Publicacao');
        const {filter} = request.body;
        const result = await usuario.deleteOne({filter});
        response.send(`${result.deletedCount} documentos removidos`);
    }finally{
        await publicacao.close();
    }
}

module.exports = {
    getPubliUsuario,
    getPublis,
    addPubli,
    atualizarPubli,
    deletarPubli
};