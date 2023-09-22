var quantidadeLeitoesGlobal; // Variável para a quantidade de leitões no Firebase
var quantidadeLeitoesVivos; // Variável para a quantidade de leitões vivos no lote
var pesoMedioLeitoesGlobal;
var totalRacao;
var pesoMedioLeitoesValue;
var pesoAtualLeitoes = document.getElementById('pesoAtualLeitoes');

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // Carregue a quantidade de leitões do Firebase
    quantidadeLeitoes(loteKey);
    // Exiba o total de ração
    exibirTotalRacao(loteKey);
    // Carregue a quantidade de leitões vivos no lote
    loadQuantidadeLeitoes(loteKey);
    // calcularConsumoRacao()
  } else {
    console.log('Usuário não autenticado');
  }
});

function quantidadeLeitoes(loteKey) {
  var quantidadeLeitoesRef;
  
  if (loteKey) {
    let dbRefUsers = database.ref("users");
    quantidadeLeitoesRef = dbRefUsers
      .child(firebase.auth().currentUser.uid + "/lotes")
      .child(loteKey)
      .child("quantidadeLeitoes");
  } else {
    quantidadeLeitoesRef = database.ref("quantidadeLeitoes");
  }

  quantidadeLeitoesRef.on("value", function (snapshot) {
    quantidadeLeitoesGlobal = snapshot.val();
    console.log("Quantidade de Leitões: " + quantidadeLeitoesGlobal);
    
    // Após obter a quantidade de leitões, busque o peso médio
    buscarPesoMedio(loteKey);
  });
}

function buscarPesoMedio(loteKey) {
  var pesoMedioRef;

  if (loteKey) {
    let dbRefUsers = database.ref("users");
    pesoMedioRef = dbRefUsers
      .child(firebase.auth().currentUser.uid + "/lotes")
      .child(loteKey)
      .child("pesoMedioLeitoes");
  } else {
    pesoMedioRef = database.ref("pesoMedioLeitoes");
  }

  pesoMedioRef.on("value", function (snapshot) {
    pesoMedioLeitoesGlobal = snapshot.val();
    console.log("Peso Médio dos Leitões: " + pesoMedioLeitoesGlobal);
    
    // Após obter o peso médio, calcule o peso inicial total
    calcularPesoInicialTotal();
  });
}

function calcularPesoInicialTotal() {
  if (quantidadeLeitoesGlobal !== undefined && pesoMedioLeitoesGlobal !== undefined) {
    var pesoInicialTotal = quantidadeLeitoesGlobal * pesoMedioLeitoesGlobal;
    var pesoEntrada = document.getElementById("pesoEntrada");
    pesoEntrada.textContent =  pesoInicialTotal  
    // Chame a função para atualizar os elementos HTML com os valores
    atualizarElementosHTML(quantidadeLeitoesGlobal, quantidadeLeitoesVivos, pesoMedioLeitoesGlobal);
  } else {
    console.log("Aguardando dados para calcular o peso inicial total...");
  }
}

function loadQuantidadeLeitoes(loteKey) {
  if (currentUser && loteKey) {
    let dbRefUsers = database.ref("users");
    let loteRef = dbRefUsers
      .child(currentUser.uid + "/lotes")
      .child(loteKey);

    loteRef
      .child("totalVivos") // Mudança: Obter o valor de totalVivos
      .once("value")
      .then(function (snapshot) {
        quantidadeLeitoesVivos = snapshot.val(); // Alterado o nome da variável

        if (quantidadeLeitoesVivos !== null && quantidadeLeitoesGlobal !== undefined) { // Verificar se os valores são válidos
          // Ambas as variáveis estão definidas, agora atualize os elementos HTML
          atualizarElementosHTML(quantidadeLeitoesGlobal, quantidadeLeitoesVivos);
        }
        console.log("Quantidade de Leitões Vivos: " + quantidadeLeitoesVivos);
      })
      .catch(function (error) {
        console.log("Erro ao obter quantidade de leitões vivos:", error);
      });
  }
}


function atualizarElementosHTML(quantidadeLeitoesGlobal, quantidadeLeitoesVivos, pesoMedioLeitoesGlobal) {
  // Atualize os elementos HTML com os valores obtidos
  var quantidadeLeitoesElement = document.getElementById("quantidadeLeitoes");
  var quantidadeLeitoesResultadoElement = document.getElementById("quantidadeLeitoesResultado");
  var pesoEntrada = document.getElementById("pesoEntrada");

  if (quantidadeLeitoesElement && quantidadeLeitoesResultadoElement && pesoEntrada) {
    quantidadeLeitoesElement.textContent = quantidadeLeitoesGlobal;
    quantidadeLeitoesResultadoElement.textContent = quantidadeLeitoesVivos;
    pesoGanho.textContent = pesoMedioLeitoesGlobal;
  }
}

function exibirTotalRacao(loteKey) {
  // Referência ao banco de dados do Firebase
  var database = firebase.database();
  var totalRacaoRef;

  if (loteKey) {
    let dbRefUsers = database.ref("users");
    totalRacaoRef = dbRefUsers
      .child(firebase.auth().currentUser.uid + "/lotes")
      .child(loteKey)
      .child("racao")
      .child("total");
  } else {
    totalRacaoRef = database.ref("racao/total");
  }

  // Escute as alterações no valor do total de ração
  totalRacaoRef.on("value", function (snapshot) {
    var totalRacaoValue = snapshot.val();

    // Converta a string para um número
    var totalRacaoNumber = parseFloat(totalRacaoValue);

    if (!isNaN(totalRacaoNumber)) {
      // A conversão foi bem-sucedida, agora você pode usar toFixed(2)
      var totalRacaoElement = document.getElementById("totalRacaoResultado");

      if (totalRacaoElement) {
        totalRacaoElement.textContent = totalRacaoNumber.toFixed(2);
      }
      totalRacao = totalRacaoNumber; // Certifique-se de atribuir o valor a totalRacao
      console.log("Total de Ração: " + totalRacao);
    } else {
      // A conversão falhou, o valor não é um número válido
      console.log("Valor de totalRacao não é um número válido:", totalRacaoValue);
    }
  });
}


var submitPesoMedioFormButton = document.getElementById("submitPesoMedioForm");

if (submitPesoMedioFormButton) {
  submitPesoMedioFormButton.addEventListener("click", function (event) {
    event.preventDefault(); // Evite o comportamento padrão de envio do formulário

    // Obtenha o valor do campo de entrada do peso médio dos leitões
    var pesoMedioLeitoesElement = document.getElementById("pesoMedioLeitoes");
    pesoMedioLeitoesValue = parseFloat(pesoMedioLeitoesElement.value); // Remova 'var' aqui
   
    // Verifique se o valor é um número válido
    if (!isNaN(pesoMedioLeitoesValue)) {

      calcularConsumoRacao();
    } else {
      console.log("Peso médio inválido. Certifique-se de inserir um número válido.");
    }
  });
}



function calcularConsumoRacao() {
  console.log("Peso Médio dos Leitões (valor obtido):", pesoMedioLeitoesValue);
  console.log("Quantidade de Leitões Vivos:", quantidadeLeitoesVivos);
  console.log("Total de Ração:", totalRacao);

  if (!isNaN(pesoMedioLeitoesValue) && quantidadeLeitoesVivos !== undefined && totalRacao !== undefined) { 
    var ganhoDePeso = pesoMedioLeitoesValue - pesoMedioLeitoesGlobal;
    var pesoGanho = document.getElementById("pesoGanho");
    pesoGanho.textContent = ganhoDePeso;
    
    var pesoSaida = document.getElementById("pesoSaida");
    var pesoTotalSaida = ganhoDePeso * quantidadeLeitoesVivos; 
    pesoSaida.textContent = pesoTotalSaida;

    var consumoRacao = totalRacao / pesoTotalSaida ;
    var ganhoDePesoElement = document.getElementById("ganhoDePesoResultado");

    if (ganhoDePesoElement) {
      ganhoDePesoElement.textContent = consumoRacao.toFixed(2);
    }
  } else {
    console.log("Aguardando dados para calcular o consumo de ração...");

    // Se o cálculo não for bem-sucedido, defina o campo "Ganho de peso" como vazio
    var ganhoDePesoElement = document.getElementById("ganhoDePesoResultado");

    if (ganhoDePesoElement) {
      ganhoDePesoElement.textContent = ""; // Define o campo como vazio
    }
  }
}


// Crie uma função para gerar e imprimir o relatório
function imprimirRelatorio() {
  // Obtenha a data atual
  var dataAtual = new Date();

  // Formate a data como string no formato desejado (por exemplo, "dd/mm/aaaa")
  var dataFormatada = dataAtual.toLocaleDateString("pt-BR");

  // Crie o cabeçalho do relatório com a data
  var relatorio = "Relatório de Resultados\n";
  relatorio += "Data do Relatório: " + dataFormatada + "\n\n";
  relatorio += "Quantidade de Leitões: " + quantidadeLeitoesGlobal + "\n";
  relatorio += "Quantidade de Leitões Vivos: " + quantidadeLeitoesVivos + "\n";
  relatorio += "Peso Médio dos Leitões: " + pesoMedioLeitoesGlobal + "\n";
  relatorio += "Total de Ração: " + totalRacao + "\n";

  // Crie um elemento de parágrafo temporário para inserir o relatório
  var paragrafo = document.createElement("p");
  paragrafo.textContent = relatorio;

  // Adicione o parágrafo temporário à página para que ele possa ser impresso
  document.body.appendChild(paragrafo);

  // Use o método de impressão do navegador
  window.print();

  // Remova o parágrafo temporário após a impressão
  document.body.removeChild(paragrafo);
}

// Adicione um evento de clique ao botão de impressão
var imprimirRelatorioButton = document.getElementById("imprimirRelatorio");

if (imprimirRelatorioButton) {
  imprimirRelatorioButton.addEventListener("click", imprimirRelatorio);
}