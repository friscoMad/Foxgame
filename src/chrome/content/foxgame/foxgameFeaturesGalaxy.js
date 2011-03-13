//*****************************************************************************************
// Galaxy Features functions
//*****************************************************************************************

//*****************************************************************************************
function foxgame2_addDebrisImage(document) {

	if (document && !foxgame2_isGalaxyUrl(document.location.href)) return;
	if (!foxgame2_GetBooleanPref("foxgameHighlightBigDebris",true)) return;	
	
	try {
		var color = foxgame2_PrefsBranch.getCharPref("foxgameHighlightDebrisColor");
	} catch(e) { var color ="#AA3333";}

	try {
		var min = foxgame2_PrefsBranch.getCharPref("foxgameHighlightDebrisMin");
	} catch(e) { var min ="20000";}
	
	foxgame2_addJavaScript(document,"chrome://foxgame2/content/resources/js/foxgame_debrisHL.js");		
	foxgame2_loadJs(document,"foxgame_initDebrisHL ('"+color+"','"+min+"')");
	
}

//*****************************************************************************************
function foxgame2_removePlanets(document) {
	
	if (document && !foxgame2_isGalaxyUrl(document.location.href)) return;
	if (!foxgame2_GetBooleanPref("foxgameRemovePlanets",true)) return;
	
    foxgame2_addJavaScript(document,"chrome://foxgame2/content/resources/js/foxgame_reduceGalaxy.js");
}

//*****************************************************************************************
function foxgame2_addSpySpace(document) {
	
	if (document && !foxgame2_isGalaxyUrl(document.location.href)) return;
	if (!foxgame2_GetBooleanPref("foxgameAddSpySpace",true)) return;
	
    foxgame2_addJavaScript(document,"chrome://foxgame2/content/resources/js/foxgame_addSpySpace.js");
}

//*****************************************************************************************
function foxgame2_addDebrisNumbers(document) {

   if (document && !foxgame2_isGalaxyUrl(document.location.href)) return;
   if (!foxgame2_GetBooleanPref("foxgameAddDebrisNumbers",false)) return;  
   
   foxgame2_addJavaScript(document,"chrome://foxgame2/content/resources/js/foxgame_debrisNumbers.js");
}

//*****************************************************************************************
function foxgame2_addPlayerRank(document) {

   if (document && !foxgame2_isGalaxyUrl(document.location.href)) return;
   if (!foxgame2_GetBooleanPref("foxgameShowPlayerRank",false)) return;

   foxgame2_addJavaScript(document,"chrome://foxgame2/content/resources/js/foxgame_playerRanks.js");

}
//*****************************************************************************************
function foxgame2_addAllianceRank(document) {

   if (document && !foxgame2_isGalaxyUrl(document.location.href)) return;
   if (!foxgame2_GetBooleanPref("foxgameShowAllyRank",false)) return;

   foxgame2_addJavaScript(document,"chrome://foxgame2/content/resources/js/foxgame_allyRanks.js");

}


//*****************************************************************************************
function foxgame2_HLGalaxy(document) {

	if (document && !foxgame2_isGalaxyUrl(document.location.href)) return;
	//if (!foxgame2_GetBooleanPref("foxgameHighlight",true)) return;
	
	try {
		foxgame2_listaUserHLs.load();
		foxgame2_loadJs(document,"foxgame2_listaUserHLs = eval("+foxgame2_JSON_toString(foxgame2_listaUserHLs.data,"")+");");
		foxgame2_addJavaScript(document,"chrome://foxgame2/content/resources/js/foxgame_FindUHL.js");		
		foxgame2_addJavaScript(document,"chrome://foxgame2/content/resources/js/foxgame_HL.js");		
	} catch (e) {
		foxgame2_debug(e);
	}
}
