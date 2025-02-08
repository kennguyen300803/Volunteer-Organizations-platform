// store userdata in localvariable - should be done using cookies but don't have time
var userData = {
    isLoggedIn: false,
    branches: [],
    currentBranch: 0,
    currentBranchName: ""
};

// show all organisations underneath dropdown
function showDropdown(event) {
    event.stopPropagation();
    var dropdown = event.target.nextElementSibling;
    toggleDropdown(dropdown);
}

function toggleDropdown(dropdown) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    for (var i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown !== dropdown && openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
        }
    }
    dropdown.classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.fa-earth-oceania')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        for (var i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
};

function waitForElm(selector) { // from https://stackoverflow.com/a/61511955
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    });
}

const parser = new DOMParser();
document.onload = headerTemplateLoad();

function headerTemplateLoad() { // load template header and footer and replace the templates that are in the page.
    let xhttp = new XMLHttpRequest();
    xhttp.responseType = 'text';
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            waitForElm('.header').then((elm) => {
                const htmlDoc = parser.parseFromString(this.response, 'text/html');
                elm.innerHTML = htmlDoc.getElementsByClassName("header")[0].innerHTML;
                // console.log(htmlDoc.getElementsByClassName("header")[0].innerHTML);
                if(!(document.querySelectorAll('footer')[0].className == 'footer_bottom')) {
                    document.querySelectorAll('footer')[0].innerHTML = htmlDoc.querySelectorAll('footer')[0].innerHTML;
                }
            checkLoggedIn();
            });
        }
    };
    // ("GET", "/events/show_RSVP?event="+eventID, true)
    xhttp.open("GET", "/webapp_header.html", true);
    xhttp.setRequestHeader("Content-type", "text/html");
    xhttp.send();
}

// const toggleBtn = document.querySelector('.toggle_btn');
// const toggleBtnIcon = document.querySelector('.toggle_btn i');
// const dropDown = document.querySelector('.drop_down');

// toggleBtn.addEventListener('click', function() {
//     dropDown.classList.toggle('open');
//     toggleBtnIcon.classList.toggle('fa-bars');
//     toggleBtnIcon.classList.toggle('fa-xmark');
// });

function checkLoggedIn() { // dynamic update based on user data
    let xhttp = new XMLHttpRequest();
    xhttp.responseType = 'json';
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // document.getElementById("output").innerText = this.responseText;
            userData = JSON.parse(this.response);
            // console.log(userData);
            UIUpdate();
        }
    };
    // ("GET", "/events/show_RSVP?event="+eventID, true)
    xhttp.open("GET", "/getuserdata", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
}

function UIUpdate() { // update header dynamic elements based on user session
    if((userData.isLoggedIn == true) || (userData.isLoggedIn == 'true')) {
        const signin_btns = document.getElementsByClassName("signin");
        for(var i = 0; i < Object.keys(signin_btns).length; i++) {
            // console.log(signin_btns[i]);
            signin_btns[i].removeAttribute("href");
            signin_btns[i].onclick = callSignout;
            signin_btns[i].innerText = "LOG OUT";
        }
        document.getElementById("showProfile").style.display = "inherit";
    }
    var dropdownHeader = document.getElementById("dropdown-header");
    dropdownHeader.innerHTML = '';
    // console.log(userData);

    for(let i = 0; i < Object.keys(userData.branches).length; i++) {
        let branch = userData.branches[i];
        // console.log(userData.currOrg);
        let dropChild = document.createElement("a");
        //  <div class="dropdown-content" id="dropdown-header">
        //      <a href="#" value=""></a>
        //  </div>
        dropChild.setAttribute('value', branch.orgID);
        dropChild.innerText = branch.branchName;
        dropChild.setAttribute('onclick', 'changeCurrBranch(this.getAttribute("value"))');
        dropdownHeader.appendChild(dropChild);

        if(userData.currOrg == branch.orgID) {
            // console.log(document.getElementById("orgText").innerText);
            document.getElementById("orgText").innerText = branch.branchName;
        }
    }
    // update current selected branch
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

function changeCurrBranch(value) {
    let xhttp = new XMLHttpRequest();
    xhttp.responseType = 'json';
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            location.reload();
        }
    };
    // ("GET", "/events/show_RSVP?event="+eventID, true)
    xhttp.open("POST", "/changebranch?currOrg="+value, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
}

// document.onload = headerTemplateLoad();
