var foxgame2_prefObj = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
var foxgame2_PrefsBranch = foxgame2_prefObj.getBranch("foxgame2.userprefs.");
var foxgame2_xmlReq; 

try {
	var foxgame2_UniversesXml = document.implementation.createDocument("", "", null);
	foxgame2_UniversesXml.async = false;
	var file = foxgame2_getConfigDir(null);
	file.append("fgUniverses.xml");
	if (!file.exists()){
		foxgame2_UniversesXml.load("chrome://foxgame2/content/fgUniverses.xml", "text/xml");
	} else {
    	var domParser = Components.classes["@mozilla.org/xmlextras/domparser;1"]
                              .createInstance(Components.interfaces.nsIDOMParser);

    	var configContents = foxgame2_getContents(foxgame2_getConfigFileURI("fgUniverses.xml"));
    	var foxgame2_UniversesXml = domParser.parseFromString(configContents, "text/xml");		
	}
} catch (e) {
	alert(e);
}


function foxgame2_GetBooleanPref(key, defval) {
    
    try {
        var val = foxgame2_PrefsBranch.getBoolPref(key);
        return val;     
    } catch (e) {
        return defval;
    }
    
}

function foxgame2_configure() {
    window.openDialog("chrome://foxgame2/content/foxgameOptions.xul",
                      "", "chrome, all, modal, resizable=yes");
} 

function foxgame2_debug(exception) {
	window.openDialog(
        "chrome://foxgame2/content/resources/html/showErrorBacktrace.htm",
        "errorbacktrace",
        "centerscreen=yes,chrome=yes,modal=yes,resizable=yes",
        exception,
        "display error"
      ); 
}

function foxgame2_getContents(aURL, charset){
  if( !charset ) {
    charset = "UTF-8"
  }
  var ioService=Components.classes["@mozilla.org/network/io-service;1"]
    .getService(Components.interfaces.nsIIOService);
  var scriptableStream=Components
    .classes["@mozilla.org/scriptableinputstream;1"]
    .getService(Components.interfaces.nsIScriptableInputStream);
  
  var unicodeConverter = Components
    .classes["@mozilla.org/intl/scriptableunicodeconverter"]
    .createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
  unicodeConverter.charset = charset;

  var channel=ioService.newChannelFromURI(aURL);
  var input=channel.open();
  scriptableStream.init(input);
  var str=scriptableStream.read(input.available());
  scriptableStream.close();
  input.close();

  try {
    return unicodeConverter.ConvertToUnicode(str);
  } catch( e ) {
    return str;
  }
}

function foxgame2_getConfigFileURI(fileName) {
  return Components.classes["@mozilla.org/network/io-service;1"]
                   .getService(Components.interfaces.nsIIOService)
                   .newFileURI(foxgame2_getConfigFile(fileName));
}

function foxgame2_getConfigFile(fileName) {
	var file = foxgame2_getConfigDir(null);
	file.append(fileName);
	if (!file.exists()){
		file.create(0,0644);
		var doc = document.implementation.createDocument("", "Config", null);
		doc.firstChild.appendChild(doc.createTextNode("\r\n"))
		var configStream = foxgame2_getWriteStream(file);
		new XMLSerializer().serializeToStream(doc, configStream, "utf-8");
		configStream.close();
  	}
  return file;
}

function foxgame2_getWriteStream(file) {
  var stream = Components.classes["@mozilla.org/network/file-output-stream;1"]
    .createInstance(Components.interfaces.nsIFileOutputStream);

  stream.init(file, 0x02 | 0x08 | 0x20, 420, -1);

  return stream;
}

function foxgame2_getConfigDir(subdir) {

    try {
    
        var dirLocator = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties);
        var dir = dirLocator.get("ProfD", Components.interfaces.nsILocalFile);
        dir.appendRelativePath("FoxGame");
        
        if (!dir.exists() ) {        
            dir.create(dir.DIRECTORY_TYPE, 0755);
        }
        
        if (subdir != null) {
            dir.appendRelativePath(subdir);
            if (!dir.exists() ) {        
                dir.create(dir.DIRECTORY_TYPE, 0755);
            }
        }
       return dir;   
   } 
   catch(e) {
            return null;
   }    
}

//**************************************************************************
function foxgame2_checkUpdates(async) {
	var foxgame2_xmlReq = new XMLHttpRequest();
	foxgame2_xmlReq.open("GET", "http://www.foxgame.org/xml/fgUniverses.xml", async);
	foxgame2_xmlReq.onload = foxgame2_processUpdateResponse;
	foxgame2_xmlReq.send(null);
}

//**************************************************************************
function foxgame2_processUpdateResponse(event) {
	try {
		var text = event.target.responseText;
		var universesStream = foxgame2_getWriteStream(foxgame2_getConfigFile("fgUniverses.xml"));
		// First, get and initialize the converter
		var converter = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"]
            	              .createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
		converter.charset = "UTF-8";
		var chunk = converter.ConvertFromUnicode(text);
		universesStream.write(chunk, chunk.length);
		var fin = converter.Finish();
		if (fin.length > 0)
			universesStream.write(fin, fin.length);
		universesStream.close();
		var today = new Date();
		today.setHours(0);
		today.setMinutes(0);
		today.setSeconds(0);
		foxgame2_PrefsBranch.setCharPref("foxgameLastCheck",Date.parse(today));
	} catch(e) {
	}
}

function foxgame2_UserHLElement(name,type,color) {
	this.name = name;
	this.type = type;
	this.color = color;
	this.modify = function (name,type,color) {
		this.name = name;
		this.type = type;
		this.color = color;
	}
	this.getValue = function (id) {
		switch (id) {
			case "name":
				return this.name;
			case "type":
				return this.type;
			case "color":
				return this.color;
		}
		return "";
	}
}

var foxgame2_listaUserHLs = {
  configFile : null,
  data : null,
  tree : null,
  type : "UHL",
  init : function(configFile) {
	this.data = [];
	this.configFile = configFile;
  },
  setTree : function(tree) {
	this.tree = tree;
  },
  get length() {
	return this.data.length;
  },
  value: function(row) {
	return this.data[row];
  },
  setValue: function(row,value) {
	this.data[row] = value;
	this.tree.invalidateRow(row)
  },    
  addElement: function(ele) {
	if (!('name' in ele) || !('type' in ele) || !('color' in ele))
		return;
	for (var i = 0; i < this.data.length; i++) 
		if (this.data[i].name == ele.name && this.data[i].type == ele.type)
			return;

	this.data.push(new foxgame2_UserHLElement(ele.name,ele.type,ele.color));
	this.tree.rowCountChanged(this.data.length-1,1);
    },
  removeElement: function(i) {
	var temp;
	temp = this.data.splice(i, 1);

	this.tree.rowCountChanged(i,-1);
	return temp;
    },
  modifyElement: function(i,ele) {
	if (!('name' in ele) && !('type' in ele) && !('color' in ele) )
		return;
	this.data[i].modify(ele.name,ele.type,ele.color);

	this.tree.invalidateRow(i);
    },
  save : function() {
    var doc = document.implementation.createDocument("", "Config", null);
    
    for (var i = 0; i < this.data.length ; i++) {
      var scriptNode = doc.createElement("UserHL");

      scriptNode.setAttribute("name", this.data[i].name);
      scriptNode.setAttribute("type", this.data[i].type);
      scriptNode.setAttribute("color", this.data[i].color);

      doc.firstChild.appendChild(doc.createTextNode("\r\n\t"));
      doc.firstChild.appendChild(scriptNode);
    }

    doc.firstChild.appendChild(doc.createTextNode("\r\n"))

    var configStream = foxgame2_getWriteStream(this.configFile);
    new XMLSerializer().serializeToStream(doc, configStream, "utf-8");
    configStream.close();
  }, 

  load : function() {
    var domParser = Components.classes["@mozilla.org/xmlextras/domparser;1"]
                              .createInstance(Components.interfaces.nsIDOMParser);

    var configContents = foxgame2_getContents(foxgame2_getConfigFileURI(this.configFile.leafName));
    var doc = domParser.parseFromString(configContents, "text/xml");
    var nodes = doc.evaluate("/Config/UserHL", doc, null, 0, null);

    this.data = [];

    for (var node = null; (node = nodes.iterateNext()); ) {
      var ele = {};

      ele.name = node.getAttribute("name");
      ele.type = node.getAttribute("type");
      ele.color = node.getAttribute("color");

	this.data.push(new foxgame2_UserHLElement(ele.name,ele.type,ele.color));
	if (typeof foxgame2_treeView != "undefined" && typeof foxgame2_treeView[0] != "undefined")
		foxgame2_treeView[0].treeBox.rowCountChanged(this.data.length-1,1);
    }
  }
};

function foxgame2_LoginElement(uni,server,cycle) {
	this.uni = uni;
	this.server = server;
	this.cycle = cycle;
	this.modify = function (uni,server) {
		this.uni = uni;
		this.server = server;
	}
	this.setCycle = function (value) {
		this.cycle = value;
	}
	this.getValue = function (id) {
		switch (id) {
			case "uni":
				return this.uni;
			case "server":
				return this.server;
		}
		return "";
	}		
}

var foxgame2_listaLogins = {
  configFile : null,
  data : null,
  tree : null,
  type : "Login",
  init : function(configFile) {
	this.data = [];
	this.configFile = configFile;
  },
  setTree : function(tree) {
	this.tree = tree;
  },
  get length() {
	return this.data.length;
  },
  value: function(row) {
	return this.data[row];
  },
  setValue: function(row,value) {
	this.data[row] = value;
	this.tree.invalidateRow(row)
  },    
  addElement: function(ele) {
	if (!('uni' in ele))
		return;
	for (var i = 0; i < this.data.length; i++) 
		if (this.data[i].uni == ele.uni && this.data[i].server == ele.server)
			return;

	this.data.push(new foxgame2_LoginElement(ele.uni,ele.server,0));
	this.tree.rowCountChanged(this.data.length-1,1);
    },
  removeElement: function(i) {
	var temp;
	temp = this.data.splice(i, 1);

	this.tree.rowCountChanged(i,-1);
	return temp;
    },
  modifyElement: function(i,ele) {
	if (!('uni' in ele))
		return;
	this.data[i].modify(ele.uni,ele.server);
	this.tree.invalidateRow(i);
    },
  save : function() {
    var doc = document.implementation.createDocument("", "Config", null);
    
    for (var i = 0; i < this.data.length ; i++) {
      var scriptNode = doc.createElement("Login");

      scriptNode.setAttribute("uni", this.data[i].uni);
      scriptNode.setAttribute("server", this.data[i].server);
      scriptNode.setAttribute("cycle", this.data[i].cycle);
      doc.firstChild.appendChild(doc.createTextNode("\r\n\t"));
      doc.firstChild.appendChild(scriptNode);
    }
    doc.firstChild.appendChild(doc.createTextNode("\r\n"))
    var configStream = foxgame2_getWriteStream(this.configFile);
    new XMLSerializer().serializeToStream(doc, configStream, "utf-8");
    configStream.close();
  }, 

  load : function() {
    var domParser = Components.classes["@mozilla.org/xmlextras/domparser;1"]
                              .createInstance(Components.interfaces.nsIDOMParser);

    var configContents = foxgame2_getContents(foxgame2_getConfigFileURI(this.configFile.leafName));
    var doc = domParser.parseFromString(configContents, "text/xml");
    var nodes = doc.evaluate("/Config/Login", doc, null, 0, null);

    this.data = [];

    for (var node = null; (node = nodes.iterateNext()); ) {
      var ele = {};

      ele.uni = node.getAttribute("uni");
      ele.server = node.getAttribute("server");
      ele.cycle = node.getAttribute("cycle");

	this.data.push(new foxgame2_LoginElement(ele.uni,ele.server,ele.cycle));
	if (typeof foxgame2_treeView != "undefined" && typeof foxgame2_treeView[1] != "undefined")
		foxgame2_treeView[1].treeBox.rowCountChanged(this.data.length-1,1);
    }
  }
};

function foxgame2_HighlightElement(type,color,other) {
	this.type = type;
	this.color = color;
	this.other = other;
	this.modify = function (type,color,other) {
		this.type = type;
		this.color = color;
		this.other = other;
	}
	this.getValue = function (id) {
		switch (id) {
			case "other":
				return this.other;
			case "type":
				return this.type;
			case "color":
				return this.color;
		}
		return "";
	}	
}

var foxgame2_listaHighlights = {
  configFile : null,
  data : null,
  tree : null,
  type : "HL",
  init : function(configFile) {
	this.data = [];
	this.configFile = configFile;
  },
  setTree : function(tree) {
	this.tree = tree;
  },
  get length() {
	return this.data.length;
  },  
  value: function(row) {
	return this.data[row];
  },
  setValue: function(row,value) {
	this.data[row] = value;
	this.tree.invalidateRow(row)
  },  
  addElement: function(ele) {
	if (!('type' in ele))
		return;
	for (var i = 0; i < this.data.length; i++) 
		if (this.data[i].type == ele.type && this.data[i].other == ele.other)
			return;
	if (ele.color == "")
		return;
	this.data.push(new foxgame2_HighlightElement(ele.type,ele.color,ele.other));
	this.tree.rowCountChanged(this.data.length-1,1);
    },
  removeElement: function(i) {
	var temp;
	temp = this.data.splice(i, 1);

	this.tree.rowCountChanged(i,-1);
	return temp;
    },
  modifyElement: function(i,ele) {
	if (!('type' in ele))
		return;
	this.data[i].modify(ele.type,ele.color,ele.other);

	this.tree.invalidateRow(i);
    },
  save : function() {
    var doc = document.implementation.createDocument("", "Config", null);
    
    for (var i = 0; i < this.data.length ; i++) {
      var scriptNode = doc.createElement("Highlight");

      scriptNode.setAttribute("type", this.data[i].type);
      scriptNode.setAttribute("color", this.data[i].color);
	  var temp = doc.createTextNode(this.data[i].other);
	  scriptNode.appendChild(temp);

      doc.firstChild.appendChild(doc.createTextNode("\r\n\t"));
      doc.firstChild.appendChild(scriptNode);
    }

    doc.firstChild.appendChild(doc.createTextNode("\r\n"))

    var configStream = foxgame2_getWriteStream(this.configFile);
    new XMLSerializer().serializeToStream(doc, configStream, "utf-8");
    configStream.close();
  }, 

  load : function() {
    var domParser = Components.classes["@mozilla.org/xmlextras/domparser;1"]
                              .createInstance(Components.interfaces.nsIDOMParser);

    var configContents = foxgame2_getContents(foxgame2_getConfigFileURI(this.configFile.leafName));
    var doc = domParser.parseFromString(configContents, "text/xml");
    var nodes = doc.evaluate("/Config/Highlight", doc, null, 0, null);

    this.data = [];

    for (var node = null; (node = nodes.iterateNext()); ) {
      var ele = {};

      ele.type = node.getAttribute("type");
      ele.color = node.getAttribute("color");
	try {
      	ele.other = node.firstChild.nodeValue;
	} catch (e) {
		ele.other = '0';
	}
	this.data.push(new foxgame2_HighlightElement(ele.type,ele.color,ele.other));
	if (typeof foxgame2_treeView != "undefined" && typeof foxgame2_treeView[2] != "undefined")
		foxgame2_treeView[2].treeBox.rowCountChanged(this.data.length-1,1);
    }
  }
};

function foxgame2_JSON_toString(aJSObject, aKeysToDrop) {
    var pieces = [];
    
    function append_piece(aObj) {
      if (typeof aObj == "string") {
        aObj = aObj.replace(/[\\"\x00-\x1F\u0080-\uFFFF]/g, function($0) {
          switch ($0) {
          case "\b": return "\\b";
          case "\t": return "\\t";
          case "\n": return "\\n";
          case "\f": return "\\f";
          case "\r": return "\\r";
          case '"':  return '\\"';
          case "\\": return "\\\\";
          }
          return "\\u" + ("0000" + $0.charCodeAt(0).toString(16)).slice(-4);
        });
        pieces.push('"' + aObj + '"')
      }
      else if (typeof aObj == "boolean") {
        pieces.push(aObj ? "true" : "false");
      }
      else if (typeof aObj == "number" && isFinite(aObj)) {
        pieces.push(aObj.toString());
      }
      else if (aObj === null) {
        pieces.push("null");
      }
      else if (aObj instanceof Array ||
               typeof aObj == "object" && "length" in aObj &&
               (aObj.length === 0 || aObj[aObj.length - 1] !== undefined)) {
        pieces.push("[");
        for (var i = 0; i < aObj.length; i++) {
          arguments.callee(aObj[i]);
          pieces.push(",");
        }
        if (aObj.length > 0)
          pieces.pop(); // drop the trailing colon
        pieces.push("]");
      }
      else if (typeof aObj == "object") {
        pieces.push("{");
        for (var key in aObj) {
          if (aKeysToDrop && aKeysToDrop.indexOf(key) != -1)
            continue;
          
          arguments.callee(key.toString());
          pieces.push(":");
          arguments.callee(aObj[key]);
          pieces.push(",");
        }
        if (pieces[pieces.length - 1] == ",")
          pieces.pop(); // drop the trailing colon
        pieces.push("}");
      }
      else {
        pieces.push("null");
      }
    }
    append_piece(aJSObject);
    
    return pieces.join("");
 }


