authForm.onsubmit = function (event) {
    event.preventDefault()
    if (authForm.submitAuthForm.innerHTML == 'LOGIN') {
      firebase.auth().signInWithEmailAndPassword(authForm.email.value, authForm.password.value).then(function (user) {
        console.log('Acessou com sucesso')
        console.log(user)
      }).catch(function (error) {
        console.log('Falha no acesso')
        console.log(error)
      })
    } else {
      firebase.auth().createUserWithEmailAndPassword(authForm.email.value, authForm.password.value).then(function (user) {
        console.log('Cadastrou com sucesso')
        console.log(user)
      }).catch(function (error) {
        console.log('Falha no cadastro')
        console.log(error)
      })
  
    }
  }