 if ($("#galaxyContent").length == 1) {
 	$("#galaxyContent").ajaxSuccess(function(evt, request, settings){
 		 	if (settings.url.indexOf("page=galaxyContent") == -1)
	 			return;
 			foxgame2_HLGalaxy(document);
 	});
} 	
if ($("#statisticsContent").length == 1) {
 	$("#statisticsContent").ajaxSuccess(function(evt, request, settings){
 		 	if (settings.url.indexOf("page=statisticsContent") == -1)
	 			return;
 			foxgame2_HLStats(document);
 	});
} 	
 

//*****************************************************************************************
function foxgame2_HLGalaxy(document) {

	try {
		foxgame2_FindUHL(document, '//a[starts-with(@rel,"#player")]', 0);
		foxgame2_FindUHL(document, '//span[starts-with(@rel,"#alliance")]', 1);
	} catch (e) {
		alert(e);
	}
}

//*****************************************************************************************
function foxgame2_HLStats(document) {
	try {
		foxgame2_FindUHL(document, '//td[(@class="name")]/a[last()]', 0);
		foxgame2_FindUHL(document, '//span[(@class="ally-tag")]/a', 1);
	} catch (e) {
		alert(e);
	}
}