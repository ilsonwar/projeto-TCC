// Trata a submissão do formulário de autenticação
var todoForm;

document.addEventListener("DOMContentLoaded", function() {
  todoForm = document.getElementById("todoForm");
  todoForm.onsubmit = function (event) {
    event.preventDefault(); // Evita o redirecionamento da página

    const dataLote = document.getElementById("dataLote").value;

    if (dataLote != "") {
      // Verificar se uma data foi selecionada
      if (!dataLote) {
        alert("Selecione uma data para o lote.");
        return;
      }

      const dataFormatada = new Date(dataLote);
      dataFormatada.setDate(dataFormatada.getDate() + 1);
      const nomeLote = `Lote de ${dataFormatada.toLocaleDateString("pt-BR")}`;

      const data = {
        name: nomeLote,
        data: dataLote,
      };

      const newLoteRef = dbRefUsers
        .child(firebase.auth().currentUser.uid + "/lotes")
        .push(); // Gera uma nova referência com ID único

      newLoteRef
        .set(data)
        .then(function () {
          console.log('Lote "' + nomeLote + '" adicionado com sucesso');
        })
        .catch(function (error) {
          showError("Falha ao adicionar lote.", error);
        });

      todoForm.name.value = "";
    } else {
      alert("O nome do lote não pode estar em branco para criar o lote!");
    }
  };
});

// Exibe a lista de lotes do usuário
function fillTodoList(dataSnapshot) {
  ulTodoList.innerHTML = "";

  let num = dataSnapshot.numChildren();
  todoCount.innerHTML = num + (num > 1 ? " Lotes" : " Lote") + ":"; // Exibe na interface o número de lotes

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

// Redireciona para a página do lote com os dados
function redirectToLotPage(newLoteKey, data) {
  // Formata a data para o formato "dd-mm-yyyy"
  const dataFormatada = new Date(data.data);
  const dia = ("0" + dataFormatada.getDate()).slice(-2);
  const mes = ("0" + (dataFormatada.getMonth() + 1)).slice(-2);
  const ano = dataFormatada.getFullYear();
  const dataFormatadaString = dia + "-" + mes + "-" + ano;

  // Codifica os dados do lote na URL
  const encodedData = encodeURIComponent(JSON.stringify({ ...data, data: dataFormatadaString }));

  // Cria a URL da página do lote
  const url = new URL("http://127.0.0.1:5500/pages/lotepage.html");
  url.searchParams.append("key", newLoteKey);
  url.searchParams.append("data", encodedData);

  // Redireciona para a página do lote com os parâmetros na URL
  window.location.href = url.toString();

  // Atualiza a data do lote na barra de navegação
  const loteDateElement = document.getElementById("loteDate");
  loteDateElement.textContent = "Data do Lote: " + dataFormatadaString;

  localStorage.setItem("loteKey", newLoteKey);
  localStorage.setItem("loteData", JSON.stringify({ ...data, data: dataFormatadaString }));
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
  window.location.href = "http://127.0.0.1:5500/index.html";
}

function toggleSidebar() {
  var body = document.querySelector("body");
  body.classList.toggle("open");
}

document.addEventListener("DOMContentLoaded", function() {
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