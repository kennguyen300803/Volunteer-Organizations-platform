function event_email(eventData) {
    let emailData = {
        subject: "NEW EVENT! "+eventData.eventTitle,
        text: eventData.eventDescription+"\n"+eventData.eventDate,
        orgID: eventData.orgID
    };
    let req = new XMLHttpRequest();
    req.onreadystatechange = function(){
        if(req.readyState == 4 && req.status == 200){
            console.log('Emails sent');
        } else if(req.readyState == 4 && req.status == 500){
            console.log('Emails unsent');
        }
    };
    req.open('POST','/email');
    req.setRequestHeader('Content-Type','application/json');
    req.send(JSON.stringify(emailData));
}

function create_event() {
    let eventData = {
        eventTitle: document.getElementById('eventName').value,
        eventDescription: document.getElementById('eventDescription').value,
        eventDate: document.getElementById('eventDate').value,
        orgID: document.getElementById('orgID').value
    };
    console.log(eventData.orgID);
    let req = new XMLHttpRequest();
    req.onreadystatechange = function(){
        if(req.readyState == 4 && req.status == 200){
            alert('Created event');
        } else if(req.readyState == 4 && req.status == 500){
            alert('Create event failed');
        }
    };
    req.open('POST','/events/create_event');
    req.setRequestHeader('Content-Type','application/json');
    req.send(JSON.stringify(eventData));
    event_email(eventData);
}

/*function edit_event(chosenEvent) {
    let eventData = {
        eventID: chosenEvent,
        eventTitle: document.getElementById('eventTitle').value,
        eventDescription: document.getElementById('eventDescription').value,
        eventDate: document.getElementById('eventDate').value,
        //orgID: document.getElementById('orgID').value
    };
    let req = new XMLHttpRequest();
    req.onreadystatechange = function(){
        if(req.readyState == 4 && req.status == 200){
            alert('Edited event');
        } else if(req.readyState == 4 && req.status == 500){
            alert('Edit event failed');
        }
    };
    req.open('POST','/events/edit_event');
    req.setRequestHeader('Content-Type','application/json');
    req.send(JSON.stringify(eventData));
}*/

document.onload = branchName();

function branchName() { // DYNAMICALLY render currently selected branch
    var userData = {
        isLoggedIn: false,
        branches: [],
        currOrg: 0,
        currOrgName: ""
    };
    // console.log(userData);
    let xhttp = new XMLHttpRequest();
    xhttp.responseType = 'json';
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // document.getElementById("output").innerText = this.responseText;
            userData = JSON.parse(this.response);
            // console.log(userData);
            var banner = document.getElementById("currentOrgBanner");
            console.log(userData);
            banner.innerText = "Events in " + userData.currOrgName + ":";
        }
    };
    // ("GET", "/events/show_RSVP?event="+eventID, true)
    xhttp.open("GET", "/getuserdata", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
}

// Dynamically rendering for events page
const vueinst = Vue.createApp({
    data() {
        return {
            eventTable: [],
            RSVPs: [],
            joinedEvents: []
        };
    },
    methods: {
        // Request data for dycamically rendering events
        getEvents() {
            let xhttp = new XMLHttpRequest();
            xhttp.responseType = 'json';
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    vueinst.eventTable = this.response;
                    //console.log(vueinst.eventTable);
                }
            };
            xhttp.open("GET", "/events/get_events", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send();
        },
        // Request user data for people who have RSVP'd an event
        showRSVP(eventID){
            //console.log('showingRSVP for event number '+eventID);

            let xhttp = new XMLHttpRequest();
            xhttp.responseType = 'json';
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    vueinst.RSVPs = this.response;
                }
            };
            xhttp.open("GET", "/events/show_RSVP?event="+eventID, true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send();
        },
        removeRSVP(uID, eID){
            let rsvpData = {
                userID: uID,
                eventID: eID
            };
            //console.log(JSON.stringify([userID, eventID]));
            if(confirm('Are you sure you want to remove this user from the RSVP?') == true){
                let req = new XMLHttpRequest();
                req.onreadystatechange = function(){
                    if(req.readyState == 4 && req.status == 200){
                        console.log('Removed user from RSVP');
                        vueinst.showRSVP(eID);
                    }
                };
                req.open('POST','/events/remove_RSVP', true);
                req.setRequestHeader('Content-Type','application/json');
                req.send(JSON.stringify(rsvpData));
            }
        },
    },
    mounted() {
        this.getEvents();
    }
}).mount('body');