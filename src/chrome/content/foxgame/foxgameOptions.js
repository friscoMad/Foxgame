var foxgame2_prefObj = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
var foxgame2_PrefsBranch = foxgame2_prefObj.getBranch("foxgame2.userprefs.");

function foxgame2_fillListFromXml(id, prefix, xmlDoc, elem, descAttr, valAttr){
    
    var values = xmlDoc.getElementsByTagName(elem);
    var menupopup = document.getElementById(id);
    var langs = new Array();
    	
    for (var i=0; i<values.length; i++) {
        var label = values[i].attributes.getNamedItem(descAttr).textContent;
        var value = values[i].attributes.getNamedItem(valAttr).textContent;
        langs[langs.length] = new Array(label,value);
    }

    function sortfunction(a,b) {
        return a[0].localeCompare(b[0]);
    }
    
    langs.sort(sortfunction);

    for (var i=0; i<langs.length; i++) {
        
        var label = langs[i][0];
        var value = langs[i][1];

        var obj = document.createElement("menuitem");
        obj.setAttribute("id", prefix+value);
        obj.setAttribute("label", label);
        obj.setAttribute("value", value);
        
        menupopup.appendChild(obj);
        
    }

}

function foxgame2_fillSubListFromXml(id, prefix, xmlDoc, elem, descAttr, valAttr, fatherElem, fatherAtrr, fatherVal){
    
    try {
	//alert('//'+fatherElem+'[@'+fatherAtrr+'="'+fatherVal+']/descendant::'+elem);
    var values = xmlDoc.evaluate('//'+fatherElem+'[@'+fatherAtrr+'="'+fatherVal+'"]/descendant::'+elem,xmlDoc,null,XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null)
    var menupopup = document.getElementById(id);

    while (menupopup.childNodes.length > 0) {
	menupopup.removeChild(menupopup.firstChild);
    }
        
    var langs = new Array();
    
	
    for (var i=0; i<values.snapshotLength; i++) {
        var label = values.snapshotItem(i).attributes.getNamedItem(descAttr).textContent;
        var value = values.snapshotItem(i).attributes.getNamedItem(valAttr).textContent;
        langs[langs.length] = new Array(label,value);
    }

    function sortfunction(a,b) {
        return a[0].localeCompare(b[0]);
    }
    
    langs.sort(sortfunction);

    for (var i=0; i<langs.length; i++) {
        
        var label = langs[i][0];
        var value = langs[i][1];

        var obj = document.createElement("menuitem");
        obj.setAttribute("id", prefix+value);
        obj.setAttribute("label", label);
        obj.setAttribute("value", value);
        
        menupopup.appendChild(obj);    
    }
	} catch(e) {
		foxgame_debug(e);
	}
}

function foxgame2_loadUnis(){
	try {
	var server = document.getElementById("fgServer").selectedItem.value;
	foxgame2_fillSubListFromXml("fgUniPopup", "fgUni-", foxgame2_UniversesXml, "universe", "name", "value", "index", "url", server);
	document.getElementById("fgUni").selectedItem = null;
	} catch(e) { }
}

function foxgame2_initPreferences() {
    try {   
		function foxgame2_getPref(pref) {
			try {		
				return foxgame2_PrefsBranch.getCharPref(pref)
			} catch(e) {		
				return "-1";
			}
		}

		var i = 0;
		var lista = document.getElementById("fg_missionPriorities");

		var pref = foxgame2_getPref("foxgameMissionPreference"+i);	
		var button;
 		while (pref != "-1") {
      		button = document.getElementById("fg_missionButton"+pref);
			lista.appendItem((lista.getRowCount()+1)+". "+button.label,pref);
			button.setAttribute('hidden','true');
			i++;
			pref = foxgame2_getPref("foxgameMissionPreference"+i);
		} 
	
		if (document.getElementById('foxgamePersonalDate').value == "dd/MM" || document.getElementById('foxgamePersonalDate').value == "MM/dd")
			document.getElementById('fgDateFormat').value = document.getElementById('foxgamePersonalDate').value;
		else {
			document.getElementById('fgDateFormat').value = '2';
			document.getElementById('foxgamePersonalDateBox').setAttribute('hidden','false'); 
		}
		if (document.getElementById('foxgamePersonalHour').value == "H:mm:ss" || document.getElementById('foxgamePersonalHour').value == "K:mm:ss a")
			document.getElementById('fgHourFormat').value = document.getElementById('foxgamePersonalHour').value;
		else {
			document.getElementById('fgHourFormat').value = '2';
			document.getElementById('foxgamePersonalHourBox').setAttribute('hidden','false'); 
		}		
		if(document.getElementById("foxgameTimeMode").value == "3")
			document.getElementById("fgTimeDiffBox").setAttribute('hidden','false');
				
	} catch (e) {
		foxgame2_debug(e);
	}
}


function foxgame2_savePreferences() {
	try {
		var lista = document.getElementById("fg_missionPriorities");
	  	var i = 0;
  	  	for (i = 0; i < lista.getRowCount(); i++) {
        	foxgame2_PrefsBranch.setCharPref("foxgameMissionPreference"+i, lista.getItemAtIndex(i).value);	
	  	}
      	foxgame2_PrefsBranch.setCharPref("foxgameMissionPreference"+i, "-1");
      	return true;        
    	} catch (e) {
        	foxgame_debug(e);
        	return true;
    	}
}

function foxgame2_borrarLista(id,prefix) {
	var a = document.getElementById(id);
	var id2;
	var button;
	while(a.getRowCount() > 0) {
		id2 = prefix + a.getItemAtIndex(0).value;
		button = document.getElementById(id2);
		button.setAttribute("hidden","false");
		a.removeItemAt(0);
	}
	document.getElementById(prefix+1).focus();
}
function foxgame2_borrarUltimo(id, prefix) {
	var a = document.getElementById(id);
	var id2 = prefix + a.getItemAtIndex(a.getRowCount()-1).value;
	var button = document.getElementById(id2);
	button.setAttribute("hidden","false");
	a.removeItemAt(a.getRowCount()-1);
	document.getElementById(prefix+1).focus();
}
function foxgame2_anadir(id,label,value) {
	var a = document.getElementById(id);
	a.appendItem((a.getRowCount()+1)+". "+label,value);
}

//------------------------------------------ Tree functions

function foxgame2_TreeView() {
    this.data = null;
    this.treeBox = null;
    this.selection = null;
    this.init = function(lista) {
	this.data = lista;
	};
    this.rowCount = function() {	
	return this.data.length;
    };

/*    get rowCount() {
	return this.data.length;
    },
*/
    this.getCellText = function(row,column){
    	return this.data.value(row).getValue(column.id);
    };
    this.setTree = function(treebox){ this.data.setTree(treebox); this.treeBox = treebox;};
    this.isContainer = function(row){ return false; };
    this.isSeparator = function(row){ return false; };
    this.isSorted = function(){ return false; };
    this.getLevel = function(row){ return 0; };
    this.getImageSrc = function(row,col){ return null; };
    this.getRowProperties = function(row,props){};
    this.getCellProperties = function(row,col,props){};
    this.getColumnProperties = function(colid,col,props){};
};
var foxgame2_treeView = new Array ();
foxgame2_treeView[0] = new foxgame2_TreeView();
foxgame2_treeView[0].getCellText = function(row,column){
	if ( column.id == "priority")
		return (row+1)+"";
	var temp = this.data.value(row).getValue(column.id);		
	if (column.id == "type")
		if (temp == "0")
			return document.getElementById("foxgame.prefs.messageTypeUser").value;		
		else
			return document.getElementById("foxgame.prefs.messageTypeAli").value;		 
   	return temp;
};

foxgame2_treeView[1] = new foxgame2_TreeView();
foxgame2_treeView[2] = new foxgame2_TreeView();
foxgame2_treeView[2].getCellText = function(row,column){
	var temp = this.data.value(row).getValue(column.id);	
	
	if (temp === "PM")
		return document.getElementById("foxgame.prefs.messageTypePM").value;
	else if (temp === "CC")
		return document.getElementById("foxgame.prefs.messageTypeCC").value;		
	else if (temp === "SpyReport")
		return document.getElementById("foxgame.prefs.messageTypeSpyR").value;		
	else if (temp === "SpyReport")
		return document.getElementById("foxgame.prefs.messageTypeSpyA").value;		
	else if (temp === "Missile")
		return document.getElementById("foxgame.prefs.messageTypeMissile").value;
	else {
		if ( column.id == "priority")
			return (row+1)+"";					
		return temp;
	}				
};

function foxgame2_treeSetView()
{
	foxgame2_listaLogins.init(foxgame2_getConfigFile("logins.xml"));
	foxgame2_treeView[1].init(foxgame2_listaLogins);
	document.getElementById('loginList').view=foxgame2_treeView[1];
	foxgame2_listaLogins.load();
	foxgame2_listaUserHLs.init(foxgame2_getConfigFile("UserHL.xml"));
	foxgame2_treeView[0].init(foxgame2_listaUserHLs);
	document.getElementById('listUHL').view=foxgame2_treeView[0];
	foxgame2_listaUserHLs.load();	foxgame2_listaHighlights.init(foxgame2_getConfigFile("HL.xml"));
/*	
	foxgame2_treeView[2].init(foxgame2_listaHighlights);
	document.getElementById('listHL').view=foxgame2_treeView[2];
	foxgame2_listaHighlights.load();
*/	
}
function foxgame2_treeEditElement(id) {
	var treeView2 = foxgame2_treeView[id];
	if (treeView2.selection.getRangeCount() == 0) return;
	var i = treeView2.selection.currentIndex;
	var result = {};
	openDialog("chrome://foxgame2/content/edit"+treeView2.data.type+".xul", "_blank", "chrome,centerscreen,modal", treeView2.data.value(i), result);
	treeView2.data.modifyElement(i,result);   	
}

function foxgame2_treeUpElement(id) {
	var treeView2 = foxgame2_treeView[id];
	if (treeView2.selection.getRangeCount() == 0) return;
	var i = treeView2.selection.currentIndex;
	if (i < 1) {
		return;
	}
	var temp = treeView2.data.value(i);
	treeView2.data.setValue(i,treeView2.data.value(i-1));
	treeView2.data.setValue(i-1,temp);	
}

function foxgame2_treeDownElement(id) {
	var treeView2 = foxgame2_treeView[id];
	if (treeView2.selection.getRangeCount() == 0) return;
	var i = treeView2.selection.currentIndex;
	if (i > treeView2.data.length - 2 )
		return;
	var temp = treeView2.data.value(i);
	treeView2.data.setValue(i,treeView2.data.value(i+1));
	treeView2.data.setValue(i+1,temp);		
}

function foxgame2_treeAddElement(id) {
	var treeView2 = foxgame2_treeView[id];
	var result = {};
	openDialog("chrome://foxgame2/content/edit"+treeView2.data.type+".xul", "_blank", "chrome,centerscreen,modal", '', result);
	treeView2.data.addElement(result);
}
function foxgame2_treeDeleteElement(id) {
	var treeView2 = foxgame2_treeView[id];
      var min = {};
      var max = {};
	while(treeView2.selection.getRangeCount() > 0)
	{
		treeView2.selection.getRangeAt(0, min, max);
		treeView2.data.removeElement(min.value);
	}
}
function foxgame2_updateList() {
	foxgame2_checkUpdates(false);
	alert("Server List Updated");
}