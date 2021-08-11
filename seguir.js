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

//Função para adicionar um usuário, o único parâmetro recebido é o email
async function addUser(obj){
    const session = amizade.session();
    await session.run('CREATE (p:Pessoa{email:$email}) RETURN p',
        {email: obj.email})
        .then(result => console.log(result.records[0].length>0))
        .catch(error => console.log(error));
}

//Objetos para teste
const user1 = {
    email:"milena@gmail.com"
}

const user2 = {
    email:"gabriel@gmail.com"
}

const user3 = {
    email:"felipe@gmail.com"
}

const user4 = {
    email:"michele@gmail.com"
}

const user5 = {
    email:"marcos@gmail.com"
}


/*
addUser(user1);
addUser(user2);
addUser(user3);*/

//addUser(user4);

//addUser(user5);

//Função para adicionar amizade entre dois usuários
async function addAmizade(email1, email2){
    const session = amizade.session();
    const query = 'MATCH (p1:Pessoa), (p2:Pessoa) WHERE p1.email=$email1 AND p2.email=$email2 CREATE (p1)-[:AMIGO]->(p2)';
    await session.run(query,  {email1: email1, email2:email2})
        .then(result => console.log(result.summary.counters._stats.relationshipsCreated > 0))
        .catch(error => console.log(error));
}
//addAmizade("felipe@gmail.com", "michele@gmail.com");


async function getAmizadeUser(email){
    const session = amizade.session();
    const query = `MATCH (p:Pessoa{email:$email}) -[:AMIGO] -> (p2:Pessoa)          
    RETURN p2.email as email`;
    await session.run(query, {email: email})
    .then(result => result.records.forEach(record => console.log (record.get('email'))))
    .catch(error => console.log(error));
} 

getAmizadeUser("milena@gmail.com");
 
async function deleteUser(email){
    const session = amizade.session();
    const query = `MATCH (p:Pessoa{email:$email}) DETACH DELETE p`;
    await session.run(query, {email:email})
        .then(result => console.log(result.summary.counters._stats.nodesDeleted > 0))
        .catch(error => console.log(error));
} 

//deleteUser("marcos@gmail.com");

async function recomendaParaUsuario (email){
    const session = amizade.session();
    const query = `MATCH (p1:Pessoa{email:$email})-[:AMIGO]->(:Pessoa)-[:AMIGO]->(p2:Pessoa)
    RETURN p2.email as email`;
    await session.run(query, {email:email})
        .then(result => result.records.forEach(record => console.log (record.get('email'))))        
        .catch(error => console.log(error));
}

//recomendaParaUsuario ("milena@gmail.com")