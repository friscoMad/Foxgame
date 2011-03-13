function foxgame_initDebrisHL (color, min){
	 $("#galaxyContent").ajaxSuccess(function(evt, request, settings){
	 	 	if (settings.url.indexOf("page=galaxyContent") == -1)
	 			return;
		try {	
	    	var path = '//li[@class="debris-content"]/parent::*';
      		var obj =  document.evaluate(path,document,null,	XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

			min = parseInt(min);

			var total, li, ul, obj2, text;
			for (var i = 0; i < obj.snapshotLength; i++) {
				ul = obj.snapshotItem(i); 
				obj2 = document.evaluate('./li[@class="debris-content"]',ul,null,	XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
				total = 0;
				for (var j = 0; j < obj2.snapshotLength; j++) {
						text = obj2.snapshotItem(j).innerHTML;
						text = text.split(':');
						total += fg_parseInt(text[text.length - 1]);
				}		
				if (total >= min) {
					obj2 =document.evaluate('./ancestor::tr[@class="row"]/td[@class="position"]',ul,null,	XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null); 
					if (obj2.snapshotLength > 0) {
						path = '//a[@rel="#debris'+obj2.snapshotItem(0).innerHTML+'"]/parent::*'; 
						obj2 =document.evaluate(path,document,null,	XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null); 
						if (obj2.snapshotLength > 0)
							obj2.snapshotItem(0).setAttribute("style", "background-color : "+color+"; background-image : none;");
							
					}
				}
			}
		} catch (e) {
			alert(e);
		}
	});
};

function fg_parseInt(string) {
	if (!string)
		return 0;
	string = string.replace(/^\s*0(.+)/, "$1");
	string = string.replace(/[\.\s,]/g,'');
	return parseInt(string);
}
