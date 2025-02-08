// RESPONSIVE DESIGN fubctionality
var userData = false;

const toggleBtn = document.querySelector('.toggle_btn');
const toggleBtnIcon = document.querySelector('.toggle_btn i');
const dropDown = document.querySelector('.drop_down');

toggleBtn.addEventListener('click', function() {
    dropDown.classList.toggle('open');
    toggleBtnIcon.classList.toggle('fa-bars');
    toggleBtnIcon.classList.toggle('fa-xmark');
});

document.onload = checkLoggedIn();

const parser = new DOMParser();

// function headerTemplateLoad() {
//     fetch("webapp_header.html")
//         .then((response) => response.text())
//         .then((text) => {
//             const htmlDoc = parser.parseFromString(text, 'text/html');
//             // console.log(htmlDoc.getElementById("header").innerHTML);
//             document.getElementById("header").innerHTML = htmlDoc.getElementById("header").innerHTML;
//             checkLoggedIn();
//         });
// }

function checkLoggedIn() {
    let xhttp = new XMLHttpRequest();
    xhttp.responseType = 'json';
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // document.getElementById("output").innerText = this.responseText;
            let userDataJSON = JSON.parse(this.response);
            userData = userDataJSON.isLoggedIn;
            // console.log(userData);
            if(userData == true) {
                const signin_btns = document.getElementsByClassName("signin");
                for(var i = 0; i < Object.keys(signin_btns).length; i++) {
                    // console.log(signin_btns[i]);
                    signin_btns[i].removeAttribute("href");
                    signin_btns[i].onclick = callSignout;
                    signin_btns[i].innerText = "LOG OUT";
                }
            }
        }
    };
    xhttp.open("GET", "/getuserdata", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
}

function callSignout() {
    let req = new XMLHttpRequest();
    req.onreadystatechange = function(){
        if(req.readyState == 4 && req.status == 200){
            alert('Logout successful');
            location.reload();
        } else if(req.readyState == 4 && req.status == 401){
            alert('Logout unsuccessful');
        }
    };
    req.open('POST','/logout');
    req.setRequestHeader('Content-Type','application/json');
    req.send();
}

// document.onload = headerTemplateLoad();
