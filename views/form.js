let codigoCliente = 0;
        let ultimocCliente = 0;
        let primeiroCliente = 0;
        let codigoAnterior = 0;
        let codigoPosterior = 0;
        let clienteAtual = null;
        let novoCliente = false;
        let token = '';

        function buscaTokenUsuario() {
            fetch('/user/getUserToken/', {
                method: 'get',
                headers: {"Token": token}              
               
            }).then((res) => res.json())
                .then((data) =>  {
                    token = data.token;
                  
                })
                .catch((err) => console.log(err));
        }
        buscaTokenUsuario();

        function primeiro() {
            buscaPrimeiroCliente();
            codigoCliente = primeiroCliente;
            carregaCliente();
        }

        function ultimo() {
            buscaUltimoCodigoCliente();
            codigoCliente = ultimocCliente;
            carregaCliente();
        }

        function salvar() {

            clienteAtual.nome = document.getElementById('nome').value;
            clienteAtual.endereco = document.getElementById('endereco').value;
            clienteAtual.sexo = document.getElementById('sexo').value;
            clienteAtual.telefone = document.getElementById('telefone').value;

            let method = "PUT";
            let endereco = '/api/v1/clientes/' + codigoCliente;

            if (novoCliente) {
                method = "POST";
                endereco = '/api/v1/clientes/';
            }

           var myHeaders = new Headers();
            myHeaders.append("Token", token);
            myHeaders.append("Content-Type", "application/json");

            

            var raw = JSON.stringify(clienteAtual);

            var requestOptions = {
            method: method,
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
            };

            fetch(endereco , requestOptions).then((res) => res.json())
                    .then((data) => {

                        console.log("data");
                        console.dir(data);

                        if (novoCliente) {
                            codigoCliente = data.id;
							$toast("Cliente alterado com sucesso", "#FF9100");
                        } else {
							$toast("Cliente salvo com sucesso", "#FF9100");
						}

                        setTimeout(carregaCliente(), 2000);
                        let navegacao = document.getElementById('navegacao');
                        let edicao = document.getElementById('edicao');
                        navegacao.style.visibility = 'visible';
                        edicao.style.visibility = 'hidden';
                       
                    })
                    .catch((err) => {$toast("Erro ao salvar o cliente " + err, "#FF9100"); console.dir(err);});

        }

        function eliminaCliente() {

            $confirm("Você confirma a Exclusão deste Cliente?", "#FF9100")
            .then(() => {
                console.log("vai deletar o: " + codigoCliente);
                fetch('/api/v1/clientes/' + codigoCliente , {
                    method: 'delete',
                    headers: {"Token": token}               
                
                }).then((res) => res.json())
                    .then((data) => {
                        $alert("Cliente Eliminado!");
                        buscaUltimoCodigoCliente();
                        buscaPrimeiroCliente();
                        codigoCliente = data;    
                        carregaCliente();
                    })
                    .catch((err) => console.log(err));
            });        
        }

        

        function buscaUltimoCodigoCliente() {
            fetch('/api/v1/clientes/ultimo', {
                method: 'get',
                headers: {"Token": token}              
               
            }).then((res) => res.json())
                .then((data) => {
                    ultimocCliente = data;
                })
                .catch((err) => console.log(err));
        }
        //buscaUltimoCodigoCliente();

        function buscaPrimeiroCliente() {
            
            fetch('/api/v1/clientes/primeiro/', {
                method: 'get',
                headers: {"Token": token}               
               
            }).then((res) => res.json())
                .then((data) => {
                    primeiroCliente = data;
                })
                .catch((err) => console.log(err));
        }
        //buscaPrimeiroCliente();
        

        function proximo() {
            if (codigoPosterior != null) {
                codigoCliente = codigoPosterior;
                carregaCliente();
            }
            
        }

        function anterior() {

            if (codigoAnterior != null) {
                codigoCliente = codigoAnterior;
                carregaCliente();
            }

        }

        function buscaCliente() {
            return new Promise((resolve, reject) => {
                fetch('/api/v1/clientes/' + codigoCliente,
                {   method : 'get',
                    headers: {"Token": token}})
                    .then(res => res.json())
                    .then(data => {
                        resolve(data);
                    })
                    .catch(err => {
                        reject(err);
                    })
            });
        }
        function carregaCliente() {
            console.log('carregaCliente codigoCliente ' + codigoCliente);
            if (codigoCliente == 0) {
                buscaPrimeiroCliente();
                codigoCliente = primeiroCliente; 
            }

            console.log('carregaCliente depois codigoCliente ' + codigoCliente);

            buscaCliente().then(cliente => {
                clienteAtual = cliente;

                let campoNome = document.getElementById('nome');
                campoNome.value = cliente.nome;
                campoNome.disabled = true;

                let campoTelefone = document.getElementById('telefone');
                campoTelefone.value = cliente.telefone;
                campoTelefone.disabled = true;

                let campoSexo = document.getElementById('sexo');
                campoSexo.value = cliente.sexo;
                campoSexo.disabled = true;

                let campoEndereco = document.getElementById('endereco');
                campoEndereco.value = cliente.endereco;
                campoEndereco.disabled = true;

                if (cliente.prev != null) {
                    codigoAnterior = cliente.prev;
                } else {
                    codigoAnterior = null;
					$toast("Você está no primeiro cliente", "#FF9100");
                }

                
                if (cliente.next != null) {
                    codigoPosterior = cliente.next;
                } else {
                    codigoPosterior = null;
					$toast("Você está no último cliente", "#FF9100");
                }
                novoCliente = false;
                                
            }).catch(error => {
                throw('Cliente inexistente com este código ' + codigoCliente);
          });

        }

        function modificar() {
                let campoNome = document.getElementById('nome');
                campoNome.disabled = false;

                let campoTelefone = document.getElementById('telefone');
                campoTelefone.disabled = false;

                let campoSexo = document.getElementById('sexo');
                campoSexo.disabled = false;

                let campoEndereco = document.getElementById('endereco');
                campoEndereco.disabled = false;

                let navegacao = document.getElementById('navegacao');
                let edicao = document.getElementById('edicao');

                navegacao.style.visibility = 'hidden';
                edicao.style.visibility = 'visible';
        }
        

        function adicionar() {
                let campoNome = document.getElementById('nome');
                campoNome.value = '';
                campoNome.disabled = false;

                let campoTelefone = document.getElementById('telefone');
                campoTelefone.value = '';
                campoTelefone.disabled = false;

                let campoSexo = document.getElementById('sexo');
                campoSexo.value = '';
                campoSexo.disabled = false;

                let campoEndereco = document.getElementById('endereco');
                campoEndereco.value = '';
                campoEndereco.disabled = false;

                let navegacao = document.getElementById('navegacao');
                let edicao = document.getElementById('edicao');

                navegacao.style.visibility = 'hidden';
                edicao.style.visibility = 'visible';
                novoCliente = true;
        }


        function cancelar() {
            carregaCliente();
            let navegacao = document.getElementById('navegacao');
            let edicao = document.getElementById('edicao');

            navegacao.style.visibility = 'visible';
            edicao.style.visibility = 'hidden';
        }