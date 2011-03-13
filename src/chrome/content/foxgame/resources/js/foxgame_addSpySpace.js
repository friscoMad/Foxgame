(function(){
	 $("#galaxyContent").ajaxSuccess(function(evt, request, settings){
	 	 	if (settings.url.indexOf("page=galaxyContent") == -1)
	 		return;
		try {
			$('.action a:nth-child(3)').each(function (i) {
				if (this.href == "")
					this.parentNode.insertBefore(document.createElement('a'),this.parentNode.firstChild);
			})		
   		} catch (e) {
			alert(e);
   		}
	});
})();
