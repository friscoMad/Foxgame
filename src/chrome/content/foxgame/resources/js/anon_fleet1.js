// ==ANONUserScript==
// @file        anon_fleet1.js
// @name        anon_fleet1
// @description Enhances Fleet page 1, with cargo space, ships needed to take resources, ...
// @author      SolarAngel (SA) <furry[you know what comes here]tesla.rcub.bg.ac.yu>
// @include     http://uni*.ogame.*/game/flotten1.php?session=*&mode=Flotte*
// ==/ANONUserScript==

//*****************************************************************************************
var fg_shipCapacity = new Array (0,0,5000,25000,50,100,800,1500,7500,20000,0,500,0,2000,1000000,750);

//*****************************************************************************************
// parseInt fix to always parse value in system of 10
//
var _parseInt = function(string, system){ return parseInt(string, system||10); };

//*****************************************************************************************

function isNumber(a) {
  return typeof a == 'number' && isFinite(a);
}

//*****************************************************************************************
// don't ask, I know I am insane ;)
function formatNumber(n,p,g){
  var b=n<0,a=new Array(),v='';p=p||'.';g=g||3;
  var s=(b?(v+n).substring(1):v+n).split(v).reverse().join(v);
  for(var i=0;i<s.length;i+=g)a[Math.ceil(i/g)]=s.substring(i,i+g);
  return (b?'-':v)+a.join(p).split(v).reverse().join(v);
};

function formatNumberRe(n,p,g) {
  n+='';p='$1'+(p||'.')+'$2';g=g||3;
  var re = new RegExp('(\\d+)(\\d{'+g+'})','');
  while (re.test(n)) n=n.replace(re, p);
  return n;
}

//*****************************************************************************************

function ShowCapacity() {
try {
	var input       = 	document.evaluate('//input[starts-with(@name,"am")]',document,null,
						XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
	var capic       = 0;
	var shipNumber;
	var shipCargo;

	if (input.snapshotLength == 0)
		return;
	for(var i=0; i< input.snapshotLength ;i++) {
		var item = input.snapshotItem(i);
		var name = item.getAttribute('name');
		shipCargo = fg_shipCapacity[_parseInt(name.substr(3))];			
		shipNumber = _parseInt(item.value);
		if(isNumber(shipNumber)) 
			capic+=shipNumber*shipCargo;
	}
	capic = capic<0?0:capic;
	capic = formatNumberRe(capic,'.',3);
    // NOW WHERE TO INSERT (find cell with "-" text in it, and add capacity to next cell)
    var capacity = document.getElementById("capacity_number");
    if (capacity !== null) {
    	capacity.innerHTML = capic;
    	return;
	}
	var path = '//span[@class="send_none"]';
	var obj = document.evaluate(path,document,null,
			XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    if (obj.snapshotLength == 0) return;
    var div = obj.snapshotItem(0);
    var new_div = div.cloneNode(false);
    new_div.setAttribute("style","font-size:large;color:lime;");
    var span = document.createElement("span");
    span.setAttribute("id","capacity_number");
    span.appendChild(document.createTextNode(capic));
    new_div.appendChild(span);
    div.parentNode.parentNode.insertBefore(new_div,div.parentNode.nextSibling);
	
  }catch(e){ alert(e) }
};// end ShowCapacity();


//*****************************************************************************************

$("input[name^='am']").keyup(ShowCapacity);
$("input[name^='am']").change(ShowCapacity);
$("a.max").click(ShowCapacity);

$("span.send_none a, #sendall").click(ShowCapacity);
$("select.combatunits option").click(ShowCapacity);
ShowCapacity();

