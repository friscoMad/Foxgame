gfSlider.slideInStep2 = gfSlider.slideInStep;
gfSlider.closed = true;

gfSlider.slideInStep = function() {
	gfSlider.slideInStep2();
	if (gfSlider.closed) {
		getElementByIdWithCache('planet').style.height = gfSlider.slideInObj.style.height;
		gfSlider.slideInObj.style.marginTop = '0px';
	}
	if (!gfSlider.inAction)
		gfSlider.closed = false;
	getElementByIdWithCache('planet').style.display = 'block';	
}

gfSlider.slideOutStep2 = gfSlider.slideOutStep;
gfSlider.slideOutStep = function() {
		gfSlider.slideOutStep2();
		getElementByIdWithCache('planet').style.display = 'none';
		gfSlider.closed = true;			
}		

gfSlider.hide2 = gfSlider.hide;
gfSlider.hide = function(obj) {
		gfSlider.hide2(obj);
		getElementByIdWithCache('planet').style.display = 'none';
		gfSlider.closed = true;			
}		

gfSlider.currHeight=getElementByIdWithCache('planet').getAttribute("name");
