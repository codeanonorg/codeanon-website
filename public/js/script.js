
function submit() {
  let name = document.getElementById('email').value
  window.open(`/login/${name}`)
  return false
}