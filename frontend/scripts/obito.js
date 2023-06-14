// Referência ao banco de dados do Firebase
var database = firebase.database();

const loteKey = localStorage.getItem("loteKey");
const loteData = JSON.parse(localStorage.getItem("loteData"));

if (loteKey && loteData) {
  function addObito() {
    var obitoData = document.getElementById("date").value;

    // Usar a chave (id do lote) armazenada no localStorage
    var key = loteKey;

    // Usar os dados do lote armazenados no localStorage
    var data = loteData;

    // Usar a chave (id do lote) em outra página
    console.log(key);

    // Formatar a data para dd-mm-yyyy
    var formattedDate = new Date(obitoData).toLocaleDateString("pt-BR", {
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
      // Criar um novo nó no banco de dados com a data no lote específico
      const obitoRef = newLoteRef.child(key + "/obitos").push();
      obitoRef.set({
        data: formattedDate,
      });
    } else {
      console.log("Lote inválido");
    }
  }
} else {
  console.log("Não foi possível recuperar os parâmetros do localStorage");
}

function openModal() {
  var modal = document.getElementById("modal");
  var modalBody = modal.querySelector(".modal-body ul");

  // Limpar a lista de óbitos antes de carregar os dados do Firebase
  modalBody.innerHTML = "";

  if (loteKey) {
    let dbRefUsers = database.ref("users");
    let obitosRef = dbRefUsers
      .child(firebase.auth().currentUser.uid + "/lotes")
      .child(loteKey)
      .child("obitos");

    obitosRef.on("child_added", function (snapshot) {
      var obito = snapshot.val();
      var data = obito.data;

      // Adicionar um novo item à lista no modal
      var li = document.createElement("li");
      li.textContent = "Data: " + data;
      modalBody.appendChild(li);
    });
  } else {
    console.log("Lote inválido");
  }

  // Abrir o modal
  modal.style.display = "block";
}

// Função para fechar o modal
function closeModal() {
  var modal = document.getElementById("modal");
  modal.style.display = "none";
}

// Chame a função fillLotDetails() ao carregar a página para preencher os detalhes do lote
window.addEventListener("load", fillLotDetails);
