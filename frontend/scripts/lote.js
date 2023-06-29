// Trata a submissão do formulário de autenticação
todoForm.onsubmit = function (event) {
  event.preventDefault(); // Evita o redirecionamento da página
  if (todoForm.name.value != "") {
    const dataLote = document.getElementById("dataLote").value;

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
  const encodedData = encodeURIComponent(JSON.stringify(data)); // Codifica os dados do lote na URL
  const url = new URL("https://gestao-granja-5f83a.firebaseapp.com/pages/lotepage.html"); // Cria a URL da página do lote
  url.searchParams.append("key", newLoteKey); // Adiciona a chave (key) como parâmetro na URL
  url.searchParams.append("data", encodedData); // Adiciona os dados (data) como parâmetro na URL
  window.location.href = url.toString(); // Redireciona para a página do lote com os parâmetros na URL
  localStorage.setItem("loteKey", newLoteKey);
  localStorage.setItem("loteData", JSON.stringify(data));
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
