// Referência ao banco de dados do Firebase
var database = firebase.database();
var currentUser;

var totalObitos; // Variável global para armazenar o total de óbitos

function loadTotalObitos() {
  var loteKey = localStorage.getItem("loteKey");

  if (currentUser && loteKey) {
    let dbRefUsers = database.ref("users");
    let obitosRef = dbRefUsers
      .child(currentUser.uid + "/lotes")
      .child(loteKey)
      .child("obitos");

    obitosRef
      .once("value")
      .then(function (snapshot) {
        totalObitos = snapshot.numChildren();

        // Atualizar o total exibido no HTML
        document.getElementById("totalObitos").textContent = totalObitos;
        // Após obter o total de óbitos, chame a função para calcular o total de suínos vivos
        // calcularTotalSuinosVivos();
      })
      .catch(function (error) {
        console.log("Erro ao obter total de óbitos:", error);
      });
  }
}

// Chame a função para carregar o total de óbitos ao entrar na página
window.addEventListener("DOMContentLoaded", function () {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      currentUser = user;
      loadTotalObitos();
      loadQuantidadeLeitoes(loteKey);
    } else {
      console.log('Usuário não autenticado')
    }
  });
});

const loteKey = localStorage.getItem("loteKey");
const loteData = JSON.parse(localStorage.getItem("loteData"));

if (loteKey && loteData) {
  function addObito() {
    var obitoData = document.getElementById("date").value;
  
    if (!obitoData) {
      alert("Selecione uma data para o óbito.");
      return;
    }
  
    // Usar a chave (id do lote) armazenada no localStorage
    var key = loteKey;
  
    // Usar os dados do lote armazenados no localStorage
    var data = loteData;
  
    // Formatar a data para dd-mm-yyyy
    var dataFormatada = new Date(obitoData);
    var formattedDate =
      ("0" + dataFormatada.getDate()).slice(-2) +
      "-" +
      ("0" + (dataFormatada.getMonth() + 1)).slice(-2) +
      "-" +
      dataFormatada.getFullYear();
  
    // Verificar se o loteId é válido (se necessário)
    if (key) {
      let dbRefUsers = database.ref("users");
      let newLoteRef = dbRefUsers.child(currentUser.uid + "/lotes");
  
      console.log(newLoteRef);
      // Criar um novo nó no banco de dados com a data no lote específico
      const obitoRef = newLoteRef.child(key + "/obitos").push();
      obitoRef
        .set({
          data: formattedDate,
        })
        .then(function () {
          alert("Óbito adicionado com sucesso!");
  
          // Atualizar a quantidade de leitões vivos no Firebase
          var loteRef = dbRefUsers.child(currentUser.uid + "/lotes/" + key);
  
          loteRef.once("value").then(function (snapshot) {
            var loteData = snapshot.val();
  
            if (loteData && loteData.totalVivos !== undefined) {
              // Obter a quantidade atual de leitões vivos
              var quantidadeAtual = loteData.totalVivos;
  
              // Diminuir a quantidade em 1 (devido ao óbito)
              quantidadeAtual--;
  
              // Atualizar a quantidade no Firebase
              loteRef.update({ totalVivos: quantidadeAtual }).then(function () {
                console.log("Quantidade de leitões vivos atualizada no Firebase");
  
                // Atualizar a quantidade exibida no HTML
                loadQuantidadeLeitoes();
              });
            }
          });
  
          // Limpar o campo de data
          document.getElementById("date").value = "";
  
          // Fechar o modal
          closeModal();
  
          // Atualizar o total de óbitos
          loadTotalObitos();
        })
        .catch(function (error) {
          alert("Erro ao adicionar óbito: " + error.message);
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

  if (currentUser && loteKey) {
    let dbRefUsers = database.ref("users");
    let obitosRef = dbRefUsers
      .child(currentUser.uid + "/lotes")
      .child(loteKey)
      .child("obitos");

    obitosRef
      .once("value")
      .then(function (snapshot) {
        var obitos = snapshot.val();
        if (obitos) {
          Object.keys(obitos).forEach(function (obitoKey) {
            var obito = obitos[obitoKey];
            var data = obito.data;

            // Adicionar um novo item à lista no modal
            var li = document.createElement("li");
            li.setAttribute("id", "obito-" + obitoKey);
            li.textContent = "Data: " + data;
            modalBody.appendChild(li);

            // Botão para remover o óbito
            var removeButton = document.createElement("img");
            removeButton.src = "../../frontend/assets/images/icons/trash.svg";
            removeButton.setAttribute(
              "onclick",
              'removeObito("' + obitoKey + '")'
            );
            removeButton.setAttribute("class", "remove-button");
            li.appendChild(removeButton);
          });

          // Obter o número total de óbitos
          var totalObitos = snapshot.numChildren();

          // Atualizar o total exibido no HTML
          document.getElementById("totalObitos").textContent = totalObitos;
        }
      })
      .catch(function (error) {
        console.log("Erro ao obter registros de óbitos:", error);
      });
  } else {
    console.log("Usuário não autenticado ou loteKey inválido");
  }

  // Abrir o modal
  modal.style.display = "block";
}

// Função para fechar o modal
function closeModal() {
  var modal = document.getElementById("modal");
  modal.style.display = "none";
}

function removeObito(obitoKey) {
  if (confirm("Deseja realmente excluir este registro de óbito?")) {
    let dbRefUsers = database.ref("users");
    let obitoRef = dbRefUsers
      .child(currentUser.uid + "/lotes")
      .child(loteKey)
      .child("obitos")
      .child(obitoKey);

    obitoRef
      .remove()
      .then(function () {
        // Remover o elemento visualmente
        var obitoElement = document.getElementById("obito-" + obitoKey);
        if (obitoElement) {
          obitoElement.parentNode.removeChild(obitoElement);
        }

        // Atualizar o total de óbitos
        loadTotalObitos();

        // Incrementar totalVivos em 1
        var loteRef = dbRefUsers.child(currentUser.uid + "/lotes/" + loteKey);

        loteRef.once("value").then(function (snapshot) {
          var loteData = snapshot.val();

          if (loteData && loteData.totalVivos !== undefined) {
            // Obter a quantidade atual de leitões vivos
            var quantidadeAtual = loteData.totalVivos;

            // Incrementar a quantidade em 1 (devido à remoção do óbito)
            quantidadeAtual++;

            // Atualizar a quantidade no Firebase
            loteRef.update({ totalVivos: quantidadeAtual }).then(function () {
              console.log("Quantidade de leitões vivos atualizada no Firebase");
              // Atualizar a quantidade exibida no HTML
              loadQuantidadeLeitoes();
            });
          }
        });
        
      })
      .catch(function (error) {
        alert("Erro ao excluir registro de óbito: " + error.message);
      });
  }
}
