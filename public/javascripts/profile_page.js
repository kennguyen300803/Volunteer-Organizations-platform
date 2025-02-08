function edit_profile() {
    let userData = {
        firstName: document.getElementById('firstname').value,
        lastName: document.getElementById('lastname').value,
        DOB: document.getElementById('dob').value,
        email: document.getElementById('email').value,
        phonenumber: document.getElementById('phone').value
    };
    let req = new XMLHttpRequest();
    req.onreadystatechange = function(){
        if(req.readyState == 4 && req.status == 200){
            alert('Changes saved successfully');
        } else if(req.readyState == 4 && req.status == 500){
            alert('Changes did not save');
        }
    };
    req.open('POST','/profile/edit_profile');
    req.setRequestHeader('Content-Type','application/json');
    req.send(JSON.stringify(userData));
}

function new_password(){
    if(document.getElementById('newPassword').value !== document.getElementById('confirmPassword').value){
        alert("Passwords don't match");
        return;
    }
    let passData = {
        oldPassword: document.getElementById('oldPassword').value,
        newPassword: document.getElementById('newPassword').value
    };
    let req = new XMLHttpRequest();
    req.onreadystatechange = function(){
        if(req.readyState == 4 && req.status == 200){
            alert('Password changed successfully');
        } else if(req.readyState == 4 && req.status == 500){
            alert('Password did not change');
        }
    };
    req.open('POST','/profile/edit_profile');
    req.setRequestHeader('Content-Type','application/json');
    req.send(JSON.stringify(passData));
}

function mailingListToggle() {
    let req = new XMLHttpRequest();
    req.onreadystatechange = function(){
        if(req.readyState == 4 && req.status == 200){
            vueinst.getSubscribed();
        }
        if(req.readyState == 4 && req.status !== 200){
            alert("req failed")
        }
    };
    req.open('POST','/profile/subscribeToggle');
    req.setRequestHeader('Content-Type','html/text');
    req.send();
}

const vueinst = Vue.createApp({
    data() {
        return {
            profileData: [],
            orgName: [],
            subscribed: false
        };
    },
    methods: {
        // Request data for dycamically rendering user profile data
        getEvents() {
            let xhttp = new XMLHttpRequest();
            xhttp.responseType = 'json';
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    vueinst.profileData = this.response[0];
                    //console.log(this.response[0]);
                }
            };
            xhttp.open("GET", "/profile/get_profile", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send();
        },
        getOrgName() {
            let xhttp = new XMLHttpRequest();
            xhttp.responseType = 'json';
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    vueinst.orgName = this.response[0].branchName;
                    if(vueinst.orgName === undefined || vueinst.orgName.length < 1){
                        vueinst.orgName = "No affiliated organisation, JOIN ONE!";
                        document.getElementById("mailingBtn").style.display = "none";
                    } else{;
                        document.getElementById("mailingBtn").style.display = "inherit";
                    }
                    // console.log(vueinst.orgName);
                }
            };
            xhttp.open("GET", "/profile/get_orgname", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send();
        },
        getSubscribed() {
            let xhttp = new XMLHttpRequest();
            xhttp.responseType = 'json';
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    vueinst.subscribed = this.response;
                    if(vueinst.subscribed == 'true' || vueinst.subscribed == true){
                        document.getElementById("mailingBtn").innerText = "Click to unsubscribe from " + vueinst.orgName + "'s mailing list";
                    } else{
                        document.getElementById("mailingBtn").innerText = "Click to subscribe to " + vueinst.orgName + "'s mailing list";
                    }
                    // console.log(vueinst.orgName);
                }
            };
            xhttp.open("GET", "/profile/subscribeBtn", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send();
        }
    },
    mounted() {
        this.getEvents();
        this.getOrgName();
        this.getSubscribed();
    }
}).mount('body');