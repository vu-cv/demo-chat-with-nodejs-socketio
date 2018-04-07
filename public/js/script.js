var socket = io("http://localhost") ;

socket.on('server-send-reg-fail', function() {
	alert("Username đã tồn tại")
});
socket.on('server-send-reg-ok', function(data) {
	// alert("Đăng ký thành công! " + data);
	$('#current-user').text(data);
	$('.loginform').hide(2000);
	$('.chatform').show(1000);
});

socket.on('server-send-list-user', function(data) {
	$('#user-online').html("");
	data.forEach(function (i) {
		$('#user-online').append('<li class="list-group-item">'+i+'</li>');
	});
});
socket.on('server-send-message', function(data) {
	$('.message-content ul').append('<li>'+data.usn+': '+data.content+'</li>');
});
socket.on('server-send-focusin', function(data) {
	$('#userfocus').text(data + ' đang gõ...');
	$('#userfocus').show();
});
socket.on('server-send-focusout', function(data) {
	$('#userfocus').hide();
});

$(document).ready(function() {
	$('.loginform').show();
	$('.chatform').hide();

	$('#btnReg').click(function () {
		socket.emit("client-send-username", $('#txtName').val());
	});

	$('#btnlogout').click(function () {
		socket.emit("client-send-logout");
		$('.loginform').show(1);
		$('.chatform').hide(2);
	});

	$('#btnsendmessage').click(function () {
		socket.emit('client-send-message', $('#txtmessage').val());
	})

	$('#txtmessage').focusin(function() {
		socket.emit('client-send-focusin');
	});
	$('#txtmessage').focusout(function() {
		socket.emit('client-send-focusout');
	});

});