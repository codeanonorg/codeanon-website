


function getData() {
  let pass = document.getElementById('pass').value
  let name = document.getElementById('email').value 
  return {
    email: name,
    password: CryptoJS.SHA256(pass).toString()
  }
};

function login() {
  let data = getData()
  return fetch('/', {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: {
        "Content-Type": "application/json",
    },
    redirect: "follow",
    body: JSON.stringify(data)
  })
};


function submit() {
  login()
  return false
};

function openTab(tab) { //used in login.ejs to close and open tabs
  if (tab === "login") {
    document.getElementById('register').style.display = " none";
    document.getElementById('register-act').classList.remove("is-active");
    document.getElementById('login-act').classList.add("is-active");
  } else {
    document.getElementById('login').style.display = " none";
    document.getElementById('login-act').classList.remove("is-active");
    document.getElementById('register-act').classList.add("is-active");
  }
  document.getElementById(tab).style.display = " block";
} 