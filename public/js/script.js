function toggle(elementId) {
	let element = document.getElementById(elementId);
	if(element.style.display == "block") {
    		element.style.display = "none";
  	}
	else {
		element.style.display = "block";
	}
} 