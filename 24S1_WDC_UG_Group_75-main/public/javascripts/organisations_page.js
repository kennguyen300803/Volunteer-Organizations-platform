document.onload = branchName();

function branchName() {
    var userData = {
        isLoggedIn: false,
        branches: [],
        currOrg: 0,
        currOrgName: ""
    };
    let xhttp = new XMLHttpRequest();
    xhttp.responseType = 'json';
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            userData = JSON.parse(this.response);
            var banner = document.getElementById("currentOrgBanner");
            console.log(userData);
            banner.innerText = userData.currOrgName + " Organisation:";
        }
    };
    xhttp.open("GET", "/getuserdata", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
}

const vueinst = Vue.createApp({
    data() {
        return {
            orgList: [],
            users: [],
            newOrg: null // Add newOrg to track newly joined organisation
        };
    },
    methods: {
        getOrgs() {
            let xhttp = new XMLHttpRequest();
            xhttp.responseType = 'json';
            xhttp.onreadystatechange = () => {
                if (this.readyState == 4 && this.status == 200) {
                    this.orgList = this.response;
                }
            };
            xhttp.open("GET", "/get_orgs", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send();
        },
        showUsers(orgID) {
            let xhttp = new XMLHttpRequest();
            xhttp.responseType = 'json';
            xhttp.onreadystatechange = () => {
                if (this.readyState == 4 && this.status == 200) {
                    this.users = this.response;
                }
            };
            xhttp.open("GET", "/show_users?org=" + orgID, true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send();
        },
        changeBranch(orgID) {
            this.showUsers(orgID);
        },
        joinOrg() {
            let xhttp = new XMLHttpRequest();
            xhttp.responseType = 'json';
            xhttp.onreadystatechange = () => {
                if (this.readyState == 4 && this.status == 200) {
                    this.newOrg = this.response;
                    this.orgList.push(this.newOrg); // Update the orgList with the new organisation
                }
            };
            xhttp.open("POST", "/orgs/join_org", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify({ orgID: this.newOrg.orgID }));
        }
    },
    mounted() {
        this.getOrgs();
    }
}).mount('body');