var express = require('express')
var cors = require('cors')
var app = express()

var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

//token user
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');
const secret = 'Project-Network-2023'

app.use(express.json())
app.use(cors())

//mysql2 connection
const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password : '',
  database: 'project_network'
});

//Login-API
app.post('/login', jsonParser, function (req, res, next) {
  connection.execute(
    'SELECT * FROM users WHERE email=?',
    [req.body.email],
    function(err, users, fields) {
      if(err){
        res.json({status: 'error', message : err}); return }
      if (users.length == 0){
        res.json({status: 'error', message : 'user not found'}); return }
        bcrypt.compare(req.body.password, users[0].password, function(err, isLogin) {
        if (isLogin){
          var token = jwt.sign({ email: users[0].email }, 'secret' ,{ expiresIn: '1h' });
          res.json({status: 'ok', role: users[0].role, message: 'login success', token})
        }else{
          res.json({status: 'error', message: 'login failed'})
        }
      });
    }
  );
})

//Authen Token API
app.post('/authen', jsonParser, function (req, res, next) {
  try{
    const token = req.headers.authorization.split(' ')[1]
    var decoded = jwt.verify(token, 'secret');
    res.json({status: 'ok', decoded})
  } catch (err){
    res.json({status: 'error', message: err.message})
  }
})

//Switch API Start

//Switch List
app.get('/swlist', function (req, res, next) {
  connection.query('SELECT * FROM switch', function(err, results, fields){
    if (err) throw err;
    res.json(results)
  })
})

//Switch API End

//Access Point API Start

//AP List
app.get('/aplist', (req, res) => {
  const sql = "SELECT * FROM accesspoint";
  connection.query(sql, (err, result) => {
    if(err) return res.json("Error");
    return res.json(result);
  })
})

//AP Edit With AP_ID API
app.get('/editap/:id', (req, res) => {
  const sql = "SELECT * FROM accesspoint where ID = ?";
  const id = req.params.id;
  connection.query(sql,[id], (err, result) => {
    if(err) return res.json({Error: err});
    return res.json(result);
  })
})

//AP List With AP_ID API
app.get('/aplist2/:id', (req, res) => {
  const sql = "SELECT * FROM accesspoint where ID = ?";
  const id = req.params.id;
  connection.query(sql,[id], (err, result) => {
    if(err) return res.json({Error: err});
    return res.json(result);
  })
})

//AP Update API
app.put('/updateap/:id', (req, res) => {
  const sql = "UPDATE accesspoint SET Role = ? , Buildname = ?, Buildgroup = ?, IPswitch = ?, APname = ?  where ID = ?";
  const id = req.params.id;
  const values = [req.body.role,req.body.build_name, 
  req.body.build_group, req.body.ipswitch, req.body.hostname,]
  connection.query(sql, [...values,id], (err, result) => {
    if(err) return res.json("Error");
    return res.json({updated: true})
  })
})

//AP Delete API
app.delete('/deleteap/:id' ,(req,res) => {
  const sql = "DELETE FROM accesspoint where ID = ?";
  const id = req.params.id;
  connection.query(sql,[id], (err, result) => {
    if(err) return res.json({Error: err});
    return res.json(result);
  })
})

//AP Add API
app.post('/addap', (req, res) => {    
  const sql = "INSERT INTO accesspoint (Role, Map, Config , Buildname, Buildgroup, IPswitch, Model, APname) VALUES (?)";    
  const values = [req.body.role, req.body.maps, req.body.config,
  req.body.build_name, req.body.build_group, req.body.ipswitch,
  req.body.model, req.body.hostname,]    
  connection.query(sql, [values], (err, result) => {        
    if(err) return res.json("Error");        
    return res.json({added: true});    
  })
})

//Access Point API End

//User API Start
//User List API
app.get('/users', (req, res) => {
  const sql = "SELECT * FROM users";
  connection.query(sql, (err, result) => {
    if(err) return res.json("Error");
    return res.json(result);
  })
})

//Add Users API
app.post('/register', jsonParser, function (req, res, next) {
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    connection.execute(
      'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
      [req.body.email, hash, req.body.name, req.body.role],
      function(err, results, fields) {
        if(err){
          res.json({status: 'error', message : err})
          return
        }
        res.json({status : 'ok'})
      }
    );
  });
})

//Delete Users API
app.delete('/deleteuser/:id' ,(req,res) => {
  const sql = "DELETE FROM users where ID = ?";
  const id = req.params.id;
  connection.query(sql,[id], (err, result) => {
    if(err) return res.json({Error: err});
    return res.json(result);
  })
})

//User Edit Display Page With User_ID
app.get('/edituser/:id', (req, res) => {
  const sql = "SELECT * FROM users where ID = ?";
  const id = req.params.id;
  connection.query(sql,[id], (err, result) => {
    if(err) return res.json({Error: err});
    return res.json(result);
  })
})

//User Update API
app.put('/updateuser/:id', (req, res) => {
  const sql = "UPDATE users SET name = ?, role = ? where ID = ?";
  const id = req.params.id;
  const values = [req.body.name, req.body.role]
  connection.query(sql, [...values,id], (err, result) => {
    if(err) return res.json("Error");
    return res.json({updated: true})
  })
})

app.listen(3333, jsonParser, function () {
  console.log('CORS-enabled web server listening on port 3333')
})