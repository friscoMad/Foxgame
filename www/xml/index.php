<?php
echo "hola1";
require_once('xml_domit_parser.php');
echo "hola2";
//header ("Content-type: application/xhtml+xml");
//header ("Charset: utf-8");

$domains = array('ogame.com.es','ogame.de','ogame.org', 'ogame.pl', 'ogame.fr', 'ogame.nl', 'ogame.it', 
'ogame.dk', 'ogame.com.br', 'ogame.com.pt', 'ogame.ru', 'ogame.sk', 'ogame.com.tr', 'ogame.com.tw', 'ogame.com.hr','ogame.ba');

set_time_limit(0);
echo "hola3";

$resdoc = new DOMIT_Document();
$xmlDecl =& $resdoc->createProcessingInstruction('xml', 'version="1.0" encoding="utf-8"');
$resdoc->appendChild($xmlDecl);
$rootElement =& $resdoc->createElement('universes');
$resdoc->appendChild($rootElement);

echo "hola4";
for ($i = 0; $i < count($domains); $i++)
{
	parseWeb($domains[$i],$rootElement, $resdoc);
}

echo $resdoc->toNormalizedString(false,false);

function parseWeb($string, $rootElement, $resdoc) {
	$xmldoc = new DOMIT_Document();
	$xmldoc->expandEmptyElementTags(true);
	$xmldoc->setNamespaceAwareness(true);
	$xmldoc->useHTTPClient(true);

	if (strrpos($string, 'ba') || strrpos($string, 'hr'))
		$success = $xmldoc->loadXML("http://$string/portal/?frameset=1&lang=yu");
	else
		$success = $xmldoc->loadXML("http://$string/portal/?frameset=1");
	if (!$success) {
		echo "Error code: " . $xmldoc->getErrorCode();
		echo "\n<br />";
		echo "Error string: " . $xmldoc->getErrorString();
		echo "Error";
		return;
	}
	$childRoot =& $resdoc->createElement('index');
	$childRoot->setAttribute('url',$string);
	$nodeList =& $xmldoc->selectNodes('//select[@name="Uni"]/option');
	for ($i = 0; $i < $nodeList->getLength(); $i++){
		if ($nodeList->item($i)->getAttribute('value') == "") continue;
		$child =& $resdoc -> createElement('universe');
		$name = $nodeList->item($i)->getText();
		$name = split('\.',$name,2);
		if (strlen($name[0]) == 1)
			$name[0] = '0'.$name[0];
		if (strrpos($string,'tw')){
			$name = $name[0].'. 宇宙';
		} else if (strrpos($string,'ru')){
			$name = $name[0].'. Вселенная';
		}else {
			$name = $name[0].'.'.$name[1];
		}
		$child->setAttribute('name',$name);
		$child->setAttribute('value',$nodeList->item($i)->getAttribute('value'));
		$childRoot->appendChild($child);
	}
	$rootElement->appendChild($childRoot);
}
?>