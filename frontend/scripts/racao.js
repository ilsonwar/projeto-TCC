

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
  

if (loteKey && loteData) {
  function addRacao() {
    var quantidade = document.getElementById("number").value;
    var racaoData = document.getElementById("date").value;

    // Usar a chave (id do lote) armazenada no localStorage
    var key = loteKey;

    // Usar os dados do lote armazenados no localStorage
    var data = loteData;

    // Usar a chave (id do lote) em outra página
    console.log(key);

    // Formatar a data para dd-mm-yyyy
    var formattedDate = new Date(racaoData).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

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
} else {
  console.log("Não foi possível recuperar os parâmetros do localStorage");
}

// Função para abrir o modal e exibir os dados
function openModal() {
  var modal = document.getElementById("modal");
  modal.style.display = "block";

  var modalBody = document.getElementById("racao-list");
  modalBody.innerHTML = "";

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

  racaoRef.on("value", function (snapshot) {
    var total = 0;

    snapshot.forEach(function (childSnapshot) {
      var racao = childSnapshot.val();
      var data = racao.data;
      var quantidade = racao.quantidade;

      if (data !== undefined && quantidade !== undefined) {
        var li = document.createElement("li");
        li.textContent = "Data: " + data + ", Quantidade: " + quantidade;
        modalBody.appendChild(li);

        total += parseFloat(quantidade);
      }
    });

    var totalElement = document.getElementById("total");
    totalElement.textContent = "Total: " + total.toFixed(2);
  });

  updateTotal(loteKey);
}


// Função para fechar o modal
function closeModal() {
  var modal = document.getElementById("modal");
  modal.style.display = "none";
}


// Função para fechar o modal
function closeModal() {
  var modal = document.getElementById("modal");
  modal.style.display = "none";
}




// Função para fechar o modal
function closeModal() {
  var modal = document.getElementById("modal");
  modal.style.display = "none";
}

window.addEventListener("load", function() {
  if (loteKey && firebase.auth().currentUser) {
    updateTotal(loteKey); // Carregar o total ao carregar a página
  } else {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user && loteKey) {
        updateTotal(loteKey); // Carregar o total ao carregar a página
      }
    });
  }
});