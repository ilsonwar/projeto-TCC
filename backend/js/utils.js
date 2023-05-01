// Defindo referências para elementos da página
let authForm = document.getElementById("authForm");
let register = document.getElementById("register");
let access = document.getElementById("access");

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

