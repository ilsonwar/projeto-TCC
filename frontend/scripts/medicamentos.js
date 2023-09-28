// Referência ao banco de dados do Firebase
var database = firebase.database();
var loteKey = localStorage.getItem("loteKey");
var loteData = JSON.parse(localStorage.getItem("loteData"));

var medicamentosRef; // Referência aos medicamentos no Firebase

// Função para inicializar o Firebase e obter a referência aos medicamentos
function inicializarFirebase() {
  // Verifique se há um usuário autenticado antes de acessar o UID
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      medicamentosRef = database.ref("users/" + user.uid + "/medicamentos");

      // Chame a função para preencher a lista de medicamentos
      atualizarListaMedicamentos();

      // Monitore as mudanças na lista de medicamentos no Firebase em tempo real
      medicamentosRef.on("value", function (snapshot) {
        medicamentos = []; // Limpe o array de medicamentos

        snapshot.forEach(function (childSnapshot) {
          var medicamento = childSnapshot.val();
          medicamento.id = childSnapshot.key;
          medicamentos.push(medicamento);
        });

        // Atualize a lista de medicamentos na página
        atualizarListaMedicamentos();
      });
    } else {
      console.log("Não há usuário autenticado.");
    }
  });
}

window.addEventListener("load", function () {
  if (firebase.auth().currentUser) {
    inicializarFirebase();
  } else {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        inicializarFirebase();
      }
    });
  }
});

// Botão para abrir o modal
var adicionarMedicamentoBtn = document.getElementById("adicionarMedicamentoBtn");

// Modal e elementos relacionados
var medicamentoModal = document.getElementById("medicamentoModal");
var fecharModalBtn = document.getElementById("fecharModal");
var medicamentoForm = document.getElementById("medicamentoForm");
var nomeMedicamentoInput = document.getElementById("nomeMedicamento");

// Lista de medicamentos
var listaMedicamentos = document.getElementById("listaMedicamentos");

// Array para manter o controle dos medicamentos na memória
var medicamentos = [];

// Abrir o modal ao clicar no botão "Adicionar Medicamento"
adicionarMedicamentoBtn.addEventListener("click", function () {
  medicamentoModal.style.display = "block";
});

// Fechar o modal ao clicar no botão "Fechar" ou fora do modal
fecharModalBtn.addEventListener("click", function () {
  medicamentoModal.style.display = "none";
});

window.addEventListener("click", function (event) {
  if (event.target == medicamentoModal) {
    medicamentoModal.style.display = "none";
  }
});

// Lidar com o envio do formulário
medicamentoForm.addEventListener("submit", function (event) {
  event.preventDefault();

  // Obter os valores dos novos campos
  var nomeMedicamento = nomeMedicamentoInput.value;
  var dosagem = document.getElementById("dosagem").value;
  var descricao = document.getElementById("descricao").value;
  var carenciaAbate = document.getElementById("carenciaAbate").value;

  // Validar se o campo do nome do medicamento está preenchido
  if (nomeMedicamento.trim() === "") {
    alert("Por favor, insira o nome do medicamento.");
    return;
  }

  // Gerar um novo ID para o medicamento
  var novoMedicamentoKey = medicamentosRef.push().key;

  // Salvar o medicamento no Firebase com seus dados
  medicamentosRef.child(novoMedicamentoKey).set({
    nome: nomeMedicamento,
    dosagem: dosagem,
    descricao: descricao,
    carenciaAbate: carenciaAbate
  })
  .then(function () {
    // Limpar os campos do formulário
    nomeMedicamentoInput.value = "";
    document.getElementById("dosagem").value = "";
    document.getElementById("descricao").value = "";
    document.getElementById("carenciaAbate").value = "";
    
    medicamentoModal.style.display = "none";
  })
  .catch(function (error) {
    alert("Falha ao adicionar medicamento: " + error.message);
  });
});

// Função para remover medicamento
function removerMedicamento(medicamentoId) {
  // Remover o medicamento do Firebase
  medicamentosRef.child(medicamentoId).remove()
    .then(function () {
      // Atualize o array medicamentos removendo o medicamento pelo ID
      medicamentos = medicamentos.filter(function (medicamento) {
        return medicamento.id !== medicamentoId;
      });

      // Atualizar a lista de medicamentos após a remoção
      atualizarListaMedicamentos();
    })
    .catch(function (error) {
      alert("Falha ao remover medicamento: " + error.message);
    });
}

// Função para atualizar a lista de medicamentos na página
function atualizarListaMedicamentos() {
  listaMedicamentos.innerHTML = "";

  medicamentos.forEach(function (medicamento) {
    var listItem = document.createElement("li");
    listItem.innerHTML = `
      <strong>Nome:</strong> ${medicamento.nome}<br>
      <strong>Dosagem:</strong> ${medicamento.dosagem}<br>
      <strong>Descrição:</strong> ${medicamento.descricao}<br>
      <strong>Carência Abate:</strong> ${medicamento.carenciaAbate}<br>
    `;

    // Crie um elemento de imagem para o ícone de remoção
    var removerImg = document.createElement("img");
    removerImg.src = "../../frontend/assets/images/icons/trash.svg"; // Substitua com o caminho correto para o seu ícone

    // Configure o evento de clique para remover o medicamento
    removerImg.addEventListener("click", function () {
      removerMedicamento(medicamento.id);
    });

    listItem.appendChild(removerImg);
    listaMedicamentos.appendChild(listItem);
  });
}






