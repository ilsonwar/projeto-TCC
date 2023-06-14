// Referência ao banco de dados do Firebase
var database = firebase.database();

// Recupera a chave e os dados do lote do localStorage
const loteKey = localStorage.getItem("loteKey");
const loteData = JSON.parse(localStorage.getItem("loteData"));

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
      racaoRef.set({
        quantidade: quantidade,
        data: formattedDate,
      });
    } else {
      // Criar um novo nó no banco de dados com a quantidade e a data
      var racaoRef = database.ref("racao");
      racaoRef.push().set({
        quantidade: quantidade,
        data: formattedDate,
      });
    }
  }
} else {
  console.log("Não foi possível recuperar os parâmetros do localStorage");
}

function openModal() {
  var modal = document.getElementById("modal");
  var modalBody = modal.querySelector(".modal-body ul");

  // Limpar a lista de racao antes de carregar os dados do Firebase
  modalBody.innerHTML = "";

  if (loteKey) {
    let dbRefUsers = database.ref("users");
    let racaoRef = dbRefUsers
      .child(firebase.auth().currentUser.uid + "/lotes")
      .child(loteKey)
      .child("racao");

    racaoRef.on("child_added", function (snapshot) {
      var racao = snapshot.val();
      var data = racao.data;
      var quantidade = racao.quantidade;

      // Adicionar um novo item à lista no modal
      var li = document.createElement("li");
      li.textContent = "Data: " + data + ", Quantidade: " + quantidade;
      modalBody.appendChild(li);
    });
  } else {
    // Obter os dados do Firebase
    var racaoRef = database.ref("racao");
    racaoRef.on("child_added", function (snapshot) {
      var racao = snapshot.val();
      var data = racao.data;
      var quantidade = racao.quantidade;

      // Adicionar um novo item à lista no modal
      var li = document.createElement("li");
      li.textContent = "Data: " + data + ", Quantidade: " + quantidade;
      modalBody.appendChild(li);
    });
  }

  // Abrir o modal
  modal.style.display = "block";
}

// Função para fechar o modal
function closeModal() {
  var modal = document.getElementById("modal");
  modal.style.display = "none";
}

function calculateTotal() {
  var racaoRef;
  var user = firebase.auth().currentUser;
  if (user && loteKey) {
    let dbRefUsers = database.ref("users");
    racaoRef = dbRefUsers
      .child(user.uid + "/lotes")
      .child(loteKey)
      .child("racao");
  } else {
    racaoRef = database.ref("racao");
  }

  racaoRef.once("value", function (snapshot) {
    var total = 0;

    snapshot.forEach(function (childSnapshot) {
      var racao = childSnapshot.val();
      var quantidade = parseFloat(racao.quantidade);

      total += quantidade;
    });

    var totalElement = document.getElementById("total");
    totalElement.textContent = "Total: " + total.toFixed(2);
  });
}

// Chame a função calculateTotal() ao carregar a página ou quando necessário
window.addEventListener("load", calculateTotal);
