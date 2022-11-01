let postSocket = null;
let jsonFile //this is a new section////////////////////////////////
const body = document.getElementsByTagName("BODY")[0]
const comment = document.getElementsByClassName("comment")
document.addEventListener("DOMContentLoaded", function () {
    postSocket = new WebSocket("ws://localhost:8080/postWs/");
    console.log("JS attempt to connect");
    postSocket.onopen = () => console.log("connected-postCreate");
    postSocket.onclose = () => console.log("Bye-postCreate");
    postSocket.onerror = (err) => console.log("Error!-postCreate", err);
    postSocket.onmessage = (msg) => {
        const resp = JSON.parse(msg.data);
        console.log({ resp });
        if (resp.label === "Greet") {
            jsonFile = JSON.parse(resp.content)
            console.log("this is resp content", resp.content)
            createPost(jsonFile)
        } else if (resp.label === "post") {
            jsonFile = JSON.parse(resp.content)
            createPost(jsonFile)
        } else if (resp.label === "comment") {
            jsonFile = JSON.parse(resp.content)
            console.log("label is now comment----------------------")
            CreateComments(jsonFile)
        }
    }
});
function createPost(arr) {
    document.querySelectorAll("#curentPost").forEach(e => {
        e.remove();//this is a new section////////////////////////////////
    });
    const curentPost = document.createElement("div")
    curentPost.id = "curentPost"
    for (let i = 0; i < arr.length; i++) {
        const postDiv = document.createElement("div")
        postDiv.className = "PostContainer"//-----------------------------------------------------------------------------Godfrey
        const titleDiv = document.createElement("div");
        const titleButton = document.createElement("div")//-----------------------------------------------------------------------------Godfrey
        titleButton.setAttribute("value", i)
        titleButton.addEventListener("click", function (e) {
            showcommentHandler
            console.log("lastjsonfile", jsonFile)
            let valu = e.explicitOriginalTarget.value
            const comment = document.querySelector(".comment")
            comment.style.height = "%100"
            let chosenPost = document.querySelector(`#post-${valu}`)
            console.log("post is choosen")
            let clone = chosenPost.cloneNode(true)
            const closeComments = document.createElement("button")
            closeComments.textContent = String.fromCodePoint(0x274C)
            closeComments.addEventListener("click", function () {
                comment.style.height = "0%"
                while (comment.firstChild) {
                    comment.removeChild(comment.firstChild)
                }
            })
            let comForm = CreateCommentForm(valu)
            commentHandler
            let comments = CreateComments(jsonFile)
            comment.append(clone, comments, comForm, closeComments)
            comment.style.height = "100%";
        })
        titleButton.innerText = (arr[i].postinfo.title)
        // titleButton.style.padding = "0"
        // titleButton.style.border = "none"
        // titleButton.style.background = "none"
        const contentDiv = document.createElement("div");
        const categoryDiv = document.createElement("div");
        const userIdDiv = document.createElement("div");
        postDiv.id = `post-${i}`;
        titleDiv.id = `curentPostTitle-${i}`;
        titleDiv.className = "curentPostTitle"//-----------------------------------------------------------------------------Godfrey
        contentDiv.id = `PostContent-${i}`;
        contentDiv.className = "PostContent"//-----------------------------------------------------------------------------Godfrey
        categoryDiv.id = `PostCategory-${i}`;
        categoryDiv.className = "PostCategory"//-----------------------------------------------------------------------------Godfrey
        userIdDiv.id = `id-${i}`;
        // const titleText = document.createElement("p")
        // titleText.style.fontWeight= "900"
        const contentText = document.createElement("p")
        const categoryText = document.createElement("p")
        // categoryText.style.backgroundColor = "grey"
        // categoryText.style.width = "10%"
        const userIdText = document.createElement("p")
        // const titletextNode = document.createTextNode(arr[i].postinfo.title) 
        // titleText.appendChild(titletextNode)
        const contenttextNode = document.createTextNode(arr[i].postinfo.Content)
        contentText.appendChild(contenttextNode)
        const categorytextNode = document.createTextNode(arr[i].postinfo.category_option)
        categoryText.appendChild(categorytextNode)
        const userIdtextNode = document.createTextNode(arr[i].postinfo.userID)
        userIdText.appendChild(userIdtextNode)
        // titleDiv.append(titleText)
        titleDiv.append(titleButton)
        contentDiv.append(contentText)
        categoryDiv.append(categoryText)
        userIdDiv.append(userIdText)
        postDiv.append(titleDiv, contentDiv, categoryDiv, userIdDiv)
        curentPost.append(postDiv)
    }
    body.appendChild(curentPost)
}
const PostHandler = function (e) {
    e.preventDefault();
    const formFields = new FormData(e.target);
    const payloadObj = Object.fromEntries(formFields.entries());
    payloadObj["label"] = "post";
    console.log({ payloadObj });
    postSocket.send(JSON.stringify(payloadObj));
};

const PostForm = document.createElement("form");
PostForm.addEventListener("submit", PostHandler);

// Creating New post
const titleLabelDiv = document.createElement('div');
const titleLabel = document.createElement('label');
titleLabel.textContent = "Subject Title";
titleLabel.setAttribute("for", "SubjectTitle");
titleLabelDiv.append(titleLabel);
// name input
const titleInputDiv = document.createElement('div');
const titleInput = document.createElement('input');
titleInput.setAttribute("type", "text");
titleInput.setAttribute("name", "title");
titleInput.setAttribute("id", "title Field");
titleInputDiv.append(titleInput);
//-------------------
const CatDiv = document.createElement('div');
const CatOptionDiv = document.createElement('div');
const CatLabel = document.createElement("label");
CatLabel.textContent = "Please choose category";
CatLabel.setAttribute("for", "cat");
CatDiv.append(CatLabel);
const CatInputOpt1 = document.createElement("input");
const CatInputOpt2 = document.createElement("input");
const CatInputOpt3 = document.createElement("input");
const CatInputOpt4 = document.createElement("input");
const CatLabelOpt1 = document.createElement("label");
const CatLabelOpt2 = document.createElement("label");
const CatLabelOpt3 = document.createElement("label");
const CatLabelOpt4 = document.createElement("label");
CatInputOpt1.setAttribute("type", "radio");
CatInputOpt2.setAttribute("type", "radio");
CatInputOpt3.setAttribute("type", "radio");
CatInputOpt4.setAttribute("type", "radio");
CatInputOpt1.setAttribute("name", "category_option");
CatInputOpt2.setAttribute("name", "category_option");
CatInputOpt3.setAttribute("name", "category_option");
CatInputOpt4.setAttribute("name", "category_option");
CatInputOpt1.setAttribute("id", "1");
CatInputOpt2.setAttribute("id", "2");
CatInputOpt3.setAttribute("id", "3");
CatInputOpt4.setAttribute("id", "4");
CatInputOpt1.setAttribute("value", "1");
CatInputOpt2.setAttribute("value", "2");
CatInputOpt3.setAttribute("value", "3");
CatInputOpt4.setAttribute("value", "4");
CatLabelOpt1.setAttribute("for", "1");
CatLabelOpt2.setAttribute("for", "2");
CatLabelOpt3.setAttribute("for", "3");
CatLabelOpt4.setAttribute("for", "4");
CatLabelOpt1.textContent = "1";
CatLabelOpt2.textContent = "2";
CatLabelOpt3.textContent = "3";
CatLabelOpt4.textContent = "4";
CatOptionDiv.append(
    CatInputOpt1, CatLabelOpt1,
    CatInputOpt2, CatLabelOpt2,
    CatInputOpt3, CatLabelOpt3,
    CatInputOpt4, CatLabelOpt4);

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
//need to creat a classList and function for all the titleInputDiv
PostForm.append(titleLabelDiv, titleInputDiv, CatDiv, CatOptionDiv, contLabelDiv, contInputDiv, PostSubmitDiv);

function CreateCommentForm(value) {
    const commentForm = document.createElement("form")
    commentForm.addEventListener("submit", commentHandler);
    const commentLabelDiv = document.createElement('div');
    const commentLabel = document.createElement('label');
    commentLabel.textContent = "create a comment:";
    commentLabel.setAttribute("for", "content");
    commentLabelDiv.append(commentLabel);
    const commentInputDiv = document.createElement('div');
    const commentInput = document.createElement('input');
    commentInput.setAttribute("type", "text");
    commentInput.setAttribute("name", "content");
    commentInput.setAttribute("placeholder", "type here...");
    commentInput.setAttribute("id", "content");
    commentInputDiv.append(commentInput);
    const commentSubmitDiv = document.createElement('div');
    const commentSubmit = document.createElement("button");
    commentSubmit.textContent = "comment";
    commentSubmit.setAttribute("type", "submit");
    commentSubmitDiv.append(commentSubmit);
    const postValue = document.createElement("input")
    const postValueLabel = document.createElement("label")
    postValueLabel.setAttribute("for", "postID")
    postValue.setAttribute("type", "hidden")
    postValue.setAttribute("value", value)
    postValue.id = "postID"
    postValueLabel.append(postValue)
    commentForm.append(commentLabelDiv, commentInputDiv, commentSubmitDiv, postValueLabel)
    return commentForm
}
const commentHandler = function (e) {
    e.preventDefault();
    const formFields = new FormData(e.target);
    const payloadObj = Object.fromEntries(formFields.entries());
    payloadObj["label"] = "comment";
    postSocket.send(JSON.stringify(payloadObj));
};
const showcommentHandler = function (e) {
    e.preventDefault();
    const formFields = new FormData(e.target);
    const payloadObj = Object.fromEntries(formFields.entries());
    payloadObj["label"] = "showComment";
    postSocket.send(JSON.stringify(payloadObj));
};
function CreateComments(arr) {
    document.querySelectorAll("#allComments").forEach(e => {
        e.remove();
    });
    console.log("func check", arr)
    const allComments = document.createElement("div")
    allComments.id = "allComments"
    for (let i = 0; i < arr.length; i++) {
        const comDiv = document.createElement("div")
        const comContentDiv = document.createElement("div");
        const comUserIdDiv = document.createElement("div");
        comDiv.id = `comment-${i}`;
        comContentDiv.id = `comment-${i}`;
        comUserIdDiv.id = `userId-${i}`;
        const commentText = document.createElement("p")
        const comUserIdText = document.createElement("p")
        const coommenTextNode = document.createTextNode(arr[i].postinfo.Content)
        const comUserIdtextNode = document.createTextNode(arr[i].postinfo.userID)
        commentText.appendChild(coommenTextNode)
        comUserIdText.appendChild(comUserIdtextNode)
        comContentDiv.append(commentText)
        comUserIdDiv.append(comUserIdText)
        comDiv.append(comContentDiv, comUserIdDiv)
        allComments.append(comDiv)
    }
    return allComments
}

export default PostForm;
