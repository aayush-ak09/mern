const express = require('express');
const app = express();
const ejs  = require('ejs');
const path = require('path');
const bodyParser = require('body-parser');
const authsignup = require('./public/utilities/authsignup');
const insAuth = require(__dirname + '/public/utilities/insAuth');
const nodemailer = require('nodemailer');
const fs = require('fs');
const fileData = require('./public/utilities/fileData');  // functio for get data 
// const { setDefaultHighWaterMark } = require('nodemailer/lib/xoauth2');

app.set("views", path.join(__dirname, "views"));
app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());                               //parse the json body


app.use('/imgs', express.static(path.join(__dirname,'imgs')));  //use static for some routes
app.use('/public/css', express.static(path.join(__dirname,'public/css')));
app.use('/public/Js', express.static(path.join(__dirname,'public/js')));
app.use('/video', express.static(path.join(__dirname,'video')));
app.use('/views', express.static(path.join(__dirname,'views')));
app.use('/public/utilities', express.static(path.join(__dirname, 'public/utilities')));


const port = 1235
app.listen(port, ()=>{
    console.log('server is runnig on port',port);
});


app.post('/login',(req,res)=>{                                 //receiving data from login page
    const formData = req.body;
    console.log(formData);
})
app.post('/api/data',insAuth.insAuth);
app.post('/api/vrfydata', insAuth.insvrfy);
app.post('/signup',authsignup.signupAuth);                     // receiving new user data
app.post('/insSignup', insAuth.insSignup);

app.get('/',(req,res) =>{
    // res.render('insDashboard');
   
    res.render('homepage');
});

app.get('/intrRegister', (req,res)=>{
    res.render('intrRegister');
})

app.get('/data.txt', (req,res)=>{
    fs.readFile('data.txt', 'utf8', (err, data)=>{
        if(err){
            console.error(err);
        }else{
            res.send(data);
        }
    });
});

app.post('/update', (req, res) => {
    const updatedUserData = req.body;
    console.log(updatedUserData);

    fs.readFile('data.txt', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading data file:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        const lines = data.split('\n');
        const updatedLines = lines.map(line => {
            if (line) {
                const userData = JSON.parse(line);
                if (userData.email === updatedUserData.email) {
                    // Update the verified property
                    userData.verified = updatedUserData.verified;
                }
                return JSON.stringify(userData);
            }
            return line;
        });

        const updatedData = updatedLines.join('\n');
        fs.writeFile('data.txt', updatedData, 'utf8', err => {
            if (err) {
                console.error('Error writing data file:', err);
                res.status(500).send('Internal Server Error');
            } else {
                console.log('Data updated successfully.');
                res.send('success');
            }
        });
    });
});

app.get('/myLearnings', (req,res)=>{
    const data  = fileData.emailexist('aayush1220158@jmit.ac.in');
    const name  = data.name || 'Guest';  //by default guest
    const email = data.email || 'not Available'
    res.render('myLearnings', {name});
})

app.get('/profile',(req,res) => {
    const data = fileData.emailexist('aayush1220158@jmit.ac.in');
    const name = data.name;
    const email = data.email;

    res.render('profile', {name, email});
})

app.get('/TnC.ejs', (req,res)=>{
    res.render('TnC');
})

app.get('/insSignup',(req,res)=> {
    res.render('insSignup');

});

app.get('/public/utilities/readfile', (req, res) => {
    // Provide the absolute or relative path to the file you want to send
    const filePath = 'public/utilities/readfile.js';
  
    // Use res.sendFile to send the file
    res.sendFile(filePath, { root: __dirname });
  });
  

app.get('*', (req,res)=> {
    console.log(req.url);
})