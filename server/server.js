const http = require('http');
const port = 5001;
const url =require('url');
const fs =require('fs');
// const queryString = require('querystring');
const {MongoClient}=require ('mongodb');

const client = new MongoClient('mongodb://localhost:27017');

async function connect(){
    try{
    await client.connect();
    console.log("database connection established....")
} catch(error){
    console("error ",error)

}
}
connect();


const server =http.createServer(async(req,res)=>{

    let db=client.db("dms");
    let collection=db.collection("users");

    const req_url=req.url;
    console.log("req_url :",req_url);

    const parsed_url=url.parse(req_url);
    console.log("parsed_url :",parsed_url);
    if( parsed_url.pathname ==='/'){
        res.writeHead(200,{'Content-Type':'text/html'});
        res.end(fs.readFileSync('../client/index.html'));
    }else if(parsed_url.pathname === '/adduser.html'){
        res.writeHead(200,{'Content-Type':'text/html'});
        res.end(fs.readFileSync('../client/adduser.html'));

    }else if(parsed_url.pathname === '/script.js'){
        res.writeHead(200,{'Content-Type':'text/javascript'});
        res.end(fs.readFileSync('../client/script.js'));

    }else if(parsed_url.pathname === '/seeusers.html'){
        res.writeHead(200,{'Content-Type':'text/html'});
        res.end(fs.readFileSync('../client/seeusers.html'));
    }
    else if(parsed_url.pathname === '/submit' && req.method === 'POST'){
        console.log("Reached here.....");

        let body = '';

        req.on('data',(chunks)=>{
            console.log("chunks : ",chunks);
            body += chunks.toString();
        });
        req.on('end' , ()=>{
            console.log("body : ", body);

            let datas = JSON.parse(body);
            console.log("datas : ", datas);

            console.log("name : ", datas.username);
            console.log("email : ", datas.email);


            collection.insertOne({
                name : datas.username,
                email : datas.email,


            })
            // .then((message) =>{
            //     console.log("message :",message);
            //     res.writeHead(201,{'Content_type' : "text/plain"});
            //     res.end("user created.....");

            // })
            // .catch((error)=>{
            //     console.log("error",error)

            //     res.writeHead(400,{"Content_type" :"text/plain"});
            //     res.end(error.message ? error.message : "user creation failed");
            // })


            
          
        });


    }else if(parsed_url.pathname === '/submit' && req.method === 'GET'){
        
        let usreDatas = await collection.find().toArray();
        console.log("userDatas :",usreDatas);

        let json_datas=JSON.stringify(usreDatas);
        console.log("json_Datas :",json_datas);

        res.writeHead(200,{'Content-Type': "text/json"});
        res.end(json_datas);
    }

})
server.listen(port,()=>{
    console.log(`server running at http://localhost:${port}`)
})