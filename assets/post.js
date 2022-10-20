let postSocket = null; 
document.addEventListener("DOMContentLoaded", function() {
    postSocket = new WebSocket("ws://localhost:8080/postWs/");
    console.log("JS attempt to connect");
    postSocket.onopen = () => console.log("connected");
    postSocket.onclose = () => console.log("Bye");
    postSocket.onerror = (err) => console.log("Error!");
    postSocket.onmessage = (msg) => {
        const resp = JSON.parse(msg.data);
        console.log({resp});
        if (resp.label === "Greet") {
            console.log(resp.content);
        } else if (resp.label === "post") {
            console.log(resp.content);
        }
    }
});

const PostHandler = function(e) {
    e.preventDefault();
    const formFields = new FormData(e.target);
    const payloadObj = Object.fromEntries(formFields.entries());
    payloadObj["label"] = "post";
    console.log({payloadObj});
    postSocket.send(JSON.stringify(payloadObj));
};

const PostForm = document.createElement("form");
PostForm.addEventListener("submit", PostHandler);

// login form
// name label
const titleLabelDiv = document.createElement('div');
const titleLabel = document.createElement('label');
titleLabel.textContent = "title";
titleLabel.setAttribute("for", "title");
titleLabelDiv.append(titleLabel);
// name input
const titleInputDiv = document.createElement('div');
const titleInput = document.createElement('input');
titleInput.setAttribute("type", "text");
titleInput.setAttribute("name", "title");
titleInput.setAttribute("id", "title");
titleInputDiv.append(titleInput);
//-------------------
const CatDiv = document.createElement('div');
const CatOptionDiv = document.createElement('div');
const CatLabel = document.createElement("label");
CatLabel.textContent= "Please choose category";
CatLabel.setAttribute("for","cat");
CatDiv.append(CatLabel);
const CatInputOpt1= document.createElement("input");
const CatInputOpt2= document.createElement("input");
const CatInputOpt3= document.createElement("input");
const CatInputOpt4= document.createElement("input");
const CatLabelOpt1= document.createElement("label");
const CatLabelOpt2= document.createElement("label");
const CatLabelOpt3= document.createElement("label");
const CatLabelOpt4= document.createElement("label");
CatInputOpt1.setAttribute("type","radio");
CatInputOpt2.setAttribute("type","radio");
CatInputOpt3.setAttribute("type","radio");
CatInputOpt4.setAttribute("type","radio");
CatInputOpt1.setAttribute("name","category_option");
CatInputOpt2.setAttribute("name","category_option");
CatInputOpt3.setAttribute("name","category_option");
CatInputOpt4.setAttribute("name","category_option");
CatInputOpt1.setAttribute("id","1");
CatInputOpt2.setAttribute("id","2");
CatInputOpt3.setAttribute("id","3");
CatInputOpt4.setAttribute("id","4");
CatInputOpt1.setAttribute("value","1");
CatInputOpt2.setAttribute("value","2");
CatInputOpt3.setAttribute("value","3");
CatInputOpt4.setAttribute("value","4");
CatLabelOpt1.setAttribute("for","1");
CatLabelOpt2.setAttribute("for","2");
CatLabelOpt3.setAttribute("for","3");
CatLabelOpt4.setAttribute("for","4");
CatLabelOpt1.textContent= "1";
CatLabelOpt2.textContent= "2";
CatLabelOpt3.textContent= "3";
CatLabelOpt4.textContent= "4";
CatOptionDiv.append(
    CatInputOpt1,CatLabelOpt1,
    CatInputOpt2,CatLabelOpt2,
    CatInputOpt3,CatLabelOpt3,
    CatInputOpt4,CatLabelOpt4);

CatOptionDiv.setAttribute("id", "category");
//=-----------------------
// pw label
const contLabelDiv = document.createElement('div');
const contLabel = document.createElement('label');
contLabel.textContent = "content:";
contLabel.setAttribute("for", "content");
contLabelDiv.append(contLabel);
// password input
const contInputDiv = document.createElement('div');
const contInput = document.createElement('input');
contInput.setAttribute("type", "text");
contInput.setAttribute("name", "content");
contInput.setAttribute("id", "content");
contInputDiv.append(contInput);

const PostSubmitDiv = document.createElement('div');
const PostSubmit = document.createElement("button");
PostSubmit.textContent = "Post";
PostSubmit.setAttribute("type", "submit");
PostSubmitDiv.append(PostSubmit);

PostForm.append(titleLabelDiv, titleInputDiv, CatDiv,CatOptionDiv,contLabelDiv, contInputDiv, PostSubmitDiv);

export default PostForm;