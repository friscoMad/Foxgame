function next(e) {
	try {
		document.getElementById("milos_form"+e).submit();
		document.getElementById("div_frame").style.visibility = "visible";
	} catch(e) {
		alert(e);
	}
}
function hide(e) {
	document.getElementById("div_frame").style.visibility = "hidden";
}