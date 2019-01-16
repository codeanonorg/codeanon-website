


function getData() {
  let pass = document.getElementById('pass').value
  let name = document.getElementById('email').value 
  return {
    email: name,
    password: CryptoJS.SHA256(pass).toString()
  }
}

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
}


function submit() {
  login()
  return false
}