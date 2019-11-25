function tutorInfo(id, toggle){
  var x = document.getElementById(id);
  if(toggle == 1){
    if(x.style.display == "block"){
      x.style.display = "none";
      x.style.height = "0px";
    } else{
      x.style.display = "block";
      x.style.height = "auto";
    }
  } else{
    x.style.display = "none";  
    x.style.height = "0px";
  } 
}

function formDone(){
  var fName = document.forms["regForm"]["fName"].value;
  var lName = document.forms["regForm"]["lName"].value;
  var schoolSelect = document.forms["regForm"]["schoolSelect"].value;
  var studentStatus = document.forms["regForm"]["studentStatus"].checked;
  var tutorStatus = document.forms["regForm"]["tutorStatus"].checked;
  var yearStatus = document.forms["regForm"]["yearStatus"].value;
  var subjectStatus = document.forms["regForm"]["subjectStatus"].value;
  var email = document.forms["regForm"]["email"].value;
  var password = document.forms["regForm"]["password"].value;
  var cPassword = document.forms["regForm"]["cPassword"].value;
  var username = document.forms["regForm"]["username"].value;
  var pronouns = document.forms["regForm"]["pronouns"].value;
  var ret = true;
  document.getElementById("fNameError").innerHTML = "";
  document.getElementById("lNameError").innerHTML = "";
  document.getElementById("schoolError").innerHTML = "";
  document.getElementById("typeStatus").innerHTML = "";
  document.getElementById("yearError").innerHTML = "";
  document.getElementById("emailError").innerHTML = "";
  document.getElementById("passError").innerHTML = "";
  document.getElementById("cPassError").innerHTML = "";
  document.getElementById("usernameError").innerHTML = "";
  document.getElementById("pronounsError").innerHTML = "";

  if(fName.length == 0){
    document.getElementById("fNameError").innerHTML = "* Please Enter Your First Name";
    ret = false
  }
  if(lName.length == 0){
    document.getElementById("lNameError").innerHTML = "* Please Enter Your Last Name";
    ret = false
  }
  if(schoolSelect.length == 0){
    document.getElementById("schoolError").innerHTML = "* Please Select a School";
    ret = false
  }
   if(pronouns.length == 0){
    document.getElementById("pronounsError").innerHTML = "* Please Select Your Pronouns";
    ret = false
  }
  if(tutorStatus == false && studentStatus == false){
    document.getElementById("typeStatus").innerHTML = "* Please Select a Role";
    ret = false
  }
  if(tutorStatus){
    if(yearStatus.length == 0){
      document.getElementById("yearError").innerHTML = "* Please Select a Year";
      ret = false;
    }
    if(subjectStatus.length == 0){
      document.getElementById("subjectError").innerHTML = "* Please Select a Subject";
    }
  }
  if(username.length == 0){
    document.getElementById("usernameError").innerHTML = "* Please Enter a Username";
    ret = false
  }
  if(email.length == 0){
    document.getElementById("emailError").innerHTML = "* Please Enter an E-mail";
    ret = false;
  } else{
    var n = email.search("edu");
    if(n == -1){
      document.getElementById("emailError").innerHTML = "* Please Enter a Student E-mail";
    }
  }
  if(password.length == 0){
    document.getElementById("passError").innerHTML = "* Please Enter a Password";
    ret = false;
  }
  if(cPassword.length == 0){
    document.getElementById("cPassError").innerHTML = "* Please Confirm Password";

  } else{
    if(cPassword != password){
      document.getElementById("cPassError").innerHTML = "* Passwords Do Not Match";
    }
  }
  return ret;
}