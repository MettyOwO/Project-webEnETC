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

//Import Excel-Data const
const fs = require('fs');
const path = require('path')
const multer = require('multer')
const csv = require('fast-csv');

app.use(express.static("./public"))
app.use(express.json())
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

//mysql2 connection
const mysql = require('mysql2');
const { error } = require('console')
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password : '',
  database: 'project_network'
});

//Import Excel-Data Multer,Storage Function
var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, 'C:/AMettyA/Project EnET-C/Network Maintenance Information System Website/main-web/src/uploads/')    
        // D:/work/Project-webEnETC/main-web/src/uploads/
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})
var upload = multer({
    storage: storage
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

//Switch API
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
  const sql = "UPDATE switch SET role = ? , buildname = ?, buildgroup = ?, ip = ?, hostname = ?, model = ?, urlmap = ?, urlconfig = ?  where ID = ?";
  const id = req.params.id;
  const values = [req.body.role,req.body.build_name, 
  req.body.build_group, req.body.ipswitch, req.body.hostname, req.body.model
  ,req.body.url, req.body.urlconfig]
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
  const sql = "INSERT INTO switch (site, buildname, buildgroup, ip, hostname, role, model) VALUES (?)";    
  const values = [req.body.site, req.body.build_name, req.body.build_group, req.body.ipswitch, req.body.hostname, req.body.role
  ,req.body.model]    
  connection.query(sql, [values], (err) => {        
    if(err) return res.json("Error");        
    return res.json({added: true});    
  })
})
//Switch Import Excel
app.post('/import-switch-csv', upload.single("import-csv"), (req, res) =>{
    uploadSwitchExcel
    ('C:/AMettyA/Project EnET-C/Network Maintenance Information System Website/main-web/src/' + 'uploads/' + req.file.filename);
    // ('D:/work/Project-webEnETC/main-web/src/' + '/uploads/' + req.file.filename);
    console.log(res);
}); 
function uploadSwitchExcel(filePath){
  let stream = fs.createReadStream(filePath); //สร้างตัวแปร stream สำหรับอ่านข้อมูลจากไฟล์แบบทีละ chunk(ก้อน) จาก filePath(ไฟล์ที่อัพโหลด)
  let csvDataRows = []; //สร้างตัวแปร์เป็น [] เปล่าๆ เพื่อเก็บข้อมูลที่มาจากการอัพโหลดไฟล์
  let fileStream = csv //ตัวแปรให้อ่านไฟล์สกุล csv
    .parse() //เมทธ็อดแปลงข้อมูลที่อัพโหลดจากไฟล์ excel ให้เป็น Arrays
    .on("data", function (data) { //เมทธ็อดเช็ค Event ของ fileStream ที่เกิดขึ้นเมื่อมีข้อมูลที่อัพโหลดแล้วสามารถอ่านได้โดยมีตัวแปร data ไว้เก็บข้อมูล
      csvDataRows.push(data); //นำตัวแปร data มาเก็บไว้ที่ csvDataRows
      console.log(data);
    })
    .on("end", function () { //เมทธ็อด เมื่ออ่านไฟล์และรวบรวมข้อมูลทั้งหมดแล้ว
      csvDataRows.shift(); //ลบส่วนหัว (Header) ของแถวออก
      connection.connect((error) => { //เช็คการเชื่อมต่อของ DB
      if (error) {
        console.error(error);
      }else{
        // สร้างตัวแปร query เพื่อ Insert ข้อมูลลง DB ของตาราง switch
        let query = 'INSERT INTO switch (site,boxid,buildgroup,buildname,floor,role,serialsw,hostname,rackname,ip,model,serialno,macaddress,urlmap,urlconfig) VALUES ?';
        connection.query(query, [csvDataRows], (error, result) => { //query ข้อมูลลง DB
        if(error){
          console.log(error);
        }
        console.log(result);
        });
      }
    });            
    fs.unlinkSync(filePath) //ลบชื่อไฟล์จาก filePath(ไฟล์ที่อัพโหลด)
  });  
  stream.pipe(fileStream); //เมทธ็อดรวมข้อมูลทั้งหมดของตัวแปร stream ส่งข้อมูลทั้งหมดไปยังตัวแปร fileStream
}

//Access Point API
//AP List
app.get('/aplist', (req, res) => {
  const sql = "SELECT * FROM accesspoint";
  connection.query(sql, (err, result) => {
    if(err) return res.json("Error");
    return res.json(result);
  })
})
//AP List With AP_ID API
app.get('/aplistwithid/:id', (req, res) => {
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
  const sql = "UPDATE accesspoint SET Role = ? , Buildname = ?, Buildgroup = ?, IPswitch = ?, APname = ?, Model = ?, urlmap = ?  where ID = ?";
  const id = req.params.id;
  const values = [req.body.role,req.body.build_name, 
  req.body.build_group, req.body.ipswitch, req.body.hostname,req.body.model,req.body.url]
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
  const sql = "INSERT INTO accesspoint (Site, Buildname, Buildgroup, IPswitch, APname, Role, Model) VALUES (?)";    
  const values = [req.body.site, req.body.build_name, req.body.build_group, req.body.ipswitch, req.body.hostname, req.body.role, req.body.model]    
  connection.query(sql, [values], (err) => {        
    if(err) return res.json("Error");        
    return res.json({added: true});    
  })
})
//AP Import Excel
app.post('/import-accesspoint-csv', upload.single("import-csv"), (req, res) =>{
  uploadAccessPointExcel
  ('C:/AMettyA/Project EnET-C/Network Maintenance Information System Website/main-web/src/' + '/uploads/' + req.file.filename);
  // ('D:/work/Project-webEnETC/main-web/src/' + '/uploads/' + req.file.filename);
  console.log(res);
}); 
function uploadAccessPointExcel(filePath){
  let stream = fs.createReadStream(filePath); //สร้างตัวแปร stream สำหรับอ่านข้อมูลจากไฟล์แบบทีละ chunk(ก้อน) จาก filePath(ไฟล์ที่อัพโหลด)
  let csvDataRows = []; //สร้างตัวแปร์เป็น [] เปล่าๆ เพื่อเก็บข้อมูลที่มาจากการอัพโหลดไฟล์
  let fileStream = csv //ตัวแปรให้อ่านไฟล์สกุล csv
    .parse() //เมทธ็อดแปลงข้อมูลที่อัพโหลดให้เป็น Arrays
    .on("data", function (data) { //เมทธ็อดเช็ค Event ของ fileStream ที่เกิดขึ้นเมื่อมีข้อมูลที่อัพโหลดแล้วสามารถอ่านได้โดยมีตัวแปร data ไว้เก็บข้อมูล
      csvDataRows.push(data); //นำตัวแปร data มาเก็บไว้ที่ csvDataRows
      console.log(data);
    })
    .on("end", function () { //เมทธ็อด เมื่ออ่านไฟล์และรวบรวมข้อมูลทั้งหมดแล้ว
      csvDataRows.shift(); //ลบส่วนหัว (Header) ของแถวออก
      connection.connect((error) => { //เช็คการเชื่อมต่อของ DB
      if (error) {
        console.error(error);
      }else{
        // สร้างตัวแปร query เพื่อ Insert ข้อมูลลง DB ของตาราง accesspoint
        let query = 'INSERT INTO accesspoint (Site,Buildgroup,Buildname,Floor,Switchname,IPSwitch,Model,Seriesap,Apid,Vlan,APname,APbox,Cablename,Serialnumber,MACaddress,Role,urlmap) VALUES ?';
        connection.query(query, [csvDataRows], (error, result) => { //query ข้อมูลลง DB
        if(error){
          console.log(error);
        }
        console.log(result);
        });
      }
    });            
    fs.unlinkSync(filePath) //ลบชื่อไฟล์จาก filePath(ไฟล์ที่อัพโหลด)
  });  
  stream.pipe(fileStream); //เมทธ็อดรวมข้อมูลทั้งหมดของตัวแปร stream และ fileStream  ส่งข้อมูลทั้งหมดไปยังตัวแปร fileStream
}

//User API
//User List
app.get('/users', (req, res) => {
  const sql = "SELECT * FROM users";
  connection.query(sql, (err, result) => {
    if(err) return res.json("Error");
    return res.json(result);
  })
})
//Add Users
app.post('/register', (req, res) => {
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    const sql = "INSERT INTO users (email, password, name, role) VALUES (?)";
    const values = [req.body.email, hash, req.body.name, req.body.role]
    connection.query(sql, [values], (err) => {        
      if(err) return res.json("Error");        
      return res.json({added: true});    
    })
  });
})
//Delete Users
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
//User Update
app.put('/updateuser/:id', (req, res) => {
  const sql = "UPDATE users SET name = ?, role = ? where ID = ?";
  const id = req.params.id;
  const values = [req.body.name, req.body.role]
  connection.query(sql, [...values,id], (err, result) => {
    if(err) return res.json("Error");
    return res.json({updated: true})
  })
})

//device corrupted api
app.get('/deviceclist', (req, res) => {
  const sql = "SELECT * FROM device_corrupted";
  connection.query(sql, (err, result) => {
    if(err) return res.json("Error");
    return res.json(result);
  })
})
app.post('/addreport_ap/:id', (req, res) => {    
  const sql = "INSERT INTO device_corrupted (Site, Buildgroup, Buildname, Hostname, Ipaddress, Role, Serialnumber, Details, urlmap) VALUES (?)";    
  const values = [req.body.site, req.body.build_group, req.body.build_name, req.body.hostname, 
  req.body.ipswitch, req.body.role, req.body.serial_number, req.body.detail, req.body.url]    
  connection.query(sql, [values], (err) => {        
    if(err) return res.json("Error");        
    return res.json({added: true});    
  })
})
app.post('/addreport_sw/:id', (req, res) => {    
  const sql = "INSERT INTO device_corrupted (Site, Buildgroup, Buildname, Hostname, Ipaddress, Role, Serialnumber, Details, urlmap, urlconfig) VALUES (?)";    
  const values = [req.body.site, req.body.build_group, req.body.build_name, req.body.hostname, 
  req.body.ipswitch, req.body.role, req.body.serial_number, req.body.detail, req.body.url, req.body.urlconfig]    
  connection.query(sql, [values], (err) => {        
    if(err) return res.json("Error");        
    return res.json({added: true});    
  })
})
app.delete('/deletedc/:id' ,(req,res) => {
  const sql = "DELETE FROM device_corrupted where ID = ?";
  const id = req.params.id;
  connection.query(sql,[id], (err, result) => {
    if(err) return res.json({Error: err});
    return res.json(result);
  })
})

//Graph
app.get('/getSiteAP/:site', (req,res) => {
  const sql = "SELECT * FROM accesspoint WHERE Site = ?";
  const site = req.params.site
  connection.query(sql ,[site],(err, result) => {
    if(err) return res.json({Error: err});
    return res.send(result);
  })
})
app.get('/getSiteSW/:site', (req,res) => {
  const sql = "SELECT * FROM switch WHERE site = ?";
  const site = req.params.site
  connection.query(sql ,[site],(err, result) => {
    if(err) return res.json({Error: err});
    return res.send(result);
  })
})
app.get('/getSiteDC/:site', (req,res) => {
  const sql = "SELECT * FROM device_corrupted WHERE Site = ?";
  const site = req.params.site
  connection.query(sql ,[site],(err, result) => {
    if(err) return res.json({Error: err});
    return res.send(result);
  })
})

//Count Switch
app.get('/total_switch_as', (req, res) => {
  const sql = "SELECT COUNT(ID) as numswitch FROM switch where role = 'Access'";
  connection.query(sql, (err, result) => {
    if(err) return res.json({Error: err});
    return res.send(result[0]);
  })
})
app.get('/total_switch_ds', (req, res) => {
  const sql = "SELECT COUNT(ID) as numswitch2 FROM switch where role = 'Distribute'";
  connection.query(sql, (err, result) => {
    if(err) return res.json({Error: err});
    return res.send(result[0]);
  })
})

//Count Access Point
app.get('/total_ap_in', (req, res) => {
  const sql = "SELECT COUNT(ID) as numap FROM accesspoint where Role = 'Indoor'";
  connection.query(sql, (err, result) => {
    if(err) return res.json({Error: err});
    return res.send(result[0]);
  })
})
app.get('/total_ap_out', (req, res) => {
  const sql = "SELECT COUNT(ID) as numap2 FROM accesspoint where Role = 'Outdoor'";
  connection.query(sql, (err, result) => {
    if(err) return res.json({Error: err});
    return res.send(result[0]);
  })
})

//Count Device Corrupted
app.get('/total_dc_ap', (req, res) => {
  const sql = "SELECT COUNT(ID) as numdcap FROM device_corrupted where Role = 'AP-Indoor'";
  connection.query(sql, (err, result) => {
    if(err) return res.json({Error: err});
    return res.send(result[0]);
  })
})
app.get('/total_dc_ap2', (req, res) => {
  const sql = "SELECT COUNT(ID) as numdcap2 FROM device_corrupted where Role = 'AP-Outdoor'";
  connection.query(sql, (err, result) => {
    if(err) return res.json({Error: err});
    return res.send(result[0]);
  })
})
app.get('/total_dc_sw', (req, res) => {
  const sql = "SELECT COUNT(ID) as numdcsw FROM device_corrupted where Role = 'SW-Access'";
  connection.query(sql, (err, result) => {
    if(err) return res.json({Error: err});
    return res.send(result[0]);
  })
})
app.get('/total_dc_sw2', (req, res) => {
  const sql = "SELECT COUNT(ID) as numdcsw2 FROM device_corrupted where Role = 'SW-Distribute'";
  connection.query(sql, (err, result) => {
    if(err) return res.json({Error: err});
    return res.send(result[0]);
  })
})

//Site
app.get('/site_name',(req , res) => {
  const sql = "SELECT DISTINCT name FROM sitename";
  connection.query(sql , (err, result) => {
    if(err) return res.json({Error: err});
    return res.send(result);
  })
})
app.get('/ap_site', (req, res) => {
  const sql = "SELECT * FROM sitename where type = 'AP'";
  connection.query(sql, (err, result) => {
    if(err) return res.json({Error: err});
    return res.send(result);
  })
})
app.get('/sw_site', (req, res) => {
  const sql = "SELECT * FROM sitename where type = 'SW'";
  connection.query(sql, (err, result) => {
    if(err) return res.json({Error: err});
    return res.send(result);
  })
})
app.get('/dc_site', (req, res) => {
  const sql = "SELECT * FROM sitename where type = 'DC'";
  connection.query(sql, (err, result) => {
    if(err) return res.json({Error: err});
    return res.send(result);
  })
})
app.post('/addsitedevice', (req, res) => {    
  const sql = "INSERT INTO sitename (type, name) VALUES (?)";    
  const values = [req.body.type, req.body.sitename]    
  connection.query(sql, [values], (err) => {        
    if(err) return res.json("Error");        
    return res.json({added: true});    
  })
})

//AP Model&Datasheet
app.get('/ap_model', (req, res) => {
  const sql = "SELECT * FROM model where type = 'AP'";
  connection.query(sql, (err, result) => {
    if(err) return res.json({Error: err});
    return res.send(result);
  })
})
app.get('/ap_datasheet', (req, res) => {
  const sql = "SELECT * FROM datasheet where type = 'AP'";
  connection.query(sql, (err, result) => {
    if(err) return res.json({Error: err});
    return res.send(result);
  })
})
app.post('/addmodel', (req, res) => {    
  const sql = "INSERT INTO model (type, name, href) VALUES (?)";    
  const values = [req.body.type, req.body.name, req.body.url]    
  connection.query(sql, [values], (err) => {        
    if(err) return res.json("Error");        
    return res.json({added: true});    
  })
})
app.post('/adddatasheet', (req, res) => {    
  const sql = "INSERT INTO datasheet (type, name, href) VALUES (?)";    
  const values = [req.body.type, req.body.name, req.body.url]    
  connection.query(sql, [values], (err) => {        
    if(err) return res.json("Error");        
    return res.json({added: true});    
  })
})

//SW Model&Datasheet
app.get('/sw_model', (req, res) => {
  const sql = "SELECT * FROM model where type = 'SW'";
  connection.query(sql, (err, result) => {
    if(err) return res.json({Error: err});
    return res.send(result);
  })
})
app.get('/sw_datasheet', (req, res) => {
  const sql = "SELECT * FROM datasheet where type = 'SW'";
  connection.query(sql, (err, result) => {
    if(err) return res.json({Error: err});
    return res.send(result);
  })
})

//Map and Config URL API
app.put('/updateaplink/:id',(req,res) => {
  const url = req.body.url;
  const id = req.params.id;
  console.log(req.body);
  connection.query("UPDATE accesspoint SET urlmap = ? WHERE ID = ?",[url, id] , (err,result) => {
      if (err) {
          console.log(err);
      }else {
          res.send(result);
      }
  })
})
app.put('/updateswlink/:id',(req,res) => {
  const url = req.body.url;
  const id = req.params.id;
  console.log(req.body);
  connection.query("UPDATE switch SET urlmap = ? WHERE ID = ?",[url, id] , (err,result) => {
      if (err) {
          console.log(err);
      }else {
          res.send(result);
      }
  })
})
app.put('/updatedclink/:id',(req,res) => {
  const url = req.body.url;
  const id = req.params.id;
  console.log(req.body);
  connection.query("UPDATE device_corrupted SET urlmap = ? WHERE ID = ?",[url, id] , (err,result) => {
      if (err) {
          console.log(err);
      }else {
          res.send(result);
      }
  })
})
app.put('/updateconfiglink/:id',(req,res) => {
  const url = req.body.url;
  const id = req.params.id;
  console.log(req.body);
  connection.query("UPDATE switch SET urlconfig = ? WHERE ID = ?",[url, id] , (err,result) => {
      if (err) {
          console.log(err);
      }else {
          res.send(result);
      }
  })
})
app.put('/updateconfiglink2/:id',(req,res) => {
  const url = req.body.url;
  const id = req.params.id;
  console.log(req.body);
  connection.query("UPDATE device_corrupted SET urlconfig = ? WHERE ID = ?",[url, id] , (err,result) => {
      if (err) {
          console.log(err);
      }else {
          res.send(result);
      }
  })
})

app.listen(3333, jsonParser, function () {
  console.log('CORS-enabled web server listening on port 3333')
})