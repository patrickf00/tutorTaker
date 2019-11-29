var messages = document.getElementById("messages");
var textbox = document.getElementById("textbox");
var button = document.getElementById("button");

const tokenProvider = new Chatkit.TokenProvider({
  url: "https://us1.pusherplatform.io/services/chatkit_token_provider/v1/72542696-9aeb-4905-b562-282191c1d894/token"
});

const chatManager = new chatkit.ChatManager({
  instanceLocator: "v1:us1:72542696-9aeb-4905-b562-282191c1d894",
  userId: 1 //TODO: figure out how to send
})

button.addEventListener("click", function(){
     var newMessage = document.createElement("li");
     newMessage.innerHTML = textbox.value;
     messages.appendChild(newMessage);
     textbox.value = "";
});
