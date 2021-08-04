require('dotenv').config();


const redis = require("redis");

const cachedb = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
});

cachedb.on("connect", function(error){
    console.log("Conectado Redis!");
});

cachedb.on("error", function(error){
    console.log(error);
});


const rascunho = {
    id: "1",
    texto: "lkdfjldg"
};

/*
cachedb.setex("Publicação", 7200, JSON.stringify(rascunho), redis.print);

cachedb.get("Publicação", redis.print); */