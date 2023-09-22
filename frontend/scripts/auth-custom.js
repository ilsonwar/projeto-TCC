// Função que trata a submissão do formulário de autenticação
authForm.onsubmit = function (event) {
  showItem(loading);
  event.preventDefault();
  if (authForm.submitAuthForm.innerHTML == "LOGIN") {
    firebase
      .auth()
      .signInWithEmailAndPassword(
        authForm.email.value,
        authForm.password.value
      )
      .catch(function (error) {
        showError("Falha no acesso: ", error);
      });
  } else {
    firebase
      .auth()
      .createUserWithEmailAndPassword(
        authForm.email.value,
        authForm.password.value
      )
      .catch(function (error) {
        showError("Falha no cadastro: ", error);
      });
  }
};