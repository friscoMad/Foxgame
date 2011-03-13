function foxgame2_parseInt(string) {
	if (!string)
		return 0;
	string = string.replace(/^\s*0(.+)/, "$1");
	string = string.replace(/[\.\s,]/g,'');
	return parseInt(string);
}

(function(){
	$("#detail").ajaxSuccess(function(evt, request, settings){
		if (settings.url.indexOf("page=station") == -1)
			return;
		try {
			var type = "0";
			var chunks = settings['data'].split("=");
			if (chunks.length != 2)
				return; 
			var gid   = foxgame2_parseInt(chunks[1]+"");// building id
			if (gid != 42) //Only for phalanx
				return;
			var level = 0;                                              // will be filled with level
			var result= null;                                           // result energy

			levelObj = $("a#details42 span.level"); // read level
			if (levelObj == null) return;			
			level = $.trim(levelObj.text()).split(' ');
			level = foxgame2_parseInt(level[level.length - 1]);
			if (level == 0)
				return;
			var range = Math.pow(level,2) - 1;
			var coords = $('a.active.planetlink span:last').text();
			coords = coords.match(/\[[0-9\:]+\]/g);
			var galaxy = coords[0].split(':')[0].substring(1);
			var system = coords[0].split(':')[1];

			var range1 = (range+foxgame2_parseInt(system));     
			var range2 = foxgame2_parseInt(system)-range;
			if (range1 > 499)
        		range1 = 499;
			if (range2 < 1)
        		range2 = 1;

			range1 = galaxy+":"+range1;
			range2 = galaxy+":"+range2;

			var li = document.createElement('li');
    		var font = document.createElement("font");
			font.setAttribute("color","orange");
    		font.setAttribute("size","smaller");
			var span = document.createElement("span");
    		span.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;" + range2+" - "+range1;
    		span.setAttribute("class","range");
    		font.appendChild(span);
    		li.appendChild(font);
    		var prevLi = $("#action ul li:first")[0];    		
			prevLi.parentNode.insertBefore(li, prevLi.nextSibling);
		} catch (e) {
			alert(e);
		}
	});
})();

