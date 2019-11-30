var messages = document.getElementById("myForm");
var textbox = document.getElementById("textbox");
var button = document.getElementById("button");

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

const tokenProvider = new Chatkit.TokenProvider({
  url: "https://us1.pusherplatform.io/services/chatkit_token_provider/v1/72542696-9aeb-4905-b562-282191c1d894/token"
});

const chatManager = new chatkit.ChatManager({
  instanceLocator: "v1:us1:72542696-9aeb-4905-b562-282191c1d894",
  userId: getCookie("uid"),
  tokenProvider: tokenProvider
});

function displayMessage(message){
  var newMessage = document.createElement("li");
  newMessage.innerHTML = message;
  messages.appendChild(newMessage);
}
