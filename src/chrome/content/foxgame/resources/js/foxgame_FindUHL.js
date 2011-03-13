function foxgame2_FindUHL(document, path, type) {
	try {
		if (foxgame2_listaUserHLs.length == 0)
			return;
			
		var ele, found, link, text, pos;
		var Links = document.evaluate(path,document,null,	XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
		if (Links.snapshotLength != 0) {
			for (var j = 0; j < Links.snapshotLength; j++) {				
				link = Links.snapshotItem(j);
				found = false;
				for (var i = 0; i < foxgame2_listaUserHLs.length && !found ; i++){
					ele = foxgame2_listaUserHLs[i];	
					if (ele.type != type)
						continue;
					text = link.textContent.trim();
					if (text.match(new RegExp('^[\\s\\r\\n]*('+ele.name+')|(\\['+ele.name+'\\])[\\s\\r\\n]*$'))) {						
						link = link.parentNode;
						link.setAttribute("style", "background-color : "+ele.color+"; background-image : none;");
						found = true;
					}
				}
			}
		}
	} catch (e) {
		alert(e);
	}						
}