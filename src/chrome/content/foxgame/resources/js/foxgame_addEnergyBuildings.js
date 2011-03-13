function foxgame_initEnergyBuildings (energy2,ELevel2){
	$("#detail").ajaxSuccess(function(evt, request, settings){
		if (settings.url.indexOf("page=resources") == -1)
			return;
		try {
			var type = "0";
			energy = fg_parseInt(energy2+"");
			var chunks = settings['data'].split("=");
			if (chunks.length != 2)
				return; 
			var gid   = fg_parseInt(chunks[1]+"");// building id
			var level = 0;                                              // will be filled with level
			var result= null;                                           // result energy

			levelObj = $("li .supply"+gid+" span.level"); // read level
			if (levelObj == null) return;			
			level = $.trim(levelObj.text()).split(' ');
			level = fg_parseInt(level[level.length - 1]);
			
			if(gid==1||gid==2)        // Metal Mine & Crystal Mine
				result= - (Math.ceil(10*(level+1)*Math.pow(1.1,(level+1)))- Math.ceil(10*level*Math.pow(1.1,level)));

			if(gid==3) // Deuterium Synthesizer
				result= - (Math.ceil(20*(level+1)*Math.pow(1.1,(level+1)))- Math.ceil(20*level*Math.pow(1.1,level)));

			if(gid==4) // Solar Plant
				result= Math.floor(20*(level+1)*Math.pow(1.1,(level+1)))- Math.floor(20*level*Math.pow(1.1,level));

			if(gid==12){ 
				var ELevel = fg_parseInt(ELevel2+"");
				if (ELevel != 0)
					result= Math.floor(30*(level+1)*Math.pow(1.05+0.01*ELevel,(level+1)))- Math.floor(30*(level)*Math.pow(1.05+0.01*ELevel,(level)));
				else
					result = null;
			}
			
			if(result != null) { 
				var ending = energy + result;
				var li = document.createElement("li");
				li.setAttribute("class","metal tips3");
				var img = document.createElement("img");
				img.setAttribute("src","img/layout/ressourcen_energie.gif");
				li.appendChild(img);
				li.appendChild(document.createElement("br"));        	
				li.innerHTML += '<font color="'
					+(result>0?'lime':'red')+'">'+(result>0?'+':'')+number_format(result)+'</font>(<b><font color="'
					+(ending>0?'lime':'red')+'">'+(ending>0?'+':'')+number_format(ending)+'</font></b>)';
				var ulObj = $('div#costswrapper ul');
				if (ulObj.length == 0) return;
				ulObj[0].appendChild(li);
			}
		} catch (e) {
			alert(e);
		}
	});
}

function fg_parseInt(string) {
	if (!string)
		return 0;
	string = string.replace(/^\s*0(.+)/, "$1");
	string = string.replace(/[\.\s,]/g,'');
	return parseInt(string);
}

