var foxgame2_speedLang;
var foxgame2_dragoLang;
var foxgame2_speed = false;
var foxgame2_drago = false;
function foxgame2_initSimMessages (speedLang, speed, dragoLang, drago){
	foxgame2_speedLang = speedLang;
	foxgame2_dragoLang = dragoLang;
	foxgame2_speed = speed;
	foxgame2_drago = drago;
	if ($("#messageContent").length == 1) {
		$("#messageContent").ajaxSuccess(function(evt, request, settings){
 			if (settings.url.indexOf("page=messages") == -1)
 				return;
 			if (foxgame2_speed)
 				$("div#showSpyReportsNow").each(foxgame2_speedSimLinkProxy);
			if (foxgame2_drago)
 				$("div#showSpyReportsNow").each(foxgame2_dragoSimLinkProxy); 			
		});
	}
}

function foxgame2_initSimMessage (speedLang, speed, dragoLang, drago){
	try{
		foxgame2_speedLang = speedLang;
		foxgame2_dragoLang = dragoLang;
		if($("table.material.spy").length > 0) {
			var div = $("table.material.spy").get(0).parentNode;
			if (speed)
				foxgame2_speedSimLink(div);
			if (drago)
				foxgame2_dragoSimLink(div);			
		}
	} catch(e) {
		alert(e);
	}
}

function foxgame2_speedSimLinkProxy() {
	try{
		foxgame2_speedSimLink(this);
	} catch(e) {
		alert(e);
	}
}

function foxgame2_speedSimLink(that) {
	try {
		if ($(that).parents('tr:eq(0)').length > 0) {
			var rowId = $(that).parents('tr:eq(0)').attr('id');
			rowId = rowId.split('_');
			rowId = rowId[1];
		} else {
			rowId = 1;
		}
		text = $(that).text();
		text = text.replace(/\r|\n/,' ');
		ruta = "http://websim.speedsim.net/index.php?lang="+foxgame2_speedLang;
		var form = document.createElement('div');
		form.innerHTML = '<form action="'+ruta+'" method=post target="_speedsim" name="speedsim_form" id="speed_'+rowId+'" >'+
				'<input type="hidden" name="report" id="input_sso" value="'+encodeURI(text)+'"></form>';
		document.body.appendChild(form);
		var img = "<img src='chrome://foxgame2/content/resources/images/speedsim.png' border='0' align='absbottom' />";
		var a = "<a href='#' onclick='document.getElementById(\"speed_"+rowId+"\").submit();'>"+img+"</a>";
		if ($("a[rel='" +rowId+ "']").length > 0)
			$("a[rel='" +rowId+ "']").parent().append(a);
		else 
			$("div.showMsgNavi ul").append("<li>"+a+"</li>");
	} catch (e) {
		alert(e);
	}
}

function foxgame2_dragoSimLinkProxy() {
	try{
		foxgame2_dragoSimLink(this);
	} catch(e) {
		alert(e);
	}
}

function foxgame2_dragoSimLink(that) {
	try {
		text = $(that).text();
		text = encodeURI(text.replace(/\r|\n/,' ').trim());	
		var img = "<img src='chrome://foxgame2/content/resources/images/drago.gif' border='0' align='absbottom' />";
		var a = "<a href=\"http://drago-sim.com/index.php?lang="+foxgame2_dragoLang+"&scan="+text+"\" target='_blank' >"+img+"</a>";
		
		if ($(that).parents('tr:eq(0)').length > 0) {
			var rowId = $(that).parents('tr:eq(0)').attr('id');
			rowId = rowId.split('_');
			rowId = rowId[1];
		} else {
			rowId = 1;
		}
		if ($("a[rel='" +rowId+ "']").length > 0)
			$("a[rel='" +rowId+ "']").parent().append(a);
		else 
			$("div.showMsgNavi ul").append("<li>"+a+"</li>");
	} catch (e) {
		alert(e);
	}
}
