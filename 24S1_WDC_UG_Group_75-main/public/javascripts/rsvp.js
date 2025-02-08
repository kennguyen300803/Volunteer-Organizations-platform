const vueinst = Vue.createApp({
    data() {
        return {
            joinedEvents: []
        };
    },
    methods: {
        getJoinedEvents() {
            let xhttp = new XMLHttpRequest();
            xhttp.responseType = 'json';
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    vueinst.joinedEvents = this.response;
                }
            };
            xhttp.open("GET", "/events/get_joined_events", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send();
        },
        amGoing(eID){
            let xhttp = new XMLHttpRequest();
            xhttp.responseType = 'json';
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    vueinst.getJoinedEvents();
                }
            };
            xhttp.open("POST", "/events/going", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify(eID));
        },
        notGoing(eID){
            if(confirm('Are you sure you are not interested?') == true){
                let req = new XMLHttpRequest();
                req.onreadystatechange = function(){
                    if(req.readyState == 4 && req.status == 200){
                        vueinst.getJoinedEvents();
                    }
                };
                req.open('POST','/events/not_going', true);
                req.setRequestHeader('Content-Type','application/json');
                req.send(JSON.stringify(eID));
            }
        },
    },
    mounted() {
        this.getJoinedEvents();
    }
}).mount('body');