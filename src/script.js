const socket = io();

const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('messageForm')
const messageInput = document.getElementById('input-box')
const fileInput = document.getElementById('input-file')

var cnt = 1;
const users = {};
const name= prompt('닉네임을 입력해주세요.')
appendMessage(`${moment().format('ll dddd')}`, 'day');
appendMessage(`<strong>${name}</strong>님이 들어오셨습니다.`, 'announcement')
$('#userlist').append(`
	<div class="user-container">
		<div class="user-profile" value="me">
			<img src="https://post-phinf.pstatic.net/MjAxNzA2MjlfMjU5/MDAxNDk4NzM5NzI3MjA0.Aon2aPyhufiwt9-Y21w0v1luZzlYnihR7Xcozypyf8Qg.QLFNlJRzJzd1TqWWSN0DyVeHxe8zsAxGc7PHwkNHy8gg.PNG/1483309553699.png?type=w1200">
		</div>
		<div class="mesign">나</div>${name}
	</div>
`);
socket.emit('new-user', name)

socket.on('get-userlist', data => {
	for (var userid in data) {
        var username = data[userid];
        $('#userlist').append(`
			<div class="user-container" value="${userid}">
				<div class="user-profile">
					<img src="https://post-phinf.pstatic.net/MjAxNzA2MjlfMjU5/MDAxNDk4NzM5NzI3MjA0.Aon2aPyhufiwt9-Y21w0v1luZzlYnihR7Xcozypyf8Qg.QLFNlJRzJzd1TqWWSN0DyVeHxe8zsAxGc7PHwkNHy8gg.PNG/1483309553699.png?type=w1200">
				</div>
				${username}
			</div>
        `);
		cnt++;
    }
	$('#usernum').text(cnt)
})

socket.on('chat-message', data => {
	console.log($('#message-container').children().last().val())
	$('#message-container').append(
		`
		<div class="otherChat" value="${data.id}">
			<div class="profile-img"> 
				<img src="https://post-phinf.pstatic.net/MjAxNzA2MjlfMjU5/MDAxNDk4NzM5NzI3MjA0.Aon2aPyhufiwt9-Y21w0v1luZzlYnihR7Xcozypyf8Qg.QLFNlJRzJzd1TqWWSN0DyVeHxe8zsAxGc7PHwkNHy8gg.PNG/1483309553699.png?type=w1200">
			</div>
			<div class="chat-box">
				<div class="name">${data.name}</div>
				<div>
					<div class="speech-bubble">
						<div class="bubble-box">
							${data.message}
						</div>
						<br>
					</div>
					<div class="time"> ${moment().format('LT')} </div>
				</div>
			</div>
		</div>		
		`
	);
	$('#message-container').scrollTop($('#message-container').prop("scrollHeight"));
})

socket.on('user-connected', data => {
	appendMessage(`<strong>${data.name}</strong>님이 들어오셨습니다.`, 'announcement')
	$('#userlist').append(
		`
		<div class="user-container" value="${data.id}">
			<div class="user-profile">
				<img src="https://post-phinf.pstatic.net/MjAxNzA2MjlfMjU5/MDAxNDk4NzM5NzI3MjA0.Aon2aPyhufiwt9-Y21w0v1luZzlYnihR7Xcozypyf8Qg.QLFNlJRzJzd1TqWWSN0DyVeHxe8zsAxGc7PHwkNHy8gg.PNG/1483309553699.png?type=w1200">
			</div>
			${data.name}
		</div>
		`
	);
	$('#usernum').text(++cnt)
})

socket.on('user-disconnected', data => {
	appendMessage(`<strong>${data.name}</strong>님이 나가셨습니다.`, 'announcement')
	$(`.user-container[value=${data.id}]`).remove();
	$('#usernum').text(--cnt)
})

messageForm.addEventListener('submit', e => {
	e.preventDefault()
	const message = messageInput.value
	$('#message-container').append(
		`
		<div class="myChat">
			<div class="chat-box">
				<div class="time"> ${moment().format('LT')} </div>
				<div class="speech-bubble">
					<div class="bubble-box">
						${message}
					</div>
					<br>
				</div>
			</div>
		</div>
		`
	);	
	$('#message-container').scrollTop($('#message-container').prop("scrollHeight"));
	socket.emit('send-chat-message', message)
	messageInput.value = ''
})

function appendMessage(message, type) {
	/*
	const messageLine = document.createElement('div')
	const messageBox = document.createElement('span')
	messageBox.innerText = message
	messageLine.append(messageBox)
	
	messageContainer.append(messageLine);
	//messageContainer.scrollTop();
	*/

	$('#message-container').append(
		`<div class= ${type} > ${message} </div>`
	);
	$('#message-container').scrollTop($('#message-container').prop("scrollHeight"));
}


	$( "#fileForm" ).ajaxForm(
		{
			url: "/uploaded",
			method: "post",
			enctype: "multipart/form-data",
			success: function ( data ){
				var img = "<img src='http://52.78.128.87:3000/"+data.originalname+"'>";
				$('#message-container').append(
					`
					<div class="myChat">
						<div class="chat-box">
							<div class="time"> ${moment().format('LT')} </div>
							<div class="speech-bubble">
								<div class="bubble-box">
									${img}
								</div>
								<br>
							</div>
						</div>
					</div>
					`
				);	
			}
		}
	);

	function upload_file(){
		$( "#fileForm" ).submit();
	}
/*
$( "#fileForm" ).ajaxForm(
	{
		url: "/uploaded",
		method: "post",
		enctype: "multipart/form-data",
		success: function ( data ){
			var img = "<img src='http://"+data.originalname+"'>";
			$("#photo").html(img);
		}
	}
);
fileInput.addEventListener('change',() => {
	const message = fileInput.value
	$('#message-container').append(
		`
		<div class="myChat">
			<div class="chat-box">
				<div class="time"> ${moment().format('LT')} </div>
				<div class="speech-bubble">
					<div class="bubble-box">
						${message}
					</div>
					<br>
				</div>
			</div>
		</div>
		`
	);
	
	socket.emit('send-chat-message', message)
});

*/
