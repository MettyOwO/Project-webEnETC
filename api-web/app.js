var express = require('express')
var cors = require('cors')
var app = express()
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

//token user const
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');
const secret = 'Project-Network-2023'
//token user const

//Import Excel-Data const
const fs = require('fs');
const path = require('path')
const multer = require('multer')
const csv = require('fast-csv');
//Import Excel-Data const

app.use(express.static("./public"))
app.use(express.json())
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

//mysql2 connection
const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password : '',
  database: 'project_network'
});
//mysql2 connection

//Import Excel-Data Multer Function
var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './uploads/')    
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})
var upload = multer({
    storage: storage
});
//Import Excel-Data Multer Function 

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
//Login-API

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
//Authen Token API

//Switch API Start
//Switch List
app.get('/swlist', function (req, res, next) {
  connection.query('SELECT * FROM switch', function(err, results, fields){
    if (err) throw err;
    res.json(results)
  })
})
//Switch List With ID
app.get('/switchlistwithid/:id', (req, res) => {
  const sql = "SELECT * FROM switch where ID = ?";
  const id = req.params.id;
  connection.query(sql,[id], (err, result) => {
    if(err) return res.json({Error: err});
    return res.json(result);
  })
})
//Switch List With KKU
app.get('/switchlist_kku', (req, res) => {
  const sql = "SELECT * FROM switch where site = 'KKU'";
  connection.query(sql, (err, result) => {
    if(err) return res.json({Error: err});
    return res.json(result);
  })
})
//Switch List With NKC
app.get('/switchlist_nkc', (req, res) => {
  const sql = "SELECT * FROM switch where site = 'NKC'";
  connection.query(sql, (err, result) => {
    if(err) return res.json({Error: err});
    return res.json(result);
  })
})
//Switch Data Update
app.put('/updatesw/:id', (req, res) => {
  const sql = "UPDATE switch SET role = ? , buildname = ?, buildgroup = ?, ip = ?, hostname = ?  where ID = ?";
  const id = req.params.id;
  const values = [req.body.role,req.body.build_name, 
  req.body.build_group, req.body.ipswitch, req.body.hostname,]
  connection.query(sql, [...values,id], (err, result) => {
    if(err) return res.json("Error");
    return res.json({updated: true})
  })
})
//Switch Data Delete
app.delete('/deletesw/:id' ,(req,res) => {
  const sql = "DELETE FROM switch where ID = ?";
  const id = req.params.id;
  connection.query(sql,[id], (err, result) => {
    if(err) return res.json({Error: err});
    return res.json(result);
  })
})
//Switch Data Add
app.post('/addsw', (req, res) => {    
  const sql = "INSERT INTO switch (buildname, buildgroup, ip, hostname, role) VALUES (?)";    
  const values = [req.body.build_name, req.body.build_group, req.body.ipswitch, req.body.hostname, req.body.role]    
  connection.query(sql, [values], (err) => {        
    if(err) return res.json("Error");        
    return res.json({added: true});    
  })
})
//Switch Import Excel
app.get('/import-switch', (req, res) => {
  res.sendFile(__dirname + '/import-switch.html');
});
app.post('/import-csv2', upload.single("import-csv"), (req, res) =>{
    uploadCsv2(__dirname + '/uploads/' + req.file.filename);
    console.log(res);
}); 
function uploadCsv2(uriFile){
    let stream = fs.createReadStream(uriFile);
    let csvDataColl = [];
    let fileStream = csv
        .parse()
        .on("data", function (data) {
            csvDataColl.push(data);
        })
        .on("end", function () {
            csvDataColl.shift();
            connection.connect((error) => {
                if (error) {
                    console.error(error);
                } else {
                    let query = 'INSERT INTO switch (site,boxid,buildgroup,buildname,floor,role,serialsw,hostname,rackname,ip,model,serialno,macaddress) VALUES ?';
                    connection.query(query, [csvDataColl], (error, res) => {
                        console.log(error || res);
                    });
                }
            });            
            fs.unlinkSync(uriFile)
        });  
    stream.pipe(fileStream);
}
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
//AP List With NKC
app.get('/aplist_nkc', (req, res) => {
  const sql = "SELECT * FROM accesspoint where Site = 'NKC'";
  connection.query(sql,(err, result) => {
    if(err) return res.json({Error: err});
    return res.json(result);
  })
})
//AP List With KKU
app.get('/aplist_kku', (req, res) => {
  const sql = "SELECT * FROM accesspoint where Site = 'KKU'";
  connection.query(sql,(err, result) => {
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
  const sql = "INSERT INTO accesspoint (Buildname, Buildgroup, IPswitch, APname, Role) VALUES (?)";    
  const values = [req.body.build_name, req.body.build_group, req.body.ipswitch, req.body.hostname, req.body.role]    
  connection.query(sql, [values], (err) => {        
    if(err) return res.json("Error");        
    return res.json({added: true});    
  })
})
//AP Import Excel
app.get('/import-accesspoint', (req, res) => {
  res.sendFile(__dirname + '/import-accesspoint.html');
});
app.post('/import-csv', upload.single("import-csv"), (req, res) =>{
    uploadCsv(__dirname + '/uploads/' + req.file.filename);
    console.log(res);
}); 
function uploadCsv(uriFile){
    let stream = fs.createReadStream(uriFile);
    let csvDataColl = [];
    let fileStream = csv
        .parse()
        .on("data", function (data) {
            csvDataColl.push(data);
        })
        .on("end", function () {
            csvDataColl.shift();
            connection.connect((error) => {
                if (error) {
                    console.error(error);
                } else {
                    let query = 'INSERT INTO accesspoint (Site,Buildgroup,Buildname,Floor,Switchname,IPSwitch,Model,Seriesap,Apid,Vlan,APname,APbox,Cablename,Serialnumber,MACaddress,Role) VALUES ?';
                    connection.query(query, [csvDataColl], (error, res) => {
                        console.log(error || res);
                    });
                }
            });            
            fs.unlinkSync(uriFile)
        });  
    stream.pipe(fileStream);
}
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
//User List With User_ID
app.get('/userlist2/:id', (req, res) => {
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
//User API END

//Start
app.get('/deviceclist', (req, res) => {
  const sql = "SELECT * FROM device_corrupted";
  connection.query(sql, (err, result) => {
    if(err) return res.json("Error");
    return res.json(result);
  })
})

app.post('/adddc', (req, res) => {    
  const sql = "INSERT INTO device_corrupted (Site, Buildgroup, Buildname, Hostname, Ipaddress, Role, Serialnumber, Details) VALUES (?)";    
  const values = [req.body.site, req.body.build_group, req.body.build_name, req.body.hostname, 
  req.body.ipaddress, req.body.role, req.body.serial_number, req.body.detail]    
  connection.query(sql, [values], (err) => {        
    if(err) return res.json("Error");        
    return res.json({added: true});    
  })
})

//End
app.listen(3333, jsonParser, function () {
  console.log('CORS-enabled web server listening on port 3333')
})