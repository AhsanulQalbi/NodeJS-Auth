const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();

app.get('/api',(req, res)=>{
    res.json({
        message : 'welcome to API'
    });
});

app.post('/api/posts',verifyToken,(req, res)=>{
    console.log(req.token)
    jwt.verify(req.token, 'secretkey',(err, authData)=>{
        if(err)
        {
            res.sendStatus(403);
        }
        else{
            res.json({
                message : 'Post Created',
                authData 
            });
        }
    })
    
});

app.post('/api/login',(req,res)=>{
    // mock user
    const users = [
        {
            id : 1,
            username : 'brad',
            password : 'brad',
            email : 'brad@gmail.com'
        },
        {
            id : 2,
            password : 'brad',
            username : 'bradff',
            email : 'brad@gmail.com'
        },
    ];

    var user = null;
    var iterator = 0;
    const count = users.length;
    
    while (iterator < count)
    {
        console.log(users[iterator].id)
        if (users[iterator].username == req.headers['username'] && users[iterator].password == req.headers['password'])
        {
            user = users[iterator];
            break;
        }
        iterator++;
    }
    
    if (user!=null)
    {
        jwt.sign({user},'secretkey', {expiresIn : '30s'},(err, token)=>{
            res.json({
                token
            })
        });
    }
    else{
        res.sendStatus(404)
    }
    
});

// format of token
//authorization : Bearer <access_token>
//verify token

function verifyToken(req, res, next){
    // get auth header value
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if(typeof bearerHeader !== 'undefined'){
        console.log(bearerHeader)
        // split at the space
        const bearer = bearerHeader.split(' ');

        // get token from array

        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    }
    else{

        res.sendStatus(403)
    }

}

app.listen(3000,()=> console.log('running in 3000'));