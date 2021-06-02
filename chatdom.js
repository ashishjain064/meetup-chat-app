var socket = io();
var messages = document.getElementById("messages");
var form = document.getElementById("form");
var input = document.getElementById("input");
var heading = document.getElementById("heading");

input.addEventListener("focus", function () {
  if (!input.value) {
    setTimeout(() => {
      socket.emit("typing", "is typing");
    }, 2);
  }
});

socket.on("typing", function (typingmsg) {
  var item = document.createElement("h4");
  item.setAttribute("class", "heading2");
  console.log("42", heading.innerText); //
  if (!heading.innerText) {
    //if empty
    item.textContent = typingmsg;
    heading.appendChild(item);
  }
  //- debugger
  window.scrollTo(0, document.body.scrollHeight);
});

form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (input.value) {
    socket.emit("chat message", input.value);
    input.value = "";
  }
});

socket.on("chat message", function (msg) {
  var item = document.createElement("li");

  var str = msg;
  var res = str.split(": ");
  console.log(res[0]);
  // if (person == res[0]) {
  item.setAttribute("class", "me");
  // }
  //  else if (person != res[0]) {
  //   item.setAttribute("class", "him");
  // }
  item.textContent = msg;
  messages.appendChild(item);
  heading.innerText = "";
  window.scrollTo(0, document.body.scrollHeight);
});

function notTyping() {
  if (!input.value)
    setTimeout(() => {
      heading.innerText = "";
    }, 1);
}
