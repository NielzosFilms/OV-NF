document.addEventListener("DOMContentLoaded", function (event) {
	var scrollpos = localStorage.getItem("scrollpos");
	if (scrollpos) window.scrollTo(0, scrollpos);
});

window.onbeforeunload = function (e) {
	localStorage.setItem("scrollpos", window.scrollY);
};

window.onload = function () {
	setInterval(function () {
		window.location.reload();
	}, 60000);
};
