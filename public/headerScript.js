const openBtn = document.querySelector("#topnav-open-btn");
const closeBtn = document.querySelector("#topnav-close-btn");
const media = window.matchMedia("(width < 40em)");
const topNavMenu = document.querySelector(".topnav-menu");
const main = document.querySelector("main");
const body = document.querySelector("body");

function setupTopNav(e) {
  if (e.matches) {
    // is mobile
    topNavMenu.setAttribute("inert", "");
    topNavMenu.style.transition = "none";
  } else {
    closeMobileView();
    topNavMenu.removeAttribute("inert");
  }
}

function openMobileView() {
  openBtn.setAttribute("aria-expanded", "true");
  topNavMenu.removeAttribute("inert");
  topNavMenu.removeAttribute("style");
  main.setAttribute("inert", "");
  bodyScrollLockUpgrade.disableBodyScroll(body);
  closeBtn.focus();
}

function closeMobileView() {
  openBtn.setAttribute("aria-expanded", "false");
  topNavMenu.setAttribute("inert", "");
  main.removeAttribute("inert");
  bodyScrollLockUpgrade.enableBodyScroll(body);
  openBtn.focus();

  setTimeout(() => {
    topNavMenu.style.transition = "none";
  }, 500);
}

setupTopNav(media);
openBtn.addEventListener("click", openMobileView);
closeBtn.addEventListener("click", closeMobileView);

media.addEventListener("change", (e) => {
  setupTopNav(e);
});
