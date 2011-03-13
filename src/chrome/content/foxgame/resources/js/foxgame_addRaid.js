function foxgame_initRaid (size,totalString, raidString){
	 $("#messageContent").ajaxSuccess(function(evt, request, settings){
	 	if (settings.url.indexOf("page=messages") == -1)
	 		return;
	 	try {
	 		var tr2 = $(".areadetail");	
	 		if (tr2.length === 0)
	 			return;
	 		for (var j = 0; j < tr2.length; j++) {	 			
	 			var td = $(tr2[j]).find("td.item + td");

	 			var res, text, total, total2;
	 			total = 0;
	 			total2 = new Array();
	 			for (var i = 0; i < 3; i++) {	 				
	 				res = fg_parseInt(td[i].textContent);
	 				total += res;
	 				total2[i] = res;
	 			}
	 			td = td[0];
	 			total2 = fg_calcMinFleet(total2[0]/2, total2[1]/2, total2[2]/2, size); 
	 			var tr = td.parentNode.cloneNode(true);
	 			tr.cells[0].innerHTML = totalString;
	 			tr.cells[1].innerHTML = number_format(total);
	 			tr.cells[2].innerHTML = raidString;
	 			tr.cells[3].innerHTML = number_format(total2);
	 			td.parentNode.parentNode.appendChild(tr);
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

function fg_calcMinFleet(metal, crystal, deut, size) {
	
	var  total2 = (metal + crystal + deut)/size;
	if (Math.round(total2) != total2)
		total2 = Math.round(total2) + 1;
	var ok = false;
	do {
		var auxMetal = metal;
		var auxCrystal = crystal;
		var totalSize = total2 * size;
		var maxMetal = Math.floor(totalSize/3);
		if (maxMetal > auxMetal) {
			totalSize = totalSize - auxMetal;
			auxMetal = 0;
		} else {
			totalSize = totalSize - maxMetal;
			auxMetal = auxMetal - maxMetal;
		}			
		var maxCrystal = Math.floor(totalSize/2);
		if (maxCrystal > auxCrystal) {
			totalSize = totalSize - auxCrystal;
			auxCrystal = 0;
		} else {
			totalSize = totalSize - maxCrystal;
			auxCrystal = auxCrystal - maxCrystal;
		}
		if (totalSize > deut) {
			totalSize = totalSize - deut;			
		} else {
			total2++; //Not enough space for all deut.
			continue;
		}
		var maxMetal = Math.floor(totalSize/2);
		if (maxMetal > auxMetal) {
			totalSize = totalSize - auxMetal;
			auxMetal = 0;
		} else {
			total2++; //Not enough space for all metal.
			continue;
		}			
		if (totalSize > auxCrystal) {
			totalSize = totalSize - auxCrystal;
			auxCrystal = 0;
			ok = true;
		} else {
			total2++; //Not enough space for all crystal.
			continue;
		}		
	} while (!ok);
	return total2;
}
