// Trata a submissão do formulário de autenticação
// Trata a submissão do formulário de autenticação
var todoForm;
var totalVivos; // Inicialize a variável global totalVivos

document.addEventListener("DOMContentLoaded", function () {
  todoForm = document.getElementById("todoForm");
  todoForm.onsubmit = function (event) {
    event.preventDefault(); // Evita o redirecionamento da página

    const dataLote = document.getElementById("dataLote").value;
    const quantidadeLeitoes = document.getElementById("quantidadeLeitoes").value; // Converter para número
    const pesoMedioLeitoes = document.getElementById("pesoMedioLeitoesEntrada").value; // Converter para número

    if (!dataLote) {
      alert("Selecione uma data para o lote.");
      return;
    }

    const dataFormatada = new Date(dataLote);
    dataFormatada.setDate(dataFormatada.getDate() + 1);
    const nomeLote = `Lote de ${dataFormatada.toLocaleDateString("pt-BR")}`;

    // Inicialize totalVivos com a quantidade de leitões
    totalVivos = parseInt(quantidadeLeitoes);

    // Aqui, você pode salvar os dados diretamente no Firebase
    const data = {
      name: nomeLote,
      data: dataLote,
      quantidadeLeitoes: quantidadeLeitoes,
      pesoMedioLeitoes: pesoMedioLeitoes,
      totalVivos: totalVivos // totalVivos é inicializado aqui
    };

    const newLoteRef = dbRefUsers
      .child(firebase.auth().currentUser.uid + "/lotes")
      .push(); // Gera uma nova referência com ID único

    newLoteRef
      .set(data)
      .then(function () {
        alert('Lote "' + nomeLote + '" adicionado com sucesso'); // Exibe um alerta de sucesso
        console.log('Lote "' + nomeLote + '" adicionado com sucesso');
      })
      .catch(function (error) {
        alert("Falha ao adicionar lote. Erro: " + error.message); // Exibe um alerta de erro
        showError("Falha ao adicionar lote.", error);
      });

    // Limpa os campos do formulário após a submissão
    document.getElementById("dataLote").value = "";
    document.getElementById("quantidadeLeitoes").value = "";
    document.getElementById("pesoMedioLeitoes").value = "";
  };
});


// Exibe a lista de lotes do usuário
function fillTodoList(dataSnapshot) {
  ulTodoList.innerHTML = "";

  let num = dataSnapshot.numChildren();
  console.log(num); // Adicione esta linha para depurar

  let message = num === 1 ? " Lote" : " Lotes";
  todoCount.innerHTML = num + message + ":";

  dataSnapshot.child("lotes").forEach(function (item) {
    let value = item.val();
    let li = document.createElement("li"); // Cria um elemento do tipo li
    let spanLi = document.createElement("span"); // Cria um elemento do tipo span
    spanLi.appendChild(document.createTextNode(value.name));
    spanLi.id = item.key; // Define o id do spanLi como chave do lote
    spanLi.addEventListener("click", function () {
      redirectToLotPage(item.key, value); // Redireciona para a página do lote ao clicar nele
    });
    li.appendChild(spanLi); // Adiciona a span dentro da li

    let liUpdateBtn = document.createElement("img"); // Cria um botão para alterar o lote
    liUpdateBtn.src = "../../frontend/assets/images/icons/edit-ico.svg"; // Adiciona o ícone do botão
    liUpdateBtn.setAttribute("onclick", 'updateTodo("' + item.key + '")'); // Configura o onclick do botão de editar lotes
    liUpdateBtn.setAttribute("class", "todoBtn"); // Define classes de estilo para o botão de editar
    li.appendChild(liUpdateBtn); // Adiciona o botão de edição dentro da li

    let liRemoveBtn = document.createElement("img"); // Cria um botão para remoção do lote
    liRemoveBtn.src = "../../frontend/assets/images/icons/delete.svg"; // Adiciona o ícone do botão
    liRemoveBtn.setAttribute("onclick", 'removeTodo("' + item.key + '")'); // Configura o onclick do botão de remover lotes
    liRemoveBtn.setAttribute("class", "todoBtn"); // Define classes de estilo para o botão de remoção
    li.appendChild(liRemoveBtn); // Adiciona o botão de remoção dentro da li

    ulTodoList.appendChild(li); // Adiciona a li dentro da ul
  });
}

function redirectToLotPage(key, data) {
  // Formata a data para o formato "dd-mm-yyyy"
  const dataFormatada = new Date(data.data);
  const dia = ("0" + dataFormatada.getDate()).slice(-2);
  const mes = ("0" + (dataFormatada.getMonth() + 1)).slice(-2);
  const ano = dataFormatada.getFullYear();
  const dataFormatadaString = dia + "-" + mes + "-" + ano;

  // Codifica os dados do lote na URL
  const encodedData = encodeURIComponent(JSON.stringify({ ...data, data: dataFormatadaString }));

  // Cria a URL da página do lote
  const url = new URL("https://gestao-granja-5f83a.firebaseapp.com/pages/lotepage.html");
  url.searchParams.append("key", key);
  url.searchParams.append("data", encodedData);

  // Redireciona para a página do lote com os parâmetros na URL
  window.location.href = url.toString();
}


// Remove uma tarefa
function removeTodo(key) {
  let confirmation = confirm("Realmente deseja remover o lote?");

  if (confirmation) {
    const currentUser = firebase.auth().currentUser;
    const loteRef = dbRefUsers.child(currentUser.uid + "/lotes/" + key);

    loteRef
      .remove()
      .then(function () {
        console.log("Lote removido com sucesso");
      })
      .catch(function (error) {
        showError("Falha ao remover lote", error);
      });
  }
}

// Atualiza o nome do lote
function updateTodo(key) {
  let selectedItem = document.getElementById(key);
  let newValue = prompt(
    'Informe o novo nome para o lote "' + selectedItem.innerHTML + '".',
    selectedItem.innerHTML
  );

  if (newValue && newValue !== "") {
    const currentUser = firebase.auth().currentUser;
    const loteRef = dbRefUsers.child(currentUser.uid + "/lotes/" + key);
    const data = {
      name: newValue,
      nameLowerCase: newValue.toLowerCase(),
    };

    loteRef
      .update(data)
      .then(function () {
        console.log("Lote atualizado com sucesso");
      })
      .catch(function (error) {
        showError("Falha ao atualizar lote", error);
      });
  } else {
    alert("O nome do lote não pode estar em branco ao atualizar");
  }
}

function sair() {
  console.log("Saindo da conta");
  window.location.href = "https://gestao-granja-5f83a.firebaseapp.com/index.html";
}

function toggleSidebar() {
  var body = document.querySelector("body");
  body.classList.toggle("open");
}

document.addEventListener("DOMContentLoaded", function () {
  // Verifica se há parâmetros na URL
  const urlParams = new URLSearchParams(window.location.search);
  const loteKey = urlParams.get("key");
  const loteDataString = urlParams.get("data");

  if (loteKey && loteDataString) {
    // Decodifica os dados do lote
    const decodedData = JSON.parse(decodeURIComponent(loteDataString));
    const loteData = {
      key: loteKey,
      data: decodedData.data,
    };

    // Atualiza a data do lote na barra de navegação
    const loteDateElement = document.getElementById("loteDate");
    loteDateElement.textContent = "Data do Lote: " + loteData.data;

    // Armazena os dados do lote no localStorage
    localStorage.setItem("loteKey", loteKey);
    localStorage.setItem("loteData", JSON.stringify(loteData));
  }
});

window.addEventListener("load", function () {
  const loteDateElement = document.getElementById("loteDate");

  if (loteData && loteData.data) {
    loteDateElement.textContent = "Data do Lote: " + loteData.data;
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // Event listener para o botão "Adicionar Lote" em telas menores que 600px
  const abrirModalButton = document.getElementById("abrirModalAdicionarLoteMobile");
  abrirModalButton.addEventListener("click", function () {
    // Abre o modal de adicionar lote
    const modalAdicionarLote = document.getElementById("modalAdicionarLote");
    modalAdicionarLote.style.display = "block";
    
    // Define o background-color do body
    document.body.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  });

  // Event listener para fechar o modal
  const fecharModalButton = document.getElementById("fecharModalAdicionarLote");
  fecharModalButton.addEventListener("click", function () {
    // Fecha o modal de adicionar lote
    const modalAdicionarLote = document.getElementById("modalAdicionarLote");
    modalAdicionarLote.style.display = "none";
    
    // Restaura o background-color do body
    document.body.style.backgroundColor = ""; // Isso irá remover a cor de fundo definida
  });
});

