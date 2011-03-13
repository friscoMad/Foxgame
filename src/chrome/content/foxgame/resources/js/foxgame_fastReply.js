
$("#openCloseForm").click(function(){
	$(".answerHeadline").toggleClass("open");
	if($(".answerHeadline").hasClass("open")) {
		$("#answerForm").show();
	    $(".textWrapper").addClass("textWrapperSmall");
    	$(".textWrapper").removeClass("textWrapper");
	} else {
    	$("#answerForm").hide();
    	$(".textWrapperSmall").addClass("textWrapper");
    	$(".textWrapperSmall").removeClass("textWrapperSmall");
	}
});
$('.answerHeadline').unbind();
$("#openCloseForm,#ButtonReply,#ButtonQuote").hover(function() {
		$(this).addClass("pushable");
		$(this).css("cursor","pointer");
	}, function() {
        $(this).removeClass("pushable");
		$(this).css("cursor","");        
    });

function foxgame2_initReplys (Session, From, Message, PMTitle, CircTitle, PMReply, CircReply, Quote, Clear){
	if(From == "null") {
		$("#ButtonReply").remove();
	} else {
		$("#ButtonReply").click(function(){
			if($(this).text().trim() == "["+PMReply+"]") {		
				$("#answerForm form").get(0).action = "index.php?page=messages&session="+Session+"&to="+From+"&isAnswerMessage=1&relationMessageId="+Message;
				foxgame2_changeFade($("#ButtonReply"),50,"["+CircReply+"]",50);
				foxgame2_changeFade($("#Replytype"),100,PMTitle,500);
				$('#ButtonQuote').fadeOut(600);
			}else {
				$("#answerForm form").get(0).action = "index.php?page=networkkommunikation&session="+Session;
				foxgame2_changeFade($("#ButtonReply"),50,"["+PMReply+"]",50);
				foxgame2_changeFade($("#Replytype"),100,CircTitle,500);
				$('#ButtonQuote').fadeIn(100);
			}
		});
	}		
	$('#ButtonQuote').toggle(function() {		
		var msgC = $('.note:first').text().trim()+"\n";
		msgC ='[color=lime]-------------------------------------------'+"\n"+
			msgC+'-------------------------------------------[/color]'+"\n";

		document.getElementsByClassName('mailnew')[0].value = msgC;
		foxgame2_changeFade($("#ButtonQuote"),50,'['+Clear+']',50);
	},function() {
		document.getElementsByClassName('mailnew')[0].value = "";
		foxgame2_changeFade($("#ButtonQuote"),50,'['+Quote+']',50);
	});
}
function foxgame2_changeFade(obj,velOut,text,velIn) {
	obj.fadeOut(velOut,function(){
		$(this).html(text);		
		$(this).fadeIn(velIn);
	});
}
function foxgame2_modifyForm() {
	$("#answerForm form").append('<input type="hidden" name="empfaenger" value="0"></input>').attr("name","asdf");
	$("#answerForm form input[type='submit']").attr("name","submitMail");
}