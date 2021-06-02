// var interestlinkfinal = document.getElementById("interest");
var interestlinktest = "chat";

function redirect(interestlinktest) {
  var urlgo =
    "http://localhost:3000/" +
    interestlinktest +
    "/" +
    interestlinktest +
    ".pug";
  var TheDemoURL = window.location.protocol + "//" + window.location.host;
  window.location.replace(TheDemoURL);
}
// iform.addEventListener("submit", function () {
//   console.log(req.body); //
// });
