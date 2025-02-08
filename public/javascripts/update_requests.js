function post_update() {
    /*let privacy = 0;
    console.log(document.getElementById('isPublic').value);
    if(document.getElementById('isPublic').value === 'Public'){
        privacy = 1;
    }*/
    let updateData = {
        orgID: document.getElementById('orgID').value,
        postTopic: document.getElementById('postTopic').value,
        postBody: document.getElementById('postBody').value,
        //isPublic: privacy
    };
    let req = new XMLHttpRequest();
    req.onreadystatechange = function(){
        if(req.readyState == 4 && req.status == 200){
            alert('Created update');
        } else if(req.readyState == 4 && req.status == 500){
            alert('Create update failed');
        }
    };
    req.open('POST','/updates/create_update');
    req.setRequestHeader('Content-Type','application/json');
    req.send(JSON.stringify(updateData));
}

/*function edit_update(chosenUpdate) {
    let updateData = {
        updateID: chosenUpdate,
        //orgID: document.getElementById('orgID').value,
        postTopic: document.getElementById('postTopic').value,
        postBody: document.getElementById('postBody').value,
        isPublic: document.getElementById('isPublic').value
    };
    let req = new XMLHttpRequest();
    req.onreadystatechange = function(){
        if(req.readyState == 4 && req.status == 200){
            alert('Edited update');
        } else if(req.readyState == 4 && req.status == 500){
            alert('Edit update failed');
        }
    };
    req.open('POST','/updates/edit_update');
    req.setRequestHeader('Content-Type','application/json');
    req.send(JSON.stringify(updateData));
}*/

// Dynamically rendering updates
const vueinst = Vue.createApp({
    data() {
        return {
            updateTable: []
        };
    },
    methods: {
        getUpdates() {
            let xhttp = new XMLHttpRequest();
            xhttp.responseType = 'json';
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    vueinst.updateTable = this.response;
                    //console.log(vueinst.updateTable);
                }
            };
            xhttp.open("GET", "/updates/get_updates", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send();
        },
    },
    mounted() {
        this.getUpdates();
    }
}).mount('main');