(function(){
	 $("#galaxyContent").ajaxSuccess(function(evt, request, settings){
	 	if (settings.url.indexOf("page=galaxyContent") == -1)
	 		return;
   		try {
	      	var path = '//li[@class="rank"]';
    	  	var obj = document.evaluate(path,document,null,	XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
			var li, rank;
      		for (var i = 0; i < obj.snapshotLength; i++) {
        		li = obj.snapshotItem(i);
        		rank = li.innerHTML;        	
	        	rank = rank.split(':');
    	    	rank = rank[rank.length-1];
        		rank = rank.replace(/^\s*|\s*$/g,"").replace(/<([^>]+)>/g,"");
        		if (rank == "")
        			continue;
				var href = $(li.parentNode).find('li:eq(3) a').attr('href');
        		path = './ancestor::div[starts-with(@id,"player")]/preceding-sibling::a';
	        	obj2 =document.evaluate(path,li,null,	XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null); 
    	    	if (obj2.snapshotLength > 0) {
    	    		  var a = obj2.snapshotItem(0);        	
        	          var font = document.createElement("font");
            	      font.setAttribute("color","orange");
                	  font.setAttribute("size","smaller");
					  var span = document.createElement("span");
    	              span.setAttribute("class","rank");
        	          ranknode = document.createTextNode(' @'+rank);
            	      font.appendChild(span);
                	  span.appendChild(ranknode);
	                  a.appendChild(font);
	                  a.setAttribute('href',href);
	                  $(a).cluetip("destroy");
    	        }
			}
		} catch (e) {
    		alert(e);
   		}
	});
})();
