
const http = require('http');
const port = 5001;
const url = require('url');
const fs = require('fs');
const { MongoClient, ObjectId } = require('mongodb');

const client = new MongoClient('mongodb://localhost:27017');

async function connect() {
    try {
        await client.connect();
        console.log("Database connection established...");
    } catch (error) {
        console.error("Error:", error);
    }
}
connect();

const server = http.createServer(async (req, res) => {
    let db = client.db("dms");
    let collection = db.collection("users");



    const reqUrl = req.url;
    console.log("reqUrl:", reqUrl);

    const parsedUrl = url.parse(reqUrl, true); // true to parse query strings
    console.log("parsedUrl:", parsedUrl);

    if (parsedUrl.pathname === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(fs.readFileSync('../client/index.html'));


    } else if (parsedUrl.pathname === '/adduser.html') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(fs.readFileSync('../client/adduser.html'));


    } else if (parsedUrl.pathname === '/script.js') {
        res.writeHead(200, { 'Content-Type': 'text/javascript' });
        res.end(fs.readFileSync('../client/script.js'));


    } else if (parsedUrl.pathname === '/seeusers.html') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(fs.readFileSync('../client/seeusers.html'));


    } else if (parsedUrl.pathname === '/view.html') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(fs.readFileSync('../client/view.html'));


    } else if(parsedUrl.pathname === '/seeuser.css'){
        res.writeHead(200, { 'Content-Type': 'text/css' });
        res.end(fs.readFileSync('../client/seeuser.css'));

    }else if(parsedUrl.pathname === '/style.css'){
        res.writeHead(200, { 'Content-Type': 'text/css' });
        res.end(fs.readFileSync('../client/style.css'));

    }else if(parsedUrl.pathname === '/view.css'){
        res.writeHead(200, { 'Content-Type': 'text/css' });
        res.end(fs.readFileSync('../client/view.css'));

    }else if (parsedUrl.pathname === '/update.html') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(fs.readFileSync('../client/update.html'));


    } else if (parsedUrl.pathname === '/submit' && req.method === 'POST') {
        
        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                let data = JSON.parse(body);
                console.log("Data:", data);

                await collection.insertOne({
                    name: data.username,
                    email: data.email
                });

                res.writeHead(201, { 'Content-Type': 'text/plain' });
                res.end("User created...");
            } catch (error) {
                console.error("Error:", error);
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end("User creation failed");
            }
        });
    } else if (parsedUrl.pathname === '/submit' && req.method === 'GET') {
        try {
            let userDatas = await collection.find().toArray();
            // console.log("UserDatas:", userDatas);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(userDatas));
        } catch (error) {
            console.error("Error:", error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end("Error fetching users");
        }
    } else if (parsedUrl.pathname === ('/submits') && req.method === 'GET') {
        let id = parsedUrl.query.id;
        if (!id) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end("Missing ID");
            return;
        }

        try {
            let _id = new ObjectId(id);
            let userData = await collection.findOne({ _id });
            console.log("UserData:", userData);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(userData));
        } catch (error) {
            console.error("Error:", error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end("Error fetching user");
        }
    }else if (parsedUrl.pathname === ('/submits') && req.method === 'DELETE') {
        let id = parsedUrl.query.id;
        if (!id) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end("Missing ID");
            return;
        }

        try {
            let _id = new ObjectId(id);
            let userData = await collection.deleteOne({ _id });
            // console.log("UserData:", userData);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(userData));
        } catch (error) {
            console.error("Error:", error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end("Error fetching user");
        }
    }else if (parsedUrl.pathname === ('/users') && req.method === 'PUT') {
        
        let body='';
         req.on('data',(chunks)=>{
            body =chunks.toString();
         });
         req.on('end',async()=>{
            console.log("body",body);
            let parsed_body=JSON.parse(body);
            console.log("parsed_body",parsed_body);
            let query=parsedUrl.query
            let parsed_query = querystring.parse(query);
            console.log("parsed_query :",parsed_query)

            let id =parsed_query.id;
            console.log("id",id);
            let _id =new ObjectId(id);
            console.log("_id",_id);
            let updateDatas={
                username:parsed_body.username,
                email:parsed_body.email
                }
            
           let updatedata= await collection.updateOne({_id},{$set :updateDatas})

            res.writeHead(200,{"Content-Type":"text/plain"});
            res.end("User updated successfully")

            let string_data = JSON.stringify(updatedata);
            console.log("string_data : ",string_data);

         })
         
    } 
    });


server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
