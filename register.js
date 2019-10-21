function register(){
  var email = document.getElementById("email").value;
  var pass = document.getElementById("pass").value;
  var cpass = document.getElementById("repass").value;
  if(email != '' && pass != '' && cpass != ''){

    if(pass!=cpass){
      alert("Please Confirm your Password");
    }else{
    try{
      alert("Most Welcome");

      // let user = await auth.createUserWithEmailAndPassword(email,pass)
      // .then((userObj) => this.createUserObj(userObj.user, email)).catch((error) => alert(error));
    }catch(error){
      console.log('Login error:'+error);
      alert(error);
    }
  }
  }else {
    alert('Wrong format of username or password!')
  }
}

function cancel(){
  window.location = "home.html";
}
