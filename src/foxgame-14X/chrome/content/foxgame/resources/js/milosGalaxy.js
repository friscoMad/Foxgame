function next(e) {
	try {
		var temp = e.split(':');
		document.getElementById("milos_form").submit();
		if (temp[1] != "GalaxieTool")
			document.getElementById("div_frame").style.visibility = "visible";
		setTimeout("cargado('"+temp[0]+"');",4000);
	} catch(e) {
		alert(e);
	}
}
function hide(e) {
	document.getElementById("div_frame").style.visibility = "hidden";
}
function cargado (e) {
	if (e == "l") {
		galaxy_submit('systemLeft');
	} else if (e == "r") {
		galaxy_submit('systemRight');
	}
}