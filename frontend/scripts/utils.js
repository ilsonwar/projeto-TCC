// Defindo referências para elementos da página
let authForm = document.getElementById("authForm");
let register = document.getElementById("register");
let access = document.getElementById("access");
let loading = document.getElementById("loading");
let auth = document.getElementById("auth");
let userContent = document.getElementById("userContent");
let userEmail = document.getElementById("userEmail");
let sendEmailVerificationDiv = document.getElementById(
  "sendEmailVerificationDiv"
);
let emailVerified = document.getElementById("emailVerified");
let passwordReset = document.getElementById("passwordReset");
let userName = document.getElementById("userName");
let userImg = document.getElementById("userImg");

var todoForm = document.getElementById("todoForm");
var todoCount = document.getElementById("todoCount");
var ulTodoList = document.getElementById("ulTodoList");

// Alterar o formulário de autenticação para o cadastro de novas contas
function toggleToRegister() {
  authForm.submitAuthForm.innerHTML = "CADASTRE-SE";
  hideItem(register);
  showItem(access);
  hideItem(passwordReset);
}

// Alterar o formulário de autenticação para o acesso de contas já existentes
function toggleToAccess() {
  authForm.submitAuthForm.innerHTML = "LOGIN";
  hideItem(access);
  showItem(register);
  showItem(passwordReset);
}

toggleToAccess();

// Simplifica a exibição de elementos da página
function showItem(element) {
  element.style.display = "block";
}

// Simplifica a remoção de elementos da página
function hideItem(element) {
  element.style.display = "none";
}

// Mostrar conteúdo para usuários autenticados
function showUserContent(user) {
  if (user.emailVerified) {
    emailVerified.innerHTML = "E-mail verificado";
    hideItem(sendEmailVerificationDiv);
  } else {
    emailVerified.innerHTML = "E-mail não verificado";
    showItem(sendEmailVerificationDiv);
    title.innerHTML = "Verifique seu e-mail";
  }
  userImg.src = user.photoURL
    ? user.photoURL
    : "../../frontend/assets/images/unknownUser.png";
  userName.innerHTML = user.displayName;
  userEmail.innerHTML = user.email;
  userEmail.innerHTML = user.email;
  hideItem(auth);

  dbRefUsers
    .child(firebase.auth().currentUser.uid)
    .on("value", function (dataSnapshot) {
      fillTodoList(dataSnapshot);
    });

  // Usuário está logado, remova o title-auth
  const mediaQuery = window.matchMedia("(max-width: 600px)");
  function handleMediaQueryChange(mediaQuery) {
    if (mediaQuery.matches) {
      document.querySelector(".title-auth").style.display = "none";
      document.querySelector(".container-app").style.margin = "0";
    } else {
      document.querySelector(".title-auth").style.display = ""; //
      document.querySelector(".container-app").style.margin = ""; //
    }
  }

  handleMediaQueryChange(mediaQuery); // Executar a função para aplicar as regras iniciais

  mediaQuery.addListener(handleMediaQueryChange); // Adicionar um ouvinte de evento para verificar as alterações na largura da janela

  showItem(userContent);
}

// Mostrar conteúdo para usuários não autenticados
function showAuth() {
  authForm.email.value = "";
  authForm.password.value = "";
  hideItem(userContent);
  showItem(auth);
}

// centralizar e traduzir erros
function showError(prefix, error) {
  console.log(error.code);
  hideItem(loading);

  switch (error.code) {
    case "auth/invalid-email":
      alert(prefix + " " + "E-mail inválido!");
      break;
    case "auth/wrong-password":
      alert(prefix + " " + "Senha inválida!");
      break;
    case "auth/weak-password":
      alert(prefix + " " + "Senha deve ter ao menos 6 caracteres!");
      break;
    case "auth/email-already-in-use":
      alert(prefix + " " + "E-mail já está em uso por outra conta!");
      break;
    case "auth/popup-closed-by-user":
      alert(
        prefix +
          " " +
          "O popup de autenticação foi fechado antes da operação ser concluída!"
      );
      break;

    default:
      alert(prefix + " " + error.message);
  }
}

// Função que permite atualizar nomes de usuários
function updateUserName() {
  var newUserName = prompt(
    "Informe um novo nome de usuário.",
    userName.innerHTML
  );
  if (newUserName && newUserName != "") {
    userName.innerHTML = newUserName;
    showItem(loading);
    firebase
      .auth()
      .currentUser.updateProfile({
        displayName: newUserName,
      })
      .catch(function (error) {
        showError("Falha ao atualizar o nome de usuário: ", error);
      })
      .finally(function () {
        hideItem(loading);
      });
  } else {
    alert("O nome de usuário não pode ser vazio");
  }
}

// Função que permite remover contas de usuário
function deleteUserAccount() {
  var confirmation = confirm("Realmente deseja excluir a sua conta?");
  if (confirmation) {
    showItem(loading);
    firebase
      .auth()
      .currentUser.delete()
      .then(function () {
        alert("Conta foi removida com sucesso");
      })
      .catch(function (error) {
        showError("Falha ao deletar sua conta: ", error);
      })
      .finally(function () {
        hideItem(loading);
      });
  }
}

// Função que permite ao usuário sair da conta dele
function signOut() {
  console.log("Saindo");
  firebase
    .auth()
    .signOut()
    .catch(function (error) {
      showError("Falha ao sair da conta: ", error);
    });
}

//Responsável pela animação no login
const labels = document.querySelectorAll(".form-control label");

labels.forEach((label) => {
  label.innerHTML = label.innerText
    .split("")
    .map(
      (letter, idx) =>
        `<span style="transition-delay:${idx * 50}ms">${letter}</span>`
    )
    .join("");
});

// Função que permite o usuário fazer a verificação do e-mail dele
function sendEmailVerification() {
  showItem(loading);
  var user = firebase.auth().currentUser;
  user
    .sendEmailVerification(actionCodeSettings)
    .then(function () {
      alert(
        "E-mail de verificação foi enviado para " +
          user.email +
          "! Verifique a sua caixa de entrada"
      );
    })
    .catch(function (error) {
      showError("Falha ao enviar mensagem de verificação de e-mail: ", error);
    })
    .finally(function () {
      hideItem(loading);
    });
}

// Função que permite o usuário redefinir a senha dele
function sendPasswordResetEmail() {
  var email = prompt(
    "Redefinir senha! Informe o seu endereço de e-mail.",
    authForm.email.value
  );
  if (email) {
    showItem(loading);
    firebase
      .auth()
      .sendPasswordResetEmail(email, actionCodeSettings)
      .then(function () {
        alert("E-mail de redefinição de senha foi enviado para " + email + ".");
      })
      .catch(function (error) {
        showError("Falha ao enviar e-mail de redefinição de senha: ", error);
      })
      .finally(function () {
        hideItem(loading);
      });
  } else {
    alert("É preciso preencher o campo de e-mail para redefinir a senha!");
  }
}

// Função que permite a autenticação pelo Google
function signInWithGoogle() {
  showItem(loading);
  firebase
    .auth()
    .signInWithPopup(new firebase.auth.GoogleAuthProvider())
    .catch(function (error) {
      showError("Falha ao autenticar com o Google: ", error);
      hideItem(loading);
    });
}

// Atributos extras de configuração de e-mail
let actionCodeSettings = {
  url: "http://127.0.0.1:5500",
};

let database = firebase.database();
let dbRefUsers = database.ref("users");
