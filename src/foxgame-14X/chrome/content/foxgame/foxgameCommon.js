var prefObjFG = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
var PrefsBranchFG = prefObjFG.getBranch("foxgame.userprefs.");


function fgGetBooleanPref(key, defval) {
    
    try {
        var val = PrefsBranchFG.getBoolPref(key);
        return val;     
    } catch (e) {
        return defval;
    }
    
}

function configureFoxGame() {
    window.openDialog("chrome://foxgame/content/foxgameOptions.xul",
                      "", "centerscreen, chrome, modal, resizable=yes");
} 

function foxgamedebug(exception) {
	window.openDialog(
        "chrome://foxgame/content/resources/html/showErrorBacktrace.htm",
        "errorbacktrace",
        "centerscreen=yes,chrome=yes,modal=yes,resizable=yes",
        exception,
        "display error"
      ); 
}

function fg_getContents(aURL, charset){
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

function fg_getConfigFileURI(fileName) {
  return Components.classes["@mozilla.org/network/io-service;1"]
                   .getService(Components.interfaces.nsIIOService)
                   .newFileURI(fg_getConfigFile(fileName));
}

function fg_getConfigFile(fileName) {
	var file = fg_getConfigDir(null);
	file.append(fileName);
	if (!file.exists()){
		file.create(0,0644);
		var doc = document.implementation.createDocument("", "Config", null);
		doc.firstChild.appendChild(doc.createTextNode("\r\n"))
		var configStream = fg_getWriteStream(file);
		new XMLSerializer().serializeToStream(doc, configStream, "utf-8");
		configStream.close();
  	}
  return file;
}

function fg_getWriteStream(file) {
  var stream = Components.classes["@mozilla.org/network/file-output-stream;1"]
    .createInstance(Components.interfaces.nsIFileOutputStream);

  stream.init(file, 0x02 | 0x08 | 0x20, 420, -1);

  return stream;
}

function fg_getConfigDir(subdir) {

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

function fg_DBElement(uni,server,type,other) {
	this.uni = uni;
	this.server = server;
	this.type = type;
	this.other = other;
	this.modify = function (uni,server,type,other) {
		this.uni = uni;
		this.server = server;
		this.type = type;
		this.other = other;
	}
}

var fg_listaDBs = {
  configFile : null,
  data : null,
  tree : null,
  type : "DB",
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
  addElement: function(ele) {
	if (!('uni' in ele))
		return;
	for (var i = 0; i < this.data.length; i++) 
		if (this.data[i].uni == ele.uni && this.data[i].server == ele.server)
			return;

	this.data.push(new fg_DBElement(ele.uni,ele.server,ele.type,ele.other));
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
	this.data[i].modify(ele.uni,ele.server,ele.type,ele.other);

	this.tree.invalidateRow(i);
    },
  save : function() {
    var doc = document.implementation.createDocument("", "Config", null);
    
    for (var i = 0; i < this.data.length ; i++) {
      var scriptNode = doc.createElement("Database");

      scriptNode.setAttribute("uni", this.data[i].uni);
      scriptNode.setAttribute("server", this.data[i].server);
      scriptNode.setAttribute("type", this.data[i].type);

      scriptNode.setAttribute("other", this.data[i].other);

      doc.firstChild.appendChild(doc.createTextNode("\r\n\t"));
      doc.firstChild.appendChild(scriptNode);
    }

    doc.firstChild.appendChild(doc.createTextNode("\r\n"))

    var configStream = fg_getWriteStream(this.configFile);
    new XMLSerializer().serializeToStream(doc, configStream, "utf-8");
    configStream.close();
  }, 

  load : function() {
    var domParser = Components.classes["@mozilla.org/xmlextras/domparser;1"]
                              .createInstance(Components.interfaces.nsIDOMParser);

    var configContents = fg_getContents(fg_getConfigFileURI(this.configFile.leafName));
    var doc = domParser.parseFromString(configContents, "text/xml");
    var nodes = doc.evaluate("/Config/Database", doc, null, 0, null);

    this.data = [];

    for (var node = null; (node = nodes.iterateNext()); ) {
      var ele = {};

      ele.uni = node.getAttribute("uni");
      ele.server = node.getAttribute("server");
      ele.type = node.getAttribute("type");
      ele.other = node.getAttribute("other");

	this.data.push(new fg_DBElement(ele.uni,ele.server,ele.type,ele.other));
	if (typeof treeView != "undefined")
		treeView.treeBox.rowCountChanged(this.data.length-1,1);
    }
  }
};
