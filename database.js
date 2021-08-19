require('dotenv').config();

const {Client} = require('pg');

//Criando banco
const client = new Client({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DATABASE,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
});

//Verificando conexão
client.connect()
    .then(()=> console.log('Conectado PG!'))
    .catch(err => console.log(err.stack));

//Função para retornar os usuários
const getUsuarios = (request, response) =>{
    client.query('SELECT * FROM usuario', (error, results) => {
        if(error){
            response.status(400).send(error);
            return;
        }
        response.status(200).json(results.rows);
    });
}

//Função para adicionar um novo usuário
const addUsuario = (request, response) =>{
    const {nome,email} = request.body;
    
    client.query(`INSERT INTO usuario (nome, email) VALUES ($1, $2)`, 
        [nome,email],(error, results) =>{
        if(error){
            response.status(400).send(error);
            return;
        }
        response.status(200).send('Usuário inserido!');
    });
};

//Função para atualizar os dados de um usuário
const atualizarUsuario = (request, response) => {
        
    const { nome, email } = request.body;
      
    client.query(
        'UPDATE usuario SET nome = $1 WHERE email=$2',
            [nome, email],
            (error, results) => {
            if (error) {
                response.status(400).send(error);
                return;
            }
        response.status(200).send('Usuário modificado!');
    });
};


//Função para deletar um usuário
const deletarUsuario = (request, response) => {
    const id = parseInt(request.params.id)
      
    client.query('DELETE FROM usuario WHERE id = $1', [id], (error, results) => {
        if (error) {
            response.status(400).send(error);
            return;
        }
        response.status(200).send('Usuário deletado!');
    });
};

module.exports = {
    getUsuarios,
    addUsuario,
    atualizarUsuario,
    deletarUsuario
};