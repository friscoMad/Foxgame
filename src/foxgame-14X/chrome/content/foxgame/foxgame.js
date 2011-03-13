var DOMEventUnloadTime = 0;
var fg_Debug = false;
//Real - servidor
var fg_Delta = 0;
var today;
var fg_domain = "";
var fg_lastChecked = "0";
var fg_Update_Checked = 0;
var fg_GTPluginVersion = "2.1";

var messages = srGetStrBundle("chrome://foxgame/locale/foxgame.properties");
var fg_MilosDiv = "<div style=\"position:absolute; z-index:1; top:110px; left:50px; visibility: hidden\" id=\"div_frame\">"+
	'<table celspacing="0" celpadding="0"><tr><td align="right" bgcolor="#FFFFFF"><a onclick="hide();"><font color="black">'+messages.GetStringFromName("foxgame.inner.close") +'</font></a></td></tr><tr><td>'+
	"<iframe src=\"\" name=\"_milos\"id=\"_milos\" height=\"300\" width=\"600\"></iframe>"+
	'</td></tr></table></div>';


//*****************************************************************************************
// MAIN load (executed only 1 time per tab)
//*****************************************************************************************
function foxgame_load() {
	window.addEventListener('DOMContentLoaded', fg_adjustPages, true);
	window.addEventListener('popupshowing', fg_initPopupMenu, true);


	window.addEventListener("load", loriWindowOnLoad, false);

	DOMEventUnloadTime = new Number(new Date());

	var old_onmouseup = window.onmouseup;
	window.onmouseup = function (e) { 
			foxgameOnMouseUp(e); 
			if (typeof old_onmouseup == "function") old_onmouseup(e);
			};
	var old_onkeyup = window.onkeyup;
	window.onkeyup = function (e) { 
			foxgame_onKeyUpCheck(e);
			if (typeof old_onkeyp == "function") old_onkeyup(e);
			};

	window.addEventListener ('unload', function (event) {
			DOMEventUnloadTime = new Number(new Date());		
		}, true );

	fg_listaDBs.init(fg_getConfigFile("dbs.xml"));
	PrefsBranchFG.setBoolPref("foxgameStoreCoordFlag",false);
}


//*****************************************************************************************
// MAIN function
//*****************************************************************************************
function fg_adjustPages(event)	{
    
       var doc = event.originalTarget;
       
       try {
           if (doc.nodeType != doc.DOCUMENT_NODE) 
                doc = doc.ownerDocument;

		if (doc == null)
			return;		
		var href = doc.location.href;     
		if (fg_isOGameDomain(href)) {
			fg_domain = fg_getDomain(doc);
			var functions = new Array(
				//fg_addDebrisNumbers,
				fg_getDelta,
				fg_selectUniverse,
				//fg_addAllianceRank,
				//fg_addPlayerRank,
				fg_addFlotaTime,
				fg_replicateOptions,
				fg_addFlotaReturnTime,
				fg_addReportButtons,
				fg_addMilosButtons,
				fg_addRankingButtons,
				fg_addDebrisImage,
				fg_removePlanets,
				fg_colorizePrivates,
				fg_colorizeAlly,
				fg_addBuildingsTime,
				fg_addResearchTime,
				fg_addPhalanxTime,
				fg_addOverviewTime,
				fg_addBuildingTime,
				fg_addSignature,
				fg_pasteCoords,
				//fg_infosDeltas,
				fg_addLabels,
				fg_addAllyButtons,
				//fg_addPlanetButtons,
				fg_selectMission
			);
			callOgameFunctions(functions, doc);
			fg_checkUpdate2();
		}
	} catch (e) {
		foxgamedebug(e);
	}

}


//*****************************************************************************************
function callOgameFunction(func, doc) {
    try {
        func(doc);   
    } catch (e) {
        foxgamedebug(e);
    }
}

//*****************************************************************************************
function callOgameFunctions(funcs, doc) {
    
    for (var i=0; i<funcs.length; i++) {
        callOgameFunction(funcs[i], doc);
    }
    
}

//*****************************************************************************************
function fg_initPopupMenu(event) {
    try {    
    	if (event.target.id != "contentAreaContextMenu") return;

//	gContextMenu.showItem("foxgame-config-menu",fg_isOGameDomain(window._content.document.location.href));

   	var fgMenu = document.getElementById("foxgame-config-menu");

//	dump(isOGameDomain(window._content.document.location.href)+"\n");

	fgMenu.setAttribute("hidden",!fg_isOGameDomain(window._content.document.location.href));

//	fgMenu.setAttribute("collapsed",!isOGameDomain(window._content.document.location.href));
//	fgMenu.hidden = !isOGameDomain(window._content.document.location.href);
//	fgMenu.collapsed = !isOGameDomain(window._content.document.location.href);
//	dump(fgMenu.hidden+"\n");

	return;
    } catch (e){
        foxgamedebug(e);
    }

}

//*****************************************************************************************
// URL checks
//*****************************************************************************************
function fg_isLoginUrl(href) {
    return href.search(/portal\//i) > -1;
}

function fg_isFlota2Url(href) {
	return href.search(/page=flotten2/i) > -1;
}

function fg_isFlota3Url(href) {
	return href.search(/page=flotten3/i) > -1;
}

function fg_isFlotaUrl(href) {
	return href.search(/page=flotten1/i) > -1;
}

function fg_isGalaxyUrl(href) {
	return href.search(/page=galaxy/i) > -1;
}

function fg_isMessagesUrl(href) {
	return href.search(/page=messages/i) > -1;
}

function fg_isBuildingsUrl(href) {
	return href.search(/page=buildings/i) > -1;
}

function fg_isBuildings2Url(href) {
	return href.search(/page=b_building/i) > -1;
}

function fg_isOverviewUrl(href) {
	return href.search(/page=overview/i) > -1;
}

function fg_isPhalanxUrl(href) {
	return href.search(/page=phalanx/i) > -1;
}

function fg_isWriteMessagesUrl(href) {
	return href.search(/page=writemessages/i) > -1;
}

function fg_isInfosUrl(href) {
	return href.search(/page=infos/i) > -1;
}

function fg_isStatUrl(href) {
	return href.search(/page=stat/i) > -1;
}

function fg_isAllyPlayersUrl(href) {
	return (href.search(/page=allianzen/i) > -1) && (href.search(/a=4/i) > -1);
}


//*****************************************************************************************
// Misc Functions
//*****************************************************************************************
function fg_isCoord(str) {
	if (str.search(/[>\s\[\(](\d{1,2})[:\.\-\/\s](\d{1,3})[:\.\-\/\s](\d{1,2})[\s\]\)<,\.]/gi) != -1) return true;
	if (str.search(/^(\d{1,2})[:\.\-\/\s](\d{1,3})[:\.\-\/\s](\d{1,2})[\s\]\)<,\.]/gi) != -1) return true;
	if (str.search(/[>\s\[\(](\d{1,2})[:\.\-\/\s](\d{1,3})[:\.\-\/\s](\d{1,2})$/gi) != -1) return true;
	if (str.search(/^(\d{1,2})[:\.\-\/\s](\d{1,3})[:\.\-\/\s](\d{1,2})$/gi) != -1) return true;
	return false;
}

//*****************************************************************************************
function fg_checkUpdate2() {
	if (fg_Update_Checked != 0)
		return;

	today = new Date();
	today.setHours(0);
	today.setMinutes(0);
	today.setSeconds(0);
	try {
		fg_lastChecked = PrefsBranchFG.getCharPref("foxgameLastCheck");
	} catch(e) {
		fg_lastChecked = "0";
	}
	if (Date.parse(today) != fg_lastChecked) {
			setTimeout("fg_checkUpdates()",1);
			fg_Update_Checked = 1;
	}
}

//**************************************************************************
function fg_checkUpdates() {
	var xmlReq = new XMLHttpRequest();
	xmlReq.open("GET", "http://www.foxgame.org/xml/fgUniverses.xml", true);
	xmlReq.onload = fg_processUpdateResponse;
	xmlReq.send(null);
}

//**************************************************************************
function fg_processUpdateResponse(event) {
	try {
		var text = event.target.responseText;
		var universesStream = fg_getWriteStream(fg_getConfigFile("fgUniverses.xml"));
		// First, get and initialize the converter
		var converter = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"]
            	              .createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
		converter.charset = "UTF-8";
		var chunk = converter.ConvertFromUnicode(text);
		universesStream.write(chunk, chunk.length);
		var fin = converter.Finish();
		if (fin.length > 0)
			universesStream.write(fin, fin.length);
		universesStream.close();
		var today = new Date();
		today.setHours(0);
		today.setMinutes(0);
		today.setSeconds(0);
		PrefsBranchFG.setCharPref("foxgameLastCheck",Date.parse(today));
	} catch(e) {
	}
}

//*****************************************************************************************
function fg_newDate2(mode, domain) 
{
	if (typeof domain == "undefined" )
		domain = fg_domain;
	var date = new Date();
	if (mode == 0) //Hora cliente
		return date;	
	try {
		var fg_Delta = fg_parseInt(PrefsBranchFG.getCharPref("foxgameDeltaTime-"+domain));
	} catch(e) {}		
	if (mode == 1) //Hora servidor
	{
		date.setTime(date.getTime() - fg_Delta);
		return date;
	}
	if (mode == 2) //Hora cliente minutos y segundos servidor
	{
		var horas = 1000 * 60 * 60;
		var diff = 0;
		if (fg_Delta < 0)
			diff = -((- fg_Delta) % horas);
		else
			diff = fg_Delta % horas;
		date.setTime(date.getTime() - diff);
		return date;			
	}
	if (mode == 3) //Hora servidor + differencia
	{
		try {
			var diff = fg_parseInt(PrefsBranchFG.getCharPref("fgTimeDiff"));
		} catch (e) {
			var diff = -4;
		}

		var horas = 1000 * 60 * 60;
		diff = diff * horas;
		date.setTime(date.getTime() - fg_Delta + diff);
		return date;			
	}
}

//*****************************************************************************************
function fg_newDate(doc) {
	
	try {
		var mode = fg_parseInt(PrefsBranchFG.getCharPref("fgTimeMode"));
	} catch (e) {
		var mode = 1;
	}
	return fg_newDate2(mode,fg_getDomain(doc));
}

//*****************************************************************************************
function fg_addJavaScript(doc, js) {
    
  var head = doc.getElementsByTagName("head")[0];    

  var script = doc.createElement("script");
  script.setAttribute("language", "JavaScript");
  script.setAttribute("src", js);
  head.appendChild(script);
  
  return script;
    
}

//*****************************************************************************************
function fg_appendBody(document,ele) {
	var body = document.getElementsByTagName("body")[0];    
	body.appendChild(ele);
}

//*****************************************************************************************
function fg_addFormat(str) {
	str += '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(str)) {
		str = str.replace(rgx, '$1' + '.' + '$2');
	}
	return str;
}

//*****************************************************************************************
function fg_addFiring(doc, func) {

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
function fgEvalnode(path,document,node) {
	var ret = document.evaluate(path,node,null,
			XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
	if (fg_Debug) alert(ret.snapshotLength);

	return ret;

}

//*****************************************************************************************
function fgEval(path,document) {
	return fgEvalnode(path,document,document);
}

//*****************************************************************************************
function fg_isOGameDomain(href) {

    if (href.match(/^file:\/\//) && fg_Debug) return true;
          
     var sites = new Array(/^http:\/\/(.*\.)?ogame\d*\.de/i,
				/^http:\/\/s\d+\.gfsrv\.net/i,
				/^http:\/\/en\d+\.gfsrv\.net/i, 
				/^http:\/\/213\.239\.\d+\.\d+/i,
				/^http:\/\/85\.214\.\d+\.\d+/i,
				/^http:\/\/88\.198\.\d+\.\d+/i,
				/^http:\/\/81\.169\.\d+\.\d+/i,
				/^http:\/\/203\.175\.\d+\.\d+/i,
				/^http:\/\/222\.73\.\d+\.\d+/i,
				/^http:\/\/61\.129\.\d+\.\d+/i,
				/^http:\/\/80\.237\.\d+\.\d+/i,
				/^http:\/\/game\d+\.de/i,
				/^http:\/\/.*\.ogamed*\.de\.es/i,
				/^http:\/\/(.*\.)?ogame\d+\.tiscali\.de/i,
				/^http:\/\/(.*\.)?ogame\.com\.es/i,
				/^http:\/\/(.*\.)?ogame\.de/i,
				/^http:\/\/(.*\.)?ogame\.fr/i,
				/^http:\/\/(.*\.)?ogame\.pl/i,
				/^http:\/\/(.*\.)?ogame\.onet\.pl/i,
				/^http:\/\/(.*\.)?ogame\.nl/i,
				/^http:\/\/(.*\.)?ogame\.dk/i,
				/^http:\/\/(.*\.)?ogame\.it/i,
				/^http:\/\/(.*\.)?ogame\.ru/i,
				/^http:\/\/(.*\.)?ogame\.sk/i,
				/^http:\/\/(.*\.)?ogame\.ba/i,
				/^http:\/\/(.*\.)?ogame\.se/i,
				/^http:\/\/(.*\.)?ogame\.gr/i,
				/^http:\/\/(.*\.)?ogame\.com\.hr/i,
				/^http:\/\/(.*\.)?ogame\.com\.tw/i,
				/^http:\/\/(.*\.)?ogame\.tw/i,
				/^http:\/\/(.*\.)?ogame\.ro/i,
				/^http:\/\/(.*\.)?ogame\.cz/i,
				/^http:\/\/(.*\.)?ogame\.hu/i,								
				/^http:\/\/(.*\.)?ogame\.com\.br/i,
				/^http:\/\/(.*\.)?ogame\.com\.pt/i,
				/^http:\/\/(.*\.)?ogame\.com\.tr/i,
				/^http:\/\/(.*\.)?ogame\.com\.cn/i,
				/^http:\/\/(.*\.)?o-game\.co\.kr/i,
				/^http:\/\/(.*\.)?ogame2\.kr/i,				
				/^http:\/\/(.*\.)?ogame\.org/i);
            
     for (var i = 0; i< sites.length; i++) {
        if (href.search(sites[i]) > -1) {
          return true;   
        } 
     }    
     return false;
}

//*****************************************************************************************
function fg_getDomain(document) {
	try {
		if (document == null)
			return null;
		var text = document.location.href;
		text = text.split('\/\/');
		text = text[1];
		text = text.split('\/');
		text = text[0];
		return text;
	} catch(e){
		foxgamedebug(e);
		return null;
	}	
}


//*****************************************************************************************
function fgFindParentDocument(document) {
	try {
		var l = getBrowser().mPanelContainer.childNodes.length;
		var found = false;
		for(var i = 0; i < l; i++) {
			var b = getBrowser().mTabContainer.childNodes[i].linkedBrowser;
			if (!b && typeof getBrowser().getBrowserAtIndex() != "undefined" )
				b = getBrowser().getBrowserAtIndex(i);
			if (b && fg_isOGameDomain(b.currentURI.spec)) 
			{
				var frames = b.contentDocument.getElementsByTagName("frame");
				if(frames.length > 1 && (frames[1].contentDocument == document))
				{
					return b.contentDocument;
				}
			}
		}
		return null;
	} catch(e){
		foxgamedebug(e);
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
function foxgame_onKeyUpCheck(e)
{
	if(e && e.keyCode == e.DOM_VK_A && e.ctrlKey)
	{
		foxgameOnMouseUp(e);
	}
}

//*****************************************************************************************
function foxgameOnMouseUp(e)
{
   if ((!e) || ((e.ctrlKey) && (!e.keyCode)))
	return;

   var targetclassname = e.target.toString();
   if (!fgGetBooleanPref("foxgameAutoCopy",false))  return;

	try {
		if(targetclassname.match(/InputElement|SelectElement|OptionElement/i) || targetclassname.match(/object XUL/i))
			return;

		if(e.target.ownerDocument.designMode)
			if(e.target.ownerDocument.designMode.match(/on/i))
				return;

		if(foxgame_getSelection().length > 0)
		{
			var str = foxgame_getSelection();
			if (foxgame_saveCoords(str, /\[(\d{1,2}:\d{1,3}:\d{1,2})\]/i,true))
				return;
			else	if (foxgame_saveCoords(str, /\d{1,2}:\d{1,3}:\d{1,2}/i,false))
				return;
			else {
				str = str.replace(/[>\s\[\(](\d{1,2})[:\.\-\/\s](\d{1,3})[:\.\-\/\s](\d{1,2})[\s\]\)<,\.]/gi,"$1:$2:$3");
				str = str.replace(/^(\d{1,2})[:\.\-\/\s](\d{1,3})[:\.\-\/\s](\d{1,2})[\s\]\)<,\.]/gi,"$1:$2:$3");
				str = str.replace(/[>\s\[\(](\d{1,2})[:\.\-\/\s](\d{1,3})[:\.\-\/\s](\d{1,2})$/gi,"$1:$2:$3");
				str = str.replace(/^(\d{1,2})[:\.\-\/\s](\d{1,3})[:\.\-\/\s](\d{1,2})$/gi,"$1:$2:$3");
				foxgame_saveCoords(str, /\d{1,2}:\d{1,3}:\d{1,2}/i,false);
			}
	
		}
		return;
	} catch(e) {
		foxgamedebug(e);
		return;
	}
}
//*****************************************************************************************
function foxgame_saveCoords(str, reg, extract){
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
		var g = fg_parseInt(temp[0]);
		var s = fg_parseInt(temp[1]);
		var p = fg_parseInt(temp[2]);
		if (g+"" == temp[0] && s+"" == temp[1] && p+"" == temp[2] && !(g < 1 || g > 50) && !(s < 1 || s > 499 || (s > 100 && g >9)) && !(p > 16))
		{
			PrefsBranchFG.setCharPref("foxgameStoreCoord",str2);
			PrefsBranchFG.setBoolPref("foxgameStoreCoordFlag",true);
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
function foxgame_getSelection() 
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
		try
		{
			var winWrapper = new XPCNativeWrapper(focusedWindow, 'document', 'getSelection()');
			var Selection = winWrapper.getSelection();
		}
		catch(e)
		{
			var Selection = focusedWindow.getSelection();
		}
		SelectionText = Selection.toString();
	}
	return SelectionText;
}

//*****************************************************************************************
function fg_findUrlInFrames(document,func) {
	if (func(document.location.href))
		return document;

	var frames = document.getElementsByTagName("frame");
	for (var i = 0; i < frames.length; i++) {
		if (frames[i] == null || frames[i].contentDocument == null)
			continue;
		if (func(frames[i].contentDocument.location.href)) {
			return(frames[i].contentDocument);
		}
		var ret = fg_findUrlInFrames(frames[i].contentDocument,func);
		if (ret != null)
			return ret;
	}
	var frames = document.getElementsByTagName("iframe");
	for (var i = 0; i < frames.length; i++) {
		if (frames[i] == null || frames[i].contentDocument == null)
			continue;
		if (func(frames[i].contentDocument.location.href)) {
			return(frames[i].contentDocument);
		}
		var ret = fg_findUrlInFrames(frames[i].contentDocument,func);
		if (ret != null)
			return ret;
	}	
	return null;
}

//*****************************************************************************************
function fg_parseInt(string) {
	string = string.replace(/^\s*0(.+)/, "$1");
	string = string.replace(/[\.\s,]/g,'');
	return parseInt(string);
}

//*****************************************************************************************
// Stacktrace function (Code from http://www.helephant.com/Article.aspx?ID=675)
// Just for debug
//*****************************************************************************************
/*
function fg_stackTrace(startingPoint) { 
	var stackTraceMessage = "Stack trace:\n"; 
	var nextCaller = startingPoint; 
	while(nextCaller) {
		var nameTemp = "";
		if(nextCaller.name) 
			nameTemp = nextCaller.name;
		else {
			var definition = nextCaller.toString(); 
			nameTemp = definition.substring(definition.indexOf('function') + 8,definition.indexOf('(')); 
		}
		if (!nameTemp)
			nameTemp = "anonymous"; 
		stackTraceMessage += nameTemp + "("; 
		for(var x=0; x<nextCaller.arguments.length; x++) { 
			var nextArgument = nextCaller.arguments[x]; 
			if(nextArgument.length > 30) 
				nextArgument = nextArgument.substring(0, 30) + "..."; 
			stackTraceMessage += "'" + nextArgument + "'"; 
			if(x < nextCaller.arguments.length - 1) 
				stackTraceMessage += ", "; 
		} 
		stackTraceMessage += ")\n";  
		nextCaller = nextCaller.caller; 
	} 
	alert(stackTraceMessage); 
}
*/

//*****************************************************************************************
// Features functions
//*****************************************************************************************

function fg_selectUniverse(doc) {

//	if (doc && !fg_isLoginUrl(doc.location.href)) return;
	if (!doc) return;
	if (!fgGetBooleanPref("foxgameSelectUniverse",true)) return;
	try {
		if (doc.location.href.indexOf(PrefsBranchFG.getCharPref("fgServer")) == -1) return;
	} catch(e){ return;}

	if (fg_Debug) alert("Estamos Universo");

	try {
		var uni = PrefsBranchFG.getCharPref("fgUni");
	} catch(e) { return;}
	var path = '//option[@value="'+uni+'"]';
	var univeroption = fgEval(path,doc);
	if (univeroption.snapshotLength != 0) 
		univeroption.snapshotItem(0).selected = true;
	else 
		return;
	var path = '//input[@name="login"]';
	var obj = fgEval(path,doc);
	if (obj.snapshotLength != 0) 
		obj.snapshotItem(0).focus();

}
//*****************************************************************************************
function fg_addBuildingTime(document) {

	if (document && !fg_isBuildingsUrl(document.location.href)) return;
	if (!fgGetBooleanPref("foxgameBuildingTime",true)) return;

	if (fg_Debug) alert("Estamos tiempo hangar");

	try {
	      var path = '//form/form';
      	var obj = fgEval(path,document);

		if (obj.snapshotLength == 0) return;

		obj = obj.snapshotItem(0);
		while(obj.nodeName != "#text")
			obj = obj.nextSibling;
		var text = obj.nodeValue;
		text = text.split(':');
		if (text.length == 1) //russian patch
		{
			text = text[0].split(/\s+/);
			var text2 = "";
			for (var i = 1; text.length - i > 3; i++) 
				text2 = ' '+ text[text.length - i] + text2;
			text = text2.trim();
		} else 
			text = text[1].trim();
		text = text.split(/\s+/);
		var sec = 0, temp = 0;
		for (var i = 0; i < text.length; i++) {	
			temp = fg_parseInt(text[i]);
			if (i == 0 && text.length == 8)
				sec = sec + (temp * 86400);
			else if ((i == 0 && text.length == 6) || (i == 2 && text.length == 8))
				sec = sec + (temp * 3600);
			else if ((i == 0 && text.length == 4) || (i == 2 && text.length == 6) || (i == 4 && text.length == 8))
				sec = sec + (temp * 60);
			else if ((i == 2 && text.length == 4) || (i == 4 && text.length == 6) || (i == 6 && text.length == 8))
				sec = sec + temp;
			i++;
		}
		var date = fg_newDate(document);
		date.setTime(date.getTime() + (sec*1000));
		var date2 = fg_newDate(document);
		var text2 = document.createTextNode(messages.GetStringFromName("foxgame.inner.finishTime") + " : " + formatDate(date,(date.getDatum()!=date2.getDatum()?"d/MM H:mm:ss":"H:mm:ss")));
		br = document.createElement("br");
		obj.parentNode.appendChild(br);
		obj.parentNode.appendChild(text2);
		
	} catch (e) {
		foxgamedebug(e);
	}
}

//*****************************************************************************************
function fg_addResearchTime(document) {

	if (document && !fg_isBuildingsUrl(document.location.href))  return;
	if (!fgGetBooleanPref("foxgameResearchTime",true)) return; 
	
	if (fg_Debug) alert("Estamos tiempo investigacion");

	setTimeout(function(){
		fg_addBxxTime(document,false,false);
	},500);
}

//*****************************************************************************************
function fg_addBuildingsTime(document) {

	if (document && !fg_isBuildings2Url(document.location.href))  return;
	if (!fgGetBooleanPref("foxgameBuildingsTime",true)) return; 
	
	if (fg_Debug) alert("Estamos tiempo construccion");
	
	setTimeout(function(){
		fg_addBxxTime(document,false,false);
	},500);		
}

//*****************************************************************************************
function fg_addPhalanxTime(document) {

	if (document && !fg_isPhalanxUrl(document.location.href))  return;
	if (!fgGetBooleanPref("foxgamePhalanxTime",true)) return; 
	
	if (fg_Debug) alert("Estamos tiempo phalanx");

	setTimeout(function(){
		fg_addBxxTime(document,true,false);
	},500);
}

//*****************************************************************************************
/*
function fg_addBxxTime(document,secondTime) {

	try {
	    var path = '//div[starts-with(@id,"bxx")]';
      	var obj = fgEval(path,document);


		var date, date2 = fg_newDate(document);
		var secs;
		var ele;
		var text;
		for (var i = 0; i < obj.snapshotLength; i++) {
			ele = obj.snapshotItem(i);
			text = ele.firstChild.nodeValue.split(':');
			secs = fg_parseInt(text[0]) * 3600;
			secs = secs + fg_parseInt(text[1]) * 60;
			secs = secs + fg_parseInt(text[2]);

			date = fg_newDate(document);
			date.setTime(date.getTime() + (secs*1000));

			var text2 = document.createTextNode(formatDate(date,(date.getDatum()!=date2.getDatum()?"d/MM H:mm:ss":"H:mm:ss")));
			var font = document.createElement("strong");
			font.innerHTML = "<br /><font color='lime'>" +text2.nodeValue+"</font>";
			font.setAttribute("color","lime");
			ele.parentNode.appendChild(font);
		}

	} catch (e) {
		if (!secondTime)
			setTimeout(function(){
				fg_addBxxTime(document,true);
			},1000);
	}

}
*/

function fg_addBxxTime(document, isPhalanx, secondTime) {
  	try {
    	var obj = fgEval('//div[starts-with(@id,"bxx")]',document);
    	if (obj.snapshotLength == 0)
    		return;
    	var date, date2 = new Date(), date3, date4;
    	var date3 = fg_newDate2(1,fg_getDomain(document));
    	var date4 = fg_newDate(document);      
    	date = fg_newDate(document);
   	 	for (var i = 0; i < obj.snapshotLength; i++) {
      		elem = obj.snapshotItem(i);
      		if (isPhalanx||false) {
        		// [SA] my calculation since there were huge errors in times date is always in SERVER TIME
        		var BK_PHALANX_MAGIC_NUMBER = 8496499; // +499 ms
        		try {
          			// reading values from document
          			var star    = fg_parseInt(elem.getAttribute('star'))  * 1000;
          			var title   = fg_parseInt(elem.getAttribute('title')) * 1000;
          			// time lag calculation from start of loading a script to this point
          			var timelag = new Number(new Date()) - DOMEventStartTime;
          			if (fgGetBooleanPref("foxgamePhalanxTime-UseAntiLag",false))
          				timelag = 0;
          			// calc and return date
          			date2 = (new Date(star + title + BK_PHALANX_MAGIC_NUMBER + timelag));
        			date2.setTime(date4.getTime() + date2.getTime() - date3.getTime() );
          		} catch(e) {
          			foxgamedebug(e,'phalanx');
        		}

        		// --------------------------------------------------------------------------

        	} else {
        		if ((elem.className=='z') && (elem.getAttribute('title')>1196000000)) {
        			date2 = new Date(fg_parseInt(elem.getAttribute('title'))*1000);
        			date2.setTime(date4.getTime() + date2.getTime() - date3.getTime() );
        		} else {
         		 	try {
            			secs = fg_parseInt(elem.getAttribute('title'))+1; // read title - correction 2 second due error
            		} catch(e) {
            			text = elem.firstChild.nodeValue.split(':');
            			secs = fg_parseInt(text[0]) * 3600;
              			secs = secs + fg_parseInt(text[1]) * 60;
              			secs = secs + fg_parseInt(text[2]);
          			}
          			date2.setTime(date.getTime() + (secs*1000));
        		}
      		}

      		var text2 = document.createTextNode(formatDate(date2,(date.getDatum()!=date2.getDatum()) ? 'd/MM H:mm:ss':'H:mm:ss'))
      		var font = document.createElement("strong");
      		font.innerHTML += '<font color="lime">' +text2.nodeValue+'</font>';
      		font.setAttribute('color','lime');
      		elem.parentNode.appendChild(font);
    	}
	} catch (e) {
		if (!secondTime)
			setTimeout(	function(){
					fg_addBxxTime(document,isPhalanx,true);
				},1000);
	}
} 

//*****************************************************************************************
function fg_getDelta(document) {

	if (document && !fg_isOverviewUrl(document.location.href)) return;
	
	if (fg_Debug) alert("Estamos obtener delta");

	try {
		var date = new Date();
	      var path = '//table/tbody/tr/th[@colspan="3"][1]';
      	var obj = fgEval(path,document);
		if (obj.snapshotLength == 0) return;
		obj = obj.snapshotItem(0);
		obj = obj.innerHTML;
		var startTime = getDateFromFormat(obj + " " + (1900+date.getYear()),"E MMM d H:m:s y");
		fg_Delta = date.getTime() - startTime;
		PrefsBranchFG.setCharPref("foxgameDeltaTime-"+fg_getDomain(document),fg_Delta);
	}catch(e) {
		foxgamedebug(e);
	}
}

//*****************************************************************************************
// New code from Cezarica & SA
function fg_addOverviewTime(document) {

	if (document && !fg_isOverviewUrl(document.location.href)) return;
	
	if (fg_Debug) alert("Estamos tiempo vision");
	try {
		
	    var addOverviewTime = fgGetBooleanPref("foxgameAddOverviewTime",false);
    	var removeOverviewTime = fgGetBooleanPref("foxgameRemoveOverviewTime",true); 		
		
	    var obj, date, currDate = fg_newDate(document), secs, font, ele, text2;

	    // overview fleet events time
    	obj = fgEval('//div[starts-with(@id,"bxx")][@star]',document);
	    for (var i = 0; i < obj.snapshotLength; i++) {
      		elem = obj.snapshotItem(i);
  	    	if(addOverviewTime){ // adds fleet events finnishing time
        		date = new Date(currDate);
        		secs = fg_parseInt(elem.getAttribute("title"));
        		date.setTime(date.getTime() + (secs*1000));
        		text2 = document.createTextNode(formatDate(date,(date.getDatum()!=currDate.getDatum()?"d/MM H:mm:ss":"H:mm:ss")));
        		font = document.createElement("font");
        		font.setAttribute("color","lime");
        		font.appendChild(text2);
        		elem.parentNode.appendChild(font);
      		}
      		if(removeOverviewTime){ // removes countdown
        		elem.parentNode.removeChild(elem);
      		}	
    	}//end overview fleet events time

    	// building finishing time in overview page
    	var date3 = fg_newDate2(1,fg_getDomain(document));
    	var date4 = fg_newDate(document);
    	date = new Date();
    	obj = fgEval('//div[starts-with(@id,"bxx")][@class="z"]',document);
    	if (obj.snapshotLength != 0 && fgGetBooleanPref("foxgameBuildingsTime",true)) {
      		elem = obj.snapshotItem(0);
      		secs = fg_parseInt(elem.getAttribute("title"));
      		date.setTime(secs * 1000);
      		date.setTime(date4.getTime() + date.getTime() - date3.getTime() );
      		text2 = document.createTextNode(formatDate(date,(date.getDatum()!=currDate.getDatum()?"d/MM H:mm:ss":"H:mm:ss")));
      		font = document.createElement("font");
      		font.setAttribute("color","lime");
      		font.appendChild(text2);
      		elem.parentNode.appendChild(font);
    	};// end building finnishing time 
    
	} catch (e) {
		foxgamedebug(e);
	}
	
}

//*****************************************************************************************
function fg_addDebrisImage(document) {

	if (document && !fg_isGalaxyUrl(document.location.href)) return;
	if (!fgGetBooleanPref("foxgameHighlightBigDebris",true)) return;	

	if (fg_Debug) alert("Estamos escombros");

	try {

	      var path = '//table[@width="569"]/child::tbody/descendant::tr/child::th[1]/child::a[2]';
      	var obj = fgEval(path,document);

		try {
			var color = PrefsBranchFG.getCharPref("fgDebrisColor");
		} catch(e) { var color ="#AA3333";}

		try {
			var min = PrefsBranchFG.getCharPref("fgDebrisMin");
		} catch(e) { var min ="20000";}

		min = fg_parseInt(min);
		var title, metal, cristal;
		for (var i = 0; i < obj.snapshotLength; i++) {
			obj2 = obj.snapshotItem(i);
			title = obj2.getAttribute("title");
			title = title.split(':');
			if (title.length < 2){
				title = title[0].split(' ');
				metal = title[3];
				cristal = title[6];
			} else {
				metal = title[title.length - 2].split(',');
				metal = metal[0];
				cristal = title[title.length - 1];
			}
			if (fg_parseInt(metal) + fg_parseInt(cristal) >= min) {
				obj2.parentNode.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.setAttribute("style", "background-color : "+color+"; background-image : none;");
			}	
		}
	} catch (e) {
		foxgamedebug(e);
	}
}

//*****************************************************************************************
function fg_removePlanets(document) {
	
	if (document && !fg_isGalaxyUrl(document.location.href)) return;
	if (!fgGetBooleanPref("foxgameRemovePlanets",true)) return;
	
	if (fg_Debug) alert("Estamos planets");
	

	try {
	      var path = '//table[@width="569"]/child::tbody/child::tr/child::th[position()=2]';
      	var obj = fgEval(path,document);		
	
		if (obj.snapshotLength == 0) return;

		var text;
		var max = obj.snapshotLength;
		if (obj.snapshotLength > 15)
			max = 15;
		for (var i = 0; i < max; i++) {
			if (obj.snapshotItem(i).firstChild.nextSibling != null) {
				text = obj.snapshotItem(i).nextSibling.nextSibling.innerHTML;			
				obj.snapshotItem(i).nextSibling.nextSibling.innerHTML = "";
				obj.snapshotItem(i).nextSibling.nextSibling.appendChild(
					obj.snapshotItem(i).removeChild(obj.snapshotItem(i).firstChild.nextSibling));
				obj.snapshotItem(i).nextSibling.nextSibling.firstChild.innerHTML = text;
			}
			
			obj.snapshotItem(i).parentNode.removeChild(obj.snapshotItem(i));
		}
		if (obj.snapshotLength > 15)
			obj.snapshotItem(15).setAttribute("colspan","6");
			
	    path = '//table[@width="569"]/descendant::td[@class="c"][position()=2]';
      	obj = fgEval(path,document);		
		
		for (var i = 0; i < obj.snapshotLength; i++) {
			if (i == 0) {
				text = obj.snapshotItem(i).innerHTML;
				obj.snapshotItem(i).nextSibling.nextSibling.innerHTML = text;
			}
			obj.snapshotItem(i).parentNode.removeChild(obj.snapshotItem(i));
		}

	    path = '//table[@width="569"]/descendant::td[@class="c"][position()=5]';
      	obj = fgEval(path,document);
		obj.snapshotItem(0).innerHTML = messages.GetStringFromName("foxgame.inner.reducedDebris");
		
	    path = '//table[@width="569"]/descendant::td[@class="c"][@colspan="8"]';
		obj = fgEval(path,document);
		for (var i = 0; i < obj.snapshotLength; i++) {
			obj.snapshotItem(i).setAttribute("colspan","7");
		}
	    path = '//table[@width="569"]/descendant::td[@class="c"][@colspan="6"]';
		obj = fgEval(path,document);
		for (var i = 0; i < obj.snapshotLength; i++) {
			obj.snapshotItem(i).setAttribute("colspan","5");
		}

	} catch (e) {
		foxgamedebug(e);
	}
}

//*****************************************************************************************
function fg_colorizePrivates(document) {

	if (document && !fg_isMessagesUrl(document.location.href)) return;
	if (!fgGetBooleanPref("foxgameHighlightPrivates",true)) return;

	
	if (fg_Debug) alert("Estamos privados");
	
	try {

		var path = '//table/tbody/tr/th[4]/child::a/img[@alt!=""]';
		var obj = fgEval(path,document);
		try {
			var color = PrefsBranchFG.getCharPref("fgPrivateColor");
		} catch(e) { var color ="#AA3333";}

		for (var i = 0; i < obj.snapshotLength; i++)
		{	
				
			obj2 = obj.snapshotItem(i).parentNode.parentNode.parentNode;
			var nodes = obj2.childNodes;			
			for (var j = 0; j < nodes.length; j++) {
				if (nodes[j].nodeName != "#text")
					nodes[j].setAttribute("style", "background-color : "+color+"; background-image : none;");
			}
			nodes = obj2.nextSibling.nextSibling.childNodes;
			for (var j = 0; j < nodes.length; j++) {
				if (nodes[j].nodeName != "#text")
					nodes[j].setAttribute("style", "background-color : "+color+"; background-image : none;");
			}

		}

	} catch (e) {
		foxgamedebug(e);
	}
}

//*****************************************************************************************
function fg_colorizeAlly(document) {

	if (document && !fg_isMessagesUrl(document.location.href)) return;
	if (!fgGetBooleanPref("foxgameHighlightAllyMessages",true)) return;

	
	if (fg_Debug) alert("Estamos alianza");
	
	try {

		var path = '//table/tbody/tr/th[3]';
		var obj = fgEval(path,document);
		try {
			var color = PrefsBranchFG.getCharPref("fgAllyColor");
		} catch(e) { var color ="#AA3333";}

		for (var i = 0; i < obj.snapshotLength; i++)
		{		
			var from = obj.snapshotItem(i).innerHTML;
			if (from.stripHTMLEntities().trim() == "")	//Fix for ogame.com.pt 
				from = obj.snapshotItem(i).nextSibling.innerHTML;
			found = from.match(/\[.*\]/);
			if (!found) continue;
			if (fg_isCoord(found[0])) continue;
			obj2 = obj.snapshotItem(i).parentNode;
			var nodes = obj2.childNodes;			
			for (var j = 0; j < nodes.length; j++) {
				if (nodes[j].nodeName != "#text")
					nodes[j].setAttribute("style", "background-color : "+color+"; background-image : none;");
			}
			nodes = obj2.nextSibling.nextSibling.childNodes;
			for (var j = 0; j < nodes.length; j++) {
				if (nodes[j].nodeName != "#text")
					nodes[j].setAttribute("style", "background-color : "+color+"; background-image : none;");
			}

		}

	} catch (e) {
		foxgamedebug(e);
	}
}

//*****************************************************************************************
function fg_replicateOptions(document) {

	if (document && !fg_isMessagesUrl(document.location.href)) return;
	
	if (fg_Debug) alert("Estamos replicado de opciones");
	
	try {
		if (fgGetBooleanPref("foxgameReplicateSpyReportOptions",false)) 
		{

			var path = '//table/tbody/tr/th/input[@name="fullreports"]';
			var row = fgEval(path,document);
			if (row.snapshotLength == 0) return;
			row = row.snapshotItem(0).parentNode.parentNode;
			var row2 = row.cloneNode(true);
			row.firstChild.nextSibling.firstChild.setAttribute("id","fullreports");
			row.firstChild.nextSibling.firstChild.setAttribute("onchange","document.getElementById('fullreports2').checked=this.checked");

			row2.firstChild.nextSibling.firstChild.setAttribute("name","fullreports2");
			row2.firstChild.nextSibling.firstChild.setAttribute("id","fullreports2");
			row2.firstChild.nextSibling.firstChild.setAttribute("onchange","document.getElementById('fullreports').checked=this.checked");
			row.parentNode.insertBefore(row2,row.parentNode.firstChild);

		} 
		if (fgGetBooleanPref("foxgameReplicateDeleteOptions",true)) 
		{

			var path = '//table/tbody/tr/th/select[@name="deletemessages"]';
			var row = fgEval(path,document);
			if (row.snapshotLength == 0) return;
			row = row.snapshotItem(0).parentNode.parentNode;
			var row2 = row.cloneNode(true);
			row.firstChild.nextSibling.firstChild.nextSibling.setAttribute("id","deletemessages");
			row.firstChild.nextSibling.firstChild.nextSibling.setAttribute("onchange","document.getElementById('deletemessages2').options[this.selectedIndex].selected='true'");
	
			row2.firstChild.nextSibling.firstChild.nextSibling.setAttribute("name","deletemessages2");
			row2.firstChild.nextSibling.firstChild.nextSibling.setAttribute("id","deletemessages2");
			row2.firstChild.nextSibling.firstChild.nextSibling.setAttribute("onchange","document.getElementById('deletemessages').options[this.selectedIndex].selected='true'");
			row.parentNode.insertBefore(row2,row.parentNode.firstChild);
		
		}
		//Recolocamos el formulario para que el arbol tenga una estructura correcta
	
		var table = fgEval( 
			'//input[@name="messages"]', document)
		if (table.snapshotLength == 0) return;
		table = table.snapshotItem(0).parentNode.parentNode.parentNode.parentNode;
		var form = fgEval (
			'//form[starts-with(@action,"index.php?page=messages")]', document).snapshotItem(0);
		if (form.snapshotLength == 0) return;
		form = form.parentNode.removeChild(form);

		table.parentNode.replaceChild(form,table);
		form.appendChild(table);

	} catch (e) {
		foxgamedebug(e);
	}
}

//*****************************************************************************************
function fg_addRankingButtons(document) {
	if (document && !fg_isStatUrl(document.location.href)) return;
	if (!fgGetBooleanPref("foxgameAddStatButtons",false)) return;

	
	if (fg_Debug) alert("Estamos milos ranking");
	
	try {
//Insertamos el .js con la funcion de envio del formulario

	fg_addJavaScript(document, "chrome://foxgame/content/resources/js/milosStat.js");

// Generamos un formulario para enviar la galaxia a MILOS directamente

      var path = '//table[@width="519"]';
      var obj = fgEval(path,document);

	if (obj.snapshotLength < 2) return;
	var i = fg_loadDBs(document);	
	if (i == null) return;
	var ele = fg_listaDBs.data[i];
	var text = "";

	if (ele.type != "GalaxieTool") {
//		obj = obj.snapshotItem(1);
		var Selection = window.getSelection();
		if(Selection.rangeCount > 0) Selection.removeAllRanges();

	     	var range = document.createRange();
	      range.selectNode(obj.snapshotItem(1));
		Selection.addRange(range);

	      var path = '//div[starts-with(@id,"tOoLtIp")]';
      	var obj = fgEval(path,document);
		for (var i = 0; i < obj.snapshotLength; i++) {
		     	var range = document.createRange();
		      range.selectNode(obj.snapshotItem(i));
			Selection.addRange(range);

		}
		texto = Selection.toString();

	} else {
		texto = fg_GTPlugin_getStatsText(document,document.getElementsByName("who")[0].selectedIndex);
		//obj.snapshotItem(1).innerHTML;
		//texto = texto.replace(/'/ig,"");
	}
	

	//Insertamos un formulario para poder enviar los datos directamente.	
	var form = document.createElement('tr');
	var td = document.createElement('td');
	td.setAttribute("colspan","8");
	td.setAttribute("class","1");
	td.setAttribute("align","center");
	td.setAttribute("valign","middle");
	td.innerHTML = fg_MilosDiv;
	if (ele.type == "Milos") {
		if (document.getElementsByName("who")[0].value != "ally") return;
		if (document.getElementsByName("type")[0].value != "pts") return;

		var temp = ele.other.split("[]");
		td.innerHTML += '<form action="http://milos.nethen.org/milos-paste/#" method=post target="_milos" id="milos_form">'+
			'<input type=hidden name="milos_login[user]" value="'+temp[0]+'">'+
			'<input type=hidden name="milos_login[passwd]" value="'+temp[1]+'">'+
			'<input type=hidden name="milos_login[group]" value="'+temp[2]+'">'+
			'<input type=hidden name="milos_login[sg]" value="'+temp[3]+'">'+
			'<input type=hidden name="milos_login[r]" value="">'+
			'<input type=hidden name="show" value="checked">'+
			'<input type=hidden name="noncommit" value="">'+
			'<input type=hidden name="delafter" value="checked">'+
			'<input type=hidden name=x value="'+texto+'">';
	}
	else if (ele.type == "EspRep") {
		if (document.getElementsByName("type")[0].value != "pts") return;

		td.innerHTML += '<form action="http://www.esprep.org/general/dump.php?quick=1" method=post target="_milos" id="milos_form" accept-charset="utf-8">'+
			'<input type=hidden name="show" value="Process Dump (Show Results)">'+
			'<input type="hidden" name="espplayer" value="none">'+
			'<input type="hidden" name="espalliance" value="none">'+
			'<input type=hidden name=dump value="'+texto+'">';
	}
	else if(ele.type == "GalaxieTool") {
			var temp = ele.other.split("[]");
			var uni = fg_listaDBs.data[i].uni;
			uni = uni.split('.');
			uni = uni[0].substr(3,uni[0].length);			
			td.innerHTML += '<form action="'+temp[2]+'" method=post target="_milos" id="milos_form">'+
			//td.innerHTML += '<form action="'+temp[2]+'" method=post target="_blank" id="milos_form">'+
				'<input type=hidden name="user" value="'+temp[0]+'">'+
				'<input type=hidden name="password" value="'+temp[1]+'">'+
				'<input type=hidden name="typ" value="stats">'+			
				'<input type=hidden name="uni" value="'+uni+'">'+
				'<input type=hidden name="toolbar" value="'+fg_GTPluginVersion+'">'+
				'<input type=hidden name="language" value="'+fg_GTPlugin_GetLanguage(document.location.href.toString())+'">'+							
				'<input type=hidden name="who" value="'+document.getElementsByName("who")[0].selectedIndex+'">'+
				'<input type=hidden name="what" value="'+document.getElementsByName("type")[0].selectedIndex+'">'+
				//"<textarea name=content name='content' rows=1 cols=75>"+texto+"</textarea>";
				"<input type=hidden name='content' value='"+texto+"'>";				
	}
	else if(ele.type == "OGSpy") {
			var type = "";
			var temp = document.getElementsByName("type")[0].value;
			if (temp == "pts") type = "general";
			if (temp == "flt") type = "fleet";
			if (temp == "res") type = "research";
			type = type+"_"+document.getElementsByName("who")[0].value;
			td.innerHTML += '<form action="'+ele.other+'" method=post target="_milos" id="milos_form" >'+
				'<input type=hidden name="action" value="get_data">'+
				'<input type="hidden" name="datatype" value="'+type+'">'+
				//'<textarea name=data rows=1 cols=75>'+texto+'</textarea>';
				'<input type=hidden name=data value="'+texto+'">';
	}

	td.innerHTML += "<input type=button value=\"&lt;- "+ele.type+"\" onClick=\"next('l:"+ele.type+"')\">"+
	"<input type=button value=\""+ele.type+"\" onClick=\"next('1:"+ele.type+"')\">"+
	"<input type=button value=\""+ele.type+" -&gt;\" onClick=\"next('r:"+ele.type+"')\">";
		
	form.appendChild(td);

	var tds = fgEval('//table[@width="519"]/child::tbody', document);
	if (tds.snapshotLength > 0)
		tds.snapshotItem(0).insertBefore(form,tds.firstChild);	

	} catch (e) {
		foxgamedebug(e);
	}
}

//*****************************************************************************************
function fg_loadDBs(document){
	fg_listaDBs.load();
	var found = false;
	var i;
	for (i = 0; i < fg_listaDBs.data.length; i++) {
		if (document.location.href.indexOf(fg_listaDBs.data[i].uni) != -1) {
			found = true;
			break;
		}
	}
	if (found == false)
		return null;
	return i;
}

//*****************************************************************************************
function fg_addMilosButtons(document) {

	if (document && !fg_isGalaxyUrl(document.location.href)) return;
	if (!fgGetBooleanPref("foxgameAddMilosButtons",false)) return;
	
	if (fg_Debug) alert("Estamos milos");
	
	try {
//Insertamos el .js con la funcion de envio del formulario
	fg_addJavaScript(document, "chrome://foxgame/content/resources/js/milosGalaxy.js");

// Generamos un formulario para enviar la galaxia a MILOS directamente

      var path = '//table[@width="569"]';
      var obj = fgEval(path,document);

	if (obj.snapshotLength == 0) return;
		
	var i = fg_loadDBs(document);	
	if (i == null) return;
	var ele = fg_listaDBs.data[i];
	var text = "";

	if (ele.type == "OGSpy") {
		
		var Selection = window.getSelection();
		if(Selection.rangeCount > 0) Selection.removeAllRanges();

	     	var range = document.createRange();
	      range.selectNode(obj.snapshotItem(0));
		Selection.addRange(range);

	      var path = '//div[starts-with(@id,"tOoLtIp")]';
      	var obj = fgEval(path,document);
		for (var i = 0; i < obj.snapshotLength; i++) {
		     	var range = document.createRange();
		      range.selectNode(obj.snapshotItem(i));
			Selection.addRange(range);

		}
		texto = Selection.toString();

	} else if (ele.type != "GalaxieTool") {
		obj = obj.snapshotItem(0);
		var tr = obj.firstChild.nextSibling.firstChild;
      	var range = document.createRange();
	
	      //range.selectNode(obj);
		//var text = range.toString();

		while (tr != null)
	 	{
			if (tr.nodeName == 'TR') {
				td = tr.firstChild;
				while (td != null) {
					if (td.nodeName == 'TD' || td.nodeName == 'TH')
					{
							var a = fgEvalnode('.//img[contains(@alt,"M")]',document,td);
							if (a.snapshotLength > 0) 
								text += "M \t";
							else {
							      range.selectNode(td);
								text += range.toString().retrim()+" \t";
							}
					}
					td = td.nextSibling;
				}
				text = text.substr(0,text.length-2)+"\n";
			}
			tr = tr.nextSibling;
		}
		range.detach;
		texto = text;
	} else {
		texto = fg_GTPlugin_get_galaxyview_data(document);
		//obj.snapshotItem(0).innerHTML;
		//texto = texto.replace(/'/ig,"");
	}
	

	//Insertamos un formulario para poder enviar los datos directamente.	
	var form = document.createElement('tr');
	var td = document.createElement('td');
	td.setAttribute("colspan","8");
	td.setAttribute("class","1");
	td.setAttribute("align","center");
	td.setAttribute("valign","middle");
	td.innerHTML = fg_MilosDiv;
	if (ele.type == "Milos") {
			var temp = ele.other.split("[]");
			td.innerHTML += '<form action="http://milos.nethen.org/milos-paste/#" method=post target="_milos" id="milos_form">'+
				'<input type=hidden name="milos_login[user]" value="'+temp[0]+'">'+
				'<input type=hidden name="milos_login[passwd]" value="'+temp[1]+'">'+
				'<input type=hidden name="milos_login[group]" value="'+temp[2]+'">'+
				'<input type=hidden name="milos_login[sg]" value="'+temp[3]+'">'+
				'<input type=hidden name="milos_login[r]" value="">'+
				'<input type=hidden name="show" value="checked">'+
				'<input type=hidden name="noncommit" value="">'+
				'<input type=hidden name="delafter" value="checked">'+
				'<input type=hidden name=x value="'+texto+'">';
	}
	else if (ele.type == "EspRep") {
			td.innerHTML += '<form action="http://www.esprep.org/general/dump.php?quick=1" method=post target="_milos" id="milos_form" accept-charset="utf-8">'+
				'<input type=hidden name="show" value="Process Dump (Show Results)">'+
				'<input type="hidden" name="espplayer" value="none">'+
				'<input type="hidden" name="espalliance" value="none">'+
				'<input type=hidden name=dump value="'+texto+'">';
	}
	else if (ele.type == "OGSpy") {
			td.innerHTML += '<form action="'+ele.other+'" method=post target="_milos" id="milos_form" >'+
				'<input type=hidden name="action" value="get_data">'+
				'<input type="hidden" name="datatype" value="basic">'+
				//'<textarea name=data rows=1 cols=75>'+texto+'</textarea>';
				'<input type=hidden name=data value="'+texto+'">';
	}
	else if(ele.type == "GalaxieTool") {
			var temp = ele.other.split("[]");
			var uni = fg_listaDBs.data[i].uni;
			uni = uni.split('.');
			uni = uni[0].substr(3,uni[0].length);
			td.innerHTML += '<form action="'+temp[2]+'" method=post target="_milos" id="milos_form">'+
			//td.innerHTML += '<form action="'+temp[2]+'" method=post target="_blank" id="milos_form">'+
				'<input type=hidden name="user" value="'+temp[0]+'">'+
				'<input type=hidden name="password" value="'+temp[1]+'">'+
				'<input type=hidden name="typ" value="galaxy">'+
				'<input type=hidden name="galaxy" value="'+document.getElementsByName("galaxy")[0].value+'">'+
				'<input type=hidden name="system" value="'+document.getElementsByName("system")[0].value+'">'+				
				'<input type=hidden name="uni" value="'+uni+'">'+
				'<input type=hidden name="toolbar" value="'+fg_GTPluginVersion+'">'+
				'<input type=hidden name="language" value="'+fg_GTPlugin_GetLanguage(document.location.href.toString())+'">'+			
				//"<textarea name=content rows=1 cols=75 name='content'>"+texto+"</textarea>";
				"<input type=hidden name='content' value='"+texto+"'>";		
	}
	//ele.type = "OGSpy";
	td.innerHTML += "<input type=button value=\"&lt;- "+ele.type+"\" onClick=\"next('l:"+ele.type+"')\">"+
	"<input type=button value=\""+ele.type+"\" onClick=\"next('1:"+ele.type+"')\">"+
	"<input type=button value=\""+ele.type+" -&gt;\" onClick=\"next('r:"+ele.type+"')\">";
		
	form.appendChild(td);

	var tds = fgEval('//table[@width="569"]/tbody', document);
	if (tds.snapshotLength > 0)
		tds.snapshotItem(0).insertBefore(form,tds.snapshotItem(0).firstChild);	


	} catch (e) {
		foxgamedebug(e);
	}
}

//*****************************************************************************************
function fg_addAllyButtons(document) {

	if (document && !fg_isAllyPlayersUrl(document.location.href)) return;
	if (!fgGetBooleanPref("foxgameAddAllyButtons",true)) return;

	if (fg_Debug) alert("Estamos enviar jugadores de la alianza");
	
	try {

	var i = fg_loadDBs(document);	
	if (i == null) return;
	var ele = fg_listaDBs.data[i];

	//Creamos el Iframe donde se mostraran los resultados de la inclusion
	var div = document.createElement('div');
	div.innerHTML = fg_MilosDiv;

	//Creamos el div donde se meterá el formulario
	form = document.createElement('div');

	if (ele.type != "GalaxieTool") return;

      var path = '//table[@width="519"]';
     	var obj = fgEval(path,document);
	if (obj.snapshotLength == 0) return;

	//Creamos la fila donde meter el nuevo boton
	var tr = document.createElement('tr');
	var td = document.createElement('td');
	tr.appendChild(td);
	td.setAttribute("colspan","4");
	td.setAttribute("class","1");
	td.setAttribute("align","center");
	td.setAttribute("valign","middle");

	//Cogemos la tabla de los mensajes y la formateamos para que se pueda meter como input
	var texto = obj.snapshotItem(0).innerHTML;
	texto = texto.replace(/'/ig,"");

	//Creamos el formulario con los datos almacenados
	var temp = ele.other.split("[]");
	form.innerHTML = '<form action="'+temp[2]+'" method=post target="_milos" id="milos_form"  accept-charset="utf-8">'+
		'<input type=hidden name="user" value="'+temp[0]+'">'+
		'<input type=hidden name="password" value="'+temp[1]+'">'+
		'<input type=hidden name="typ" value="allyhistory">'+
		//'<textarea name=content rows=1 cols=75>'+texto+'</textarea>';
		"<input type=hidden name='content' value='"+texto+"'>";

	td.innerHTML += "<input type=button value=\""+ele.type+"\" onClick=\"document.getElementById('milos_form').submit();\">";
	//------------------------------------------

	//Metemos el formulario oculto al final del body con el div del iframe
	fg_appendBody(document,form);	
	form.appendChild(div);
		
	//Buscamos donde meter el nuevo boton y lo metemos
	var tds = fgEval('//table[@width="519"]/child::tbody', document);
	if (tds.snapshotLength > 0)
		tds.snapshotItem(0).insertBefore(tr,tds.snapshotItem(0).firstChild);	
	} catch (e) {
		foxgamedebug(e);
	}
}

//*****************************************************************************************
function fg_addReportButtons(document) {

	if (document && !fg_isMessagesUrl(document.location.href)) return;
	if (!fgGetBooleanPref("foxgameAddReportButtons",false)) return;

	if (fg_Debug) alert("Estamos milos");
	
	try {

	var i = fg_loadDBs(document);	
	if (i == null) return;
	var ele = fg_listaDBs.data[i];

	//Insertamos el .js con la funcion de envio del formulario
	fg_addJavaScript(document, "chrome://foxgame/content/resources/js/milosReport.js");

	//Creamos el Iframe donde se mostraran los resultados de la inclusion
	var div = document.createElement('div');
	div.innerHTML = fg_MilosDiv;

	//Creamos el div donde se meterá el formulario
	form = document.createElement('div');


	if (ele.type == "OGSpy" || ele.type == "GalaxieTool") {

	      var path = '//table[@width="519"]';
      	var obj = fgEval(path,document);
		if (obj.snapshotLength == 0) return;

		//Creamos la fila donde meter el nuevo boton
		var tr = document.createElement('tr');
		var td = document.createElement('td');
		tr.appendChild(td);
		td.setAttribute("colspan","4");
		td.setAttribute("class","1");
		td.setAttribute("align","center");
		td.setAttribute("valign","middle");

		if (ele.type == "OGSpy") {
			//-------------------------------------
			var Selection = window.getSelection();
			if(Selection.rangeCount > 0) Selection.removeAllRanges();
	
		     	var range = document.createRange();
	      	range.selectNode(obj.snapshotItem(0));
			Selection.addRange(range);

		      var path = '//div[starts-with(@id,"tOoLtIp")]';
      		var obj = fgEval(path,document);
			for (var i = 0; i < obj.snapshotLength; i++) {
			     	var range = document.createRange();
			      range.selectNode(obj.snapshotItem(i));
				Selection.addRange(range);

			}
			text = Selection.toString();
					
			//Creamos el formulario con los datos almacenados
			var temp = ele.other.split("[]");
			form.innerHTML += '<form action="'+ele.other+'" method=post target="_milos" id="milos_form" >'+
					'<input type=hidden name="action" value="get_data">'+
					'<input type="hidden" name="datatype" value="basic">'+
					'<input type=hidden name=data value="'+text+'">';
			td.innerHTML += "<input type=button value=\""+ele.type+"\" onClick=\"next('');\">";

		} else if (ele.type == "GalaxieTool") {
		//----------------------------------------

			//Cogemos la tabla de los mensajes y la formateamos para que se pueda meter como input
			var texto = obj.snapshotItem(0).innerHTML;
			texto = texto.replace(/'/ig,"");

			//Creamos el formulario con los datos almacenados
			var temp = ele.other.split("[]");
			var uni = fg_listaDBs.data[i].uni;
			uni = uni.split('.');
			uni = uni[0].substr(3,uni[0].length);			
			form.innerHTML = '<form action="'+temp[2]+'" method=post target="_milos" id="milos_form"  accept-charset="utf-8">'+
				'<input type=hidden name="user" value="'+temp[0]+'">'+
				'<input type=hidden name="password" value="'+temp[1]+'">'+				
				'<input type=hidden name="uni" value="'+uni+'">'+
				'<input type=hidden name="toolbar" value="'+fg_GTPluginVersion+'">'+
				'<input type=hidden name="language" value="'+fg_GTPlugin_GetLanguage(document.location.href.toString())+'">'+				
				'<input type=hidden name="typ" value="reports">'+
				//'<textarea name=content rows=1 cols=75>'+texto+'</textarea>';
				"<input type=hidden name='content' value='"+texto+"'>";

			td.innerHTML += "<input type=button value=\""+ele.type+"\" onClick=\"document.getElementById('milos_form').submit();\">";
		//------------------------------------------
		}

		//Metemos el formulario oculto al final del body con el div del iframe
		fg_appendBody(document,form);	
		form.appendChild(div);
		
		//Buscamos donde meter el nuevo boton y lo metemos
		var tds = fgEval('//table[@width="519"]/child::tbody', document);
		if (tds.snapshotLength > 0)
			tds.snapshotItem(0).insertBefore(tr,tds.snapshotItem(0).firstChild);	
		return;
	}

	var path = '//span[@class="espionagereport"]';
     	var obj = fgEval(path,document);

	if (obj.snapshotLength == 0) return;

	//Para cada espionaje creamos un formulario nuevo y metemos un boton detras de cada espionaje.

	for (var i = 0; i < obj.snapshotLength; i++) 
	{
		var tr2 = obj.snapshotItem(i).parentNode.parentNode;
		tr2 = tr2.nextSibling.nextSibling;
	
		//Sacamos lo que tendriamos si le dieramos a copiar y pegar
		var tr3 = fgEvalnode('.//table/tbody/tr[1]',document,tr2);
		if (tr3.snapshotLength == 0) continue;

     		var range = document.createRange();
		var text = "";
		for (var j = 0; j < tr3.snapshotLength; j++) {
			tr = tr3.snapshotItem(j);
			while (tr != null)
 			{
				if (tr.nodeName == 'TR') {
					td = tr.firstChild;
					while (td != null) {
						if (td.nodeName == 'TD' || td.nodeName == 'TH'){
					      	range.selectNode(td);
							text += range.toString().retrim()+"\t";
						}
						td = td.nextSibling;
					}
					text = text.substr(0,text.length-1)+"\n";
				}
				tr = tr.nextSibling;
			}
		}
		range.detach;

		//Creamos una nueva fila en la tabla para el boton
		tr2 = tr2.nextSibling.nextSibling;
		var th = document.createElement('th');
		th.setAttribute('colspan','4');

		//Añadimos otro formulario más al div de los formularios
		if (ele.type == "Milos") {
			var temp = ele.other.split("[]");
			form.innerHTML += '<form action="http://milos.nethen.org/milos-paste/#" method=post target="_milos" id="milos_form'+i+'">'+
				'<input type=hidden name="milos_login[user]" value="'+temp[0]+'">'+
				'<input type=hidden name="milos_login[passwd]" value="'+temp[1]+'">'+
				'<input type=hidden name="milos_login[group]" value="'+temp[2]+'">'+
				'<input type=hidden name="milos_login[sg]" value="'+temp[3]+'">'+
				'<input type=hidden name="milos_login[r]" value="">'+
				'<input type=hidden name="show" value="checked">'+
				'<input type=hidden name="noncommit" value="">'+
				'<input type=hidden name="delafter" value="checked">'+
				'<input type=hidden name=x value="'+text+'">';
		} else if (ele.type == "EspRep") {
			form.innerHTML += '<form action="http://www.esprep.org/general/dump.php?quick=1" method=post target="_milos" id="milos_form'+i+'" accept-charset="utf-8">'+
				'<input type=hidden name="show" value="Process Dump (Show Results)">'+
				'<input type="hidden" name="espplayer" value="none">'+
				'<input type="hidden" name="espalliance" value="none">'+
				'<input type=hidden name=dump value="'+text+'">';
		}
		th.innerHTML += "<input type=button value=\""+ele.type+"\" onClick='next("+i+");'></form>";
		tr2.parentNode.insertBefore(th,tr2);	
	}

	form.appendChild(div);
	fg_appendBody(document,form);
	} catch (e) {
		foxgamedebug(e);
	}
}

//*****************************************************************************************
function fg_addFlotaReturnTime(document) {

	if (document && !fg_isFlotaUrl(document.location.href)) return;
	if (!fgGetBooleanPref("foxgameFlotaReturnTime",true)) return;

	
	if (fg_Debug) alert("Estamos flota return");

	try {
		//Añadimos la hora de retorno en caso de retirada
		var date2 = fg_newDate(document);
		var obj = fgEval( '//input[@name="order_return"]', document);
		for ( var i = 0; i < obj.snapshotLength; i++) {
			var date3 = fg_newDate2(1,fg_getDomain(document));
			var cell = obj.snapshotItem(i).parentNode.parentNode;
			var startTime = cell.previousSibling.previousSibling.previousSibling.previousSibling.previousSibling.previousSibling;
			startTime = getDateFromFormat(startTime.innerHTML + " " + (1900+date3.getYear()),"E MMM d H:m:s y");
			var date = fg_newDate(document);
			date.setTime(date.getTime() + date3.getTime() - startTime);
			var font = document.createElement('font');
			font.setAttribute('color','lime');
			var div = document.createElement('div');
			div.setAttribute('id',"time_"+i);
       		div.innerHTML = formatDate(date,(date.getDatum()!=date2.getDatum()?"d/MM H:mm:ss":"H:mm:ss"));
       		font.appendChild(div);
			cell.appendChild(font);
		}
		if (obj.snapshotLength > 0)
			setTimeout(
				function () {
					fg_adjustReturnTime(document);
				}, 250);
				//			setTimeout(fg_adjustReturnTime(document),499);
	} catch (e) {
		foxgamedebug(e);
	}
};

//*****************************************************************************************
function fg_adjustReturnTime(document){
	try {
/*		
		var l = getBrowser().mPanelContainer.childNodes.length;
		var found = false;
		for(var i = 0; i < l; i++) {
			try {
				var b = getBrowser().mTabContainer.childNodes[i].linkedBrowser;
			}catch (e){
				if (typeof getBrowser().getBrowserAtIndex() != "undefined" )
					var b = getBrowser().getBrowserAtIndex(i);
			}
			if (b && fg_isOGameDomain(b.currentURI.spec)) 
			{
				var ret = fg_findUrlInFrames(b.contentDocument,fg_isFlotaUrl)
				if (ret != null) {
					found = true;
					fg_adjustReturnTime2(ret);
				}
			}
		}	
		if (found) {
			setTimeout(fg_adjustReturnTime, 2500);
		}
*/		
		if (document && document.location != null) {
			fg_adjustReturnTime2(document);			
			setTimeout(
				function () {
					fg_adjustReturnTime(document);
				}, 250);
		}
	} catch(e){
		foxgamedebug(e);
	}	
}

//*****************************************************************************************
function fg_adjustReturnTime2(doc){
		if (!doc || doc.location == null)
			return;
		try {
			var document = doc;
			if (document && document.location && !fg_isFlotaUrl(document.location.href)) return;
			var i=0;
			var obj;
			var date2 = fg_newDate(doc);
			obj = document.getElementById("time_"+i);
			while (obj != null) {
				var date3 = fg_newDate2(1,fg_getDomain(document));
				var cell = obj.parentNode.parentNode;
				var startTime = cell.previousSibling.previousSibling.previousSibling.previousSibling.previousSibling.previousSibling;
				startTime = getDateFromFormat(startTime.innerHTML + " " + (1900+date3.getYear()),"E MMM d H:m:s y");
				var endTime = cell.previousSibling.previousSibling;
				endTime = getDateFromFormat(endTime.innerHTML + " " + (1900+date3.getYear()),"E MMM d H:m:s y");				
				if (endTime < date3.getTime()) 
				{
					obj.innerHTML = "-";
					return;
				}
				var date = fg_newDate(doc);
				date.setTime(date.getTime() + date3.getTime() - startTime);
        		obj.innerHTML = formatDate(date,(date.getDatum()!=date2.getDatum()?"d/MM H:mm:ss":"H:mm:ss"));
				i++;
				obj = document.getElementById("time_"+i);
			}
		} catch (e) {
			foxgamedebug(e);
		}
}

//*****************************************************************************************
function fg_Duration(document) {
	try {
	  	var speedfactor;

		speedfactor = document.getElementsByName("speedfactor")[0].value;
		var msp = fg_Maxspeed(document);
		var sp = document.getElementsByName("speed")[0].value;
		var dist = fg_Distance(document);

  		return Math.round(((35000 / sp * Math.sqrt(dist * 10 / msp) + 10) / speedfactor)); 
	} catch(e) {
		setTimeout(fg_adjustTime(document), 100);
		return 0;
	}
}


function min(a, b) {
  var c = a * 1;
  var d = b * 1;
  if (c > d) {
    return d;
  } else {
    return c;
  }
}

//*****************************************************************************************
function fg_Maxspeed(document) {
	try {
		var msp = 1000000000;
		for (i = 200; i < 220; i++) {
			if (document.getElementsByName("ship" + i)[0]) {
				if ((document.getElementsByName("speed" + i)[0].value * 1) >= 1
				&& (document.getElementsByName("ship" + i)[0].value * 1) >= 1) {
					msp = min(msp, document.getElementsByName("speed" + i)[0].value);
				}
			}
		}
		return(msp);
	} catch(e) {
		setTimeout(fg_adjustTime(document), 100);
		return 0;
	}
}

//*****************************************************************************************
function fg_Distance(document) {
	try {
  		var thisGalaxy;
  		var thisSystem;
  		var thisPlanet;

  		var targetGalaxy;
  		var targetSystem;
  		var targetPlanet;

  		var dist;

  		thisGalaxy = document.getElementsByName("thisgalaxy")[0].value;
  		thisSystem = document.getElementsByName("thissystem")[0].value;
  		thisPlanet = document.getElementsByName("thisplanet")[0].value;

  		targetGalaxy = document.getElementsByName("galaxy")[0].value;
  		targetSystem = document.getElementsByName("system")[0].value;
  		targetPlanet = document.getElementsByName("planet")[0].value;

  		dist = 0;
  		if ((targetGalaxy - thisGalaxy) != 0) {
  			dist = Math.abs(targetGalaxy - thisGalaxy) * 20000;
  		} else if ((targetSystem - thisSystem) != 0) {
    			dist = Math.abs(targetSystem - thisSystem) * 5 * 19 + 2700;
  		} else if ((targetPlanet - thisPlanet) != 0) {
    			dist = Math.abs(targetPlanet - thisPlanet) * 5 + 1000;
  		} else { 
    			dist = 5;
  		}

  		return(dist);
	} catch(e) {
		setTimeout(fg_adjustTime(document), 100);		
		return 0;
	}
}

//*****************************************************************************************
function fg_adjustTime(document){
	try {
/*		
		var l = getBrowser().mPanelContainer.childNodes.length;
		var found = false;
		for(var i = 0; i < l; i++) {
			try {
				var b = getBrowser().mTabContainer.childNodes[i].linkedBrowser;
			} catch(e) {
				if (typeof getBrowser().getBrowserAtIndex() != "undefined" )
					var b = getBrowser().getBrowserAtIndex(i);
			}
			if (b) {
				var ret = fg_findUrlInFrames(b.contentDocument,fg_isFlota2Url);
				if (ret) {
					found = true;
					fg_adjustTime2(ret);
				}
			}
		}
		if (found) {
			setTimeout(fg_adjustTime, 250);
		}
*/
		if (document && document.location != null) {
			fg_adjustTime2(document);			
			setTimeout(
				function () {
					fg_adjustTime(document);
				}, 250);
		}
	} catch(e){
		foxgamedebug(e);
	}	
}

//*****************************************************************************************
function fg_adjustTime2(doc){
		if (!doc || doc.location == null)
			return;
		try {
			var document = doc;
			var date = fg_newDate(doc);
			var date2 = fg_newDate(doc);
			obj = document.getElementById("llegada1");
			if (obj != null) 
			{
				var duration = fg_Duration(document);
				date.setTime(date.getTime() + (duration*1000))
        		obj.innerHTML = formatDate(date,(date.getDatum()!=date2.getDatum()?"d/MM H:mm:ss":"H:mm:ss"));				
				date.setTime(date.getTime() + (duration*1000))
			}
			obj = document.getElementById("llegada2");
			if (obj != null) 
			{	
        		obj.innerHTML = formatDate(date,(date.getDatum()!=date2.getDatum()?"d/MM H:mm:ss":"H:mm:ss"));				
			}
		} catch (e) {
			foxgamedebug(e);
		}
}

//*****************************************************************************************
function fg_addFlotaTime(document) {

	if (document && !fg_isFlota2Url(document.location.href)) return;
	if (!fgGetBooleanPref("foxgameFlotaTime",true)) return;

	
	if (fg_Debug) alert("Estamos");

	try {
		// Mostramos la hora de retorno y llegada de las naves
		//Insertamos las filas necesarias en la tabla

		var node = document.getElementById("duration");

		if (node == null) return;

		node = node.parentNode.parentNode;
		var tr2 = document.createElement('tr');
		tr2.setAttribute("height","20");
		var th2 = new Array(document.createElement('th'), document.createElement('th'));
		th2[0].innerHTML = messages.GetStringFromName("foxgame.inner.arrival2");
		th2[1].innerHTML = "<font color='lime'><div id=\"llegada2\">-</div></font>";

		for (var i=0; i<th2.length; i++)
			tr2.appendChild(th2[i]);

		node.parentNode.insertBefore(tr2,node.nextSibling);
		var tr = document.createElement('tr');
		tr.setAttribute("height","20");
		var th = new Array(document.createElement('th'), document.createElement('th'));
		th[0].innerHTML = messages.GetStringFromName("foxgame.inner.arrival1");
		th[1].innerHTML = "<font color='lime'><div id=\"llegada1\">-</div></font>";
	
		for (var i=0; i<th.length; i++)
			tr.appendChild(th[i]);

		node.parentNode.insertBefore(tr,node.nextSibling);
	

		//Recolocamos el formulario para que el arbol tenga una estructura correcta
	
		var table = fgEval( 
			'//table[@border="0"][@cellpadding="0"][@cellspacing="1"][@width="519"]', document).snapshotItem(0);
		var form = table.firstChild.nextSibling;
		form = table.removeChild(form);

		var input = fgEval( 
			'//input[@name="thisgalaxy"]', document).snapshotItem(0);
		var center = input.parentNode;
		center.parentNode.replaceChild(form,center);
		form.appendChild(center);

		var speed = document.getElementsByName('speed')[0];
		var div = document.createElement('div');
		div.setAttribute('align','right');
		var parent = speed.parentNode;
		while (parent.hasChildNodes()) {
			div.appendChild(parent.firstChild)
		}
		parent.appendChild(div);

		//Llamamos a la funcion que actualiza el tiempo
		fg_adjustTime(document);
	} catch (e) {
		foxgamedebug(e);
	}
}
//*****************************************************************************************
function fg_addLabels(document) {
	if (document && !fg_isFlota3Url(document.location.href)) return;
	try {
	      var path = '//input[@name="order"]';
     		var obj = fgEval(path,document);
		if (obj.snapshotLength == 0) return;
		for (var i = 0; i < obj.snapshotLength; i++) {
			obj2 = obj.snapshotItem(i);
			var label = document.createElement('label');
			label.appendChild(obj2.parentNode.removeChild(obj2.nextSibling));
			obj2.parentNode.insertBefore(label, obj2.nextSibling);
			obj2.setAttribute('id','inpuT_'+i);
			label.setAttribute('for','inpuT_'+i);
		}
	} catch(e) {
		foxgamedebug(e);
	}
}


//*****************************************************************************************
function fg_selectMission(document) {

	function fg_getPref(pref) {
		try {
			return PrefsBranchFG.getCharPref(pref)
		} catch(e) {
			return "-1";
		}
	}


	if (document && !fg_isFlota3Url(document.location.href)) return;

	var path = '//input[@type="submit"]';
	var obj = fgEval(path,document);
	if (obj.snapshotLength > 0) {
		obj.snapshotItem(0).setAttribute('accessKey','z');
		obj.snapshotItem(0).focus();	
	}

	var pref = fg_getPref("fgMissionPreference0");

	if (pref == "-1") return;
	if (fg_Debug) alert("Estamos mission select");

	try {
	      var path = '//input[@name="order"][@checked="checked"]';
     		var obj = fgEval(path,document);
		if (obj.snapshotLength != 0) return;
		var i = 0;
		while(pref != "-1") {
		      path = '//input[@name="order"][@value="'+pref+'"]';
      		obj = fgEval(path,document);
			if (obj.snapshotLength != 0) {
				obj = obj.snapshotItem(0);
				obj.checked = "true";
				return;
			}
			i++;
			pref = fg_getPref("fgMissionPreference"+i);
		}
		return;
	} catch(e) {
		foxgamedebug(e);
	}
}

//*****************************************************************************************
function fg_addSignature(document) {

	if (document && !fg_isWriteMessagesUrl(document.location.href)) return;
	if (!fgGetBooleanPref("foxgameMessageSignature",true)) return;

	
	if (fg_Debug) alert("Estamos firmas mensajes");
	
	try {

		var path = '//textarea[@name="text"]';
		var obj = fgEval(path,document);
		try {
			var signature = PrefsBranchFG.getCharPref("fgMsgSign");
		} catch(e) { var signature ="";}


		if (obj.snapshotLength == 0) return;
		obj = obj.snapshotItem(0);
		obj.value = signature;
	} catch(e) {
		foxgamedebug(e);
	}
}

//*****************************************************************************************
function fg_pasteCoords(document) {

	if (document && !fg_isFlota2Url(document.location.href)) return;

	var path = '//input[@type="submit"]';
	var obj = fgEval(path,document);
	if (obj.snapshotLength > 0) 
	{
		obj.snapshotItem(0).setAttribute('accessKey','z');
		obj.snapshotItem(0).focus();
	}

	if (!fgGetBooleanPref("foxgameAutoCopy",false)) return;
	if (!fgGetBooleanPref("foxgameStoreCoordFlag",false)) return;

	if (fg_Debug) alert("Estamos pegar coordenadas");
	try {
		var str = PrefsBranchFG.getCharPref("foxgameStoreCoord");
	} catch(e) { return;}

	try {
		str = str.split(':');
		fg_Galaxy = str[0];
		fg_System = str[1];
		fg_Planet = str[2];
	
		if (document.getElementsByName("galaxy")[0].value == document.getElementsByName("thisgalaxy")[0].value && document.getElementsByName("system")[0].value == document.getElementsByName("thissystem")[0].value && document.getElementsByName("planet")[0].value == document.getElementsByName("thisplanet")[0].value) {
			document.getElementsByName("galaxy")[0].value = fg_Galaxy;
			document.getElementsByName("system")[0].value = fg_System;
			document.getElementsByName("planet")[0].value = fg_Planet;
		}
	} catch(e) {
		foxgamedebug(e);
	}
}

//*****************************************************************************************
function fg_infosDeltas(document){
	if (document && !fg_isInfosUrl(document.location.href)) return;
	if (!fgGetBooleanPref("foxgameInfosDeltas",true)) return;

	
	if (fg_Debug) alert("Estamos deltas de info de edificios");
	
	try {

		var path = '//table[@border="1"]/descendant::th/font[@color="#ff0000"]';
		var obj = fgEval(path,document);

		if (obj.snapshotLength == 0) return;

		var tr = obj.snapshotItem(0).parentNode.parentNode;

		obj = fgEvalnode('.//th[2]',document,tr);
		if (obj.snapshotLength == 0) return;
		var value = fg_parseInt(obj.snapshotItem(0).innerHTML);

		obj = fgEvalnode('.//tr/th[2]',document,tr.parentNode);
		foxgame_addDeltas2(obj,value,document);


		obj = fgEvalnode('.//th[3]',document,tr);
		if (obj.snapshotLength == 0) return;
		var value = fg_parseInt(obj.snapshotItem(0).innerHTML);

		obj = fgEvalnode('.//tr/th[3]',document,tr.parentNode);
		foxgame_addDeltas2(obj,value,document);
		
	} catch(e) {
		foxgamedebug(e);
	}
}

//*****************************************************************************************
function foxgame_addDeltas2(obj, value, document) {
	try {
		var temp, diff;
		for (var i = 0; i < obj.snapshotLength; i++) {
			temp = fg_parseInt(obj.snapshotItem(i).innerHTML);
			if (isNaN(temp)||temp == value)
				continue;
			if (temp < value) {
				diff = temp - value;
				var font = document.createElement('font');
				font.setAttribute('color', 'red');
				font.innerHTML=" ("+fg_addFormat(diff)+")";
				obj.snapshotItem(i).appendChild(font);
			} else {
				diff = temp - value;
				var font = document.createElement('font');
				font.setAttribute('color', 'lime');
				font.innerHTML=" ("+fg_addFormat(diff)+")";
				obj.snapshotItem(i).appendChild(font);
			}
		}
	} catch(e) {
		foxgamedebug(e);
	}
}

//*****************************************************************************************
function foxgame_addDeltas(obj, temp, document) {
	try {
		for (var i = 0; i < obj.snapshotLength; i++) {
			value = fg_parseInt(obj.snapshotItem(i));
			if (isNaN(value))
				continue;
			if (temp < value) {
				diff = temp - value;
				var font = document.createElement('font');
				font.setAttribute('color', 'red');
				font.innerHTML=" ("+fg_addFormat(diff)+")";
				obj.snapshotItem(i).appendChild(font);
			} else {
				diff = temp - value;
				var font = document.createElement('font');
				font.setAttribute('color', 'lime');
				font.innerHTML=" ("+fg_addFormat(diff)+")";
				obj.snapshotItem(i).appendChild(font);
			}
		}
	} catch(e) {
		foxgamedebug(e);
	}
}

//****************************************************************************************
function fg_addPlanetButtons(document) {

   if (!document) return;

   if (fg_Debug) alert("Botones << et >>");
   
   try {
      var path = '//select[starts-with(@onchange,"haha(this)")]/option';
      var option = fgEval(path,document); 
      if (option.snapshotLength < 1)
		return;
          
       //search the id of the curent planet
       var eleSelectedId;
       for (eleSelectedId=0;option.snapshotItem(eleSelectedId).selected == false;eleSelectedId++) {}
	
       //insert the "previous" button
       var input = document.createElement("input");
       input.setAttribute("value","<<");
       input.setAttribute("type","submit");
       input.setAttribute("onclick","eval(location='" + option.snapshotItem((eleSelectedId+(option.snapshotLength-1))%option.snapshotLength).value + "');");
       option.snapshotItem(0).parentNode.parentNode.insertBefore(input,option.snapshotItem(0).parentNode);
            
        //insert the "next" button
        var input2 = document.createElement("input");
        input2.setAttribute("value",">>");
        input2.setAttribute("type","submit");
        input2.setAttribute("onclick","eval(location='" + option.snapshotItem((eleSelectedId+1)%option.snapshotLength).value + "');");
        option.snapshotItem(0).parentNode.parentNode.insertBefore(input2,option.snapshotItem(0).parentNode.nextSibling);
   } catch (e) {
      foxgamedebug(e);
   }
} 
//*****************************************************************************************
function fg_addDebrisNumbers(document) {

   if (document && !fg_isGalaxyUrl(document.location.href)) return;
   if (fg_Debug) alert("fg_addDebris#");

   try {

      var path = '//table[@width="569"]/descendant::tr/th[5]/a[1]';
      var path2 = '//table[@width="569"]/descendant::tr/th[5]/a[1]/ancestor::tr/th[1]/a[@title]';
      var numberMatch = new RegExp("[0-9\.]+", "g");
      var obj = fgEval(path,document);
      var objText = fgEval(path2,document);
	if (objText.snapshotLength != obj.snapshotLength)
		return;
	var results, text, obj2, obj2_5, childs, span, font;
      for (var i = 0; i < obj.snapshotLength; i++) {
         obj2 = obj.snapshotItem(i);
	   obj2_5 = objText.snapshotItem(i);
	   text = obj2_5.getAttribute('title');
	   results = text.match(numberMatch);
	   span = document.createElement("span");
	   span.setAttribute("class","debrisText");
	   span.appendChild(document.createTextNode(results[0]));
	   span.appendChild(document.createElement('br'));
	   span.appendChild(document.createTextNode(results[1]));
    	   font = document.createElement("font");
    	   font.setAttribute("size","-2");
	   font.appendChild(span);
         childs = obj2.childNodes;
	   while(childs.length != 0)
		obj2.removeChild(obj2.firstChild);
	   obj2.appendChild(font);
      }
   } catch (e) {
      foxgamedebug(e);
   }
}

//*****************************************************************************************
function fg_addPlayerRank(document) {

   if (document && !fg_isGalaxyUrl(document.location.href)) return;
   if (fg_Debug) alert("fg_addPlayerRank");

   try {

      var path = '//table[@width="569"]/descendant::tr/th[6]/a[1]';
      var obj = fgEval(path,document);

      var playerName, mouseover, flagsAndRank, startname, endname, endpos, spacepos, ranknode, rank;
      for (var i = 0; i < obj.snapshotLength; i++) {
         var obj2 = obj.snapshotItem(i);
         var playerCell = obj2.innerHTML;
         playerName = playerCell.stripHTMLEntities().trim();
         mouseover  = obj2.getAttribute("onmouseover");

         // Find the player-name as a starting point
         startname = mouseover.indexOf(playerName);
         if (startname != -1) {
            endname = startname+playerName.length
            // Find &lt; after the rank number
            endpos = mouseover.indexOf('<', endname);
            if (endpos != -1) {
               // Now we have the pop-up header
               flagsAndRank = mouseover.substr(endname, endpos-endname);

               // Get the rank number after the last space
               spacepos = flagsAndRank.lastIndexOf(' ');
               if (spacepos != -1) {
                  rank = flagsAndRank.substr(spacepos+1);
                  var font = document.createElement("font");
                  font.setAttribute("color","orange");
                  font.setAttribute("size","smaller");
			var span = document.createElement("span");
                  span.setAttribute("class","rank");
                  ranknode = document.createTextNode('#'+rank);
                  font.appendChild(span);
                  span.appendChild(ranknode);
                  obj2.parentNode.appendChild(font);
               }
            }
         }
      }
   } catch (e) {
      foxgamedebug(e);
   }
}
//*****************************************************************************************
function fg_addAllianceRank(document) {

   if (document && !fg_isGalaxyUrl(document.location.href)) return;
   if (fg_Debug) alert("fg_addAllianceRank");

   try {

      var path = '//table[@width="569"]/descendant::tr/th[7]/a[1]';
      var obj = fgEval(path,document);

      var allianceName, mouseover, flagsAndRank, startname, endname, endpos, spacepos, ranknode, rank;
      for (var i = 0; i < obj.snapshotLength; i++) {
         var obj2 = obj.snapshotItem(i);
         var allianceCell = obj2.innerHTML;
         allianceName = allianceCell.stripHTMLEntities().trim();
         mouseover  = obj2.getAttribute("onmouseover");

         // Trim white-spaces
         allianceName = allianceName.trim();

         if (allianceName.length > 0) {
            mouseover  = obj2.getAttribute("onmouseover");

            // Find the player-name as a starting point
            startname = mouseover.indexOf(allianceName);
            if (startname != -1) {
               endname = startname+allianceName.length
               // Find &lt; after the rank number
               endpos = mouseover.indexOf('<', endname);
               if (endpos != -1) {
                  // Now we have the pop-up header
                  rankText = mouseover.substr(endname, endpos-endname);

                  // Get the rank numbers
                  var numberMatch = new RegExp("[0-9]+", "g");
                  results = rankText.match(numberMatch);

                  if (results != null && results.length == 2) {
                     rank = "#"+results[0]+"/"+results[1];

                     var font = document.createElement("font");
                     font.setAttribute("color","orange");
                     font.setAttribute("size","smaller");
			   var span = document.createElement("span");
                     span.setAttribute("class","rank");
                     ranknode = document.createTextNode(rank);
                     font.appendChild(span);
                     span.appendChild(ranknode);
                     obj2.parentNode.appendChild(font);

                  }
               }
            }
         }   
      }
   } catch (e) {
      foxgamedebug(e);
   }
} 

//*****************************************************************************************
// FUNCTIONS FOR GalaxieTool (Heavily based on their code)
//*****************************************************************************************

function fg_GTPlugin_getStatsText(docroot, type) {
    var element;
    var found = 0;
    var rows;
    var table
    try {
        var i = 0;
        var j = 1;         
        while (table = docroot.getElementsByTagName('table')[i]) {
            if (table.width == 519) {
            	if (j == 2) {
            		found = 1;
	            	rows = docroot.getElementsByTagName('table')[i].rows;
                	break;
	            }
	            j++;
            }
			i++;
        }
        if (found == 0) return ""; // error occured - no stats found - TODO: error message
    } catch(e) {
        // nothing to do
    }

    var cells;
    if(type == 0) { // Players
        var ranks = new Array(100);
        var players = new Array(100);
        var pIds = new Array(100);
        var alliances = new Array(100);
        var points = new Array(100);
        var j;
        var pIdRegExp = /messageziel\=(\d+)/;

        for(var i = rows.length - 2; i >= 0; i--) {
            j = 0;
            cells      = rows[i+1].cells;
            ranks[i]   = parseInt(cells[j++].innerHTML.replace(".",""));
            players[i] = cells[j++];

            while(players[i].firstChild) {
                players[i] = players[i].firstChild;
            }

            players[i] = players[i].nodeValue;
            try {
                // TODO: Saubere Loesung
                pIds[i] = cells[j++].innerHTML.match(pIdRegExp)[1];
            } catch(e) { }
            // alliances[i] = cells[j++].innerHTML;
            try {
                alliances[i] = cells[j++].getElementsByTagName('a')[0].innerHTML;
                // remove leading spaces
                alliances[i] = fg_GTPlugin_trim(alliances[i]);
            } catch(e) {
                alliances[i] = "";
            }
            points[i] = parseInt(cells[j].innerHTML.replace(".","").replace(".","").replace(".",""));
        }
        var data = "";
        data += "&ranks=" + ranks.join("|");
        data += "&players=" + players.join("|");
        data += "&pIds=" + pIds.join("|");
        data += "&alliances=" + alliances.join("|");
        data += "&points=" + points.join("|");
    } else { // Alliances
        var ranks = new Array(100);
        var alliances = new Array(100);
        var members = new Array(100);
        var points = new Array(100);
        var j;
        for(var i = rows.length - 2; i >= 0; i--) {
            j = 0;
            cells = rows[i+1].cells;
            ranks[i] = parseInt(cells[j++].innerHTML);
            alliances[i] = cells[j++];
            while(alliances[i].firstChild)
            	alliances[i] = alliances[i].firstChild;
            alliances[i] = alliances[i].nodeValue;
			if (alliances[i] == null) {
 				alliances[i]=docroot.getElementsByName('SELF')[0].innerHTML; 
 			}             
            j++;
            members[i] = cells[j++].innerHTML;
            points[i] = cells[j++].innerHTML;
        }
        var data = "";
        data += "&ranks=" + ranks.join("|");
        data += "&alliances=" + alliances.join("|");
        data += "&members=" + members.join("|");
        data += "&points=" + points.join("|");
    }
    return data;
}

function fg_GTPlugin_get_galaxyview_data(docroot) {
	var rows;
	var table;
	var found = false;
 	var j=0; 
 	
	while (table=docroot.getElementsByTagName('table')[j]) { 
 		if (table.width == 569) { 
 			rows=table.getElementsByTagName('tbody')[0].rows; 
 			found=true; 
 			break;
 		} 
 		j++; 
 	} 
 	if (!found)
 		return "";
	
    var cells;
    var galaxyview = new Array(15);
    var galaxy_content;
    var posRegExp = />(\d+)<\/a>/;
    var debrisRegExp = /\d+/;

    var moonsize;
    var metal_debris;
    var crystal_debris;
    var planetname;
    var corrector = 0;

    var systemRowRegExp = / \d:\d{1,3}/;
    var systemRow = 0;
    for(var i = 2; i < 12; i++) {
        cells = rows[i].cells;
        if(cells[0].innerHTML.match(systemRowRegExp)) {
            systemRow = i;
            break;
        }
    }

    // find the word for "solar system" to determine the language later
    cells = rows[0].cells;
    var solar_system = cells[0].innerHTML;
    solar_system = solar_system.replace(/\s/,"");

    for(var i = 2; i < 17; i++) {
        // reset data
        moonsize = 0;
        metal_debris = 0;
        crystal_debris = 0;
        playerid = 0;
        playerstatus = "";
        playername = "";
        planetname = "";
        alliance = "";

        cells = rows[i].cells;
		try {
	 		moonsize=cells[3].getElementsByTagName('a')[0].getAttribute('onmouseover'); 
 			moonsize=moonsize.substring(moonsize.indexOf("alt=\\\'")+6); 
			moonsize=moonsize.substring(0,moonsize.indexOf("\\\'")); 
			moonsize=parseInt(moonsize.substring(moonsize.indexOf(":")+1)); 
		} catch(e) { //no moon
		}         
         try {        
	 		var tmp=cells[0].getElementsByTagName('a')[1].getAttribute('title'); 
 			tmp=tmp.split(":"); 
 			metal_debris=parseInt(tmp[2].replace(".","").replace(".","").replace(".","")); 
			crystal_debris=parseInt(tmp[3].replace(".","").replace(".","").replace(".","")); 
        } catch(e) {
            // no debris field
        }

        try {
                // planet is in reach of a phalanx
                planetname = cells[2].getElementsByTagName('a')[0].innerHTML;
            } catch(e) {
                // not in reach of a phalanx
                planetname = cells[2].innerHTML;
            }


        planetname = planetname.replace(/\([0-9a-zA-Z\*\s]+\)/,""); // remove activity behind planet name
        planetname = planetname.replace("&nbsp;","");
        planetname = planetname.replace(/\s/,"");

        galaxy_content = parseInt(cells[0].innerHTML.match(posRegExp)[1])+"|"; // position
        galaxy_content += planetname+"|"; // planetname
        galaxy_content += moonsize+"|"; // moon
        galaxy_content += metal_debris+"|"; // metal debris field
        galaxy_content += crystal_debris+"|"; // crystal debris field
        try {
            playername = cells[5].getElementsByTagName('span')[0].innerHTML; // playername
			try {
 				playerid=parseInt(cells[5].getElementsByTagName('a')[0].getAttribute('onmouseover').match(/messageziel=(\d+)/)[1]); 
 			} catch(e) { }             
            // get playerstats - at max 6 (i,I,u,g,s,n)
            for (var j=1; j<7; j++) {
                playerstatus += cells[5].getElementsByTagName('span')[j].innerHTML;
            }

        } catch(e) {
            // catch when there is no player or last playerstatus was found
        }
        galaxy_content += playername+"|";
        galaxy_content += playerstatus+"|"; // add playerstats
        try {
            try {
                // own alliance
                alliance = cells[6].getElementsByTagName('a')[0].getElementsByTagName('span')[0].innerHTML; // alliance
            } catch(e) {
                // another alliance
                alliance = cells[6].getElementsByTagName('a')[0].innerHTML; // alliance
            }
            alliance = alliance.replace(/\n+/,"");
        } catch(e) {
            // catch when there is no alliance
        }
        galaxy_content += alliance+"|";

        // try to find the playerid   
        galaxy_content += playerid;

        // delete all \n within this string
        galaxy_content = galaxy_content.replace(/\n+/,"");
        galaxyview[i] = galaxy_content;
    }
    var galaxystring = solar_system + galaxyview.join("\n");
    return galaxystring;
}

function fg_GTPlugin_trim(string) { 
	var var38=new String(" \t\n\r"); 
	var s=new String(string); 
	if (var38.indexOf(s.charAt(0)) != -1) {
	 	var j=0, i=s.length; 
 		while (j < i && var38.indexOf(s.charAt(j)) != -1) 
 			j++; 
 		s=s.substring(j, i); 
 	} 
 	return s; 
}
function fg_GTPlugin_GetLanguage(url) { 
	var var7; 
		try {
 		var var8=url.indexOf("ogame."); 
 		if (var8 == -1) { 
 			var8=url.indexOf("o-game."); 
 			var7=url.substring(var8 + 7); 
 		} else {
 			var7=url.substring(var8 + 6); 
 		} 
 		var8=var7.indexOf("/"); 
 		var7=var7.substring(0,var8); 
 		return var7; 
 	} catch(e) {
 		return false; 
 	} 
 }
foxgame_load();