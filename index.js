let express = require('express');
let bodyParser = require('body-parser');
let jwt = require('jsonwebtoken');
let app = express();

let campoToken = "Token";
let segredo = '';


const { application } = require('express');
const { json } = require('body-parser');

app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use(express.static(__dirname + '\\views\\form.html'));
app.use(express.static(__dirname + '\\views\\styleforms.css'));
app.use(express.static(__dirname + '\\views\\form.js'));
console.log(__dirname);
app.use(express.static(__dirname + '\\views\\login.html'));
app.use(express.static(__dirname + '/views/stylelogin.css'));

let router = express.Router();
app.use("/form/",router);
app.use("/login/",router);
let encodeUrl = bodyParser.urlencoded({ extended: false });

let clientes = [];

let cliente = {id: 1, 
               nome: 'John J Jonathan',
               endereco: 'Rua Saturnino de brito 64',
               sexo: 'Masculino',
               telefone: '234242999',
               prev: null,
               next: 2};

clientes.push(cliente);

let cliente2 = {id: 2, 
    nome: 'Ane Winter',
    endereco: 'Rua Esqueci, 95',
    sexo: 'Feminino',
    telefone: '2345342999',
    prev: 1,
    next: 3};

clientes.push(cliente2);   

let cliente3 = {id: 3, 
    nome: 'Gustavo Moretti da Silva',
    endereco: 'Rua Saturday of brito, 74',
    sexo: 'Masculino',
    telefone: '2345342999',
    prev: 2,
    next: 4};

clientes.push(cliente3); 

let cliente4 = {id: 4, 
    nome: 'Teste da Silva',
    endereco: 'Rua Saturday of brito, 74',
    sexo: 'Masculino',
    telefone: '23423422999',
    prev: 3,
    next: 5};

clientes.push(cliente4); 

let cliente5 = {id: 5, 
    nome: 'Testolina da Silva Sauro',
    endereco: 'Rua dos testes, 74',
    sexo: 'Feminino',
    telefone: '23423422999',
    prev: 4,
    next: null};

clientes.push(cliente5); 

app.get('/form/', (req, res) => {
    
    res.sendFile(__dirname + '\\views\\form.html');
});

function validaToken(requisicao) {
    let tokenText = requisicao.header(campoToken);
    
    let tokenVerificado = jwt.verify(tokenText, segredo);
    
    if (!tokenVerificado) {
        console.log("erro no token ");
        throw("Erro de verificação do token");
    } else {
        console.log("Token verificado com sucesso!")
    }
}

app.post('/login/', encodeUrl, (requisicao, resposta) => {

    var usuario = requisicao.body.usuario;
    var senha = requisicao.body.senha;

    if (usuario == 'teste' && senha == 'teste') {
        segredo = senha;
        resposta.redirect('/form/');
        
    } else {
        resposta.send("<script>alert('Usuário ou senha inválidos!'); history.go(-1);</script>");
    }

    
});

app.get('/login/', (req, res) => {
    res.sendFile(__dirname + '/views/login.html');
}); 

app.get('/api/v1/clientes/ultimo/', (req, res) => {
    validaToken(req);
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify(clientes[clientes.length -1].id));
});

app.get('/api/v1/clientes/primeiro/', (req, res) => {
    validaToken(req);
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify(clientes[0].id));
});
    
app.get('/api/v1/clientes/', (req, res) => {
    validaToken(req);
    console.log("get no metodo de listagem de clientes");

    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify(clientes));
});    

app.get('/api/v1/clientes/:id', (req, res) => {
    validaToken(req);
   
    
    let clienteLocalizado = clientes.find(cliente => cliente.id == req.params.id);
    if (req.params.id == 0 && clienteLocalizado == null) {
        clienteLocalizado = clientes[0];
    }

    let posicao = clientes.indexOf(clienteLocalizado);
    

    let posanterior = posicao - 1;
    let posproximo = parseInt(req.params.id) + 1
   
    let cliAnterior = clientes[posanterior];
    let cliPosterior = clientes.find(cliente => cliente.id >= posproximo);
    if (cliAnterior != null) {
        clienteLocalizado.prev = cliAnterior.id;
    } 

    if (cliPosterior != null) {
       
        clienteLocalizado.next = cliPosterior.id;
    } else {
        clienteLocalizado.next = null;
    }


    let statusHttp = 200;

    if (clienteLocalizado == null) {
        statusHttp = 404;
    }

    res.writeHead(statusHttp, {"Content-Type": "application/json"});
    res.end(JSON.stringify(clienteLocalizado));

});

app.get('/api/v1/clientes/nome/:nome', (req, res) => {
    validaToken(req);
    let clienteLocalizado = clientes.find(cliente => cliente.nome.toLowerCase().includes(req.params.nome.toLowerCase()));
    let statusHttp = 200;

    if (clienteLocalizado == null) {
        statusHttp = 404;
    }

    res.writeHead(statusHttp, {"Content-Type": "application/json"});
    res.end(JSON.stringify(clienteLocalizado));

});

app.post('/api/v1/clientes/', encodeUrl, (req, res) => {
	
	//throw("Explosões!!!!!!");
    validaToken(req);
    console.log("post de cliente");
    let codigoStatushttp = 201;
    let novoCliente = req.body;

    let maiorid = Math.max(...clientes.map( o => o.id ));

    
    if (maiorid > 0) {
        maiorid++;
    } else {
        maiorId = 1;
    }

    novoCliente.id = maiorid;
    clientes.push(novoCliente);

    res.writeHead(codigoStatushttp, {"Content-Type": "application/json"});
    res.end(JSON.stringify(novoCliente));

});
//
app.put('/api/v1/clientes/:id',  encodeUrl, (req, res) => {
   
    
    validaToken(req);
    
    console.log(req);
	
	//throw("Explosões!!!!!!");


    let clienteAntigo = clientes.find(cliente => cliente.id == req.params.id);
    if (clienteAntigo == null) {
        res.writeHead(400, {"Content-Type": "application/json"});
        res.end(JSON.stringify("Cliente não localizado com o id " + req.params.id));
    } else {
        let novoCliente = req.body;
        let campos = ['id','nome','endereco','sexo','telefone', 'prev', 'next'];
             console.log("Validando campos ");

            console.log(novoCliente);

        //if (Object.keys(novoCliente).some(o => campos.includes(o))) {
            console.log("Achou os campos");
            clienteAntigo.nome = novoCliente.nome;
            clienteAntigo.endereco = novoCliente.endereco;
            clienteAntigo.sexo = novoCliente.sexo;
            clienteAntigo.telefone = novoCliente.telefone;

            console.log("clienteAntigo.telefone " + clienteAntigo.telefone);

            res.writeHead(201, {"Content-Type": "application/json"});
            res.end(JSON.stringify(clienteAntigo));


       // } else {
            //res.writeHead(400, {"Content-Type": "application/json"});
            //res.end(JSON.stringify("Objeto JSon de cliente Inválido! "));
        //}
    }
});

app.delete('/api/v1/clientes/:id' , (req, res) => {
    validaToken(req);
    console.log('delete req.params.id ' + req.params.id);
    let clienteaDeletar = clientes.find(cliente => cliente.id == req.params.id);
    if (clienteaDeletar == null) {
        res.writeHead(400, {"Content-Type": "application/json"});
        res.end(JSON.stringify("Cliente não existe com o código " + req.params.id ));
    } else {
        let posicao = clientes.indexOf(clienteaDeletar);
        console.log("posicao " + posicao);
        clientes.splice(posicao, 1);
        if (clientes[posicao +1] != null) {
            posicao = clientes[posicao +1].id;
        } else {
            posicao = clientes[posicao - 1].id;
        }
        res.writeHead(201, {"Content-Type": "application/json"});
        res.end(JSON.stringify(posicao));
    }

});

app.get("/user/getUserToken/", (requisicao, resposta) => {
    let dados = {
        'Data': new Date(),
        'id' : 'Univille'
    }
    if (segredo == '') {
        resposta.writeHead(401, {"Content-Type": "application/json"});
        resposta.end(JSON.stringify("Você deve se logar para receber um token"));
        
    }
    let token = jwt.sign(dados, segredo);

    let jsonRes = {
           'token': token
    };

    resposta.send(jsonRes);
});

app.get('/form/styleforms.css', (req, res) => {
    res.sendFile(__dirname + '\\views\\styleforms.css'); 
});

app.get('/form/styleasteroid.css', (req, res) => {
    res.sendFile(__dirname + '\\views\\styleasteroid.css'); 
});


app.get('/form/form.js', (req, res) => {
    res.sendFile(__dirname + '\\views\\form.js'); 
});

app.get('/form/asteroid-alert.js', (req, res) => {
    res.sendFile(__dirname + '\\views\\asteroid-alert.js'); 
});


app.get('/', (req, res) => res.render('views/login')).listen(5000, () => {
    console.log("Aplicação de API subiu na porta 5001");
});


