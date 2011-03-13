function loriWindowOnLoad () {
	var container = getBrowser().tabContainer;
    container.addEventListener("TabOpen", tabOpenListener, false);
	var aBrowser = getBrowser().selectedBrowser;
	addTabListener(aBrowser);
}
function addTabListener(aBrowser) {
	aBrowser.loriTabHandler = new LoriTabHandler(aBrowser);
    const nsIWebProgress = Components.interfaces.nsIWebProgress;
    const filter = (nsIWebProgress.NOTIFY_STATE_ALL |
                       nsIWebProgress.NOTIFY_STATUS |
                       nsIWebProgress.NOTIFY_PROGRESS
           );
    aBrowser.addProgressListener(aBrowser.loriTabHandler, filter);       	
}

function tabOpenListener (aEvent) {
	var browser = aEvent.target.linkedBrowser;
    addTabListener(browser);
}

function LoriTabHandler(aBrowser) {
    this.init(aBrowser);
}

LoriTabHandler.prototype = { 
    eventsHandler : null,
    eventsStat : null,
  
        
    // stat
    startTime : -1,
    xferStartTime : -1,
    
    QueryInterface : function(aIID) {
        if (aIID.equals(Components.interfaces.nsIWebProgressListener) ||
            aIID.equals(Components.interfaces.nsISupportsWeakReference) ||
            aIID.equals(Components.interfaces.nsISupports)) {
                return this;
            }
        throw Components.results.NS_NOINTERFACE;
    },
    
    
    // START implements nsIWebProgressListener
    // http://www.xulplanet.com/references/xpcomref/ifaces/nsIWebProgressListener.html
    /**
     * Called when the location of the window being watched changes. 
     * This is not when a load is requested, but rather once it is verified that the load is going to occur in the 
     * given window. For instance, a load that starts in a 
     * window might send progress and status messages for the new site, but it will not send the 
     * onLocationChange until we are sure that we are loading this new page here.
     * Arguments:
     *   webProgress: The nsIWebProgress instance that fired the notification. 
     *   request: The associated nsIRequest. This may be null in some cases. 
     *   location: The URI of the location that is being loaded.      
     */
    //void onLocationChange ( nsIWebProgress webProgress , nsIRequest request , nsIURI location ) 
    onLocationChange : function (aWebProgress, aRequest, aLocation) {
    },
     
    //void onProgressChange ( nsIWebProgress webProgress , nsIRequest request , PRInt32 curSelfProgress , PRInt32 maxSelfProgress , PRInt32 curTotalProgress , PRInt32 maxTotalProgress ) 
    onProgressChange : function (aWebProgress, aRequest, aCurSelfProgress, aMaxSelfProgress, aCurTotalProgress, aMaxTotalProgress)  {
        this.countEventsStat(this.LORI_EV_PROGRESS_CHANGE);
        
        if (! this.acceptRequest(aRequest)) {
            return;
        }
            
    },
    
    //void onSecurityChange ( nsIWebProgress webProgress , nsIRequest request , PRUint32 state ) 
    onSecurityChange : function (aWebProgress, aRequest , aState) {
    },
    
    /**
     * For now, ignore all the non-http requests
     */
    acceptRequest : function (aRequest) {
        // list of all the non-http requests to ignore
        var reIgnore = /about:|javascript:|resource:|chrome:|jar:|\.xpi/;
    
        var name = null;
        
        // XXX: some request does NOT impl "name", skip those
        try {
            name = aRequest.name;
        } catch (e) {
			return false;
        }        
        if (reIgnore.exec(name)) {
            return false;
        }        
        return true;
    }, 
    
    /**
     * OK, this where all the intersting things happen: start, stop of document, request ...
     */
    //void onStateChange ( nsIWebProgress webProgress , nsIRequest request , PRUint32 stateFlags , nsresult status ) 
    onStateChange : function (aWebProgress, aRequest, aStateFlags, aStatus) {

        if (! this.acceptRequest(aRequest)) {
            return;
        }
        
        const nsIWebProgressListener = Components.interfaces.nsIWebProgressListener;

        // dispatch further to helper functions    
        // PRUint32   STATE_START  = 1
        if (aStateFlags & nsIWebProgressListener.STATE_START) {
//            this.onStateStart(aWebProgress, aRequest, aStateFlags, aStatus);
        	if (aStateFlags & nsIWebProgressListener.STATE_IS_DOCUMENT 
        		&& aStateFlags & nsIWebProgressListener.STATE_IS_WINDOW
        		&& aStateFlags & nsIWebProgressListener.STATE_IS_REQUEST) {
	    		alert(aRequest.name);
       		}
        }
    
/*
        // PRUint32 STATE_REDIRECTING = 2
        if (aStateFlags & nsIWebProgressListener.STATE_REDIRECTING) {
            this.onStateRedirecting(aWebProgress, aRequest, aStateFlags, aStatus);
        }
    
        // PRUint32 STATE_TRANSFERRING = 4
        if (aStateFlags & nsIWebProgressListener.STATE_TRANSFERRING) {
            this.onStateTransferring(aWebProgress, aRequest, aStateFlags, aStatus);
        }
    
        // PRUint32 STATE_NEGOTIATING = 8
        if (aStateFlags & nsIWebProgressListener.STATE_NEGOTIATING) {
            this.onStateNegotiating(aWebProgress, aRequest, aStateFlags, aStatus);
        }
    
        // PRUint32 STATE_STOP = 16    
        if (aStateFlags & nsIWebProgressListener.STATE_STOP) {
            this.onStateStop(aWebProgress, aRequest, aStateFlags, aStatus);
        }
        
        // PRUint32  STATE_RESTORING = 16777216 
        if (aStateFlags & nsIWebProgressListener.STATE_RESTORING) {
            this.onStateRestoring(aWebProgress, aRequest, aStateFlags, aStatus);
        }
*/        
    },
    
    //void onStatusChange ( nsIWebProgress webProgress , nsIRequest request , nsresult status , PRUnichar* message )   
    onStatusChange : function (aWebProgress, aRequest, aStatus, aMessage) {

/*
        // LORI_EV_STATUS_CHANGE
        this.countEventsStat(this.LORI_EV_STATUS_CHANGE);

        //gLoriLogger.log("> onStatusChange " + aMessage);
*/    },

    // START onStateChange helper function
    // once with the STATE_START flag
    onStateStart : function (aWebProgress, aRequest, aStateFlags, aStatus) {
/*
        if (gLoriLogger.isDebugEnabled()) {
            gLoriLogger.debug("> onStateStart");
        }
        
        const nsIWebProgressListener = Components.interfaces.nsIWebProgressListener;
        
        // aRequest: http://www.xulplanet.com/references/xpcomref/ifaces/nsIRequest.html
        if (aStateFlags & nsIWebProgressListener.STATE_IS_NETWORK) {
            //gLoriLogger.log("    onStateStart STATE_IS_NETWORK " + aRequest.name);

            // START OF THE WORLD EVENT
            this.startTime = gLoriLogger.getNow();

            // reset stat
            this.xferStartTime = -1;
            this.clearEventsStat();
                       
            this.countEventsStat(this.LORI_EV_STATE_START_NETWORK);
            
            this.eventsHandler.onLoriNavigationStarted();      
        } 

        if (aStateFlags & nsIWebProgressListener.STATE_IS_WINDOW) {
            if (gLoriLogger.isDebugEnabled()) {
                gLoriLogger.debug("    onStateStart STATE_IS_WINDOW " + aRequest.name);
            }
            
            this.countEventsStat(this.LORI_EV_STATE_START_WINDOW);
        }
        
        if (aStateFlags & nsIWebProgressListener.STATE_IS_DOCUMENT) {
            if (gLoriLogger.isDebugEnabled()) {
                gLoriLogger.debug("    onStateStart STATE_IS_DOCUMENT " + aRequest.name);
            }               
            this.countEventsStat(this.LORI_EV_STATE_START_DOCUMENT);
        } 
        
        if (aStateFlags & nsIWebProgressListener.STATE_IS_REQUEST) {
            if (gLoriLogger.isDebugEnabled()) {
                gLoriLogger.debug("    onStateStart STATE_IS_REQUEST " + aRequest.name);
            }                  
            this.countEventsStat(this.LORI_EV_STATE_START_REQUEST);
            
            this.eventsHandler.onLoriRequestStarted(aRequest);
        } 
        
//        gLoriLogger.log("< onStateStart");
*/
    },
    
    // once with the STATE_REDIRECTING flag
    onStateRedirecting : function (aWebProgress, aChannel, aStateFlags, aStatus) {
    },
    
    /**
     * STATE_TRANSFERRING 
     * This flag indicates that data for a request is being transferred to an end consumer. 
     * This flag indicates that the request has been targeted, and that the user may start 
     * seeing content corresponding to the request. 
     */
    // zero or more times with the STATE_TRANSFERRING flag 
    onStateTransferring : function (aWebProgress, aRequest, aStateFlags, aStatus) {
/*
        if (gLoriLogger.isDebugEnabled()) {
            gLoriLogger.debug("> onStateTransferring");   
        }
        
        this.countEventsStat(this.LORI_EV_STATE_TRANSFERRING);    

        if (! this.acceptRequest(aRequest)) {
            return;
        }
        
        // we have seen this to occur multiple times, for now protected the ttfb value.
        if (this.xferStartTime < 0) {
            this.xferStartTime = gLoriLogger.getNow();
            this.eventsHandler.onLoriXFerStarted();             
        }
*/
    },    
    
    // STATE_NEGOTIATING This flag is not used. 
    onStateNegotiating : function (aWebProgress, aRequest, aStateFlags, aStatus) {
    },    

    // once with the STATE_STOP flag
    onStateStop : function (aWebProgress, aRequest, aStateFlags, aStatus) {
/*
        const nsIWebProgressListener = Components.interfaces.nsIWebProgressListener;

        if (aStateFlags & nsIWebProgressListener.STATE_IS_REQUEST) {
                     
            if (gLoriLogger.isDebugEnabled()) {
                gLoriLogger.debug("    onStateStop STATE_IS_REQUEST " + aRequest.name);
            }
            this.countEventsStat(this.LORI_EV_STATE_STOP_REQUEST);
            this.eventsHandler.onLoriRequestStopped(aRequest);
        } 

        if (aStateFlags & nsIWebProgressListener.STATE_IS_DOCUMENT) {
            this.countEventsStat(this.LORI_EV_STATE_STOP_DOCUMENT);
            //gLoriLogger.log("    onStateStop STATE_IS_DOCUMENT " + aRequest.name);
        } 

        if (aStateFlags & nsIWebProgressListener.STATE_IS_WINDOW) {
            this.countEventsStat(this.LORI_EV_STATE_STOP_WINDOW);
            //gLoriLogger.log("    onStateStop STATE_IS_WINDOW " + aRequest.name);
        }
        
        if (aStateFlags & nsIWebProgressListener.STATE_IS_NETWORK) {
            //gLoriLogger.log("    onStateStop STATE_IS_NETWORK " + aRequest.name);
            this.countEventsStat(this.LORI_EV_STATE_STOP_NETWORK);
            this.eventsHandler.onLoriNavigationEnded();
            //gLoriLogger.log("    eventsStat: " + this.toStringEventsStat());

            // so that we know if we've missed a START_NETWORK            
            this.startTime = -1;
        } 
*/
    },      
    
    onStateRestoring : function (aWebProgress, aRequest, aStateFlags, aStatus) {        
    }, 
    // END implements nsIWebProgressListener
           
    // constructor
    init : function(aBrowser) {
    },
    
    // destructor
    destroy : function() {
    }
}
