function fgSendMail(mailtoUrl) {
	// Copied from browser.js's MailIntegration class
	try {

		var ioService = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
		var uri = ioService.newURI(mailtoUrl, null, null);
  
		var extProtocolSvc = Components.classes["@mozilla.org/uriloader/external-protocol-service;1"].getService(Components.interfaces.nsIExternalProtocolService);
		if (extProtocolSvc){
			extProtocolSvc.loadUrl(uri);
		}
	} catch(e){
		alert(e);
	}
}