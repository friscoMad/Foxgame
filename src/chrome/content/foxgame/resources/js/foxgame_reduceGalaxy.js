(function(){
	 $("#galaxyContent").ajaxSuccess(function(evt, request, settings){
	 	 	if (settings.url.indexOf("page=galaxyContent") == -1)
	 		return;
		try {
			$('td.microplanet').each(function (i) {
				$(this).nextAll('td:first').addClass('TTgalaxy').append($(this).find('div:first').remove()).attr('rel',this.getAttribute('rel'));				
				$(this.parentNode).find('td:eq(3) a').removeClass('ajaxTips').removeAttr('title').unbind();
				$(this).prevAll('td:first').append($(this).find('span.activity, span.fleetAction').remove());
			});
			$('td.microplanet, td.microplanet1').remove();
			$('#galaxyheadbg2 th:first').attr('colspan','2').css('width','15px');
			$("#galaxytable tr.row").css({'background-color' : 'rgba(10,10,10,0.5)','background-image' : 'none'});
			$("#galaxytable tr.row td").css({'height' : '10px'});
			$('td.position').wrapInner('<div style="position: relative;"></div>');				
			$('span.activity').css({'position': 'absolute', 'top': '0px'});
			$('span.fleetAction').css({'position': 'absolute', 'left': '-15px', 'top': '0px'});				
			AjaxCluetip ();
			tb_initialize();			
   		} catch (e) {
			alert(e);
   		}
	});
})();
