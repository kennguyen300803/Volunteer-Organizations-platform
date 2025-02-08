
function login() {
    let login_data = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };
    let req = new XMLHttpRequest();
    req.onreadystatechange = function(){
        if(req.readyState == 4 && req.status == 200){
            alert('Login successful');
            location.replace('main.html');
        } else if(req.readyState == 4 && req.status == 403){
            alert('Login unsuccessful');
        }
    };
    req.open('POST','/login');
    req.setRequestHeader('Content-Type','application/json');
    req.send(JSON.stringify(login_data));
}

function signup() {
    let signup_data = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        birthDate: document.getElementById('DOB').value,
        email: document.getElementById('email').value,
        phonenumber: document.getElementById('phonenumber').value,
        password: document.getElementById('password').value
    };
    if(document.getElementById('password').value !== document.getElementById('confirm_password').value){
        alert("Passwords don't match");
        return;
    }
    let req = new XMLHttpRequest();
    req.onreadystatechange = function(){
        if(req.readyState == 4 && req.status == 200){
            alert('Signup successful');
            location.replace('/signin');
        } else if(req.readyState == 4 && (req.status == 401 || req.status == 500)){
            alert('Signup unsuccessful');
        }
    };
    req.open('POST','/signup_form');
    req.setRequestHeader('Content-Type','application/json');
    req.send(JSON.stringify(signup_data));
}

// function logout() {
//     let req = new XMLHttpRequest();
//     req.onreadystatechange = function(){
//         if(req.readyState == 4 && req.status == 200){
//             alert('Logout successful');
//         } else if(req.readyState == 4 && req.status == 403){
//             alert('Logout unsuccessful');
//         }
//     };
//     req.open('POST','/logout');
//     req.send();
// }

function do_google_login(response){

    // Sends the login token provided by google to the server for verification using an AJAX request

    console.log(response);

    // Setup AJAX request
    let req = new XMLHttpRequest();

    req.onreadystatechange = function(){
        // Handle response from our server
        if(req.readyState == 4 && req.status == 200){
            alert('Login in with Google successful');
        } else if(req.readyState == 4 && req.status == 401){
            alert('Login in with Google unsuccessful');
        }
    };

    // Open requst
    req.open('POST','/login');
    req.setRequestHeader('Content-Type','application/json');
    // Send the login token
    req.send(JSON.stringify(response));
}

