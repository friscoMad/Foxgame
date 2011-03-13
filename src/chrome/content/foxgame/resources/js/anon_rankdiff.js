// ==ANONUserScript==
// @file        anon_rankdiff.js
// @name        anon_rankdiff
// @description adds rank gain/loss info
// @author      frisco <frisco82@gmail.com>
// @include     http://*/game/*page=statistics&*
// ==/ANONUserScript==

(function(){
	 $("#statisticsContent").ajaxSuccess(function(evt, request, settings){
	   		try {
    			var path = '//span[@class="overmark" or @class="undermark"][@title!=""]';
      			var obj = document.evaluate(path,document,null,	XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
      			if (obj.snapshotLength == 0) return;
      			var obj2;
      			for (var i = 0; i < obj.snapshotLength; i++) {
        			obj2 = obj.snapshotItem(i);
            		obj2.innerHTML = obj2.title;
      			}
   			} catch (e) {
    			alert(e);
   			}
 	});
})();
