function hackedfunction() {
  var checkBox = document.getElementById("hacked");

  var nonhackedbotun = document.getElementById("nothackeddiv");

  var hackedbotun = document.getElementById("hackeddiv");

  if (checkBox.checked == true) {
    nonhackedbotun.style.display = "none";
    hackedbotun.style.display = "block";
    console.log("evo");
  } else {
    hackedbotun.style.display = "none";
    nonhackedbotun.style.display = "block";
    console.log("evo");
  }
}

function hackedcatfunction() {
  var checkBox = document.getElementById("hackedcat");
  var hackedbotun = document.getElementById("divhackedcat");

  if (checkBox.checked == true) {
    hackedbotun.style.display = "block";
  } else {
    hackedbotun.style.display = "none";
  }
}
