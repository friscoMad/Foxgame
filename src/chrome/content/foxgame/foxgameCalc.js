function update_type() {
	var deut, metal, crystal;
	metal = document.getElementById("fgMetal");
	crystal = document.getElementById("fgCrystal");
	deut = document.getElementById("fgDeut");
	Mmetal = document.getElementById("fgMMetal");
	Mcrystal = document.getElementById("fgMCrystal");
	Mdeut = document.getElementById("fgMDeut");
	
	metal.disabled = false;
	crystal.disabled = false;
	deut.disabled = false;
	document.getElementById("lMix").hidden = false;
	document.getElementById("Mix").hidden = false;	
	Mmetal.disabled = false;
	Mcrystal.disabled = false;
	Mdeut.disabled = false;
	
	var disable = true;
	if (document.getElementById("fgSelectType").value == "Sell")
		disable = false;
	else {
		document.getElementById("lMix").hidden = true;
		document.getElementById("Mix").hidden = true;
	}
	switch (document.getElementById("fgSelectRes").value) {
		case "met":
			metal.disabled = disable;
			crystal.disabled = !disable;
			deut.disabled = !disable;
			Mmetal.disabled = true;
			Mcrystal.disabled = false;
			Mdeut.disabled = false;
			break;
		case "crys":
			metal.disabled = !disable;
			crystal.disabled = disable;
			deut.disabled = !disable;
			Mmetal.disabled = false;
			Mcrystal.disabled = true;
			Mdeut.disabled = false;
			break;
		case "deut":
			metal.disabled = !disable;
			crystal.disabled = !disable;
			deut.disabled = disable;	
			Mmetal.disabled = false;
			Mcrystal.disabled = false;
			Mdeut.disabled = true;
	}
	fixMixAll();
	update_calc();
}

function update_calc() {
	var Rmetal, Rcrystal, Rdeut, Mmetal, Mcrystal, Mdeut, crystal, deut, metal;
	Rmetal = parseFloat(document.getElementById("fgRMetal").value);
	Rcrystal = parseFloat(document.getElementById("fgRCrystal").value);
	Rdeut = parseFloat(document.getElementById("fgRDeut").value);
	Mmetal = parseFloat(document.getElementById("fgMMetal").value);
	Mcrystal = parseFloat(document.getElementById("fgMCrystal").value);
	Mdeut = parseFloat(document.getElementById("fgMDeut").value);
	metal = document.getElementById("fgMetal");
	crystal = document.getElementById("fgCrystal");
	deut = document.getElementById("fgDeut");
	
	var total;
	if (document.getElementById("fgSelectType").value != "Sell") {
		switch (document.getElementById("fgSelectRes").value) {
			case "met":
				total = (parseInt(crystal.value) / Rcrystal) + (parseInt(deut.value) / Rdeut);
				total = total * Rmetal;
				metal.value = Math.floor(total);
				break;
			case "crys":
				total = (parseInt(metal.value) / Rmetal) + (parseInt(deut.value) / Rdeut);
				total = total * Rcrystal;
				crystal.value = Math.floor(total);
				break;
			case "deut":
				total = (parseInt(crystal.value) / Rcrystal ) + (parseInt(metal.value) / Rmetal);
				total = total * Rdeut;
				deut.value = Math.floor(total);
		}
	} else {
		switch (document.getElementById("fgSelectRes").value) {
			case "met":
				crystal.value = Math.ceil(parseInt(metal.value) * Mcrystal / 100 * Rcrystal / Rmetal );
				deut.value = Math.ceil(parseInt(metal.value) * Mdeut / 100 * Rdeut / Rmetal);
				break;
			case "crys":
				metal.value = Math.ceil(parseInt(crystal.value) * Mmetal / 100 * Rmetal / Rcrystal);
				deut.value = Math.ceil(parseInt(crystal.value) * Mdeut / 100 * Rdeut / Rcrystal);
				break;
			case "deut":
				crystal.value = Math.ceil(parseInt(deut.value) * Mcrystal / 100 * Rcrystal / Rdeut);
				metal.value = Math.ceil(parseInt(deut.value) * Mmetal / 100 * Rmetal / Rdeut);
		}
	}
}

function init() {
	document.getElementById("fgMetal").value = 0;
	document.getElementById("fgCrystal").value = 0;
	document.getElementById("fgDeut").value = 0;
	document.getElementById("fgRMetal").value = 3;
	document.getElementById("fgRCrystal").value = 2;
	document.getElementById("fgRDeut").value = 1;
	document.getElementById("fgMMetal").value = 0;
	document.getElementById("fgMCrystal").value = 50;
	document.getElementById("fgMDeut").value = 50;
	load();
	update_type();
	fixMixAll();
}

function save() {
	var strObject = "[";
	strObject += "\"" + document.getElementById("fgMetal").value + "\",";
	strObject += "\"" + document.getElementById("fgCrystal").value + "\",";
	strObject += "\"" + document.getElementById("fgDeut").value + "\",";		
	strObject += "\"" + document.getElementById("fgRMetal").value + "\",";
	strObject += "\"" + document.getElementById("fgRCrystal").value + "\",";
	strObject += "\"" + document.getElementById("fgRDeut").value + "\",";
	strObject += "\"" + document.getElementById("fgMMetal").value + "\",";
	strObject += "\"" + document.getElementById("fgMCrystal").value + "\",";
	strObject += "\"" + document.getElementById("fgMDeut").value + "\",";
	strObject += "\"" + document.getElementById("fgSelectType").value + "\",";
	strObject += "\"" + document.getElementById("fgSelectRes").value + "\"";
	strObject += "]";
	foxgame2_PrefsBranch.setCharPref("calcData",strObject);
}

function load() {
	var strObject
	try {
		strObject = foxgame2_PrefsBranch.getCharPref("calcData");
	} catch(e) { return;}
	try {
		Components.utils.import("resource://gre/modules/JSON.jsm");
	} catch (e) {}  
	var object = JSON.fromString(strObject);
	document.getElementById("fgMetal").value = object[0];
	document.getElementById("fgCrystal").value = object[1];
	document.getElementById("fgDeut").value = object[2];
	document.getElementById("fgRMetal").value = object[3];
	document.getElementById("fgRCrystal").value = object[4];
	document.getElementById("fgRDeut").value = object[5];
	document.getElementById("fgMMetal").value = object[6];
	document.getElementById("fgMCrystal").value = object[7];
	document.getElementById("fgMDeut").value = object[8];	
	document.getElementById("fgSelectType").value = object[9];
	document.getElementById("fgSelectRes").value = object[10];
} 

function fixMix(res) {
	if (document.getElementById("fgSelectType").value != "Sell")
		return;

	Mmetal = parseFloat(document.getElementById("fgMMetal").value);
	Mcrystal = parseFloat(document.getElementById("fgMCrystal").value);
	Mdeut = parseFloat(document.getElementById("fgMDeut").value);
	
	if (res == 1) {
		if (document.getElementById("fgSelectRes").value == "crys")
			document.getElementById("fgMDeut").value = 100 - Mmetal;
		else
			document.getElementById("fgMCrystal").value = 100 - Mmetal;
	} else if (res == 2) {
		if (document.getElementById("fgSelectRes").value == "met")
			document.getElementById("fgMDeut").value = 100 - Mcrystal;
		else
			document.getElementById("fgMMetal").value = 100 - Mcrystal;
	} else if (res == 3) {
		if (document.getElementById("fgSelectRes").value == "met")
			document.getElementById("fgMCrystal").value = 100 - Mdeut;
		else
			document.getElementById("fgMMetal").value = 100 - Mdeut;
	}
}

function fixMixAll() {
	if (document.getElementById("fgSelectType").value != "Sell")
		return;

	var Mmetal = document.getElementById("fgMMetal");
	var Mcrystal = document.getElementById("fgMCrystal");
	var Mdeut = document.getElementById("fgMDeut");
	var total = 0;
	var first = true;
	if (document.getElementById("fgSelectRes").value != "met") {
		if (parseFloat(Mmetal.value) < 0)
			Mmetal.value = 0;
		if (total + parseFloat(Mmetal.value) > 100)
			Mmetal.value = 100 - total;
		total = total + parseFloat(Mmetal.value);
		first = false;
	} 
	if (document.getElementById("fgSelectRes").value != "crys") {	
		if (parseFloat(Mcrystal.value) < 0)
			Mcrystal.value = 0;
		if (total + parseFloat(Mcrystal.value) > 100)
			Mcrystal.value = 100 - total;
		total = total + parseFloat(Mcrystal.value);
		if (!first && total < 100)
			Mcrystal.value = 100 - total + parseFloat(Mdeut.value);
		else
			first = false;				
	} 
	if (document.getElementById("fgSelectRes").value != "deut") {
		if (parseFloat(Mdeut.value) < 0)
			Mdeut.value = 0;
		if (total + parseFloat(Mdeut.value) > 100)
			Mdeut.value = 100 - total;
		total = total + parseFloat(Mdeut.value);
		if (!first && total < 100)
			Mdeut.value = 100 - total + parseFloat(Mdeut.value);
		else
			first = false;				
	}		
}
