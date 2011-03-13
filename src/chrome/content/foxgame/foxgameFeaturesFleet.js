//*****************************************************************************************
function foxgame2_addTimeMovementsCounter(document, name) {
	try {	
		var script = foxgame2_getLastScript (document);
		if (script == null)
			return;

		var regexp = new RegExp('\"'+name+'(\\d+)\"\\),\\s*(\\d+)\\s*[\\),]',"gm");
		var res;

		while ((res = regexp.exec(script.innerHTML)) != null) {			
			var span = document.getElementById(name+res[1]);
			if (span == null)
				continue;
			var node = span.nextSibling.nextSibling;
			var date, date2 = foxgame2_newDate(document);
			var secs = foxgame2_parseInt(res[2]);			
			date = foxgame2_newDate(document);
			var lag = 0;
			//new Number(new Date()) - DOMEventUnloadTime;  // ms / comm+load lag			
			date.setTime(date.getTime() + (secs*1000) - lag);
			span.title = "|" + foxgame2_formatDate(date,date2);
			node.innerHTML = "<font color='lime'><span class='foxgame_time'>" +foxgame2_formatDate(date,date2)+"</span></font>";
			node.style.width = "100px";
		}
	} catch (e) {
		foxgame2_debug(e);
	}		
}

//*****************************************************************************************
function foxgame2_addMovementsTime(document) {

	if (document && !foxgame2_isMovementUrl(document.location.href)) return;
	if (!foxgame2_GetBooleanPref("foxgameMovementsTime",true)) return;
	try {

		foxgame2_addTimeMovementsCounter(document, "timerNext_");
		foxgame2_addTimeMovementsCounter(document, "timer_");
		var script = foxgame2_getLastScript (document);
		if (script == null)
			return;

		var regexp = new RegExp('\"route_(\\d+)\"\\),\\s*(\\d+),\\s*(\\d+),\\s*(\\d+)\\s*\\)',"gm");
		var res;
		var js = false;
		var i = 0;
		while ((res = regexp.exec(script.innerHTML)) != null) {
			if (res[4] == "1")
				continue;
			var div = document.getElementById("fleet"+res[1]);
			if (div == null)
				continue;
			var span = foxgame2_evalnode('.//span[starts-with(@class,"reversal")]',document,div);  			
			if (span.snapshotLength == 0)
				continue;
			var node = span.snapshotItem(0);

			var secsRem = foxgame2_parseInt(res[2])*1000;
			var secsTotal = foxgame2_parseInt(res[3])*1000;
			var lag = new Number(new Date()) - foxgame2_DOMEventUnloadTime;
			var serverTime = foxgame2_newDate2(1,foxgame2_getDomain(document));
			var initialTime = serverTime.getTime() - lag - (secsTotal - secsRem);
			var font = document.createElement("font");
			font.setAttribute("color","lime");
			font.innerHTML = "<span class='foxgame_time' id='time_"+i+"' name='"+initialTime+"'>-</span>";
			node.appendChild(font);
			node.title = "";
			node.className = "reversal";
			js = true;
			i++;
		}	
		if (js)
			foxgame2_addTimeJs(document,"foxgame2_returnTimeInit",250);
			
	} catch (e) {
		foxgame2_debug(e);
	}
};

//*****************************************************************************************
function foxgame2_addFlotaTime(document) {
	if (document && !(foxgame2_isFlota2Url(document.location.href)||foxgame2_isFlota3Url(document.location.href)) ) return;
	if (!foxgame2_GetBooleanPref("foxgameFlotaTime",true)) return;	
	try {
		function changeElement (document, id) {
			var node = document.getElementById(id);
			if (node == null)
				return;
			node = node.parentNode;				
			var font = document.createElement("font");
			font.setAttribute("color","lime");
			font.innerHTML = "<span class='foxgame_time' id='"+id+"'>-</span>";
			node.innerHTML = "";
			node.appendChild(font);
		}
		changeElement(document,"arrivalTime");
		changeElement(document,"returnTime");		
		foxgame2_addTimeJs(document,"foxgame2_timeInit",250);
	} catch (e) {
		foxgame2_debug(e);
	}
}

//*****************************************************************************************
function foxgame2_addTimeJs(document,func,time) {

		try { var mode = foxgame2_parseInt(foxgame2_PrefsBranch.getCharPref("foxgameTimeMode")); } catch (e) { 
			foxgame_debug(e);
			var mode = 1; }
		try { var delta = foxgame2_parseInt(foxgame2_PrefsBranch.getCharPref("foxgameDeltaTime-"+foxgame2_getDomain(document))); } catch (e) { var delta = 0; }
		try { if (mode == 3) {
				var diff = 0;
				try { diff = foxgame2_parseInt(foxgame2_PrefsBranch.getCharPref("foxgameTimeModeDiff")); } catch (e) { ; }
			} else
				diff = 0			
		} catch (e) { var diff = 0; }		
		foxgame2_addJavaScript(document,"chrome://foxgame2/content/resources/js/dateLibrary.js");
		foxgame2_addJavaScript(document,"chrome://foxgame2/content/resources/js/timeFunctions.js");
		if (time > 0)
			foxgame2_loadJs(document,"setTimeout( function() { "+func+"('"+mode+"','"+delta+"','"+diff+"','"+foxgame2_getFormatH()+"','"+foxgame2_getFormatD()+"'); } , "+time+");");
		else			
			foxgame2_loadJs(document,func+"('"+mode+"','"+delta+"','"+diff+"','"+foxgame2_getFormatH()+"','"+foxgame2_getFormatD()+"');");		
}

//*****************************************************************************************
function foxgame2_selectMission(document) {

	function foxgame2_getPref(pref) {
		try {
			return foxgame2_PrefsBranch.getCharPref(pref)
		} catch(e) {
			return "-1";
		}
	}
	if (document && !foxgame2_isFlota3Url(document.location.href)) return;

	var pref = foxgame2_getPref("foxgameMissionPreference0");
	if (pref == "-1") return;

	try {
		if (document.getElementsByName('mission')[0].value != 0) return;
		var i = 0, path, obj;		
		while(pref != "-1") {
			path = '//li[@id="button'+pref+'"][@class="on"]/a';
      		obj = foxgame2_eval(path,document);
			if (obj.snapshotLength != 0) {
				obj = obj.snapshotItem(0);
  				var evt = document.createEvent("MouseEvents");
  				evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
  				obj.dispatchEvent(evt);
				return;
			}
			i++;
			pref = foxgame2_getPref("foxgameMissionPreference"+i);
		}
		return;
	} catch(e) {
		foxgame2_debug(e);
	}
}

//*****************************************************************************************
function foxgame2_pasteCoords(document) {
	if (document && document != null && !foxgame2_isFlota2Url(document.location.href)) return;

	if (!foxgame2_GetBooleanPref("foxgameAutoCopy",false)) return;
	if (!foxgame2_GetBooleanPref("foxgameStoreCoordFlag",false)) return;

	try {
		var str = foxgame2_PrefsBranch.getCharPref("foxgameStoreCoord");
	} catch(e) { return;}

	try {
		var str2 = str.split(':');
		foxgame2_Galaxy = str2[0];
		foxgame2_System = str2[1];
		foxgame2_Planet = str2[2];
		
		if (document.getElementById("galaxy").value == foxgame2_getVar(document, "currentGalaxy") && document.getElementById("system").value == foxgame2_getVar(document, "currentSystem") && document.getElementById("position").value == foxgame2_getVar(document, "currentPosition")) {
			document.getElementById("galaxy").value = foxgame2_Galaxy;
			document.getElementById("system").value = foxgame2_System;
			document.getElementById("position").value = foxgame2_Planet;
		}		
		var select = document.getElementById("slbox");
		if (select == null)
			return; 
		var option = document.createElement("option");
		option.innerHTML = str;
		var value = str.replace(/:/g,'#')+"#1#";
		option.setAttribute("value",value);
		var found = false;
		for (var i = 0; i < select.options.length && !found; i++) {
			if (select.options[i].value.substr(0,value.length) == value)
				found = true;
		}
		if (!found) {
			select.appendChild(option);
			select.selectedIndex = option.index;
		}
	} catch(e) {
		foxgame2_debug(e);
	}
}

//*****************************************************************************************
// Code from SA, Cezarica and my own
//*****************************************************************************************
function foxgame2_addMaxResFloTranspButton(document) {
	if (!document || !foxgame2_isFlotaUrl(document.location.href)) return;
	if (!foxgame2_GetBooleanPref("foxgameShowCargoNeeded",true)) return;

  	try {
    	// get metal, crystal & deuterium
    	var obj  = foxgame2_eval('//span[starts-with(@id,"resources_")]',document);
    	if (obj.snapshotLength < 3)
    		return;
    	var sum = foxgame2_parseInt(obj.snapshotItem(0).textContent.replace(/[\D]/gi,''))
             + foxgame2_parseInt(obj.snapshotItem(1).textContent.replace(/[\D]/gi,''))
             + foxgame2_parseInt(obj.snapshotItem(2).textContent.replace(/[\D]/gi,''));

    	// number of ships
    	var num_ship = new Array();
//    	num_ship[204] = Math.ceil(sum/50); // CL
    	num_ship[202] = Math.ceil(sum/5000); // small cargo
    	num_ship[203] = Math.ceil(sum/25000); // large cargo
    	num_ship[208] = Math.ceil(sum/7500); // colony ship
    	num_ship[209] = Math.ceil(sum/20000); // recycler
    	num_ship[214] = Math.ceil(sum/1000000); // deathstar

    	for (var shipid in num_ship) {
      		var ship = document.getElementById("button"+shipid);
      		if (ship == null)
      			continue;
      		if (ship.className == "on") {
      			var red = false;
      			
      			var obj2 = foxgame2_evalnode('.//span[@class="level"]/span[@class="textlabel"]/following-sibling::text()',document,ship)
      			var max_ships = foxgame2_parseInt(obj2.snapshotItem(0).textContent.retrim());   			
   				if (max_ships < num_ship[shipid])
   					red = true;   					
   					
        		var ship_a = document.createElement("a");
        		ship_a.setAttribute("href","javascript:;");
        		ship_a.setAttribute("onClick","document.shipsChosen.am"+shipid+".value="+num_ship[shipid]+";checkIntInput('ship_"+shipid+"', 0, "+max_ships+"); checkShips('shipsChosen');");
        		
        		if (foxgame2_GetBooleanPref("foxgameShowFleetCargo",true))
        			ship_a.setAttribute("onClick",ship_a.getAttribute("onClick") + "ShowCapacity();");
        			
        		if (red)
        			ship_a.innerHTML = "<font color='red'>("+num_ship[shipid]+")</font>";
        		else
        			ship_a.innerHTML = "("+num_ship[shipid]+")";
        			
				var span2 = document.createElement("span");
				span2.setAttribute("class", "time");
				span2.setAttribute("id", "MaxRes");
				span2.style.height="12px";
				span2.style.width ="80px";
				span2.appendChild(ship_a);
				ship_a.style.backgroundImage = "url()";   
      			var obj3 = foxgame2_evalnode('.//div[@class="buildingimg"]',document,ship)
				if (obj3.snapshotLength > 0)
					obj3.snapshotItem(0).appendChild(span2);
      		}
    	}
    } catch (e) {
    	foxgame2_debug(e);
  	}
}  

//*****************************************************************************************
// Code from SA
//*****************************************************************************************	
function foxgame2_showFleetCargo(document){
  	if (!document || !foxgame2_isFlotaUrl(document.location.href)) return;

	if (!foxgame2_GetBooleanPref("foxgameShowFleetCargo",true)) return;

	foxgame2_addJavaScript(document,"chrome://foxgame2/content/resources/js/anon_fleet1.js");
}	

//*****************************************************************************************
function foxgame2_showOverviewInfo(document) {

	if (!document) return;
	if (!document.location || !foxgame2_isMovementUrl(document.location.href)) return;
	
	if (!foxgame2_GetBooleanPref("foxgameFleetOverviewInfo",true)) return;
	
	try {
	
		var path = '//div[starts-with(@id,"details")]';
		var path2 = './/table//tr[position()>2]/th/parent::tr/following-sibling::tr';
		var paths = new Array ( './/span[@class="originData"]/span/a',
							    './/span[@class="destinationData"]/span/a',
								'.//span[starts-with(@class,"mission")]');
		var divs = foxgame2_eval(path,document);
		if (divs.snapshotLength == 0)
			return;
		var flights = new Array();
		var temp, exit;			
		for (var i = 0; i < divs.snapshotLength; i++) {
			var div = divs.snapshotItem(i);
			var trs = foxgame2_evalnode(path2,document,div);
			if (trs.snapshotLength != 3)
				continue;
			var metal 		= foxgame2_parseInt(trs.snapshotItem(0).cells[1].textContent);
			var cristal 	= foxgame2_parseInt(trs.snapshotItem(1).cells[1].textContent);
			var deuterio	= foxgame2_parseInt(trs.snapshotItem(2).cells[1].textContent);
			if (metal + cristal + deuterio == 0)
				continue; 
			var id 			= div.id.substring(7);
			var div2 		= document.getElementById("fleet"+id);
			var ret 		= false;
			temp = foxgame2_evalnode('.//span[starts-with(@class,"nextMission")]',document,div2);
			if (temp.snapshotLength == 0)
				ret = true;
			var index = flights.length;
			flights[index] = new Array(metal, cristal, deuterio, "", "", "", ret);
			exit = false;
			for (var j = 0; j < 3 && !exit; j++) {
				temp = foxgame2_evalnode(paths[j],document,div2);
				if (temp.snapshotLength == 0) {
					exit = true;
					continue;
				}					
				flights[index][3+j] = temp.snapshotItem(0).textContent;	
			}
			if (exit) {
				flights[index] = null;
				continue;
			}						
		} 
		if (flights.length == 0)
			return;
/*			
		for (var i = 0; i < flights.length; i++)
			if (flights[i] != null)
				alert("Metal: "+flights[i][0]+" Cristal: "+flights[i][1]+" Deuterio: "+flights[i][2]+
				" Origen: "+flights[i][3]+ " Destino: "+flights[i][4]+ " Mision: "+flights[i][5]+
				" Return: "+flights[i][6]);
*/
		//Sort by planet && mission		
		
		var planets = new Array();
		var missions = new Array();
		metalT = 0;
		cristalT = 0;
		deuterioT = 0;
		for (var i = 0; i < flights.length; i++) {	
		
			var foundP = false;
			for (var j = 0; j < planets.length && !foundP; j++)
			 	if ((flights[i][4] == planets[j][0] && !flights[i][6]) ||
			 		(flights[i][3] == planets[j][0] && flights[i][6])) {
			 		planets[j][1] += flights[i][0];
			 		planets[j][2] += flights[i][1];
			 		planets[j][3] += flights[i][2];
			 		foundP = true;
			 	}
			 if (!foundP)
			 	planets[planets.length] = new Array (((flights[i][6])?flights[i][3]:flights[i][4]), flights[i][0], flights[i][1], flights[i][2]);
			var foundM = false;
			for (var j = 0; j < missions.length && !foundM; j++)
			 	if (flights[i][5] == missions[j][0]) {
			 		missions[j][1] += flights[i][0];
			 		missions[j][2] += flights[i][1];
			 		missions[j][3] += flights[i][2];
			 		foundM = true;
			 	}
			 if (!foundM) {
			 	missions[missions.length] = new Array (flights[i][5], flights[i][0], flights[i][1], flights[i][2]);
			 }
			 metalT 	+= flights[i][0];
			 cristalT 	+= flights[i][1];
			 deuterioT 	+= flights[i][2];	
		}
		
		var code = '<div class="headerRS"></div><div class="mainRS">'; 
		code += '<table style="width:600px;margin:10px auto 0 auto;border-collapse:collapse;clear:both;">';
		var alt = 0;
		code += '<tr class="alt"><td class="label"><em>'+foxgame2_messages.GetStringFromName("foxgame.inner.Planet")+'</em></td><td><img src="img/layout/ressourcen_metall.gif"/></td><td class="c"><img src="img/layout/ressourcen_kristal.gif"/></td><td><img src="img/layout/ressourcen_deuterium.gif"/></td></tr>';
		var currentPlanet = foxgame2_getCurrentCoords(document);		
		for (var i = 0; i < planets.length; i++) 
			if (currentPlanet != planets[i][0])
				code += '<tr class="'+(((1+i)%2!=0)?'':'alt')+'"><td class="label">' + planets[i][0] + '</td><td>' + foxgame2_NumberFormat(planets[i][1]) + '</td><td>' + foxgame2_NumberFormat(planets[i][2]) + '</td><td>' + foxgame2_NumberFormat(planets[i][3]) + '</td></tr>';
			else {
				var cMetal = foxgame2_parseInt(document.getElementById("resources_metal").textContent);
				var cCristal = foxgame2_parseInt(document.getElementById("resources_crystal").textContent);
				var cDeut = foxgame2_parseInt(document.getElementById("resources_deuterium").textContent);
				code += '<tr class="'+(((1+i)%2!=0)?'':'alt')+'"><td class="label">' + planets[i][0] + '</td><td>' + foxgame2_NumberFormat(planets[i][1]) + ' ('+ foxgame2_NumberFormat(planets[i][1]+cMetal) +')</td><td>' + foxgame2_NumberFormat(planets[i][2]) + ' ('+ foxgame2_NumberFormat(planets[i][2]+cCristal) +')</td><td>' + foxgame2_NumberFormat(planets[i][3]) + ' ('+ foxgame2_NumberFormat(planets[i][3]+cDeut) +')</td></tr>';
			}
		code += '<tr class="'+(((planets.length+1)%2!=0)?'':'alt')+'"><td class="label"><em>'+foxgame2_messages.GetStringFromName("foxgame.inner.Mission")+'</em></td><td><img src="img/layout/ressourcen_metall.gif"/></td><td class="c"><img src="img/layout/ressourcen_kristal.gif"/></td><td><img src="img/layout/ressourcen_deuterium.gif"/></td></tr>';
		for (var i = 0; i < missions.length; i++) 
			code += '<tr class="'+(((planets.length+2+i)%2!=0)?'':'alt')+'"><td class="label">' + missions[i][0] + '</td><td>' + foxgame2_NumberFormat(missions[i][1]) + '</td><td>' + foxgame2_NumberFormat(missions[i][2]) + '</td><td>' + foxgame2_NumberFormat(missions[i][3]) + '</td></tr>';
		code += '<tr class="summary '+(((planets.length + missions.length + 2)%2!=0)?'':'alt')+'"><td class="label"><em>'+foxgame2_messages.GetStringFromName("foxgame.inner.Total")+'</em></td><td>' + foxgame2_NumberFormat(metalT) + '</td><td>' + foxgame2_NumberFormat(cristalT) + '</td><td>' + foxgame2_NumberFormat(deuterioT) + '</td></tr></table>';
		code += '</div><div class="footerRS"></div>';	
		var div = document.createElement('div');
		div.setAttribute("class","contentRS");
		div.setAttribute("id","resourceSettings"); 
		div.innerHTML = code;
		document.getElementById("inhalt").appendChild(div); 

	} catch(e) { 
		foxgame2_debug(e);
	}	
}

//*****************************************************************************************	
function foxgame2_changePlanetList(document){
  	if (!document || !foxgame2_isFlota2Url(document.location.href)) return;

	if (!foxgame2_GetBooleanPref("foxgameChangePlanetList",true)) return;
	
	try {
  		var select = document.getElementById("slbox");
  		if (select == null)
  			return;	
  		var head = document.getElementsByTagName("head")[0];    
  		var script = document.createElement("link");
  		script.type = "text/css";
  		script.rel = "stylesheet";
  		script.media = "screen";
  		script.href = "chrome://foxgame2/content/resources/css/dd.css";
  		head.appendChild(script);
		selected = document.getElementById("galaxy").value;
		selected += "#" + document.getElementById("system").value;
		selected += "#" + document.getElementById("position").value;
		selected += "#" + document.getElementById("type").value;
		
  		select.className = "";
  		select.setAttribute("style","width:146px");
  		select.setAttribute("size","0");
  		var planets = document.createElement("optgroup");
  		var moons = document.createElement("optgroup");
  		var i = 0;
  		var removed;
  		var other = null;
  		while (i < select.options.length) {
  			var opt = select.options[i];
  			var value = opt.value.split("#"); 
  			if (value.length > 4) {
  				if (value[3] == 3) {
  					opt.setAttribute("title", "chrome://foxgame2/content/resources/images/moon.png");
  					moons.appendChild(select.removeChild(opt)); 					
  				} else if (value[4] != ""){
  					opt.setAttribute("title", "chrome://foxgame2/content/resources/images/planet.png");
  					planets.appendChild(select.removeChild(opt));
   				} else {
   					other = opt;
   					i++;
   					opt.setAttribute("title", "chrome://foxgame2/content/resources/images/planet.png");
   				}
  			} else {
  				removed = select.removeChild(opt)
				//i++;
  			}
  		}
  		if (planets.childElementCount > 0) {
  			planets.setAttribute("label",document.getElementById("pbutton").textContent);
  			select.appendChild(planets);
  		}
  		if (moons.childElementCount > 0) {
  			moons.setAttribute("label",document.getElementById("mbutton").textContent);
  			select.appendChild(moons);
  		}
  		var found = false;
  		for (i = 0; i < select.options.length && !found; i++) { 
  			if (select.options[i].value.substr(0,selected.length) == selected) {
  				select.selectedIndex = i;
  				found = true;
  			}
  		}
  		if (!found) {
  			select.appendChild(removed);
  			select.selectedIndex = removed.index;
  		}
		foxgame2_addJavaScript(document,"chrome://foxgame2/content/resources/js/jquery.dd.js");		
		foxgame2_loadJs(document,"setTimeout( function() { $('#slbox').msDropDown({style:'width:144px',rowHeight:20}); } , 250);");
	} catch(e) { 
		foxgame2_debug(e);
	}
}