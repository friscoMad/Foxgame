(function(){
	 $("#galaxyContent").ajaxSuccess(function(evt, request, settings){
	 	 	if (settings.url.indexOf("page=galaxyContent") == -1)
	 		return;
		try {	
	    	var path = '//li[@class="debris-content"]/parent::*';
      		var obj = document.evaluate(path,document,null,	XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

			var total, li, ul, obj2, text, span, font, childs;
			for (var i = 0; i < obj.snapshotLength; i++) {
				ul = obj.snapshotItem(i); 
				obj2 =document.evaluate('./li[@class="debris-content"]',ul,null,	XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null); 
				total = new Array();
				for (var j = 0; j < obj2.snapshotLength; j++) {
						text = obj2.snapshotItem(j).innerHTML;
						text = text.split(':');
						total[j] = text[text.length - 1];
				}		
				obj2 = document.evaluate('./ancestor::tr[@class="row"]/td[@class="position"]',ul,null,	XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
				if (obj2.snapshotLength > 0)
					obj2 = document.evaluate('//a[@rel="#debris'+obj2.snapshotItem(0).innerHTML+'"]',document,null,	XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
					if (obj2.snapshotLength > 0) {
						obj2 = obj2.snapshotItem(0);
						span = document.createElement("span");
						span.setAttribute("class","debrisText");
						span.appendChild(document.createTextNode(total[0]));
						span.appendChild(document.createElement('br'));
						span.appendChild(document.createTextNode(total[1]));
						font = document.createElement("font");
						font.setAttribute("size","-2");
						font.appendChild(span);
						childs = obj2.childNodes;
						while(childs.length != 0)
							obj2.removeChild(obj2.firstChild);
						obj2.appendChild(font);
					}
			}
   		} catch (e) {
			alert(e);
   		}
	});
})();
