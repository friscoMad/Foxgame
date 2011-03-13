var reloadEventbox_old = reloadEventbox;
var foxgame2_changeTime = false;
reloadEventbox = function (data) {
	$('#eventContent').attr('id','eventContent3');
	$('#eventContent2').attr('id','eventContent');
	reloadEventbox_old(data);	
	$('#eventContent').attr('id','eventContent2');
	$('#eventContent3').attr('id','eventContent');
}
$('.content-box-s:first').before('<div style="clear:float" id="events"></div>');
$('body').attr('style','background-color: #000 !important');
function finishEvents (){
	DOM_GET_ELEMENT_BY_ID_CACHE = new Array();
	initEventlist();
	initCluetipEventlist();
	$('a.close_details').click(function() {
		$('#events').html('');
		return false;		
	});
	$('h4 a.tips').removeAttr('onclick').click(function() {
		refreshEvents();
		return false;
	});
};
function refreshEvents() {
	$.ajax({
		url: $('a.tips.thickbox').attr('href'),
		type: 'GET',
		dataType: 'html',
		data: null,
		complete: function(res, status){
			if ( status == "success" || status == "notmodified" )
				if ($('#eventContent2').size() == 0)
					$('#eventContent').attr('id','eventContent2');
				var scripts = res.responseText.match(/<script(.|\s)*?\/script>/g);
				$('#events').html($("<div/>").append(res.responseText.replace(/<script(.|\s)*?\/script>/g, "")).find("#eventListWrap, link, script"));
				LocalizationStrings_old = LocalizationStrings;
				var lastScript = scripts[scripts.length-1];
//-------------
				if (foxgame2_changeTime) {
					var regexp = new RegExp('\"counter-(\\d+)\"\\),\\s*(\\d+)\\)',"gm");
					var res;
					while ((res = regexp.exec(lastScript)) != null) {			
						var span = document.getElementById("counter-"+res[1]);
						if (span == null)
							continue;
						var node = span.parentNode.nextSibling.nextSibling;
						var date, date2 = foxgame2_newDate(foxgame2_mode);
						var secs = parseInt(res[2],10);			
						date = foxgame2_newDate(foxgame2_mode);
						date.setTime(date.getTime() + (secs*1000));
						node.innerHTML = "<font color='lime'><span class='foxgame_time'>" +foxgame2_formatDate(date,date2)+"</span></font>";					
//						node.innerHTML = "<font color='lime'><span class='foxgame_time'>-</span></font>";
					}
				}
//-------------				
				
				new eventboxCountdown(getElementByIdWithCache("counter-38565558"), 145);
				
				
				$('#events').append(lastScript);
				LocalizationStrings = LocalizationStrings_old;
				finishEvents();
		}
	});	
};
refreshEvents();
//:not([href*='thickbox'])