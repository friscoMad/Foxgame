
var foxgame2_Debug = false;
//Real - servidor
var foxgame2_Delta = 0;
var foxgame2_today;
var foxgame2_domain = "";
var foxgame2_lastChecked = "0";
var foxgame2_Update_Checked = 0;
var foxgame2_DOMEventUnloadTime  = 0;              // Unload DOM - start of loading new DOM (content) is after unload event
var foxgame2_DOMEventStartTime   = 0;              // Loaded DOM - end of loading new DOM (content)
var foxgame2_EnergyLevels = new Array();
var foxgame2_AllyMsgs = new Array();

var foxgame2_server_lang = new Array(
	new Array('ogame.com.hr','bosnian'),
	new Array('ogame.ba','bosnian'),
	new Array('bg.ogame.org','bulgarian'),
	new Array('ogame.cz','czech'),
	new Array('ogame.dk','danish'),
	new Array('ogame.nl','dutch'),
	new Array('ogame.org','english'),
	new Array('ogame.us','english'),
	new Array('ogame.fr','french'),
	new Array('ogame.de','german'),
	new Array('ogame.hu','hungarian'),
	new Array('ogame.it','italian'),
	new Array('o-game.co.kr','korean'),
	new Array('ogame.pl','polish'),
	new Array('ogame.com.br','portuguese'),
	new Array('ogame.com.pt','portuguese'),
	new Array('ogame.ro','romanian'),
	new Array('ogame.ru','russian'),
	new Array('ogame.sk','slovak'),		
	new Array('ogame.com.es','spanish'),
	new Array('ogame.se','swedish'),
	new Array('ogame.com.tw','taiwanese'),
	new Array('ogame.com.tr','turkish')
	);


var foxgame2_server_lang2 = new Array(
	new Array('ogame.com.cn','cn'),
	new Array('ogame.ba','ba'),
	new Array('ogame.com.hr','ba'),
	new Array('bg.ogame.org','bg'),
	new Array('ogame.cz','cz'),
	new Array('ogame.dk','dk'),
	new Array('ogame.de','de'),
	new Array('ogame.org','en'),
	new Array('ogame.us','en'),
	new Array('ogame.com.es','sp'),	
	new Array('ogame.fi','fi'),
	new Array('ogame.fr','fr'),
	new Array('ogame.com.gr','gr'),
	new Array('ogame.it','it'),
	new Array('ogame.ja','ja'),
	new Array('o-game.co.kr','kr'),
	new Array('ogame.lt','lt'),
	new Array('ogame.nl','nl'),
	new Array('ogame.no','no'),	
	new Array('ogame.pl','pl'),			
	new Array('ogame.com.br','pt'),
	new Array('ogame.com.pt','pt'),
	new Array('ogame.ro','ro'),	
	new Array('ogame.ru','ru'),
	new Array('ogame.sv','sv'),		
	new Array('ogame.com.tr','turkish'),
	new Array('ogame.com.tw','tw')
	);


var foxgame2_messages = srGetStrBundle("chrome://foxgame2/locale/foxgame.properties");

//*****************************************************************************************
// MAIN load (executed only 1 time per tab)
//*****************************************************************************************
function foxgame2_load() {

	foxgame2_DOMEventUnloadTime = new Number(new Date());
	foxgame2_DOMEventStartTime  = new Number(new Date());
	window.addEventListener('unload', function(event){ foxgame2_DOMEventUnloadTime=new Number(new Date()); }, true);

	window.addEventListener('DOMContentLoaded', foxgame2_adjustPages, true);
	window.addEventListener('popupshowing', foxgame2_initPopupMenu, true);

	var old_onmouseup = window.onmouseup;
	window.onmouseup = function (e) { 
			foxgame2_OnMouseUp(e); 
			if (typeof old_onmouseup == "function") old_onmouseup(e);
			};
	var old_onkeyup = window.onkeyup;
	window.onkeyup = function (e) { 
			foxgame2_onKeyUpCheck(e);
			if (typeof old_onkeyp == "function") old_onkeyup(e);
			};

	
	foxgame2_listaUserHLs.init(foxgame2_getConfigFile("UserHL.xml"));
	foxgame2_listaLogins.init(foxgame2_getConfigFile("logins.xml"));
	foxgame2_listaHighlights.init(foxgame2_getConfigFile("HL.xml"));
	foxgame2_PrefsBranch.setBoolPref("foxgameStoreCoordFlag",false);
	
}


//*****************************************************************************************
// MAIN function
//*****************************************************************************************
function foxgame2_adjustPages(event)	{
    
       var doc = event.originalTarget;
       var publicFunctions = new Array(
				foxgame2_selectUniverse
       );
    	   
       var uniFunctions = new Array(
//				foxgame2_HLMessages,
				foxgame2_simLinks, //Msg
				foxgame2_HLGalaxy, 	//HL	
				foxgame2_processEnergyLevel,
				foxgame2_addDebrisNumbers,	//Gal
				foxgame2_getDelta,			
				foxgame2_addFlotaTime,		//Fleet
//				foxgame2_replicateOptions,
				foxgame2_addMovementsTime,	//Fleet
				foxgame2_addDebrisImage,  	//Gal
				foxgame2_removePlanets,		//Gal
				foxgame2_addPlayerRank, 	//Gal
				foxgame2_addAllianceRank,	//Gal
				foxgame2_addSpySpace,		//Gal				
				foxgame2_addBuildingsTime, 	//Grl
				foxgame2_addResearchTime,	 //Grl
				foxgame2_addOverviewPhalanxTime, //Fleet
				foxgame2_addShipyardTime, 	//Grl
				foxgame2_pasteCoords, 		//Fleet
				foxgame2_addPhalanxRange,	//Grl
				foxgame2_addPlanetButtons, 	//Grl
				foxgame2_addRankDiff,  	//Grl
				foxgame2_addRaid,		//Msg
				foxgame2_addRaid2,		//Msg
				foxgame2_selectMission,		//Fleet
				foxgame2_addEnergyStatus,	//Grl
				foxgame2_reduceDescriptions, //Grl
				foxgame2_addMaxResFloTranspButton, //Fleet
				foxgame2_showProdPercent,	//Grl
				foxgame2_showFleetCargo,	//Fleet
				foxgame2_showEnergyResources,//Grl
				foxgame2_showOverviewInfo, //Fleet
				foxgame2_changePlanetList, //Fleet
				foxgame2_HLStats,//HL
				foxgame2_fastReply, //Msg
				foxgame2_addConstructionName, //Grl
				foxgame2_showEventList,//Grl
				foxgame2_addSignature,	//Msg
				foxgame2_addSkin//Grl
			);
              
       try {
           if (doc.nodeType != doc.DOCUMENT_NODE) 
                doc = doc.ownerDocument;
		
		if (!doc || doc == null || doc.location == null || doc.body == null)
			return;
		var href = ""; 
		try {
			href = doc.location.hostname;
		} catch (e) {
			return;
		}			
		if (foxgame2_isOGameDomain(href)) {
			foxgame2_domain = foxgame2_getDomain(doc);
			foxgame2_callFunctions(publicFunctions, doc);
			if (foxgame2_isNewUni(foxgame2_domain)) {
	      		FGHOOKAPI.onEvent(event, doc, href);
				foxgame2_callFunctions(uniFunctions, doc);
			}
			foxgame2_checkUpdate2();
		}
	} catch (e) {
		foxgame2_debug(e);
	}

}

//*****************************************************************************************
function foxgame2_callFunction(func, doc) {
    try {
    	if (doc != null && doc.location != null && doc.location.href != null)
        	func(doc);   
    } catch (e) {
        foxgame2_debug(e);
    }
}

//*****************************************************************************************
function foxgame2_callFunctions(funcs, doc) {
    
    for (var i=0; i<funcs.length; i++) {
        foxgame2_callFunction(funcs[i], doc);
    }
    
}

//*****************************************************************************************
function foxgame2_initPopupMenu(event) {
    try {         
    	if (event.target.id != "contentAreaContextMenu") return;

//	gContextMenu.showItem("foxgame-config-menu",fg_isOGameDomain(window._content.document.location.href));

   	var fgMenu = document.getElementById("foxgame2-main-item");

//	dump(isOGameDomain(window._content.document.location.href)+"\n");

	fgMenu.setAttribute("hidden",!foxgame2_isOGameDomain(window._content.document.location.href));

//	fgMenu.setAttribute("collapsed",!isOGameDomain(window._content.document.location.href));
//	fgMenu.hidden = !isOGameDomain(window._content.document.location.href);
//	fgMenu.collapsed = !isOGameDomain(window._content.document.location.href);
//	dump(fgMenu.hidden+"\n");

	return;
    } catch (e){
        foxgame2_debug(e);
    }

}


//*****************************************************************************************
// URL checks
//*****************************************************************************************
function foxgame2_isLoginUrl(location) {
	href = location.href;
	if (href == "http://ogame.onet.pl" || href == "http://ogame.onet.pl/"  || href == "http://ogame.onet.pl/?redirect=1")
		return true;		
    return location.pathname === "index.php" || location.pathname === "/";
}

function foxgame2_isFlotaUrl(href) {
	return href.search(/page=fleet1/i) > -1;
}

function foxgame2_isFlota2Url(href) {
	return href.search(/page=fleet2/i) > -1;
}

function foxgame2_isFlota3Url(href) {
	return href.search(/page=fleet3/i) > -1;
}

function foxgame2_isMovementUrl(href) {
	return href.search(/page=movement/i) > -1;
}

function foxgame2_isGalaxyUrl(href) {
	return href.search(/page=galaxy/i) > -1;
}

function foxgame2_isMessagesUrl(href) {
	return href.search(/page=messages/i) > -1;
}

function foxgame2_isMessageUrl(href) {
	return href.search(/page=showmessage/i) > -1;
}

function foxgame2_isBuildingsUrl(href) {
	return href.search(/page=buildings/i) > -1;
}

function foxgame2_isBuildings2Url(href) {
	return href.search(/page=b_building/i) > -1;
}

function foxgame2_isStationUrl(href) {
	return href.search(/page=station/i) > -1;
}

function foxgame2_isResearchUrl(href) {
	return href.search(/page=research/i) > -1;
} 

function foxgame2_isOverviewUrl(href) {
	return href.search(/page=overview/i) > -1;
}

function foxgame2_isEventListUrl(href) {
	return href.search(/page=eventList/i) > -1;
}

function foxgame2_isPhalanxUrl(href) {
	return href.search(/page=phalanx/i) > -1;
}

function foxgame2_isWriteMessagesUrl(href) {
	return href.search(/page=writemessage/i) > -1;
}

function foxgame2_isWriteCircularUrl(href) {
	return href.search(/page=networkkommunikation/i) > -1;
}

function foxgame2_isInfosUrl(href) {
	return href.search(/page=infos/i) > -1;
}

function foxgame2_isStatUrl(href) {
	return href.search(/page=statistics/i) > -1;
}

function foxgame2_isAllyPlayersUrl(href) {
	return (href.search(/page=allianzen/i) > -1) && (href.search(/a=4/i) > -1);
}

function foxgame2_isResourcesUrl(href) {
	return href.search(/page=resources/i) > -1;
}

//*****************************************************************************************
// Misc Functions
//*****************************************************************************************
function foxgame2_isCoord(str) {
	if (str.search(/[>\s\[\(](\d{1,2})[:\.\-\/\s](\d{1,3})[:\.\-\/\s](\d{1,2})[\s\]\)<,\.]/gi) != -1) return true;
	if (str.search(/^(\d{1,2})[:\.\-\/\s](\d{1,3})[:\.\-\/\s](\d{1,2})[\s\]\)<,\.]/gi) != -1) return true;
	if (str.search(/[>\s\[\(](\d{1,2})[:\.\-\/\s](\d{1,3})[:\.\-\/\s](\d{1,2})$/gi) != -1) return true;
	if (str.search(/^(\d{1,2})[:\.\-\/\s](\d{1,3})[:\.\-\/\s](\d{1,2})$/gi) != -1) return true;
	return false;
}

//*****************************************************************************************
function foxgame2_checkUpdate2() {
	if (foxgame2_Update_Checked != 0)
		return;

	today = new Date();
	today.setHours(0);
	today.setMinutes(0);
	today.setSeconds(0);
	try {
		foxgame2_lastChecked = foxgame2_PrefsBranch.getCharPref("foxgameLastCheck");
	} catch(e) {
		foxgame2_lastChecked = "0";
	}
	foxgame2_lastChecked = foxgame2_parseInt(foxgame2_lastChecked);
	if (today.getTime() > (foxgame2_lastChecked + 1000*60*60*24*3)) { //Changed to check every 3 days to reduce server load
			foxgame2_Update_Checked = 1;
			setTimeout("foxgame2_checkUpdates(true)",1);			
	}
}

//*****************************************************************************************
function foxgame2_newDate2(mode, domain) 
{
	if (typeof domain == "undefined" )
		domain = foxgame2_domain;
	var date = new Date();
	if (mode == 0) //Hora cliente
		return date;	
	try {
		var foxgame2_Delta = foxgame2_parseInt(foxgame2_PrefsBranch.getCharPref("foxgameDeltaTime-"+domain));
	} catch(e) {var foxgame2_Delta = 0;}		
	if (mode == 1) //Hora servidor
	{
		date.setTime(date.getTime() - foxgame2_Delta);
		return date;
	}
	if (mode == 2) //Hora cliente minutos y segundos servidor
	{
		var horas = 1000 * 60 * 60;
		var diff = 0;
		if (foxgame2_Delta < 0)
			diff = -((- foxgame2_Delta) % horas);
		else
			diff = foxgame2_Delta % horas;
		date.setTime(date.getTime() - diff);
		return date;			
	}
	if (mode == 3) //Hora servidor + differencia
	{
		try {
			var diff = foxgame2_parseInt(foxgame2_PrefsBranch.getCharPref("foxgameTimeModeDiff"));
		} catch (e) {
			var diff = 0;
		}

		var horas = 1000 * 60 * 60;
		diff = diff * horas;
		date.setTime(date.getTime() - foxgame2_Delta + diff);
		return date;			
	}
}

//*****************************************************************************************
function foxgame2_getFormatH() {
	
	try {
		var format = foxgame2_PrefsBranch.getCharPref("foxgamePersonalHour");
	} catch (e) {
		var format = "H:mm:ss";
	}
	return format
}

//*****************************************************************************************
function foxgame2_getFormatD() {
	
	try {
		var format = foxgame2_PrefsBranch.getCharPref("foxgamePersonalDate");
	} catch (e) {
		var format = "dd/MM";
	}
	return format
}

//*****************************************************************************************
function foxgame2_newDate(doc) {
	
	try {
		var mode = foxgame2_parseInt(foxgame2_PrefsBranch.getCharPref("foxgameTimeMode"));
	} catch (e) {
		var mode = 1;
	}
	return foxgame2_newDate2(mode,foxgame2_getDomain(doc));
}

//*****************************************************************************************
function foxgame2_formatDate(date, date2) {
		if (date.getDatum() != date2.getDatum())
			return foxgame2_formatDate2(date,foxgame2_getFormatD()+" "+foxgame2_getFormatH());
		else
			return foxgame2_formatDate2(date,foxgame2_getFormatH());
}

//*****************************************************************************************
function foxgame2_addJavaScript(doc, js) {
    
  var head = doc.getElementsByTagName("head")[0];    

  var script = doc.createElement("script");
  script.type = "text/javascript";
  script.src = js;
  head.appendChild(script);
  return script;
}

//*****************************************************************************************
function foxgame2_addStyle(doc, styleCSS) {
    
  var head = doc.getElementsByTagName("head")[0];    

  var style = doc.createElement("style");  
  style.type = "text/css";
  style.appendChild(doc.createTextNode(styleCSS));
  head.appendChild(style);
  return style;
}

//*****************************************************************************************
function foxgame2_loadJs(doc, js) {
  var head = doc.getElementsByTagName("head")[0];   
  var script = doc.createElement("script");
  script.setAttribute("type", "text/javascript");
  script.setAttribute("language", "JavaScript");
  script.innerHTML = js;
  head.appendChild(script);
  return script;
}

//*****************************************************************************************
function foxgame2_appendBody(document,ele) {
	var body = document.getElementsByTagName("body")[0];    
	body.appendChild(ele);
}

//*****************************************************************************************
function foxgame2_NumberFormat(str) {
	str += '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(str)) {
		str = str.replace(rgx, '$1' + '.' + '$2');
	}
	return str;
}

//*****************************************************************************************
function foxgame2_addFiring(doc, func) {

  var head = doc.getElementsByTagName("head")[0];    

  var script = doc.createElement("script");
  script.setAttribute("language", "JavaScript");
  script.innerHTML = 'function fire(){'+
	'window.removeEventListener("mousemove", fire, true);'+
	func+'();'+
	'}'+
	'window.addEventListener("mousemove", fire, true);';
  head.appendChild(script);
}

//*****************************************************************************************
function foxgame2_evalnode(path,document,node) {
	try {
		var ret = document.evaluate(path,node,null,
				XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
		if (foxgame2_Debug) alert(ret.snapshotLength);

		return ret;
	} catch (e) { foxgame2_debug(e);}
}

//*****************************************************************************************
function foxgame2_eval(path,document) {
	return foxgame2_evalnode(path,document,document);
}

//*****************************************************************************************
function foxgame2_isOGameDomain(href) {
          
     var sites = new Array(			
				/^(.*\.)?ogame\.ba/i,
				/^(.*\.)?ogame\.com\.ar/i,
				/^(.*\.)?ogame\.com\.br/i,
				/^(.*\.)?ogame\.com\.cn/i,
				/^(.*\.)?ogame\.cz/i,
				/^(.*\.)?ogame\.de/i,
				/^(.*\.)?ogame\.dk/i,
				/^(.*\.)?ogame\.com\.es/i,
				/^(.*\.)?ogame\.fi/i,				
				/^(.*\.)?ogame\.fr/i,
				/^(.*\.)?ogame\.gr/i,
				/^(.*\.)?ogame\.com\.hr/i,
				/^(.*\.)?ogame\.hu/i,								
				/^(.*\.)?ogame\.it/i,
				/^(.*\.)?ogame\.jp/i,
				/^(.*\.)?o-game\.co\.kr/i,
				/^(.*\.)?ogame2\.kr/i,				
				/^(.*\.)?ogame\.lt/i,
				/^(.*\.)?ogame\.lv/i,
				/^(.*\.)?ogame\.nl/i,
				/^(.*\.)?ogame\.no/i,
				/^(.*\.)?ogame\.org/i,
				/^(.*\.)?ogame\.pl/i,
				/^(.*\.)?ogame\.onet\.pl/i,
				/^(.*\.)?ogame\.com\.pt/i,
				/^(.*\.)?ogame\.ro/i,
				/^(.*\.)?ogame\.ru/i,
				/^(.*\.)?ogame\.se/i,
				/^(.*\.)?ogame\.sk/i,
				/^(.*\.)?ogame\.com\.tr/i,
				/^(.*\.)?ogame\.com\.tw/i,
				/^(.*\.)?ogame\.tw/i,
				/^(.*\.)?ogame\.us/i);
            
    for (var i = 0; i< sites.length; i++) {
        if (href.search(sites[i]) > -1) {
          return true;   
    	} 
    }

    var server = foxgame2_UniversesXml.evaluate('//index',foxgame2_UniversesXml,null,XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null)
	if (server.snapshotLength == 0)
		return false;

	for (var i = 0; i < server.snapshotLength; i++) {
		if (href.indexOf(server.snapshotItem(i).getAttribute('url')) > -1) 
			return true;
	}
    return false;
}

//*****************************************************************************************
function foxgame2_isNewUni(href) { 
	if (href.match(/\d+/) == null && href.match(/board/) == null 
		&& href.split('.')[0] != 'www'
		&& href.split('.')[0] != 'ogame' )
		return true;
	if (href.indexOf("uni42.ogame.org") > -1 
		|| href.indexOf("uni6.ogame.de") > -1
		|| href.indexOf("uni2.ogame.de") > -1
		|| href.indexOf("uni78.ogame.de") > -1)
		return true;
	return false
}

//*****************************************************************************************
function foxgame2_getDomain(document) {
	try {		
		return document.location.host;
	} catch(e){
		foxgame2_debug(e);
		return null;
	}	
}

//*****************************************************************************************
String.prototype.trim = function() {
  var x=this;
  x=x.replace(/^\s*|\s*$/g,"");
  return x;
}

//*****************************************************************************************
String.prototype.stripHTMLEntities = function() {
  var x=this;
  x=x.replace(/<([^>]+)>/g,"");
  return x;
}

//*****************************************************************************************
String.prototype.retrim = function() {
  var x=this.trim();
  x=x.replace(/\s+/g," ");
  return x;
}

//*****************************************************************************************
// append Date object with function to return only date part
Date.prototype.getDatum = function(){ 
	return Date.UTC(this.getFullYear(),this.getMonth(),this.getDate()); 
}

//*****************************************************************************************
function foxgame2_onKeyUpCheck(e)
{
	if(e && e.keyCode == e.DOM_VK_A && e.ctrlKey)
	{
		foxgame2_OnMouseUp(e);
	}
}

//*****************************************************************************************
function foxgame2_OnMouseUp(e)
{
   if ((!e) || ((e.ctrlKey) && (!e.keyCode)))
	return;

   var targetclassname = e.target.toString();
   if (!foxgame2_GetBooleanPref("foxgameAutoCopy",false))  return;

	try {
		if(targetclassname.match(/InputElement|SelectElement|OptionElement/i) || targetclassname.match(/object XUL/i))
			return;

		if (e == null
			||e.target == null 
			|| e.target.ownerDocument == null 
			|| e.target.ownerDocument.designMode == null 
			|| e.target.ownerDocument.designMode.match(/on/i))
				return;

		if(foxgame2_getSelection().length > 0)
		{
			var str = foxgame2_getSelection();
			if (foxgame2_saveCoords(str, /\[(\d{1,2}:\d{1,3}:\d{1,2})\]/i,true))
				return;
			else	if (foxgame2_saveCoords(str, /\d{1,2}:\d{1,3}:\d{1,2}/i,false))
				return;
			else {
				str = str.replace(/[>\s\[\(](\d{1,2})[:\.\-\/\s](\d{1,3})[:\.\-\/\s](\d{1,2})[\s\]\)<,\.]/gi,"$1:$2:$3");
				str = str.replace(/^(\d{1,2})[:\.\-\/\s](\d{1,3})[:\.\-\/\s](\d{1,2})[\s\]\)<,\.]/gi,"$1:$2:$3");
				str = str.replace(/[>\s\[\(](\d{1,2})[:\.\-\/\s](\d{1,3})[:\.\-\/\s](\d{1,2})$/gi,"$1:$2:$3");
				str = str.replace(/^(\d{1,2})[:\.\-\/\s](\d{1,3})[:\.\-\/\s](\d{1,2})$/gi,"$1:$2:$3");
				foxgame2_saveCoords(str, /\d{1,2}:\d{1,3}:\d{1,2}/i,false);
			}
	
		}
		return;
	} catch(e) {
		foxgame2_debug(e);
		return;
	}
}
//*****************************************************************************************
function foxgame2_saveCoords(str, reg, extract){
	var found = false;
	var str2 = str.match(reg);
	if (str2 == null)
		return false;
	str2 = str2[0];
	str2 = str2.toString();
	if (extract)
		str2 = str2.replace(reg,"$1");
	while (str2 != null && found == false) {
		var temp = str2.split(':');
		var g = foxgame2_parseInt(temp[0]);
		var s = foxgame2_parseInt(temp[1]);
		var p = foxgame2_parseInt(temp[2]);
		if (g+"" == temp[0] && s+"" == temp[1] && p+"" == temp[2] && !(g < 1 || g > 50) && !(s < 1 || s > 499 || (s > 100 && g >9)) && !(p > 16))
		{
			foxgame2_PrefsBranch.setCharPref("foxgameStoreCoord",str2);
			foxgame2_PrefsBranch.setBoolPref("foxgameStoreCoordFlag",true);
			found = true;
		} else {
			str = str.substr(str.search(str2)+6);
			str2 = str.match(reg);
			if (str2 == null)
				return false;
			str2 = str2[0];
			str2 = str2.toString();
			if (extract)
				str2 = str2.replace(reg,"$1");
		}
	}
	return found;
}

//*****************************************************************************************
function foxgame2_getSelection() 
{
	var SelectionText = "";
	var trywindow = true;
	
	var focusedElement = document.commandDispatcher.focusedElement;
	if(focusedElement && typeof focusedElement != "undefined" && focusedElement != null)
	{
		try
		{
			SelectionText = focusedElement.value.substring(focusedElement.selectionStart, focusedElement.selectionEnd);
			trywindow = false;
		}
		catch(e)
		{
		}
	}
	if(trywindow)
	{
		var focusedWindow = document.commandDispatcher.focusedWindow;
		var Selection = null;
		try
		{
			var winWrapper = new XPCNativeWrapper(focusedWindow, 'document', 'getSelection()');
			Selection = winWrapper.getSelection();
		}
		catch(e)
		{
			if (focusedWindow != null)
				Selection = focusedWindow.getSelection();
		}
		if (Selection != null)
			SelectionText = Selection.toString();
	}
	return SelectionText;
}

//*****************************************************************************************
function foxgame2_parseInt(string) {
	if (!string)
		return 0;
	string = string.replace(/^\s*0(.+)/, "$1");
	string = string.replace(/[\.\s,]/g,'');
	return parseInt(string);
}

//*****************************************************************************************
function foxgame2_loadLogins(document){
	foxgame2_listaLogins.load();
	var reset = false;
	var stop = false;
	var i;
	do {
		stop = false;
		for (i = 0; i < foxgame2_listaLogins.data.length; i++) {
			if (document.location.href.indexOf(foxgame2_listaLogins.data[i].server) != -1) {
				if (foxgame2_listaLogins.data[i].cycle == 0){
					foxgame2_listaLogins.data[i].setCycle(1);
					stop = true;
					break;					
				}
			}
		}
		if (!stop && reset)
			return null;
		if (!stop && !reset) {
			reset = true;
			for (i = 0; i < foxgame2_listaLogins.data.length; i++)
				if (document.location.href.indexOf(foxgame2_listaLogins.data[i].server) != -1)
					foxgame2_listaLogins.data[i].setCycle(0);
		}
	} while (!stop)
	
	foxgame2_listaLogins.save();
	return i;
}

//*****************************************************************************************
function foxgame2_findLang(document,langArray){
	var domain = document.location.href.split('/');
	domain = domain[2];
	var server = foxgame2_UniversesXml.evaluate('//index/universe[@value="'+domain+'"]',foxgame2_UniversesXml,null,XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null)
	if (server.snapshotLength == 0)
		return "";
	server = server.snapshotItem(0).parentNode.getAttribute('url');
	var found = false;
	for (var i = 0; i < langArray.length; i++) {
		if (langArray[i][0] == server) {
			found = true;
			return langArray[i][1];
		}
	}
	return "";
}

//*****************************************************************************************
function foxgame2_findAny(text, array) {
	for (var i = 0; i < array.length; i++)
		if (text.search(array[i]) != -1)
			return true;
	return false;
}

//*****************************************************************************************
function foxgame2_getEnergyLevel(document) {
    var domain = document.location.host;
	if (foxgame2_EnergyLevels[domain]==null){
    	var url = document.location.href;
      	var url = url.replace(/page=.+?&/,'page=research&');
		var req = new XMLHttpRequest();
		req.open('GET', url, false);
		var timeoutId = setTimeout(function() { req.abort(); }, 10000 );
		req.send(null);		
		clearTimeout(timeoutId);
		if(req.status != 200)
			return 1;
		    
      	var html = req.responseText;
      	html = html.substring(html.indexOf('<div class="research113">'),html.indexOf('<div class="research120">'));
      	var div = document.createElement('div');
      	div.innerHTML = html;
      	div.style.visibility = "hidden";
      	document.body.appendChild(div);
      	var obj = foxgame2_evalnode('//div[@class="research113"]//span/span',document,div);
    	if (obj.snapshotLength == 0)
    		return 1;
		var level = obj.snapshotItem(0).textContent;
		level = level.retrim();
		level = level.split(" ");
    	level = level[level.length - 1];
      	document.body.removeChild(div);
      	      	
      	if (level && level!=''){
        	foxgame2_EnergyLevels[domain] = level;
        	return foxgame2_EnergyLevels[domain];
		} else
			return 1;
	} else {
		return foxgame2_EnergyLevels[domain];
	}  		
}

//*****************************************************************************************
function foxgame2_getAllyPIN(document, subject) {
    var domain = document.location.host;
    try {
	if (foxgame2_AllyMsgs[domain] != null){
		for (var i in foxgame2_AllyMsgs[domain]) {
			if (subject.search(foxgame2_AllyMsgs[domain][i][1]) != -1)
				return [ foxgame2_AllyMsgs[domain][i][0], foxgame2_AllyMsgs[domain][i][1]];
		}		
		return null;
	} else {
    	var url = document.location.href;
      	var url = url.replace(/page=.+?&/,'page=network&');
		var req = new XMLHttpRequest();
		req.open('GET', url, false); 
		var timeoutId = window.setTimeout(function() { req.abort(); }, 10000 );				 
		req.send(null);
		window.clearTimeout(timeoutId);
		if(req.status != 200) {
			foxgame2_AllyMsgs[domain] = new Array();
			return 1;
		}
		    
      	var html = req.responseText;     	      	
      	html = html.substring(html.indexOf('<table class="members'),html.lastIndexOf('</table>')+8);
      	var div = document.createElement('div');
      	div.innerHTML = html;
      	document.body.appendChild(div);
      	var obj = foxgame2_evalnode('.//table[starts-with(@class,"members")]/tbody/tr/td[1]',document,div);
      	if (obj.snapshotLength == 0)
      		foxgame2_AllyMsgs[domain] = new Array();
      	for (var i = 0; i < obj.snapshotLength; i++) {
      		var name = obj.snapshotItem(i).textContent.trim();      		
      		var obj2 = foxgame2_evalnode('.//a/img',document,obj.snapshotItem(i).parentNode);  		
      		if (obj2.snapshotLength > 0) {
      			if (foxgame2_AllyMsgs[domain] == null)
      				foxgame2_AllyMsgs[domain] = new Array();
      				
      			var pin = obj2.snapshotItem(0).parentNode.getAttribute('href');
      			pin = pin.replace(/.*to\=(\d+).*/igm,'$1')
      			var k =  foxgame2_AllyMsgs[domain].length;   				
      			foxgame2_AllyMsgs[domain][k] = [pin, name];
      		}
      	}
		//var k =  foxgame2_AllyMsgs[domain].length;   				
		//foxgame2_AllyMsgs[domain][k] = ["130962","frisco"];      		
      	document.body.removeChild(div);
		for (var i in foxgame2_AllyMsgs[domain]) {
			if (subject.search(foxgame2_AllyMsgs[domain][i][1]) != -1)
				return [ foxgame2_AllyMsgs[domain][i][0], foxgame2_AllyMsgs[domain][i][1]]; 
		}		
		return null;
    }
    }catch (e) {foxgame2_debug(e);}	
}

//*****************************************************************************************
foxgame2_getHashProperty = function(url,hashname){
	var p=url.indexOf(hashname);
    if(p!=-1){
    	var pe = url.indexOf('&',p);
      	if(pe>p) return url.substring((p+hashname.length+1), pe);
      	else     return url.substring((p+hashname.length+1));
    }
    return null;
}

//*****************************************************************************************
function foxgame2_getVar (document,name) {	    
		var obj = foxgame2_getLastScript (document);
		if (obj == null)
			return null;
		var res = obj.innerHTML.match(new RegExp('(var)?\\s+'+name+'\\s*=\\s*(\\d+)\\s*[;-]'));	
		if (res == null)
			return null;
		return res[2];
}

//*****************************************************************************************
function foxgame2_getLastScript (document) {
    var path = '//body//script[@type="text/javascript"][last()]';
  	var obj = foxgame2_eval(path,document);
	if (obj.snapshotLength == 0) return null;
	return obj.snapshotItem(0);
}

//*****************************************************************************************
function foxgame2_getCurrentCoords (document) {
	var path = '//a[contains(@class,"active") and contains(@class,"planetlink")]/span[last()]';
  	var obj = foxgame2_eval(path,document);
	if (obj.snapshotLength == 0) return null;
		return obj.snapshotItem(0).textContent;
}

foxgame2_load();
