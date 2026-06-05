const landingPage =
document.getElementById("landingPage");

const chatPage =
document.getElementById("chatPage");

function openChat(){

    landingPage.style.display="none";

    chatPage.style.display="flex";
}

function sendMessage(){

    const input =
    document.getElementById("messageInput");

    const chat =
    document.getElementById("chatContainer");

    if(input.value==="")
        return;

    let user =
    document.createElement("div");

    user.className="user-message";

    user.innerText=input.value;

    chat.appendChild(user);

    input.value="";

    chat.scrollTop=
    chat.scrollHeight;
}