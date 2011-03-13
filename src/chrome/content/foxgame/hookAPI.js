//#########################################################################################
//
// HOOK API
// - hook extern functions
//
//#########################################################################################

var FGHOOKAPI_Class = {
	toString: function(){ return '[FGHOOKAPI class]'; },
 	TYPE_CALLARG_DOCUMENT: 0,
 	TYPE_CALLARG_EVENT:    1,
 	FN: [],   // infoes are stored here
 	ID: 0,    // last hook id (first created should be 1 !!!

 	// add new hook
 	add: function(externFN, regexp, callarg)
 	{
   		var item =
    	{
    		id:       ++this.ID,
       		fn:       externFN,
       		regexp:   (regexp || null),
       		callarg:  (callarg || this.TYPE_CALLARG_DOCUMENT)
     	};
   		// this.FN.push(item)
   		this.FN[this.FN.length] = item;
   		return this.ID;
 	},

 	// remove hook
 	remove: function(hookID)
 	{
   		var index = -1;
   		for (var i = 0; i < this.FN.length; i++)
     		if (this.FN[i].id == hookID)
     		{
    	   		index = i;
       			break;
     		}
   		if (index == -1) return false;
   		var tmp = this.FN[index];
   		for (var i=index; i<this.FN.length-1; i++) this.FN[i] = this.FN[i+1];
   		this.FN.pop();
   		return true;
 	},

 	// run hooks
 	onEvent: function(event, document, href)
 	{
   		try
   		{
     		var FN = null, hookID = 0;
     		for (var i=0; i < this.FN.length; i++)
     		{	
       			var item = this.FN[i];
       			if (item.regexp == null || href.match(item.regexp))
       			{
        			// FGERROR.HOOK_ERROR        = 0x80020000;  // hook error ID
        			HookErrorID = (0x80020000+item.id); // first id = 1
        			try
        			{ // no fg/extern function dependency except _postError + support for ignore separate functions
           				FN = item.fn;
           				switch(item.callarg)
           				{
           					case this.TYPE_CALLARG_EVENT:
            					FN(event);
               				break;
           					case this.TYPE_CALLARG_DOCUMENT:
           					default:
               					FN(document);
               				break;
           				}
        			}
        			catch(e){ foxgame2_debug(e); }
       			}
     		}
   		}
   		catch(e){ foxgame2_debug(e); }
 	}
}; // FGHOOKAPI
if (!FGHOOKAPI || typeof FGHOOKAPI == "undefined" || FGHOOKAPI == null)
var FGHOOKAPI = FGHOOKAPI_Class;
// SUPPORT (r) FoxGame
//
function fg_HookFunction(externFN, regexp, callarg){ return FGHOOKAPI.add(externFN, regexp, callarg); }
function fg_HookFunctionNoRegexp(externFN){ return FGHOOKAPI.add(externFN); }
function fg_UnHookFunction(hookID){ FGHOOKAPI.remove(hookID); }


//#########################################################################################
//
// END HOOK API
//
//######################################################################################### 

