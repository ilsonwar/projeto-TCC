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

// Atributos extras de configuração de e-mail
let actionCodeSettings = {
  url: "https://gestao-granja-5f83a.firebaseapp.com",
};

let database = firebase.database();
let dbRefUsers = database.ref("users");
