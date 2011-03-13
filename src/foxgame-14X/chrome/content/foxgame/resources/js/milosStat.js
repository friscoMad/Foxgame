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
	var obj = document.getElementsByName("start")[0];
	var temp = parseInt(obj.selectedIndex);
	if (e == "l") {
		if (temp > 0) {
			obj.options[temp-1].selected="true";
			document.forms[0].submit();
		}
	} else if (e == "r") {
		if (temp+1 < obj.length) {
			obj.options[temp+1].selected="true";
			document.forms[0].submit();
		}
	}
}