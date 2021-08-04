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

//Objetos para testes
const publica = {
    email: "milenalins@gmail.com",
    titulo: "Publicação Milena",
    texto: "askdfhjkghkdfhkjghkdfjh"
};

const publica2 = {
    email: "gabrielalves@gmail.com",
    titulo: "Publicação Gabriel",
    texto: "kdfjgdfdflgndj"
};

//Função de adicionar uma nova publicação
async function addPubli(obj){
    try{
        await publicacao.connect();
        const publi = publicacao.db(`${process.env.MONGO_DATABASE}`).collection('Publicacao');
        await publi.insertOne(obj).then(console.log("Publicação inserida!"));

    }finally{
        await publicacao.close();
    }
}

//addPubli(publica);
//addPubli(publica2);

//Função para retornar todas as publicações
async function getPublis(){
    try{
        await publicacao.connect();
        const database = publicacao.db(`${process.env.MONGO_DATABASE}`);
        const publicacoes = database.collection('Publicacao');
        await publicacoes.find().forEach(publis => console.log(publis));
    } finally{
        await publicacao.close();
    }
}

//getPublis();

//Função para retornar as publicações de um usuário
async function getPubliUsuario(usuario){
    try{
        await publicacao.connect();
        const database = publicacao.db(`${process.env.MONGO_DATABASE}`);
        const publis = database.collection('Publicacao');
        const filter =  {email: usuario};
        await publis.find(filter).forEach(publicacao => console.log(publicacao));
    } finally{
        await publicacao.close();
    }
}

//getPubliUsuario ('milenalins@gmail.com');

//Função para atualizar uma publicação
async function atualizarPubli(query, update){
    try{
        await publicacao.connect();
        const publi = publicacao.db(`${process.env.MONGO_DATABASE}`).collection('Publicacao');
        await publi.updateOne(query, update).then(console.log("Publicação atualizada!"));
    }finally{
        await publicacao.close();
    }
}

const query = {titulo: "Publicação Milena"};
const update = {$set: {texto: "Agora sim"}};
//atualizarPubli(query, update);

//getPubliUsuario ('milenalins@gmail.com');

//Função para deletar uma publicação
async function deletarPubli(filter){
    try{
        await publicacao.connect();
        const usuario = publicacao.db(`${process.env.MONGO_DATABASE}`).collection('Publicacao');

        const result = await usuario.deleteOne(filter);
        console.log(`${result.deletedCount} documentos removidos`);
    }finally{
        await publicacao.close();
    }
}

const filter = {titulo: 'Publicação Gabriel', email: "gabrielalves@gmail.com"};
//deletarPubli(filter);

module.exports = {
    getPubliUsuario,
    getPublis,
    addPubli,
    atualizarPubli,
    deletarPubli
};