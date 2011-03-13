var prefObj = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
var fgPrefsBranch = prefObj.getBranch("foxgame.userprefs.");

var fgboolPrefsTrue = new Array("foxgameRemovePlanets","foxgameFlotaTime",
				"foxgameHighlightPrivates","foxgameReplicateDeleteOptions","foxgameSelectUniverse",
				"foxgameResearchTime","foxgameHighlightAllyMessages","foxgameHighlightBigDebris",
				"foxgameBuildingsTime","foxgameBuildingTime", "foxgameFlotaReturnTime",
				//"foxgameAddBuildingDeltas","foxgameAddResearchDeltas","foxgameInfosDeltas",
				"foxgamePhalanxTime");


var fgboolPrefsFalse = new Array("foxgameAddMilosButtons", "foxgameAddOverviewTime", "foxgameRemoveOverviewTime", "foxgameReplicateSpyReportOptions",
				//"foxgameAddHangarDeltas","foxgameAddDefenseDeltas",
				"foxgameAutoCopy","foxgameMessageSignature",
				"foxgameAddReportButtons","foxgameAddStatButtons");

var fgcharPrefs = new Array("fgDebrisMin", "fgMsgSign");

var fgcolorPrefs = new Array("fgPrivateColor", "fgAllyColor", "fgDebrisColor");

var fgcharPrefsSelects = new Array("fgServer","fgUni", "fgTimeMode", "fgTimeDiff");

try {
	var fgUniversesXml = document.implementation.createDocument("", "", null);
	fgUniversesXml.async = false;
	var file = fg_getConfigDir(null);
	file.append("fgUniverses.xml");
	if (!file.exists()){
		fgUniversesXml.load("chrome://foxgame/content/fgUniverses.xml", "text/xml");
	} else {
		fgUniversesXml.load("file://"+file.path, "text/xml");
	}
} catch (e) {
	alert(e);
}


function fillListFromXml(id, prefix, xmlDoc, elem, descAttr, valAttr){
    
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

function fillSubListFromXml(id, prefix, xmlDoc, elem, descAttr, valAttr, fatherElem, fatherAtrr, fatherVal){
    
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
		alert(e);
	}
}

function loadUnis(){
	try {
	var server = document.getElementById("fgServer").selectedItem.value;
	fillSubListFromXml("fgUniPopup", "fgUni-", fgUniversesXml, "universe", "name", "value", "index", "url", server);
	document.getElementById("fgUni").selectedItem = null;
	} catch(e) { }
}

function initFoxGamePreferences() {
    
    try {
        fillListFromXml("fgServerPopup", "fgServer-", fgUniversesXml, "index", "url", "url");
    } catch (e) {
        foxgamedebug(e);
    }
    
    for (var i=0; i < fgboolPrefsTrue.length; i++) {
        try {
            var temp = fgboolPrefsTrue[i];
            document.getElementById(temp).checked=fgGetBooleanPref(temp,true);
        } catch (e) {
		document.getElementById(temp).checked=true;
	  }
    }
    for (var i=0; i<fgboolPrefsFalse.length; i++) {
        try {
            var temp = fgboolPrefsFalse[i];
            document.getElementById(temp).checked=fgGetBooleanPref(temp,false);
        } catch (e) {
		document.getElementById(temp).checked=false;
	  }
    }

    for (var i=0; i<fgcharPrefs.length; i++) {
        try {
            var temp = fgcharPrefs[i];
            document.getElementById(temp).value=fgPrefsBranch.getCharPref(temp);
        } catch (e) {}
    }

    for (var i=0; i<fgcolorPrefs.length; i++) {
        try {
            var temp = fgcolorPrefs[i];
            document.getElementById(temp).value=fgPrefsBranch.getCharPref(temp);
        } catch (e) {
		document.getElementById(temp).value="#CC0000";
	  }
    }

    for (var i=0; i<fgcharPrefsSelects.length; i++) {
        try {
            var temp = fgcharPrefsSelects[i];
            document.getElementById(temp).selectedItem=document.getElementById(temp + "-" + fgPrefsBranch.getCharPref(temp));
		if (temp == "fgServer")
		  loadUnis();
        } catch (e) {}
    } 

    
	function fg_getPref(pref) {
		try {
			return PrefsBranchFG.getCharPref(pref)
		} catch(e) {
			return "-1";
		}
	}

	var i = 0;
	var lista = document.getElementById("fg_missionPriorities");

	var pref = fg_getPref("fgMissionPreference"+i);
	var button;
 	while (pref != "-1") {
      	button = document.getElementById("fg_missionButton"+pref);
		lista.appendItem((lista.getRowCount()+1)+". "+button.label,pref);
		button.setAttribute('hidden','true');
		i++;
		pref = fg_getPref("fgMissionPreference"+i);
	} 

	if(document.getElementById("fgTimeMode").value == "3")
		document.getElementById("fgTimeDiffBox").setAttribute('hidden','false');
}


function savePreferences() {
    
    try {

        for (var i=0; i<fgboolPrefsFalse.length; i++) {
            var temp = fgboolPrefsFalse[i];
            fgPrefsBranch.setBoolPref(temp, document.getElementById(temp).checked);
        }
        for (var i=0; i<fgboolPrefsTrue.length; i++) {
            var temp = fgboolPrefsTrue[i];
            fgPrefsBranch.setBoolPref(temp, document.getElementById(temp).checked);
        }
        for (var i=0; i<fgcharPrefs.length; i++) {
            var temp = fgcharPrefs[i];
            fgPrefsBranch.setCharPref(temp, document.getElementById(temp).value);
        }
        for (var i=0; i<fgcolorPrefs.length; i++) {
            var temp = fgcolorPrefs[i];
            fgPrefsBranch.setCharPref(temp, document.getElementById(temp).value);
        }

        for (var i=0; i<fgcharPrefsSelects.length; i++) {
            var temp = fgcharPrefsSelects[i];
            if (document.getElementById(temp).selectedItem != null) {
                fgPrefsBranch.setCharPref(temp, document.getElementById(temp).value);
            }
        }
        
	  var lista = document.getElementById("fg_missionPriorities");
	  var i = 0;
  	  for (i = 0; i < lista.getRowCount(); i++) {
            fgPrefsBranch.setCharPref("fgMissionPreference"+i, lista.getItemAtIndex(i).value);	
	  }
        fgPrefsBranch.setCharPref("fgMissionPreference"+i, "-1");

        return true;
        
    } catch (e) {
        alert (e);
        return true;
    }

    
}


//---------------------------------------------------------------
function initWindow() {

	initFoxGamePreferences();	    
}

function foxgame_getSortedKeysForArray(values, sortProperty) {
 
    var keys = new Array();
    
    for (var key in values) {
        keys[keys.length] = key;
    }
    
    function sortfunction(a,b) {
        return values[a][sortProperty].localeCompare(values[b][sortProperty]);
    }
    
    keys.sort(sortfunction);
    
    return keys;
    
}
//---------------------------------------------------------------
function fg_initColor() {

	var pref = window.arguments[0];

	try {
      	document.getElementById("fgColorPicker").color=fgPrefsBranch.getCharPref(pref);

   	} catch (e) {
		document.getElementById("fgColorPicker").color="#CC0000";
   	}
}

function fg_saveColor() {

	var pref = window.arguments[0];
      fgPrefsBranch.setCharPref(pref, document.getElementById("fgColorPicker").color);

	return true;
}
function fg_returnColor() {
	var ele = window.arguments[1];
	try {
		window.opener.document.getElementById(ele).value = document.getElementById("fgColorPicker").color;
	} catch(e) {
		alert(e);
	}
}

function fg_openColor(pref,ele) {
	window.openDialog('chrome://foxgame/content/foxGameColorPicker.xul','ColorPicker','chrome',pref,ele);
	return true;
}

function fg_borrarLista(id,prefix) {
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
function fg_borrarUltimo(id, prefix) {
	var a = document.getElementById(id);
	var id2 = prefix + a.getItemAtIndex(a.getRowCount()-1).value;
	var button = document.getElementById(id2);
	button.setAttribute("hidden","false");
	a.removeItemAt(a.getRowCount()-1);
	document.getElementById(prefix+1).focus();
}
function fg_anadir(id,label,value) {
	var a = document.getElementById(id);
	a.appendItem((a.getRowCount()+1)+". "+label,value);
}

//------------------------------------------ Tree functions

var treeView = {

    data: null,
    treeBox: null,
    selection: null,
    init: function(lista) {
	this.data = lista;
	},
    get rowCount() {
	return this.data.length;
    },
    getCellText: function(row,column){
	return eval("this.data.value(row)."+column.id);
    },
    setTree: function(treebox){ this.data.setTree(treebox); this.treeBox = treebox;},
    isContainer: function(row){ return false; },
    isSeparator: function(row){ return false; },
    isSorted: function(){ return false; },
    getLevel: function(row){ return 0; },
    getImageSrc: function(row,col){ return null; },
    getRowProperties: function(row,props){},
    getCellProperties: function(row,col,props){},
    getColumnProperties: function(colid,col,props){}
};

function fg_treeSetView()
{
	fg_listaDBs.init(fg_getConfigFile("dbs.xml"));
	treeView.init(fg_listaDBs);
	document.getElementById('list').view=treeView;
	fg_listaDBs.load();
}
function fg_treeEditElement() {
	if (treeView.selection.getRangeCount() == 0) return;
	var i = treeView.selection.currentIndex;
	var result = {};
	openDialog("chrome://foxgame/content/edit"+treeView.data.type+".xul", "_blank", "chrome,centerscreen,modal", treeView.data.value(i), result);
	treeView.data.modifyElement(i,result);
}

function fg_treeAddElement() {
	var result = {};
	openDialog("chrome://foxgame/content/edit"+treeView.data.type+".xul", "_blank", "chrome,centerscreen,modal", '', result);

	treeView.data.addElement(result);
}
function fg_treeDeleteElement() {
      var min = {};
      var max = {};
	while(treeView.selection.getRangeCount() > 0)
	{
		treeView.selection.getRangeAt(0, min, max);
		treeView.data.removeElement(min.value);
	}
}