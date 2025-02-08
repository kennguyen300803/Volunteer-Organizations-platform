

const app = Vue.createApp({
    data() {
        return {
            userList: [],
            filteredList: [],
            searchTerm: "",
            managerList: [],
            branchList: [],
            counts: {
                branch: 0,
                manager: 0,
                event: 0,
                user: 0
            },
            newUser: {
                firstName: "",
                lastName: "",
                role: "",
                email: "",
            },
            newBranch: {
                state: "",
                manager: "",
                location: ""
            }
        };
    },
    methods: {
        refreshManageBranches() {
            app.getAllBranches();
            app.getManagers();
        },
        refreshManageUsers() {
            app.searchUser();
        },
        refreshDashboard() {
            app.getCounts();
            app.getUsers();
        },
        getCounts() { //counts every branch, manager, event and user and returns the values to the counts object
            let xhttp = new XMLHttpRequest();
            xhttp.responseType = 'json';
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    app.counts.branch = this.response[0].branchCount;
                    app.counts.manager = this.response[0].managerCount;
                    app.counts.event = this.response[0].eventCount;
                    app.counts.user = this.response[0].userCount;
                }
            };
            xhttp.open("GET", "/admins/count", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send();
        },
        getUsers() { // gets a list of every user into userList array
            let xhttp = new XMLHttpRequest();
            xhttp.responseType = 'json';
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    app.userList = this.response;
                }
            };
            xhttp.open("GET", "/admins/getUsers", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send();
        },
        addUser() { // adds a new user given a full name, email and role. A default password is given to this new user
            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    app.refreshManageUsers();
                }
            };
            xhttp.open("POST", "/admins/addUser", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify(app.newUser));
        },
        promoteUser(x) { // promotes a user from user to manager or from manager to admin. If user is already an admin, does nothing
            let newUser = {
                email: x.email,
                isAdmin: x.isAdmin,
                isManager: x.isManager
            };

            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    app.refreshManageUsers();
                }
            };
            xhttp.open("POST", "/admins/promoteUser", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify(newUser));
        },
        searchUser() { // filters out users based on whether the search term can be found in their full name or email
            let search = {
                searchTerm: app.searchTerm
            };

            let xhttp = new XMLHttpRequest();
            xhttp.responseType = 'json';
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    app.filteredList = this.response;
                }
            };
            xhttp.open("POST", "/admins/searchUsers", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify(search));
        },
        deleteUser(x) { // deletes the user
            let deletedUser = {
                email: x.email,
            };

            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    app.refreshManageUsers();
                }
            };
            xhttp.open("POST", "/admins/deleteUser", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify(deletedUser));
        },
        getManagers() { // get a list of every manager not currently assigned to an organisation
            let xhttp = new XMLHttpRequest();
            xhttp.responseType = 'json';
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    app.managerList = this.response;
                }
            };
            xhttp.open("GET", "/admins/getManagers", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send();
        },
        createBranch() { // create a new organisation given the state, location and manager
            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    app.refreshManageBranches();
                }
            };
            xhttp.open("POST", "/admins/createBranch", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify(app.newBranch));
        },
        getAllBranches() { // gets a list of all organisations
            let xhttp = new XMLHttpRequest();
            xhttp.responseType = 'json';
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    app.branchList = this.response;
                }
            };
            xhttp.open("GET", "/admins/getBranches", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send();
        }
    },
    mounted() {
        this.getCounts();
        this.getUsers();
    }
}).mount('#vueAdmin');

function showContent(sectionId) {
    var sections = document.querySelectorAll('.content-section');
    sections.forEach(function(section) {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');

    if(sectionId == 'dashboard') { // if a section is loaded, refresh related data
        app.refreshDashboard();
    }
    if(sectionId == 'manageUsers') {
        app.refreshManageUsers();
    }
    if(sectionId == 'manageBranches') {
        app.refreshManageBranches();
    }
}

function logout() { // logs out the admin, preventing further changes from being made

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            alert("admin logout successful");
            location.reload();
        }
    };
    xhttp.open("POST", "/logout");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
}

// Initially show the dashboard content
showContent('dashboard');