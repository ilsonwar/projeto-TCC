// Defindo referências para elementos da página
let authForm = document.getElementById("authForm");
let register = document.getElementById("register");
let access = document.getElementById("access");

let loading = document.getElementById('loading')

let auth = document.getElementById('auth')
let userContent = document.getElementById('userContent')

let userEmail = document.getElementById('userEmail')

let sendEmailVerificationDiv = document.getElementById(
  "sendEmailVerificationDiv"
);
let emailVerified = document.getElementById("emailVerified");

// Alterar o formulário de autenticação para o cadastro de novas contas
function toggleToRegister() {
  authForm.submitAuthForm.innerHTML = 'CADASTRE-SE'
  hideItem(register)
  showItem(access)

}

// Alterar o formulário de autenticação para o acesso de contas já existentes
function toggleToAccess() {
  authForm.submitAuthForm.innerHTML = 'LOGIN'
  hideItem(access)
  showItem(register)

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
  userEmail.innerHTML = user.email
  hideItem(auth)
  showItem(userContent)
}

// Mostrar conteúdo para usuários não autenticados
function showAuth() {
  authForm.email.value = ''
  authForm.password.value = ''
  hideItem(userContent)
  showItem(auth)
}

// Atributos extras de configuração de e-mail
let actionCodeSettings = {
  url: 'http://127.0.0.1:5500/'
}