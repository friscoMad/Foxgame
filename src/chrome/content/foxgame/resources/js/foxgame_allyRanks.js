(function(){
	 $("#galaxyContent").ajaxSuccess(function(evt, request, settings){
	 	if (settings.url.indexOf("page=galaxyContent") == -1)
	 		return;
	 
   		try {

	      	var path = '//li[@class="rank"]';
    	  	var obj = document.evaluate(path,document,null,	XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
			var li, rank, players, obj2;
      		for (var i = 0; i < obj.snapshotLength; i++) {
	        	li = obj.snapshotItem(i);
    	    	rank = li.innerHTML;        	
        		rank = rank.split(':');
        		rank = rank[rank.length-1];
	        	rank = rank.replace(/^\s*|\s*$/g,"").replace(/<([^>]+)>/g,"");

    	  		var path = './/li[@class="members"]';
      			obj2 = document.evaluate(path,li.parentNode,null,	XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
      			players = "";
				if (obj2.snapshotLength > 0) {
    	    		players = obj2.snapshotItem(0).innerHTML;        	
        			players = players.split(':');
        			players = players[players.length-1];
	        		players = players.replace(/^\s*|\s*$/g,"").replace(/<([^>]+)>/g,"");
    	    	}
        	
        		var statsHref = $(li.parentNode).find('li:eq(3) a').attr('href');
        		var allyHref = $(li.parentNode).find('li:eq(2) a').attr('href');        	
        		path = './ancestor::span[contains(@class,"allytagwrapper")]';
        		obj2 = document.evaluate(path,li,null,	XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
	        	if (obj2.snapshotLength > 0) {	        		        	
    	              var font = document.createElement("font");
        	          font.setAttribute("color","orange");
            	      font.setAttribute("size","smaller");
					  var span = document.createElement("span");
	                  span.setAttribute("class","rank");
    	              ranknode = document.createTextNode(' '+players+'@'+rank);
        	          font.appendChild(span);
            	      span.appendChild(ranknode);
            	      var link = document.createElement('a');
            	      link.setAttribute('href',statsHref);
            	      link.setAttribute('style','text-decoration:none');
            	      link.appendChild(font);
            	      span = obj2.snapshotItem(0);
                	  span.appendChild(link);
            	      link = document.createElement('a');
            	      link.setAttribute('href',allyHref);
            	      link.setAttribute('style','text-decoration:none');
            	      link.innerHTML = span.firstChild.textContent;
            	      span.removeChild(span.firstChild);
            	      span.insertBefore(link,span.firstChild);
            	      $(span).cluetip('destroy');                	  
	            }
			}
		} catch (e) {
    		alert(e);
   		}
	});
})();
