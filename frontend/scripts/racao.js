// Referência ao banco de dados do Firebase
var database = firebase.database();

// Recupera a chave e os dados do lote do localStorage
const loteKey = localStorage.getItem("loteKey");
const loteData = JSON.parse(localStorage.getItem("loteData"));

/// Função para atualizar o total no Firebase e exibir o valor total na página
function updateTotal(key) {
  var racaoRef;

  if (key) {
    let dbRefUsers = database.ref("users");
    racaoRef = dbRefUsers
      .child(firebase.auth().currentUser.uid + "/lotes")
      .child(key)
      .child("racao");
  } else {
    racaoRef = database.ref("ração");
  }

  racaoRef.on("value", function (snapshot) {
    var total = 0;

    snapshot.forEach(function (childSnapshot) {
      var racao = childSnapshot.val();
      var quantidade = racao.quantidade;

      if (!isNaN(parseFloat(quantidade))) {
        total += parseFloat(quantidade);
      }
    });

    // Atualizar o total no Firebase
    racaoRef.update({
      total: total.toFixed(2),
    });

    var totalElement = document.getElementById("total");
    totalElement.textContent = "Total: " + total.toFixed(2);
  });
}

function addRacao() {
  var quantidade = document.getElementById("number").value;
  var racaoData = document.getElementById("date").value;

  // Verificar se a quantidade é maior que zero
  if (!quantidade || parseFloat(quantidade) <= 0) {
    alert("Informe uma quantidade de ração válida.");
    return;
  }

  // Verificar se uma data foi selecionada
  if (!racaoData) {
    alert("Selecione uma data.");
    return;
  }

  // Usar a chave (id do lote) armazenada no localStorage
  var key = loteKey;

  // Usar os dados do lote armazenados no localStorage
  var data = loteData;

  // Usar a chave (id do lote) em outra página
  console.log(key);

  // Formatar a data para dd-mm-yyyy
  var dataFormatada = new Date(racaoData);
  formattedDate =
  ("0" + dataFormatada.getUTCDate()).slice(-2) +
  "-" +
  ("0" + (dataFormatada.getUTCMonth() + 1)).slice(-2) +
  "-" +
  dataFormatada.getUTCFullYear();


  // Verificar se o loteId é válido (se necessário)
  if (key) {
    let dbRefUsers = database.ref("users");
    let newLoteRef = dbRefUsers.child(
      firebase.auth().currentUser.uid + "/lotes"
    );

    console.log(newLoteRef);
    // Criar um novo nó no banco de dados com a quantidade e a data no lote específico
    const racaoRef = newLoteRef.child(key + "/racao").push();
    racaoRef
      .set({
        quantidade: quantidade,
        data: formattedDate,
      })
      .then(function () {
        // Atualizar o total no Firebase
        updateTotal(key);
        alert("Dados adicionados com sucesso!");
      })
      .catch(function (error) {
        alert("Erro ao adicionar os dados: " + error.message);
      });

    // Atualizar o total no Firebase
    updateTotal(key);
  } else {
    console.log("Lote inválido");
  }
}

function removeRacao(racaoKey) {
  if (confirm("Deseja realmente excluir esta entrada de ração?")) {
    let dbRefUsers = database.ref("users");
    let racaoRef = dbRefUsers
      .child(firebase.auth().currentUser.uid + "/lotes")
      .child(loteKey)
      .child("racao")
      .child(racaoKey);

    racaoRef
      .remove()
      .then(function () {
        // Remover o elemento visualmente
        var racaoElement = document.getElementById("racao-" + racaoKey);
        if (racaoElement) {
          racaoElement.parentNode.removeChild(racaoElement);
        }

        // Atualizar o total no Firebase após a remoção da ração
        updateTotal(loteKey);
      })
      .catch(function (error) {
        alert("Erro ao excluir entrada de ração: " + error.message);
      });
  }
}

var modalRacaoRef; // Referência ao ouvinte de eventos "value" da rações no modal

function openModal() {
  var modal = document.getElementById("modal");
  modal.style.display = "block";

  var modalBody = document.getElementById("racao-list");
  modalBody.innerHTML = "";

  if (modalRacaoRef) {
    modalRacaoRef.off(); // Remover o ouvinte de eventos "value" anterior, se existir
  }

  var racaoRef;
  if (loteKey) {
    let dbRefUsers = database.ref("users");
    racaoRef = dbRefUsers
      .child(firebase.auth().currentUser.uid + "/lotes")
      .child(loteKey)
      .child("racao");
  } else {
    racaoRef = database.ref("ração");
  }

  racaoRef
    .once("value")
    .then(function (snapshot) {
      var total = 0;

      snapshot.forEach(function (childSnapshot) {
        var racao = childSnapshot.val();
        var data = racao.data;
        var quantidade = racao.quantidade;
        var racaoKey = childSnapshot.key;

        if (data !== undefined && quantidade !== undefined) {
          var li = document.createElement("li");
          li.setAttribute("id", "racao-" + racaoKey);
          li.textContent = "Data: " + data + ", Quantidade: " + quantidade;
          modalBody.appendChild(li);

          total += parseFloat(quantidade);

          var removeButton = document.createElement("img");
          removeButton.src = "../../frontend/assets/images/icons/trash.svg";
          removeButton.setAttribute(
            "onclick",
            'removeRacao("' + racaoKey + '")'
          );
          removeButton.setAttribute("class", "remove-button");
          li.appendChild(removeButton);
        }
      });

      var totalElement = document.getElementById("total");
      totalElement.textContent = "Total: " + total.toFixed(2);
    })
    .catch(function (error) {
      console.log("Erro ao recuperar os dados da rações:", error);
    });

  updateTotal(loteKey);
}

// Função para fechar o modal
function closeModal() {
  var modal = document.getElementById("modal");
  modal.style.display = "none";

  if (modalRacaoRef) {
    modalRacaoRef.off(); // Remover o ouvinte de eventos "value" ao fechar o modal
  }
}

window.addEventListener("load", function () {
  if (loteKey && firebase.auth().currentUser) {
    updateTotal(loteKey); // Carregar o total ao carregar a página
  } else {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user && loteKey) {
        updateTotal(loteKey); // Carregar o total ao carregar a página
      }
    });
  }
});
