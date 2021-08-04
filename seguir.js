require('dotenv').config();
const neo4j = require('neo4j-driver');
const { getUsuarios } = require('./database');

const uri = `neo4j://${process.env.NEO4J_HOST}:${process.env.NEO4J_PORT}`;

//Criando Banco
const amizade = neo4j.driver(uri, neo4j.auth
    .basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD));

//Verificando conexão
async function conectar (){
    await amizade.session()
}
conectar().then(console.log ("Conectado Neo4j!"));

async function addUser(obj){
    try{
        await amizade.session();
        const query = 'CREATE (p:Usuario{email:"${obj.email}"}) RETURN p';
        await amizade.run(query).then(result => console.log(result.records[0].length>0));
    }finally{
        await amizade.close();
    }
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

const user6 = {
    email:"marcos@gmail.com"
}

/* 
addUser(user1);
addUser(user2);
addUser(user3);
addUser(user4);
addUser(user5);
addUser(user6); */


async function addAmizade(email1, email2){
    try{
        await amizade.session();
        const query = `MATCH (p1:Pessoa), (p2:Pessoa) 
            CREATE (p1)-[:AMIGO]->(p2)`;
        await amizade.run(query).then(result => console.log(
            result.summary.counters._stats.relationshipsCreated));
    } finally{
        await amizade.close();
    }
}

//addAmizade("milena@gmail.com", "gabriel@gmail.com");

/* 
async function getAmizadeUser(email){
    try{
        await amizade.session();
        const query = `MATCH (p:Pessoa{email: email}) -[:AMIGO] -> (p2:Pessoa)          
        RETURN p2`;
        await amizade.run(query).then(result => console.log(
            result.summary.counters._stats.//////)
        )
    }
} */
 
async function deleteUser(email){
    try{
        await amizade.session();
        const query = `MATCH (p:Usuario{email:"${email}"}) DETACH DELETE p`;
        await amizade.run(query).then(result => console.log(
            result.summary.counters._stats.nodesDeleted));
    }finally{
        await amizade.close();
    }
} 

// deleteUser("felipe@gmail.com");
/* 
async function recomendaParaUsuario (email){
    try{
        await amizade.session();
        const query = `MATCH (p:Usuario {email: email})- [:Segue] -> () -[:Segue] -> (p2:Usuario) 
        RETURN p2`
        await amizade.run(query).then(result => console.log(result.summary.counters._stats./////////))
    }
}
 */
//recomendaParaUsuario ("milena@gmail.com")