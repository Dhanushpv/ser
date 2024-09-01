//   async function adduser(event){
//     event.preventDefault();
//     console.log("Reached.....");

//     let username =document.getElementById('username').value;
//     console.log("name :",username);

//     let email=document.getElementById('email').value;
//     console.log("eamil :",email);
//     let isValid = true;
//     let nameRegex =/^[a-zA-Z0-9]+([._]?[a-zA-Z]+)*$/;
//     let nameerror = document.getElementById('nameerr')
//     if(!username){
//         isValid = false;
        
//         nameerror.innerHTML = 'name is required'
//     }else if(!nameRegex.test(username)){
//         nameerror.innerHTML = "invalid name"
//         isValid = false;
//     }
//     let emailRegex = /^[a-zA-Z0-9_-]+@[a-zA-Z]+\.[a-zA-Z]{3,}$/;



//     let emailerror =document.getElementById('emailerr')
//     if(!email){
//         isValid = false;
//         emailerror.innerHTML = ' email is required'
//     }else if(!emailRegex.test(email)){

//         emailerror.innerHTML = "Invalid email";
//         isValid = false;
//     }
//     if (!isValid) {
//         event.preventDefault();// Stop form submission
//         alert('Please correct the errors in the form.');
//     }

   
//     // if (!username || !email) {
//     //     alert('Please fill out all fields.');
        
//     // }
   

//     let datas ={
//         username,
//         email,
//     }
//     console.log(datas)

//     let json_data =JSON.stringify(datas);
//     console.log("json_data",json_data);

//     let response =await fetch('/submit',{
//         method : "POST",
//         headers : {
//             'Content-Type' : "application/json",
//         },
//         body : json_data,
//     });
//     console.log("response",response);

//     let parsed_response =await response.text();
//     console.log("parsed_response",parsed_response);
//     if(parsed_response){
//         alert(parsed_response);
//         return;

//     }else{
//         alert("something went worg");
//     }
// }

async function adduser(event) {
    event.preventDefault(); // Prevent default form submission
    console.log("Reached.....");

    let username = document.getElementById('username').value;
    console.log("name :", username);

    let email = document.getElementById('email').value;
    console.log("email :", email);
    
    let isValid = true;
    let nameRegex = /^[a-zA-Z0-9]+([._]?[a-zA-Z]+)*$/;
    
    let nameerror = document.getElementById('nameerr');
    if (!username) {
        isValid = false;
        nameerror.innerHTML = 'Name is required';
    } else if (!nameRegex.test(username)) {
        nameerror.innerHTML = 'Invalid name';
        isValid = false;
    } else {
        nameerror.innerHTML = ''; // Clear error message if valid
    }

    let emailRegex = /^[a-zA-Z0-9_-]+@[a-zA-Z]+\.[a-zA-Z]{3,}$/;
    let emailerror = document.getElementById('emailerr');
    if (!email) {
        isValid = false;
        emailerror.innerHTML = 'Email is required';
    } else if (!emailRegex.test(email)) {
        emailerror.innerHTML = 'Invalid email';
        isValid = false;
    } else {
        emailerror.innerHTML = ''; // Clear error message if valid
    }

    if (!isValid) {
        alert('Please correct the errors in the form.');
        return; // Exit the function to prevent form submission
    }

    // Proceed with form submission if validation is successful
    let datas = {
        username,
        email,
    };
    console.log(datas);

    let json_data = JSON.stringify(datas);
    console.log("json_data", json_data);

    try {
        let response = await fetch('/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: json_data,
        });

        console.log("response", response);

        let parsed_response = await response.text();
        console.log("parsed_response", parsed_response);
        
        if (parsed_response) {
            alert(parsed_response);
        } else {
            alert("Something went wrong");
        }
    } catch (error) {
        console.error("Error during fetch:", error);
        alert("An error occurred while submitting the form.");
    }
}



async function fetchData() {
    try {
        const response = await fetch('/submit');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
        const tableBody = document.querySelector('#userTable tbody');
        tableBody.innerHTML = ''; // Clear existing content
        
        data.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user._id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <!-- Add other data fields as necessary -->
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

fetchData();