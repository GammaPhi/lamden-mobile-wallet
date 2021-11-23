import { writable } from "svelte/store";
import * as animateScroll from "svelte-scrollto";

export const page = writable(window.location.pathname);

export function navigateLink(e) {
	e.preventDefault();
    var modal = document.getElementById("mobileMenu");
	modal.style.display = "none";

	let href = this.href.replace("https://", "").replace("http://","").replace(window.location.host, "")
	console.log(window.location.hostname);
	console.log(href);
	history.pushState(history.state, '', href);
	page.set(href);
	animateScroll.scrollToTop();
}

export function navigateHome() {
    var modal = document.getElementById("mobileMenu");
	modal.style.display = "none";

	let href = "/";
	history.pushState(history.state, '', href);
	page.set(href);
	animateScroll.scrollToTop();
}