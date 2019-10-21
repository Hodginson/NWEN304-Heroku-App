function login(){
  var email = document.getElementById("email").value;
  var pass = document.getElementById("pass").value;
  console.log(email +" / " + pass);
  if(email != '' && pass != ''){
    try{
      alert("success");
      // let user = await auth.signInWithEmailAndPassword(email,pass);
      // window.location = "successlogin.html";

  console.log('Login error:'+error);
    }catch(error){
      console.log('Login error:'+error);
      alert(error);
    }
  }else {
    alert('Wrong format of username or password!')
  }
}

function cancel(){
  window.location = "home.html";
}
