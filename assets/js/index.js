import chatForm from "./chat.js";
import RegisterForm from "./reg.js";
import loginForm from "./login.js";
import PostForm from "./post.js";
import LogoutButton from "./logout.js";
const loginArea = document.querySelector("#userPopUpPOne")
const loginInputs = loginArea.firstElementChild
const regArea = document.querySelector("#userPopUpPTwo")
const reginInputs = regArea.firstElementChild
const postPage = document.querySelector(".postPage")
loginInputs.append(loginForm)
reginInputs.append(RegisterForm)
loginArea.append(loginInputs)
regArea.append(reginInputs)
postPage.append(PostForm)
postPage.append(LogoutButton)
const chatBox = document.createElement("div")
chatBox.append(chatForm);
postPage.append(chatBox);