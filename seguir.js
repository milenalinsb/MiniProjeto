require('dotenv').config();
const neo4j = require('neo4j-driver');

const uri = `neo4j://${process.env.NEO4J_HOST}:${process.env.NEO4J_PORT}`;

//Criando Banco
const amizade = neo4j.driver(uri, neo4j.auth
    .basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD));

//Iniciando conexão no banco 
const session = amizade.session();

//Verificando conexão
async function conectar (){
    const session = amizade.session();
}
conectar().then(console.log ("Conectado Neo4j!"));

//Função para adicionar um usuário
async function addUser(request, response){
    const session = amizade.session();
    const {email} = request.body;

    await session.run('CREATE (p:Pessoa{email:$email}) RETURN p',
        {email: email})
        .then(result => response.status(200).send('Usuário inserido!'))
        .catch(error => response.status(400).send(error))
}

//Função para adicionar amizade entre dois usuários
async function addAmizade(request, response){
    const session = amizade.session();
    const {email1, email2} = request.body;

    const query = 'MATCH (p1:Pessoa), (p2:Pessoa) WHERE p1.email=$email1 AND p2.email=$email2 CREATE (p1)-[:AMIGO]->(p2)';
    await session.run(query,  
        {email1: email1, email2:email2})
        .then(result => response.status(200).send('Amizade adicionada!'))
        .catch(error => response.status(400).send(error))
}

//Fução para retornar todos os amigos de um usuário
async function getAmizadeUser(request, response){
    const session = amizade.session();
    const {email} = request.body;

    const query = `MATCH (p:Pessoa{email:$email}) -[:AMIGO] -> (p2:Pessoa)          
    RETURN p2.email as email`;
    await session.run(query, 
        {email: email})
        .then(result =>  result.records.forEach(record => response.send(record.get('email'))))
        .catch(error => response.status(400).send(error));
} 

//Função para deletar um usuário 
async function deleteUser(request, response){
    const session = amizade.session();
    const {email} = request.body;
    const query = `MATCH (p:Pessoa{email:$email}) DETACH DELETE p`;
    await session.run(query,
        {email: email})
        .then(result => response.status(200).send('Usuário deletado!'))
        .catch(error => response.status(400).send(error))
} 

//Função para recomendar usuários
async function recomendaParaUsuario (request, response){
    const session = amizade.session();
    const {email} = request.body;
    const query = `MATCH (p1:Pessoa{email:$email})-[:AMIGO]->(:Pessoa)-[:AMIGO]->(p2:Pessoa)
    RETURN p2.email as email`;
    await session.run(query, 
        {email:email})
        .then(result =>  result.records.forEach(record => response.send(record.get('email'))))        
        .catch(error => response.status(400).send(error));
}

module.exports = {
    getAmizadeUser,
    addUser,
    deleteUser,
    addAmizade,
    recomendaParaUsuario
};