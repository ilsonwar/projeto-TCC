
firebase.auth().languageCode = "pt-BR";
hideItem(loading);
    // Função que centraliza e trata a autenticação
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        hideItem(loading);
        showUserContent(user); // Agora você pode chamar a função importada
        loadTotalObitos();
      } else {
        showAuth();
      }
    });

