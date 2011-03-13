var foxgame2_mode = 1;
var foxgame2_Delta = 0;
var foxgame2_diff = -4;
var foxgame2_format_h = "H:mm:ss";
var foxgame2_format_d = "d/MM ";
var counter = 0;

//***********************************************************************************
function foxgame2_timeInit(mode,delta,diff,format_h,format_d)
{
	foxgame2_mode = mode;
	foxgame2_Delta = delta;
	foxgame2_diff = diff;
	foxgame2_format_h = format_h;
	foxgame2_format_d = format_d;	
	updateTimes = foxgame2_updateTimes;
}
//***********************************************************************************
function foxgame2_returnTimeInit(mode, delta,diff,format_h,format_d)
{
	foxgame2_mode = mode;
	foxgame2_Delta = delta;
	foxgame2_diff = diff;
	foxgame2_format_h = format_h;
	foxgame2_format_d = format_d;
	foxgame2_adjustReturnTime();	
}
//***********************************************************************************
function foxgame2_eventInit(mode,delta,diff,format_h,format_d)
{
	foxgame2_mode = mode;
	foxgame2_Delta = delta;
	foxgame2_diff = diff;
	foxgame2_format_h = format_h;
	foxgame2_format_d = format_d;	
	foxgame2_changeTime = true;
}
//***********************************************************************************
function foxgame2_newDate(mode) 
{
	var date = new Date();
	if (mode == 0) //Hora cliente
		return date;
	if (mode == 1) //Hora servidor
	{
		date.setTime(date.getTime() - foxgame2_Delta);
		return date;
	}
	if (mode == 2) //Hora cliente minutos y segundos servidor
	{
		var horas = 1000 * 60 * 60;
		var diff = 0;
		if (foxgame2_Delta < 0)
			diff = -((- foxgame2_Delta) % horas);
		else
			diff = foxgame2_Delta % horas;
		date.setTime(date.getTime() - diff);
		return date;			
	}
	if (mode == 3) //Hora servidor + differencia
	{
		var horas = 1000 * 60 * 60;
		var diff = foxgame2_diff * horas;		
		date.setTime(date.getTime() - foxgame2_Delta + diff);
		return date;			
	}
}

//*****************************************************************************************
function foxgame2_formatDate(date, date2) {
		if (date.getDatum() != date2.getDatum())
			return foxgame2_formatDate2(date,foxgame2_format_d+" "+foxgame2_format_h);
		else
			return foxgame2_formatDate2(date,foxgame2_format_h);
}


//*****************************************************************************************
// append Date object with function to return only date part
Date.prototype.getDatum = function(){ 
	return Date.UTC(this.getFullYear(),this.getMonth(),this.getDate()); 
}

//***********************************************************************************
function foxgame2_updateTimes() 
{
	try {
		var add = duration;
		var hold = holdingTime * 3600;	
		var currTime = foxgame2_newDate(foxgame2_mode);
		currTime.setTime(currTime.getTime()+1000*add);
		var arrivalTime = foxgame2_formatDate(currTime, foxgame2_newDate(foxgame2_mode));		
		currTime.setTime(currTime.getTime()+1000*(add + hold));	
		var returnTime = foxgame2_formatDate(currTime, foxgame2_newDate(foxgame2_mode));
	
		try {
	    	durationAKS = durationAKS - 1;
	    	if (durationAKS > duration)
        		$("#durationAKS").html(getFormatedTime(durationAKS));
    	}catch (e){
    	}
	
		$("#arrivalTime").html(arrivalTime);
		$("#returnTime").html(returnTime);
	} catch (e) {
		alert(e);
	}
}

//******************************************************************************************
function foxgame2_adjustReturnTime(){
	try {
		var i=0;
		var obj;
		var date2 = foxgame2_newDate(foxgame2_mode);
		obj = $("#time_"+i);
		while (obj.length == 1) {
			var startTime = obj.attr("name");
			startTime = parseInt(startTime,10);
			var date3 = foxgame2_newDate(1);
			var date = foxgame2_newDate(foxgame2_mode);
			date.setTime(date.getTime() + date3.getTime() - startTime);
			if (date.getDate() != date2.getDate())
				obj.html(foxgame2_formatDate2(date,foxgame2_format_d+" "+foxgame2_format_h));
			else
				obj.html(foxgame2_formatDate2(date,foxgame2_format_h));
			i++;
			obj = $("#time_"+i);
		}
		if (i > 0)
			setTimeout(foxgame2_adjustReturnTime, 250);
	} catch (e) {
		alert(e);
	}
}