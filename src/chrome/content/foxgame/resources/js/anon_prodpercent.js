// ==ANONUserScript==
// @file        anon_prodpercent.js
// @name        anon_prodpercent
// @description adds graphic display of building / research progres (Real-Time)
// @author      SolarAngel (SA) <furry[you know what comes here]tesla.rcub.bg.ac.yu>
// @include     http://*/game/index.php?page=b_building&*
// @include     http://*/game/index.php?page=buildings&session=*&mode=Forschung
// ==/ANONUserScript==

(function(){
	try {
		if (typeof $ == "undefined" || $ == null || !$)
			return;
		if($("div.pusher span.time") == null || $("div.pusher span.time").length == 0)
			return;
		var parent = $("div.pusher span.time").parent();
		if (parent.length == 0) return;
		if (parent.parent().parent().get(0).clientHeight == 100)
			parent.append("<span class='time' id='prodPercent' style='top:60px'></span>");
		else
			parent.append("<span class='time' id='prodPercent2' style='top:45px'></span>");	
    	setTimeout(prodPercentUpdate,999);
	} catch (e) { alert(e); }    
})();
function prodPercentUpdate(){
	try {
		var span = document.getElementById('prodPercent');
		if (span != null)	
			span.innerHTML = span.parentNode.parentNode.offsetHeight + "%";
		else {
			span = document.getElementById('prodPercent2');
			if (span != null)	
				span.innerHTML = (span.parentNode.parentNode.offsetHeight * 100 / 80) + "%";
		}
		setTimeout(prodPercentUpdate,999);
	} catch (e) { alert(e); }	
}
