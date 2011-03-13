//*****************************************************************************************
// Misc Features functions
//*****************************************************************************************

//*****************************************************************************************
function foxgame2_selectUniverse(document) {

	if (!document) return;
	if (document && !foxgame2_isLoginUrl(document.location)) return;	
	if (!foxgame2_GetBooleanPref("foxgameSelectUniverse",true)) return;
	
	try {
		var select = document.getElementById("uni_select_box");
		if (select == null)
			return;
		
		var i = foxgame2_loadLogins(document);	
		if (i == null) return;
		var ele = foxgame2_listaLogins.data[i];
		var uni = ele.uni;
		var uni = foxgame2_UniversesXml.evaluate('//universe[@value="'+uni+'"]',foxgame2_UniversesXml,null,XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null)
		if (uni.snapshotLength == 0)
			return "";
		var id  = uni.snapshotItem(0).getAttribute('id');
		var url  = uni.snapshotItem(0).getAttribute('value');
		var select = document.getElementById("uni_select_box");
		for (var i = 0; i < select.options.length; i++) {
			if (select.options[i].value == url)
				select.options[i].selected = true;
		}
		foxgame2_loadJs(document,"setTimeout( function() { setUniUrl('"+url+"')} , 250);");		
	} catch(e) {
		foxgame2_debug(e);
	}
}

//*****************************************************************************************
function foxgame2_addShipyardTime(document) {

	if (!document) return;
	if (!foxgame2_GetBooleanPref("foxgameShipyardTime",true)) return;

	foxgame2_addTimeCountdown("shipSumCount",document);	
			
}

//*****************************************************************************************
function foxgame2_addResearchTime(document) {

	if (!document)  return;
	if (!foxgame2_GetBooleanPref("foxgameResearchTime",true)) return; 

	foxgame2_addTimeCountdown("researchCountdown",document);
}

//*****************************************************************************************
function foxgame2_addBuildingsTime(document) {

	if (!document)  return;
	if (!foxgame2_GetBooleanPref("foxgameBuildingsTime",true)) return; 

	foxgame2_addTimeCountdown("Countdown",document);
}

//*****************************************************************************************
function foxgame2_addTimeCountdown(name,document) {
	try {
		if (!document || !name)
			return;
			
		var obj = foxgame2_getLastScript (document);
		if (obj == null)
			return null;
		var res;
		if (name == "shipSumCount")
			res = obj.innerHTML.match(new RegExp('[\'\"]'+name+'[\'\"]\\),\\s*.+?,\\s*.+?,\\s*(\\d+),'));	
		else
			res = obj.innerHTML.match(new RegExp('[\'\"]'+name+'[\'\"]\\),\\s*(\\d+),'));
		if (res == null)
			return null;			
		var secs = foxgame2_parseInt(res[1]);
		var date = foxgame2_newDate(document);
        var lag   = new Number(new Date()) - foxgame2_DOMEventUnloadTime;  // ms / comm+load lag			
		date.setTime(date.getTime() + (secs*1000) - lag);
		var date2 = foxgame2_newDate(document);
		var text2;
		text2 = document.createTextNode(foxgame2_formatDate(date,date2));
		var tr = document.createElement("tr");
		tr.className = "data";
		var td = document.createElement("td");
		tr.appendChild(td);
		td = document.createElement("td");
		td.className = "desc";
		td.innerHTML = "<font color='lime'><span class='foxgame_time'>" +text2.nodeValue+"</span></font>";
		tr.appendChild(td);
		var ele;
		if (ele = document.getElementById(name))
			ele.parentNode.parentNode.parentNode.appendChild(tr);
	} catch (e) {
		foxgame2_debug(e);
	}			
}

//*****************************************************************************************
function foxgame2_getDelta(document) {
	if (document && !foxgame2_isOverviewUrl(document.location.href)) return;
	
	try {
		var date = new Date();
		var obj = foxgame2_getLastScript (document);
		if (obj == null)
			return;
		var res = obj.innerHTML.match(new RegExp('(var)?\\s+'+name+'\\s*=\\s*new\\s*Date\\s*\\((\\d+)\\)\\s*[;-]'));	
		if (res == null)
			return;
		startTime = res[2];			
		startTime = foxgame2_parseInt(startTime) + 3600000;
		var dateString = (new Date(startTime)).toUTCString().replace("GMT","");
		startTime = Date.parse(dateString);
		var lag = new Number(new Date()) - foxgame2_DOMEventUnloadTime;  // ms / comm+load lag	
		foxgame2_Delta = date.getTime() - startTime - lag;
		foxgame2_PrefsBranch.setCharPref("foxgameDeltaTime-"+foxgame2_getDomain(document),foxgame2_Delta);
	}catch(e) {
		foxgame2_debug(e);
	}
}

//*****************************************************************************************
function foxgame2_addOverviewPhalanxTime(document) {
	if (document && 
		( !foxgame2_isEventListUrl(document.location.href) || !foxgame2_GetBooleanPref("foxgameEventListTime",true) )&&
		( !foxgame2_isPhalanxUrl(document.location.href) || !foxgame2_GetBooleanPref("foxgamePhalanxTime",true)))
		 return;
	
	try {	
		var script = foxgame2_getLastScript (document);
		if (script == null)
			return;

		var regexp = new RegExp('\"counter-(\\d+)\"\\),\\s*(\\d+)\\)',"gm");
		var res;
		while ((res = regexp.exec(script.innerHTML)) != null) {			
			var span = document.getElementById("counter-"+res[1]);
			if (span == null)
				continue;
			var node = span.parentNode.nextSibling.nextSibling;
			var date, date2 = foxgame2_newDate(document);
			var secs = foxgame2_parseInt(res[2]);			
			date = foxgame2_newDate(document);
			var lag = 0;
			//new Number(new Date()) - DOMEventUnloadTime;  // ms / comm+load lag			
			date.setTime(date.getTime() + (secs*1000) - lag);
			node.innerHTML = "<font color='lime'><span class='foxgame_time'>" +foxgame2_formatDate(date,date2)+"</span></font>";
		}
	} catch (e) {
		foxgame2_debug(e);
	}
}

//****************************************************************************************
function foxgame2_addConstructionName(document) {

   	if (!document) return;
   	if (!foxgame2_GetBooleanPref("foxgameAddConstructionName",true)) return;  
 	try {
 		var path = '//a[contains(@class,"constructionIcon")]';
		var links = foxgame2_eval(path,document); 
		if (links.snapshotLength == 0)
			return;
		var link, text, span;		
		var small = document.getElementById('cutty');
		for (var i = 0; i < links.snapshotLength; i++) {
			link = links.snapshotItem(i);
			text = link.getAttribute('title').split('|');
			text = text[1];
			span = document.createElement('span');
			if (small == null) {
				span.setAttribute('style',"color: rgb(153, 204, 0); font-size: 10px");
				link.parentNode.setAttribute('style',"height:104px");
			} else 
				span.setAttribute('style',"position: relative; color: rgb(153, 204, 0); font-size: 10px; top: -15px");
			span.innerHTML = text;
			link.parentNode.appendChild(span);				
		}							
 	} catch (e) {
		foxgame2_debug(e); 	
 	}  
}   


//****************************************************************************************
function foxgame2_addPlanetButtons(document) {

   if (!document) return;
   if (!foxgame2_GetBooleanPref("foxgamePlanetButtons",true)) return;  
   
   try {
		var path = '//a[starts-with(@class,"planetlink") or starts-with(@class,"moonlink")]/img[starts-with(@src,"img/planets/")]';
		var option = foxgame2_eval(path,document); 
		if (option.snapshotLength < 2)
			return;

		var prev = "";
		var next = "";
		var path2 = './parent::a[contains(@class,"moonlink")]/parent::*/a[contains(@class,"active")]'
		var found = false;		
		for (var i = 0; i < option.snapshotLength && !found; i++) {	
			if (option.snapshotItem(i).parentNode.getAttribute("href") == "#" ||
				foxgame2_evalnode(path2,document,option.snapshotItem(i)).snapshotLength != 0) {
				prev = option.snapshotItem((i-1 + option.snapshotLength) % option.snapshotLength).parentNode.getAttribute("href");
				next = option.snapshotItem((i+1 + option.snapshotLength) % option.snapshotLength).parentNode.getAttribute("href");
				found = true;
			}
		}
		if (prev == "" ||  next == "")
			return;
	
       //insert the "previous" button
       var input = document.createElement("a");
       input.innerHTML = '<img src="img/navigation/icon-min-small.gif" />';
       input.setAttribute("href",prev);        
       //input.setAttribute("onclick","eval(location='" + prev + "');");
       
            
        //insert the "next" button
        var input2 = document.createElement("a");
        input2.innerHTML = '<img src="img/navigation/icon-max-small.gif" />';
        input2.setAttribute("href",next);        
        var center = document.createElement("center");
        center.appendChild(input);
        center.appendChild(document.createTextNode(" "));
        center.appendChild(input2);
        var col = document.getElementById("countColonies");
        col.style.height = (col.offsetHeight + 20) + "px";
        col.appendChild(center);
        

   } catch (e) {
      foxgame2_debug(e);
   }
} 

//*****************************************************************************************
function foxgame2_addPhalanxRange(document) {

   	if (document && !foxgame2_isStationUrl(document.location.href)) return;
   	if (!foxgame2_GetBooleanPref("foxgamePhalanxRangeInfo",true)) return;

	foxgame2_addJavaScript(document,"chrome://foxgame2/content/resources/js/foxgame_addPhalanxRange.js");
}

//*****************************************************************************************
function foxgame2_addRankDiff(document) {  //Original code from Coup de Grace

   	if (document && !foxgame2_isStatUrl(document.location.href)) return;
	if (!foxgame2_GetBooleanPref("foxgameShowRankDiffs",true)) return;   	
	
	foxgame2_addJavaScript(document,"chrome://foxgame2/content/resources/js/anon_rankdiff.js");

}

//*****************************************************************************************
function foxgame2_reduceDescriptions(document) {

	var pages = new Array(
		new Array('resources',1),
		new Array('station',1),
		new Array('research',1),
		new Array('shipyard',1),
		new Array('defense',1),
		new Array('network',0),
		new Array('messages',0),
		new Array('fleet1',0),
		new Array('fleet3',0),
		new Array('fleet2',0),
		new Array('movement',0),
		new Array('overview',2));
	
   	if (!document) return;
	
	var type = -1;
	for (var i = 0; i < pages.length; i++)
		if (document.location.href.search(new RegExp("page="+pages[i][0],"i")) > -1) {
			type = pages[i][1];
			break;
		}
	if (type == -1)
		return;
	if ((!foxgame2_GetBooleanPref("foxgameHidePlanet",false) && type != 2) ||
		(!foxgame2_GetBooleanPref("foxgameHideOverviewPlanet",false) && type == 2))
		return;
		
   	try {
   		if (document.getElementById("planet") == null)
   			return;
   			
   		document.getElementById("planet").setAttribute("name",document.getElementById("planet").offsetHeight);
   		document.getElementById("planet").style.display="none";
   		
   		var path = '//div[@id="inhalt"]/div[starts-with(@class,"c-")]';
    	var obj = foxgame2_eval(path,document);
    	for (var i = 0; i < obj.snapshotLength; i++) 
    		obj.snapshotItem(i).style.display = "none";


		if (document.getElementById("slot01") != null &&
			document.getElementById("storage") != null) {
			var resources = document.getElementById("slot01");
			resources.parentNode.removeChild(resources);
			var li = document.createElement('li');
			li.appendChild(resources);
			li.style.left = "321px";
			li.style.width = "310px";
			
			document.getElementById("storage").appendChild(li);
		}		
		if (type == 1)
   			foxgame2_addJavaScript(document,"chrome://foxgame2/content/resources/js/hide_planet.js");
   } catch (e) {
      foxgame2_debug(e);
   }
}

//*****************************************************************************************
function foxgame2_showEnergyResources(document) {
   	if (!document) return;
	if (!foxgame2_isResourcesUrl(document.location.href))
		return;

	if (!foxgame2_GetBooleanPref("foxgameShowEnergyResources",false)) return;
			
   	try {
    	energyText = foxgame2_parseInt(document.getElementById("resources_energy").textContent.retrim());   
    	
        obj = foxgame2_eval('//select[starts-with(@name,"last")]',document);
		var initText = "", gid = 0, select;
		for (var i = 0; i < obj.snapshotLength; i++) {
			select = obj.snapshotItem(i); 
			gid = select.getAttribute("name").substring(4);
			var Current, Energy=0;
			var consume = true;
	        var level = select.parentNode.parentNode.firstChild.nextSibling.textContent.split(new RegExp('[\\s)]'));	        
	        level = foxgame2_parseInt(level[level.length-2]);
														
      		if(gid==1||gid==2)        // Metal Mine & Crystal Mine
      			Energy = Math.ceil(10*level*Math.pow(1.1,level));
      		if(gid==3) // Deuterium Synthesizer
      			Energy = Math.ceil(20*level*Math.pow(1.1,level));
      		else if(gid==4) { // Solar Plant
      			Energy = Math.floor(20*level*Math.pow(1.1,level));
      			consume = false
			} else if(gid==12){ // Fusion Reactor
      			consume = false			
				var ELevel = foxgame2_getEnergyLevel(document)
				if (ELevel != 0)
      				Energy = Math.floor(30*(level)*Math.pow(1.05+0.01*ELevel,(level)));
      			else
      				Energy = 0;
			}
							
			if (Energy == 0)
				continue;							
			
			var TotalEnergy, Current = foxgame2_parseInt(select.value);
			if (consume == false)
				TotalEnergy = energyText - Math.round((Energy / 100) * Current);
			else				
				TotalEnergy = energyText + Math.round((Energy / 100) * Current);
						
			for (var j = 0; j < select.options.length; j++) {
				var opt = select.options[j];
				if (consume == false)
					opt.innerHTML = opt.innerHTML + " " + Math.floor((Energy / 100) * opt.value) + " (" + (TotalEnergy + Math.round((Energy / 100) * opt.value)) +")";
				else					 
					opt.innerHTML = opt.innerHTML + " " + Math.ceil((Energy / 100) * opt.value) + " (" + (TotalEnergy - Math.round((Energy / 100) * opt.value)) +")";				
			}
		}
   	} catch (e) {
    	foxgame2_debug(e);
	}
}

//*****************************************************************************************
function foxgame2_processEnergyLevel(document) {
   	if (!document) return;
	if (!foxgame2_isResearchUrl(document.location.href))
		return;
	try {
		var path ='//div[@class="research113"]//span/span';
    	var obj = foxgame2_eval(path,document);
    	if (obj.snapshotLength == 0)
    		return;
		var level = obj.snapshotItem(0).textContent;
		level = level.retrim();
		level = level.split(" ");
    	level = level[level.length - 1];
		foxgame2_EnergyLevels[document.location.host] = level;    	
	} catch (e) {
    	foxgame2_debug(e);
	}    
}


//*****************************************************************************************
// Code from SA, Cezarica and my own
//*****************************************************************************************
function foxgame2_addEnergyStatus(document) {
	if (document && !foxgame2_isResourcesUrl(document.location.href)) return;
	if (!foxgame2_GetBooleanPref("foxgameShowEnergyInfo",true)) return;
	try {
   		var path = '//li[starts-with(@class,"energy tips")]';
    	var obj = foxgame2_eval(path,document);
    	if (obj.snapshotLength == 0)
    		return;    	
    	var energy = foxgame2_parseInt(obj.snapshotItem(0).textContent.retrim());  
    	var ELevel = foxgame2_getEnergyLevel(document);
    	foxgame2_addJavaScript(document,"chrome://foxgame2/content/resources/js/foxgame_addEnergyBuildings.js");		
    	foxgame2_loadJs(document,"foxgame_initEnergyBuildings ('"+energy+"',"+ELevel+")");	
    } catch (e) {
    	foxgame2_debug(e);
  	} 	  	
} 
//*****************************************************************************************
// Code from SA
//*****************************************************************************************	
function foxgame2_showProdPercent(document){
  	if (!document) return;  // no url check
	if (!foxgame2_GetBooleanPref("foxgameShowProdPercent",true)) return;

	foxgame2_addJavaScript(document,"chrome://foxgame2/content/resources/js/anon_prodpercent.js");
}

//*****************************************************************************************
function foxgame2_HLStats(document) {

	if (document && !foxgame2_isStatUrl(document.location.href)) return;
	
	try {
		foxgame2_listaUserHLs.load();
		foxgame2_loadJs(document,"foxgame2_listaUserHLs = eval("+foxgame2_JSON_toString(foxgame2_listaUserHLs.data,"")+");");
		foxgame2_addJavaScript(document,"chrome://foxgame2/content/resources/js/foxgame_FindUHL.js");		
		foxgame2_addJavaScript(document,"chrome://foxgame2/content/resources/js/foxgame_HL.js");			
	} catch (e) {
		foxgame2_debug(e);
	}
}

//*****************************************************************************************
function foxgame2_showEventList(document) {

	if (document && !foxgame2_isOverviewUrl(document.location.href)) return;
	if (!foxgame2_GetBooleanPref("foxgameShowEventList",true)) return;
	
	try {	
		foxgame2_addJavaScript(document,"chrome://foxgame2/content/resources/js/foxgame_showEventList.js");
		if (foxgame2_GetBooleanPref("foxgameEventListTime",true)) {
			foxgame2_addTimeJs(document,"foxgame2_eventInit",0);
		}			
	} catch (e) {
		foxgame2_debug(e);
	}
}

//*****************************************************************************************
function foxgame2_addSkin(document) {

	if (!document) return;
	if (!foxgame2_GetBooleanPref("foxgameUseSkin",false)) return;
	try {
		var skinUrl = foxgame2_PrefsBranch.getCharPref("foxgameSkin");
	} catch(e) { var skinUrl ="";}
	
	if (skinUrl == "")
		return;
	
	try {
		var head = document.getElementsByTagName("head")[0];    
  		var link = document.createElement("link");
  		link.setAttribute('rel','stylesheet');
  		link.setAttribute('type','text/css');
  		link.setAttribute('media','screen');
  		link.setAttribute('href',skinUrl);
  		head.appendChild(link);	
	} catch (e) {
		foxgame2_debug(e);
	}
}

