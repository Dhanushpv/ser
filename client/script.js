  async function adduser(event){
    event.preventDefault();
    console.log("Reached.....");

    let username =document.getElementById('username').value;
    console.log("name :",username);

    let email=document.getElementById('email').value;
    console.log("eamil :",email);

    let namerror =document.getElementById('nameerr');
    let emailerror =document.getElementById('emailerr')

    if(!username){
        namerror.innerHTML = "Invalid"
    }
    if(!email){
        emailerror.innerHTML = "Invalid email"
    }

    let datas ={
        username,
        email,
    }
    console.log(datas)

    let json_data =JSON.stringify(datas);
    console.log("json_data",json_data);

    let response =await fetch('/submit',{
        method : "POST",
        headers : {
            'Content-Type' : "application/json",
        },
        body : json_data,
    });
    console.log("response",response);

    let parsed_response =await response.text();
    console.log("parsed_response",parsed_response);
    if(parsed_response){
        alert(parsed_response);
        return;

    }else{
        alert("something went worg");
    }
}