// ==UserScript==
// @name           Uni4 Fix
// @namespace      http://mywebsite.com/myscripts
// @description    Solucion al problema del uni4
// @include        http://*ogame159.de/game/galaxy.php?*
// ==/UserScript==

(function() {

  var head = document.getElementsByTagName("head")[0];
  var script = document.createElement("script");
  script.setAttribute("language", "JavaScript");
  script.setAttribute("src", "http://foxgame.mozdev.org/wz_tooltip.js");
  head.appendChild(script);
	
})();
