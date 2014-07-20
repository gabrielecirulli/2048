$(function(){

	$('.settings').click(function() {
		$('.menu').addClass('show');
	});

	$('.close').click(function(){
		$('.menu').removeClass('show');
	});

	$('.scheme').click(function(){
		$('.colorops').toggleClass('show');
		$('.scharrowdown').toggleClass('show2');
		$('.scharrowright').toggleClass('hide');
	});

	$('.scheme1').click(function(){
		$('html, body').removeClass('sc2');
		$('html, body').removeClass('sc3');
		$('html, body').removeClass('sc4');
		$('html, body').addClass('sc1');
	});

	$('.scheme2').click(function(){
		$('html, body').removeClass('sc1');
		$('html, body').removeClass('sc3');
		$('html, body').removeClass('sc4');
		$('html, body').addClass('sc2');
	});

	$('.scheme3').click(function(){
		$('html, body').removeClass('sc1');
		$('html, body').removeClass('sc2');
		$('html, body').removeClass('sc4');
		$('html, body').addClass('sc3');
	});

	$('.scheme4').click(function(){
		$('html, body').removeClass('sc1');
		$('html, body').removeClass('sc3');
		$('html, body').removeClass('sc2');
		$('html, body').addClass('sc4');
	});
});