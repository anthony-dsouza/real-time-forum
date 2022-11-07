import RegisterForm from "./reg.js";
import loginForm from "./login.js";
import PostForm from "./post.js";
import logoutBtn from "./logout.js";

const formDiv = document.querySelector(".form-div");
const loginBut = document.querySelector(".login-section");
const regBut = document.querySelector(".reg-section");// to review for popup
const formPage = document.querySelector(".form-page")
const openBut = document.createElement("button")
const closeBut = document.createElement("button")

const body = document.querySelector("body")

const closeButDiv = document.createElement("div")

const openButonDiv = document.createElement("div")

openButonDiv.append(openBut)
closeButDiv.append(closeBut)
regBut.append(RegisterForm)
loginBut.append(loginForm)
openButonDiv.setAttribute("id", "membershipButton")
openBut.setAttribute("id", "openRegistrationPageButton")
openBut.textContent = "Login or Register"
closeButDiv.setAttribute("id", "closeRegistrationPageButton")
closeBut.textContent = String.fromCodePoint(0x274C)// X emoji

body.append(openButonDiv)
openBut.addEventListener("click", function () {//<!--- need to chang to popup---->
    formPage.style.display = "block"
});
closeBut.addEventListener("click", function () {//<!--- need to chang to popup---->
    formPage.style.display = "none"

});

formDiv.append(logoutBtn);
formDiv.append(loginForm);

formDiv.append(closeButDiv)
document.addEventListener("DOMContentLoaded", function () {//<!--- need to chang to popup---->
    formDiv.classList.add("show");
});
body.append(PostForm)

