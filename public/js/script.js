function toggle(elementId) {
	let element = document.getElementById(elementId);
	if (element.style.display == "block") {
		element.style.display = "none";
	}
	else {
		element.style.display = "block";
	}
}

let coll = document.getElementsByClassName("collapsible");
let i;

for (i = 0; i < coll.length; i++) {
	coll[i].addEventListener("click", function () {
		this.classList.toggle("active");
		var content = this.nextElementSibling;
		if (content.style.maxHeight) {
			content.style.maxHeight = null;
		} else {
			content.style.maxHeight = content.scrollHeight + "px";
		}
	});
}