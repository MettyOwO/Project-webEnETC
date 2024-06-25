var express = require("express"); //framework
var cors = require("cors");
var app = express();
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();

//token user const
const bcrypt = require("bcrypt");
const saltRounds = 10;
var jwt = require("jsonwebtoken");
const secret = "Project-Network-2023";

//Import Excel-Data const
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const csv = require("fast-csv");

//verify-email
const nodemailer = require('nodemailer'); 
  
var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // secure:true for port 465, secure:false for port 587
    auth: {
      user: 'happyrin1234@gmail.com',
      pass: 'vxmr gzck rzvg xexc'
    }
});

app.use(express.static("./public"));
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

//mysql2 connection
const mysql = require("mysql2");
const { error, log } = require("console");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "project_network",
});

//Import Excel-Data Multer,Storage Function
var storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, __dirname + "/uploads/");
  },
  filename: (req, file, callBack) => {
    callBack(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
var upload = multer({
  storage: storage,
});

//Login-API
app.post("/login", jsonParser, function (req, res, next) {
  connection.execute(
    "SELECT * FROM users WHERE email=?",
    [req.body.email],
    function (err, users, fields) {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }
      else if (users.length == 0) {
         res.json({ status: "error", message: "user not found" });
         return;
      }
      else if (users[0].emailverify === 'false') {
        res.json({ status: "error2", message: "email not verify" });
        return;
      }
      else if (users[0].verify_acc === 'false') {
        res.json({ status: "error3", message: "account not verify by admin" });
        return;
      }
      else {
      bcrypt.compare(
        req.body.password,
        users[0].password,
        function (err, isLogin) {
          if (isLogin) {
            var token = jwt.sign({ email: users[0].email }, "secret", {
              expiresIn: "2h",
            });
            var email = [users[0].email];
            var site = [users[0].site];
            var name = [users[0].name];
            res.json({
              status: "ok",
              role: users[0].role,
              message: "login success",
              token,
              email,
              site,
              name
            });
          } else {
            res.json({ status: "error", message: "login failed" });
          }
        }
      )};
    }
  );
});

//Authen Token API
app.post("/authen", jsonParser, function (req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    var decoded = jwt.verify(token, "secret");
    res.json({ status: "ok", decoded });
  } catch (err) {
    res.json({ status: "error", message: err.message });
  }
});

//Switch API
//Switch List
app.get("/swlist", function (req, res, next) {
  connection.query("SELECT * FROM switch ORDER BY ID DESC", function (err, results, fields) {
    if (err) throw err;
    res.json(results);
  });
});
//Switch List With ID
app.get("/switchlistwithid/:id", (req, res) => {
  const sql = "SELECT * FROM switch where ID = ?";
  const id = req.params.id;
  connection.query(sql, [id], (err, result) => {
    if (err) return res.json({ Error: err });
    return res.json(result);
  });
});
//Switch Data Update
app.put("/updatesw/:id", (req, res) => {
  const SqlUpdateNumReport = "UPDATE switch SET num_report = ? WHERE ID = ?"
  const num_report = req.body.num_report;
  const total_num =  num_report + 1;
  
  const sql =
    "UPDATE switch SET role = ? , buildname = ?, buildgroup = ?, ip = ?, hostname = ?, model = ?, urlmap = ?, urlconfig = ?, serialno = ?, macaddress = ?  where ID = ?";
  const id = req.params.id;
  const values = [
    req.body.role,
    req.body.build_name,
    req.body.build_group,
    req.body.ipswitch,
    req.body.hostname,
    req.body.model,
    req.body.url,
    req.body.urlconfig,
    req.body.serial_number,
    req.body.mac_address
];

  const insertSql3 =
  "INSERT INTO device_log (ID, site, device_type, old_hostname, old_ip, old_build_group, old_build_name, old_model, old_role, old_serial, old_mac, num_device_change, report_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

  const values3 = [
    req.body.id2,
    req.body.site,
    req.body.device_type,
    req.body.old_hostname,
    req.body.old_ipswitch,
    req.body.old_build_group,
    req.body.old_build_name,
    req.body.old_model,
    req.body.old_role,
    req.body.old_serial_number,
    req.body.old_mac_address,
    total_num,
    req.body.username1
  ];

  connection.beginTransaction((err) => {
    if (err) throw err;

    connection.query(SqlUpdateNumReport, [total_num, id], (updateErr) => {
      if (updateErr) {
        connection.rollback(() => {
          throw updateErr;
        });
      }
    
    connection.query(insertSql3, values3, (InsertErr, InsertResult) => {  
      if (InsertErr) {
        connection.rollback(() => {
          throw InsertErr;
        });
      }

      connection.query(sql, [...values, id], (UpdateErr, UpdateResult) => {  
        if (UpdateErr) {
          connection.rollback(() => {
            throw UpdateErr;
          });
        }
  
    connection.commit((commitErr) => {
      if (commitErr) {
        connection.rollback(() => {
          throw commitErr;
        });
      }
      
      console.log('Transaction Complete.');
      return res.json({ updated: true });
    });
  });
  });
  });
  });
});
//Switch Data Delete
app.delete("/deletesw/:id", (req, res) => {
  const sql = "DELETE FROM switch where ID = ?";
  const sql2 = "DELETE FROM device_log where ID = ? and device_type = 'SW' ";
  const sql3 = "DELETE FROM replacement_device where ID = ? and device_type = 'SW'";
  const id = req.params.id;
  
  connection.beginTransaction((err) => {
    if (err) throw err;

    connection.query(sql, [id], (DeleteErr, DeleteResult) => {  
      if (DeleteErr) {
        connection.rollback(() => {
          throw DeleteErr;
        });
      }
    })

    connection.query(sql2, [id], (DeleteErr, DeleteResult) => {  
      if (DeleteErr) {
        connection.rollback(() => {
          throw DeleteErr;
        });
      }
    })

    connection.query(sql3, [id], (DeleteErr, DeleteResult) => {  
      if (DeleteErr) {
        connection.rollback(() => {
          throw DeleteErr;
        });
      }
    })
  
    connection.commit((commitErr) => {
      if (commitErr) {
        connection.rollback(() => {
          throw commitErr;
        });
      }
      console.log('Transaction Complete.');
      res.json({ added: true });
    });
  });
});
//Switch Data Add
app.post("/addsw", (req, res) => {
  const sql =
  "INSERT INTO switch (site, buildname, buildgroup, ip, hostname, role, model, serialno, macaddress) VALUES (?, ?, ?, ?, ? ,? ,? ,? ,?)";
  const values = [
    req.body.site,
    req.body.build_name,
    req.body.build_group,
    req.body.ipswitch,
    req.body.hostname,
    req.body.role,
    req.body.model,
    req.body.serial_number,
    req.body.mac_address
  ];

  connection.beginTransaction((err) => {
    if (err) throw err;

    connection.query(sql, values, (insertErr, insertResult) => {
      if (insertErr) {
        connection.rollback(() => {
          throw insertErr;
        });
      }
      console.log(insertResult.insertId);
      
      const sql2 =
      "INSERT INTO device_log (ID, site, device_type, old_hostname, old_ip, old_build_group, old_build_name, old_model, old_role, old_serial, old_mac, num_device_change, report_by, etc) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
      const values2 = [
        insertResult.insertId,
        req.body.site,
        req.body.device_type,
        req.body.hostname,
        req.body.ipswitch,
        req.body.build_group,
        req.body.build_name,
        req.body.model,
        req.body.role,
        req.body.serial_number,
        req.body.mac_address,
        0,
        req.body.username1,
        'new_add'
      ];

      connection.query(sql2, values2, (insertErr, insertResult2) => {
        if (insertErr) {
          connection.rollback(() => {
            throw insertErr;
          });
        }

      connection.commit((commitErr) => {
        if (commitErr) {
          connection.rollback(() => {
            throw commitErr;
          });
        }
        console.log('Transaction Complete.');
        res.json({ added: true });
      })
      });
    });
  });
});

//Switch Import Excel
app.post("/import-switch-csv", upload.single("import-csv"), (req, res) => {
  let filepath = __dirname + "/uploads/" + req.file.filename; //ที่อยูู่ของไฟล์ที่อัพโหลด
  let stream = fs.createReadStream(filepath); //สร้างฟังก์ชั่น createReadStream เพื่ออ่านข้อมูลจาก filePath(ไฟล์ที่อัพโหลด)
  let csvDataRows = []; //เก็บข้อมูลที่มาจากการอัพโหลดไฟล์ในรูปแบบ []
  let fileStream = csv.parse() //แปลงข้อมูลที่อยู่ในไฟล์ .csv ให้เป็น object
    .on("data", function (data) { //เช็ค Event ของ fileStream เมื่อแปลงข้อมูลแล้วและเก็บค่าไว้ที่ data
      csvDataRows.push(data); //นำข้อมูลที่อยู่ในdata มา push(ใส่) ไว้ที่ csvDataRows
    })
    .on("end", function () { //เมื่อจบฟังก์ชั่นของ data จะมาทำฟังก์ชั่น end ต่อ
      csvDataRows.shift(); //ลบส่วนหัว (Header) ของแถวออก
      connection.connect((error) => { //เช็คการเชื่อมต่อของ Database
        if (error) {
          return res.json("Database Error");
        } else {
          // Insert ข้อมูลลง Database ของ table switch
          let query =
           "INSERT INTO switch (site,boxid,buildgroup,buildname,floor,role,serialsw,hostname,rackname,ip,model,serialno,macaddress,urlmap,urlconfig) VALUES ?";
          connection.query(query, [csvDataRows], (error, result) => { //query ข้อมูลลง Database ตามข้อมูลที่อยู่ใน csvDataRows
            if (error) return res.json("Error");
            return res.json({ added: true });
          });
        }
      });
      fs.unlinkSync(filepath); //ลบชื่อไฟล์จาก filePath(ไฟล์ที่อัพโหลด)
    });
  stream.pipe(fileStream); //นำข้อมูลของ fileStream ส่งกลับไปที่ stream และเรียกใช้ฟังก์ชั่นตามลำดับ
});

//Access Point API
//AP List
app.get("/aplist", (req, res) => {
  const sql = "SELECT * FROM accesspoint ORDER BY ID DESC";
  connection.query(sql, (err, result) => {
    if (err) return res.json("Error");
    return res.json(result); 
  });
});
app.get("/aplistcount", (req, res) => {
  const sql = "SELECT * FROM accesspoint";
  connection.query(sql, (err, result) => {
    if (err) return res.json("Error");
    return res.json(result);
  });
});
//AP List With AP_ID API
app.get("/aplistwithid/:id", (req, res) => {
  const sql = "SELECT * FROM accesspoint where ID = ?";
  const id = req.params.id;
  connection.query(sql, [id], (err, result) => {
    if (err) return res.json({ Error: err });
    return res.json(result);
  });
});
//AP Update API
app.put("/updateap/:id", (req, res) => {
  const SqlUpdateNumReport = "UPDATE accesspoint SET num_report = ? WHERE ID = ?"
  const num_report = req.body.num_report;
  const total_num =  num_report + 1;
  
  const sql =
    "UPDATE accesspoint SET Role = ? , Buildname = ?, Buildgroup = ?, IPswitch = ?, APname = ?, Model = ?, urlmap = ?, Serialnumber = ?, MACaddress = ? where ID = ?";
  const id = req.params.id;
  const values = [
    req.body.role,
    req.body.build_name,
    req.body.build_group,
    req.body.ipswitch,
    req.body.hostname,
    req.body.model,
    req.body.url,
    req.body.serial_number,
    req.body.mac_address
  ];

  const insertSql3 =
  "INSERT INTO device_log (ID, site, device_type, old_hostname, old_ip, old_build_group, old_build_name, old_model, old_role, old_serial, old_mac, num_device_change, report_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

  const values3 = [
    req.body.id2,
    req.body.site,
    req.body.device_type,
    req.body.old_hostname,
    req.body.old_ipswitch,
    req.body.old_build_group,
    req.body.old_build_name,
    req.body.old_model,
    req.body.old_role,
    req.body.old_serial_number,
    req.body.old_mac_address,
    total_num,
    req.body.username1
  ];

  connection.beginTransaction((err) => {
    if (err) throw err;

    connection.query(SqlUpdateNumReport, [total_num, id], (updateErr) => {
      if (updateErr) {
        connection.rollback(() => {
          throw updateErr;
        });
      }
    
    connection.query(insertSql3, values3, (InsertErr, InsertResult) => {  
      if (InsertErr) {
        connection.rollback(() => {
          throw InsertErr;
        });
      }

      connection.query(sql, [...values, id], (UpdateErr, UpdateResult) => {  
        if (UpdateErr) {
          connection.rollback(() => {
            throw UpdateErr;
          });
        }
  
    connection.commit((commitErr) => {
      if (commitErr) {
        connection.rollback(() => {
          throw commitErr;
        });
      }
      
      console.log('Transaction Complete.');
      return res.json({ updated: true });
    });
  });
  });
  });
  });
});
//AP Delete API
app.delete("/deleteap/:id", (req, res) => {
  const sql = "DELETE FROM accesspoint where ID = ?";
  const id = req.params.id;
  const sql2 = "DELETE FROM device_log where ID = ? and device_type = 'AP'";
  const sql3 = "DELETE FROM replacement_device where ID = ? and device_type = 'AP'";
  
  connection.beginTransaction((err) => {
    if (err) throw err;

    connection.query(sql, [id], (DeleteErr, DeleteResult) => {  
      if (DeleteErr) {
        connection.rollback(() => {
          throw DeleteErr;
        });
      }
    })

    connection.query(sql2, [id], (DeleteErr, DeleteResult) => {  
      if (DeleteErr) {
        connection.rollback(() => {
          throw DeleteErr;
        });
      }
    })

    connection.query(sql3, [id], (DeleteErr, DeleteResult) => {  
      if (DeleteErr) {
        connection.rollback(() => {
          throw DeleteErr;
        });
      }
    })
  
    connection.commit((commitErr) => {
      if (commitErr) {
        connection.rollback(() => {
          throw commitErr;
        });
      }
      console.log('Transaction Complete.');
      res.json({ added: true });
    });
  });
});
//AP Add API
app.post("/addap", (req, res) => {
  const sql =
    "INSERT INTO accesspoint (Site, Buildname, Buildgroup, IPswitch, APname, Role, Model, Serialnumber, MACaddress) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const values = [
    req.body.site,
    req.body.build_name,
    req.body.build_group,
    req.body.ipswitch,
    req.body.hostname,
    req.body.role,
    req.body.model,
    req.body.serial_number,
    req.body.mac_address
  ];

  connection.beginTransaction((err) => {
    if (err) throw err;

    connection.query(sql, values, (insertErr, insertResult) => {
      if (insertErr) {
        connection.rollback(() => {
          throw insertErr;
        });
      }
      console.log(insertResult.insertId);
      
      const sql2 =
      "INSERT INTO device_log (ID, site, device_type, old_hostname, old_ip, old_build_group, old_build_name, old_model, old_role, old_serial, old_mac, num_device_change, report_by, etc) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
      const values2 = [
        insertResult.insertId,
        req.body.site,
        req.body.device_type,
        req.body.hostname,
        req.body.ipswitch,
        req.body.build_group,
        req.body.build_name,
        req.body.model,
        req.body.role,
        req.body.serial_number,
        req.body.mac_address,
        0,
        req.body.username1,
        'new_add'
      ];

      connection.query(sql2, values2, (insertErr, insertResult2) => {
        if (insertErr) {
          connection.rollback(() => {
            throw insertErr;
          });
        }

      connection.commit((commitErr) => {
        if (commitErr) {
          connection.rollback(() => {
            throw commitErr;
          });
        }
        console.log('Transaction Complete.');
        res.json({ added: true });
      })
      });
    });
  });
});
//AP Import Excel
app.post("/import-accesspoint-csv", upload.single("import-csv"), (req, res) => {
  let filepath = __dirname + "/uploads/" + req.file.filename; //ที่อยูู่ของไฟล์ที่อัพโหลด
  let stream = fs.createReadStream(filepath); //สร้างฟังก์ชั่น createReadStream เพื่ออ่านข้อมูลจาก filePath(ไฟล์ที่อัพโหลด)
  let csvDataRows = []; //เก็บข้อมูลที่มาจากการอัพโหลดไฟล์ในรูปแบบ []
  let fileStream = csv.parse() //แปลงข้อมูลที่อยู่ในไฟล์ .csv ให้เป็น object
    .on("data", function (data) { //เช็ค Event ของ fileStream เมื่อแปลงข้อมูลแล้วและเก็บค่าไว้ที่ data
      csvDataRows.push(data); //นำข้อมูลที่อยู่ในdata มา push(ใส่)ไว้ที่ csvDataRows
    })
    .on("end", function () { //เมื่อจบฟังก์ชั่นของ data จะมาทำฟังก์ชั่น end ต่อ
      csvDataRows.shift(); //ลบส่วนหัว (Header) ของแถวออก
      connection.connect((error) => { //เช็คการเชื่อมต่อของ Database
        if (error) {
          return res.json("Database Error");
        } else {
          // สร้างตัวแปร query เพื่อ Insert ข้อมูลลง Database ของตาราง accesspoint
          let query =
            "INSERT INTO accesspoint (Site,Buildgroup,Buildname,Floor,Switchname,IPSwitch,Model,Seriesap,Apid,Vlan,APname,APbox,Cablename,Serialnumber,MACaddress,Role,urlmap) VALUES ?";
          connection.query(query, [csvDataRows], (error, result) => { //query ข้อมูลลง Database ตามข้อมูลที่อยู่ใน csvDataRows
            if (error) return res.json("Error");
            return res.json({ added: true });
          });
        }
      });
      fs.unlinkSync(filepath); //ลบชื่อไฟล์จาก filePath(ไฟล์ที่อัพโหลด)
    });
  stream.pipe(fileStream); //นำข้อมูลของ fileStream ส่งกลับไปที่ stream และเรียกใช้ฟังก์ชั่นตามลำดับ
});

//User API
//User List
app.get("/users", (req, res) => {
  const sql = "SELECT * FROM users";
  connection.query(sql, (err, result) => {
    if (err) return res.json("Error");
    return res.json(result);
  });
});

app.get("/user_name", (req, res) => {
  const sql = "SELECT(name) FROM users where role = 'User'";
  connection.query(sql, (err, result) => {
    if (err) return res.json("Error");
    return res.json(result);
  });
});

//methon token verify email
const token1 = jwt.sign({ 
  data: 'Token Data' 
  }, 'ourSecretKey', { expiresIn: '10m' }   
);   

var url = `http://localhost:3333/` + `verify?id=` + token1;

//Add Users
app.post("/register", (req, res) => {

  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    const sql =
      "INSERT INTO users (email, password, name, role, tel, employeeid, emailverify, type, verify_acc) VALUES (?)";
    const values = [
      req.body.email,
      hash,
      req.body.name,
      req.body.role,
      req.body.tel,
      req.body.employee,
      req.body.email_verify,
      req.body.type,
      'false'
    ];

    connection.query(sql, [values], (err) => {
      if (err) return res.json("Error");
      
      const email = req.body.email;
      
      // Save the token and email in your database for later verification
      const mailOptions = {
      from: 'happyrin1234@gmail.com',
      to: email,
      subject: 'Email Verification',
      text: "Click on the link below to veriy your account " + url 
      };
    
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send('Error sending verification email.');
        } else {
            console.log('Email sent: ' + info.response);
            res.send('Verification email sent.');
        }
      });

      const sql = "UPDATE users SET email_token = ? where email = ?";
      connection.query(sql, [token1, email], (err, result) => {
        if (err) return res.json({ Error: err });
        return res.json({ added: true });
      }); 
   });
  });
});

  app.post('/sendmail', (req, res) => {
    const email = req.body.email_name;

    // Save the token and email in your database for later verification
    const mailOptions = {
    from: 'happyrin1234@gmail.com',
    to: email,
    subject: 'Email Verification',
    text: "Click on the link below to veriy your account " + url 
    };
    // console.log(url);
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          console.log(error);
          res.status(500).send('Error sending verification email.');
      } else {
          console.log('Email sent: ' + info.response);
          res.send('Verification email sent.');
      }
    });

    const sql = "UPDATE users SET email_token = ? where email = ?";
    connection.query(sql, [token1, email], (err, result) => {
      if (err) return res.json({ Error: err });
      return res.json(result);
    });

  });

//Mail-Verify
app.get('/verify', (req, res) => {
  
  const token = req.query.id;
  const sql1 = "SELECT(email) FROM users where email_token = ?";
  
  const sql2 = "UPDATE users SET emailverify = 'true' where email_token = ?";

  const sql3 = "UPDATE users SET email_token = ? where email = ?";
  const none = "-"
  
  connection.beginTransaction((err) => {
    if (err) throw err;
    
    connection.query(sql1, token, (selectErr, selectResult) => {
      if (selectErr) {
        connection.rollback(() => {
          throw selectErr;
        });
      }
      const email1 = selectResult[0].email
      // console.log(email1)

      connection.query(sql2, token, (updateErr2, updateResult2) => {
        if (updateErr2) {
          connection.rollback(() => {
            throw updateErr2;
          });
        }

        connection.query(sql3, [none, email1], (updateErr3, updateResult3) => {
          if (updateErr3) {
            connection.rollback(() => {
              throw updateErr3;
            });
          }
          res.send("Verify email complete! Now you can log-in to website with your account.")
      
      connection.commit((commitErr) => {
        if (commitErr) {
          connection.rollback(() => {
            throw commitErr;
        });
        }
      })
      })
      })
    })
  })
})

//Delete Users
app.delete("/deleteuser/:id", (req, res) => {
  const sql1 = "SELECT * FROM users where ID = ?";
  const id = req.params.id;

  const sql3 = "DELETE FROM user_site where username = ?";

  const sql4 = "DELETE FROM site_log where username = ?";

  const sql2 = "DELETE FROM users where ID = ?";
  
  connection.beginTransaction((err) => {
    if (err) throw err;

    connection.query(sql1, [id], (selectErr, selectResult) => {
      if (selectErr) {
        connection.rollback(() => {
          throw selectErr;
        });
      }
      // console.log(selectResult[0].name)        
        connection.query(sql3, [selectResult[0].name], (deleteErr2, deleteResult2) => {
          if (deleteErr2) {
            connection.rollback(() => {
              throw deleteErr2;
            });
          }
          // console.log(deleteResult2)

          connection.query(sql4, [selectResult[0].name], (deleteErr3, deleteResult3) => {
            if (deleteErr3) {
              connection.rollback(() => {
                throw deleteErr3;
              });
            }
            
            connection.query(sql2, [id], (deleteErr, deleteResult) => {
              if (deleteErr) {
                connection.rollback(() => {
                  throw deleteErr;
                });
              }

      connection.commit((commitErr) => {
        if (commitErr) {
          connection.rollback(() => {
            throw commitErr;
        });
      }
      });
      })
    })
    })
  })
})
});

//User List With User_ID
app.get("/userlist2/:id", (req, res) => {
  const sql = "SELECT * FROM users where ID = ?";
  const id = req.params.id;
  connection.query(sql, [id], (err, result) => {
    if (err) return res.json({ Error: err });
    return res.json(result);
  });
});
//User Update
app.put("/updateuser/:id", (req, res) => {
  const sql = "UPDATE users SET name = ?, role = ?, tel = ?, employeeid = ?, type = ? where ID = ?";
  const id = req.params.id;
  const values = [req.body.name, req.body.role, req.body.tel, req.body.epid, req.body.type];

  const sql2 = "UPDATE user_site SET username = ? where user_ID = ?";
  
  connection.beginTransaction((err) => {
    if (err) throw err;

    connection.query(sql, [...values,id], (UpdateErr, UpdateResult) => {  
      if (UpdateErr) {
        connection.rollback(() => {
          throw UpdateErr;
        });
      }
    })

    connection.query(sql2, [req.body.name,id], (UpdateErr2, UpdateResult2) => {  
      if (UpdateErr2) {
        connection.rollback(() => {
          throw UpdateErr2;
        });
      }
    })
  
    connection.commit((commitErr) => {
      if (commitErr) {
        connection.rollback(() => {
          throw commitErr;
        });
      }
      console.log('Transaction Complete.');
      return res.json({ updated: true });
    });
  });
});

//device corrupted api
app.get("/deviceclist", (req, res) => {
  /*const sql = "SELECT * FROM replacement_device";*/
  const sql = "SELECT * FROM replacement_device ORDER BY No DESC";
  connection.query(sql, (err, result) => {
    if (err) return res.json("Error");
    return res.json(result);
  });
});
app.post("/addreport_ap/:id", (req, res) => {
  const insertSql =
  "INSERT INTO replacement_device (ID ,Site, device_type, Buildgroup, Buildname, Hostname, Ipaddress, Model, Role, Oldserialnumber, Serialnumber, Oldmacaddress, Macaddress, Details, note, urlmap) VALUES (? ,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

  const values = [
    req.body.id2,
    req.body.site,
    req.body.device_type,
    req.body.build_group,
    req.body.build_name,
    req.body.hostname,
    req.body.ipswitch,
    req.body.model,
    req.body.role,
    req.body.serial_numberOld,
    req.body.serial_number,
    req.body.mac_addressOld,
    req.body.mac_address,
    req.body.detail,
    req.body.note,
    req.body.url
  ];

  const updateSql = "UPDATE accesspoint SET Serialnumber = ? WHERE Serialnumber = ?";
  const SerialnumberOld = req.body.serial_numberOld;

  const updateSql2 = "UPDATE accesspoint SET MACaddress = ? WHERE MACaddress = ?";
  const MacaddressOld = req.body.mac_addressOld;

  const SqlUpdateNumReport = "UPDATE accesspoint SET num_report = ? WHERE Serialnumber = ?"
  const num_report = req.body.num_report;
  const total_num =  num_report + 1;

  const insertSql2 =
  "INSERT INTO device_log (ID, site, device_type, old_hostname, old_ip, old_build_group, old_build_name, old_model, old_role, old_serial, old_mac, num_device_change, report_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

  const values2 = [
    req.body.id2,
    req.body.site,
    req.body.device_type,
    req.body.hostname,
    req.body.ipswitch,
    req.body.build_group,
    req.body.build_name,
    req.body.model,
    req.body.role,
    req.body.serial_numberOld,
    req.body.mac_addressOld,
    total_num,
    req.body.username1
  ];

  connection.beginTransaction((err) => {
    if (err) throw err;

    connection.query(insertSql, values, (insertErr, insertResult) => {
      if (insertErr) {
        connection.rollback(() => {
          throw insertErr;
        });
      }

      connection.query(updateSql, [req.body.serial_number, SerialnumberOld], (updateErr) => {
        if (updateErr) {
          connection.rollback(() => {
            throw updateErr;
          });
        }

        connection.query(updateSql2, [req.body.mac_address, MacaddressOld], (updateErr) => {
          if (updateErr) {
            connection.rollback(() => {
              throw updateErr;
            });
          }
      
          connection.query(SqlUpdateNumReport, [total_num, req.body.serial_number], (updateErr) => {
            if (updateErr) {
              connection.rollback(() => {
                throw updateErr;
              });
            }

            connection.query(insertSql2, values2, (insertErr, insertResult) => {
              if (insertErr) {
                connection.rollback(() => {
                  throw insertErr;
                });
              }

            connection.commit((commitErr) => {
              if (commitErr) {
                connection.rollback(() => {
                  throw commitErr;
              });
            }
            console.log('Transaction Complete.');
            res.json({ added: true });
            });
            });
          });  
        });
      });
    });
  });
});

app.post("/addreport_sw/:id", (req, res) => {
  const insertSql =
    "INSERT INTO replacement_device (ID ,Site, device_type, Buildgroup, Buildname, Hostname, Ipaddress, Model, Role, Oldserialnumber, Serialnumber, Oldmacaddress,  Macaddress, Details, note, urlmap, urlconfig) VALUES (? ,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  
    const values = [
    req.body.id2,
    req.body.site,
    req.body.device_type,
    req.body.build_group,
    req.body.build_name,
    req.body.hostname,
    req.body.ipswitch,
    req.body.model,
    req.body.role,
    req.body.serial_numberOld,
    req.body.serial_number,
    req.body.mac_addressOld,
    req.body.mac_address,
    req.body.detail,
    req.body.note,
    req.body.url,
    req.body.urlconfig,
  ];
  
  const updateSql = "UPDATE switch SET serialno = ? WHERE serialno = ?";
  const SerialnumberOld = req.body.serial_numberOld;

  const updateSql2 = "UPDATE switch SET macaddress = ? WHERE macaddress = ?";
  const MacaddressOld = req.body.mac_addressOld;

  const SqlUpdateNumReport = "UPDATE switch SET num_report = ? WHERE serialno = ?"
  const num_report = req.body.num_report;
  const total_num =  num_report + 1;

  const insertSql2 =
  "INSERT INTO device_log (ID, site, device_type, old_hostname, old_ip, old_build_group, old_build_name, old_model, old_role, old_serial, old_mac, num_device_change, report_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

  const values2 = [
    req.body.id2,
    req.body.site,
    req.body.device_type,
    req.body.hostname,
    req.body.ipswitch,
    req.body.build_group,
    req.body.build_name,
    req.body.model,
    req.body.role,
    req.body.serial_numberOld,
    req.body.mac_addressOld,
    total_num,
    req.body.username1
  ];

  connection.beginTransaction((err) => {
    if (err) throw err;

    connection.query(insertSql, values, (insertErr, insertResult) => {
      if (insertErr) {
        connection.rollback(() => {
          throw insertErr;
        });
      }

      connection.query(updateSql, [req.body.serial_number, SerialnumberOld], (updateErr) => {
        if (updateErr) {
          connection.rollback(() => {
            throw updateErr;
          });
        }

        connection.query(updateSql2, [req.body.mac_address, MacaddressOld], (updateErr) => {
          if (updateErr) {
            connection.rollback(() => {
              throw updateErr;
            });
          }
      
          connection.query(SqlUpdateNumReport, [total_num, req.body.serial_number], (updateErr) => {
            if (updateErr) {
              connection.rollback(() => {
                throw updateErr;
              });
            }

            connection.query(insertSql2, values2, (insertErr, insertResult) => {
              if (insertErr) {
                connection.rollback(() => {
                  throw insertErr;
                });
              }

            connection.commit((commitErr) => {
              if (commitErr) {
                connection.rollback(() => {
                  throw commitErr;
              });
            }
            console.log('Transaction Complete.');
            res.json({ added: true });
            });
          });
          });  
        });
      });
    });
  });
});

app.delete("/deletedc/:id", (req, res) => {
  const sql = "DELETE FROM replacement_device where ID = ?";
  const id = req.params.id;
  connection.query(sql, [id], (err, result) => {
    if (err) return res.json({ Error: err });
    return res.json(result);
  });
});

//Graph
app.get("/getSiteAP/:site", (req, res) => {
  const sql = "SELECT * FROM accesspoint WHERE Site = ?";
  const site = req.params.site;
  connection.query(sql, [site], (err, result) => {
    if (err) return res.json({ Error: err });
    return res.send(result);
  });
});
app.get("/getSiteSW/:site", (req, res) => {
  const sql = "SELECT * FROM switch WHERE site = ?";
  const site = req.params.site;
  connection.query(sql, [site], (err, result) => {
    if (err) return res.json({ Error: err });
    return res.send(result);
  });
});
app.get("/getSiteDC/:site", (req, res) => {
  const sql = "SELECT * FROM replacement_device WHERE Site = ?";
  const site = req.params.site;
  connection.query(sql, [site], (err, result) => {
    if (err) return res.json({ Error: err });
    return res.send(result);
  });
});

//Count Switch
app.get("/total_num_sw", (req, res) => {
  const sql = "SELECT COUNT(ID) as numsw FROM switch";
  connection.query(sql, (err, result) => {
    if (err) return res.json({ Error: err });
    return res.send(result[0]);
  });
});
//Count Access Point
app.get("/total_num_ap", (req, res) => {
  const sql =
    "SELECT COUNT(ID) as numap FROM accesspoint";
  connection.query(sql, (err, result) => {
    if (err) return res.json({ Error: err });
    return res.send(result[0]);
  });
});
//Count Replace Device
app.get("/total_num_dc", (req, res) => {
  const sql =
    "SELECT COUNT(ID) as numdc FROM replacement_device";
  connection.query(sql, (err, result) => {
    if (err) return res.json({ Error: err });
    return res.send(result[0]);
  });
});

//Site
app.get("/site_name", (req, res) => {
  const sql = "SELECT DISTINCT name FROM site";
  connection.query(sql, (err, result) => {
    if (err) return res.json({ Error: err });
    return res.send(result);
  });
});

app.get("/site2", (req, res) => {
  const sql = "SELECT * FROM site";
  connection.query(sql, (err, result) => {
    if (err) return res.json({ Error: err });
    return res.send(result);
  });
});

app.get("/user_site", (req, res) => {
  const sql = "SELECT * FROM user_site";
  connection.query(sql, (err, result) => {
    if (err) return res.json({ Error: err });
    return res.send(result);
  });
});

app.delete("/deletesite/:name", (req, res) => {
  const name = req.params.name;
  const sql = "DELETE FROM site where name = ?";
  const sql2 = "DELETE FROM accesspoint where Site = ?";
  const sql3 = "DELETE FROM switch where site = ?";
  const sql4 = "DELETE FROM replacement_device where Site = ?";
  const sql5 = "DELETE FROM device_log where site = ?";
  const sql6 = "DELETE FROM user_site where site = ?";
  const sql7 = "DELETE FROM site_log where site = ?";
  
  connection.beginTransaction((err) => {
    if (err) throw err;

    connection.query(sql, [name], (DeleteErr, DeleteResult) => {  
      if (DeleteErr) {
        connection.rollback(() => {
          throw DeleteErr;
        });
      }
    })

    connection.query(sql2, [name], (DeleteErr, DeleteResult) => {  
      if (DeleteErr) {
        connection.rollback(() => {
          throw DeleteErr;
        });
      }
    })
    
    connection.query(sql3, [name], (DeleteErr, DeleteResult) => {  
      if (DeleteErr) {
        connection.rollback(() => {
          throw DeleteErr;
        });
      }
    })

    connection.query(sql4, [name], (DeleteErr, DeleteResult) => {  
      if (DeleteErr) {
        connection.rollback(() => {
          throw DeleteErr;
        });
      }
    })

    connection.query(sql5, [name], (DeleteErr, DeleteResult) => {  
      if (DeleteErr) {
        connection.rollback(() => {
          throw DeleteErr;
        });
      }
    })

    connection.query(sql6, [name], (DeleteErr, DeleteResult) => {  
      if (DeleteErr) {
        connection.rollback(() => {
          throw DeleteErr;
        });
      }
    })

    connection.query(sql7, [name], (DeleteErr, DeleteResult) => {  
      if (DeleteErr) {
        connection.rollback(() => {
          throw DeleteErr;
        });
      }
    })
  
    connection.commit((commitErr) => {
      if (commitErr) {
        connection.rollback(() => {
          throw commitErr;
        });
      }
      console.log('Transaction Complete.');
      res.json({ added: true });
    });
  });
});
app.post("/addsite", (req, res) => {
  const sql = "INSERT INTO site (name, contact_name, contact_tel, start_period, end_period) VALUES (?)";
  const values = [req.body.site, req.body.contact_name, req.body.contact_tel, [req.body.s_day + "-" + req.body.s_month + "-" + req.body.s_year], [req.body.e_day + "-" + req.body.e_month + "-" + req.body.e_year]];
  connection.query(sql, [values], (err) => {
    if (err) return res.json("Error");
    return res.json({ added: true });
  });
});

//AP Model&Datasheet
app.get("/ap_model", (req, res) => {
  const sql = "SELECT * FROM model where type = 'AP'";
  connection.query(sql, (err, result) => {
    if (err) return res.json({ Error: err });
    return res.send(result);
  });
});
app.get("/ap_model2", (req, res) => {
  const sql = "SELECT DISTINCT role FROM model where type = 'AP'";
  connection.query(sql, (err, result) => {
    if (err) return res.json({ Error: err });
    return res.send(result);
  });
});
app.get("/ap_datasheet", (req, res) => {
  const sql = "SELECT * FROM datasheet where type = 'AP'";
  connection.query(sql, (err, result) => {
    if (err) return res.json({ Error: err });
    return res.send(result);
  });
});
app.post("/addmodel", (req, res) => {
  const sql = "INSERT INTO model (type, name, role, href) VALUES (?)";
  const values = [req.body.type, req.body.name, req.body.role, req.body.url];
  connection.query(sql, [values], (err) => {
    if (err) return res.json("Error");
    return res.json({ added: true });
  });
});
app.post("/adddatasheet", (req, res) => {
  const sql = "INSERT INTO datasheet (type, name, href) VALUES (?)";
  const values = [req.body.type, req.body.name, req.body.url];
  connection.query(sql, [values], (err) => {
    if (err) return res.json("Error");
    return res.json({ added: true });
  });
});

//SW Model&Datasheet
app.get("/sw_model", (req, res) => {
  const sql = "SELECT * FROM model where type = 'SW'";
  connection.query(sql, (err, result) => {
    if (err) return res.json({ Error: err });
    return res.send(result);
  });
});
app.get("/sw_model2", (req, res) => {
  const sql = "SELECT DISTINCT role FROM model where type = 'SW'";
  connection.query(sql, (err, result) => {
    if (err) return res.json({ Error: err });
    return res.send(result);
  });
});
app.get("/sw_datasheet", (req, res) => {
  const sql = "SELECT * FROM datasheet where type = 'SW'";
  connection.query(sql, (err, result) => {
    if (err) return res.json({ Error: err });
    return res.send(result);
  });
});

//Map and Config URL API
app.put("/updateaplink/:id", (req, res) => {
  const url = req.body.url;
  const id = req.params.id;
  //console.log(req.body);
  connection.query(
    "UPDATE accesspoint SET urlmap = ? WHERE ID = ?",
    [url, id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});
app.put("/updateswlink/:id", (req, res) => {
  const url = req.body.url;
  const id = req.params.id;
  //console.log(req.body);
  connection.query(
    "UPDATE switch SET urlmap = ? WHERE ID = ?",
    [url, id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});
app.put("/updatedclink/:id", (req, res) => {
  const url = req.body.url;
  const id = req.params.id;
  //console.log(req.body);
  connection.query(
    "UPDATE replacement_device SET urlmap = ? WHERE ID = ?",
    [url, id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});
app.put("/updateconfiglink/:id", (req, res) => {
  const url = req.body.url;
  const id = req.params.id;
  //console.log(req.body);
  connection.query(
    "UPDATE switch SET urlconfig = ? WHERE ID = ?",
    [url, id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});
app.put("/updateconfiglink2/:id", (req, res) => {
  const url = req.body.url;
  const id = req.params.id;
  //console.log(req.body);
  connection.query(
    "UPDATE replacement_device SET urlconfig = ? WHERE ID = ?",
    [url, id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.get("/device_log/:id", (req, res) => {
  const sql = "SELECT * FROM device_log where ID = ?";
  const id = req.params.id;
  connection.query(sql,[id], (err, result) => {
    if (err) return res.json({ Error: err });
    return res.json(result);
  });
});

app.get("/site/:id", (req, res) => {
  const sql = "SELECT * FROM site where ID = ?";
  const id = req.params.id;
  connection.query(sql,[id], (err, result) => {
    if (err) return res.json({ Error: err });
    return res.json(result);
  });
});

app.put("/updatesite/:id", (req, res) => {
  const sql = "UPDATE site SET name = ?, contact_name = ?, contact_tel = ?, start_period = ?, end_period = ? where ID = ?";
  const id = req.params.id;
  const values = [req.body.name, req.body.contact_name, req.body.contact_tel, [req.body.s_day + "-" + req.body.s_month + "-" + req.body.s_year], [req.body.e_day + "-" + req.body.e_month + "-" + req.body.e_year]];

  const sql2 = "UPDATE user_site SET contact_name = ?, contact_tel = ?, start_period = ?, end_period = ? where site = ?";
  const name = req.body.name;
  const values2 = [req.body.contact_name, req.body.contact_tel, [req.body.s_day + "-" + req.body.s_month + "-" + req.body.s_year], [req.body.e_day + "-" + req.body.e_month + "-" + req.body.e_year]];

  connection.beginTransaction((err) => {
    if (err) throw err;

    connection.query(sql,[...values, id], (InsertErr1, InsertResult1) => {
      if (InsertErr1) {
        connection.rollback(() => {
          throw InsertErr1;
        });
      }
      
      connection.query(sql2,[...values2, name], (InsertErr2, InsertResult2) => {
        if (InsertErr2) {
          connection.rollback(() => {
            throw InsertErr2;
          });
        }
      });

      connection.commit((commitErr) => {
        if (commitErr) {
          connection.rollback(() => {
            throw commitErr;
          });
        }
        console.log('Transaction Complete.');
        res.json({ updated : true });
      })
      });
    });  
});

//Total Replace AP List
app.get("/total_ap_replace1", (req, res) => {
  const sql = "SELECT COUNT(ID) as num_ap_replace1 FROM replacement_device where device_type = 'AP' and Details = 'โดนน้ำ' ";
  connection.query(sql, (err, result) => {
    if (err) return res.json({ Error: err });
    return res.send(result[0]);
  });
});
app.get("/total_ap_replace2", (req, res) => {
  const sql = "SELECT COUNT(ID) as num_ap_replace2 FROM replacement_device where device_type = 'AP' and Details = 'ไฟช็อต' ";
  connection.query(sql, (err, result) => {
    if (err) return res.json({ Error: err });
    return res.send(result[0]);
  });
});
app.get("/total_ap_replace3", (req, res) => {
  const sql = "SELECT COUNT(ID) as num_ap_replace3 FROM replacement_device where device_type = 'AP' and Details = 'พอร์ตไม่จ่ายไฟ' ";
  connection.query(sql, (err, result) => {
    if (err) return res.json({ Error: err });
    return res.send(result[0]);
  });
});
app.get("/total_ap_replace4", (req, res) => {
  const sql = "SELECT COUNT(ID) as num_ap_replace4 FROM replacement_device where device_type = 'AP' and Details = 'อื่นๆ' ";
  connection.query(sql, (err, result) => {
    if (err) return res.json({ Error: err });
    return res.send(result[0]);
  });
});
//Total Replace SW List
app.get("/total_sw_replace1", (req, res) => {
  const sql = "SELECT COUNT(ID) as num_sw_replace1 FROM replacement_device where device_type = 'SW' and Details = 'โดนน้ำ' ";
  connection.query(sql, (err, result) => {
    if (err) return res.json({ Error: err });
    return res.send(result[0]);
  });
});
app.get("/total_sw_replace2", (req, res) => {
  const sql = "SELECT COUNT(ID) as num_sw_replace2 FROM replacement_device where device_type = 'Sw' and Details = 'ไฟช็อต' ";
  connection.query(sql, (err, result) => {
    if (err) return res.json({ Error: err });
    return res.send(result[0]);
  });
});
app.get("/total_sw_replace3", (req, res) => {
  const sql = "SELECT COUNT(ID) as num_sw_replace3 FROM replacement_device where device_type = 'Sw' and Details = 'พอร์ตไม่จ่ายไฟ' ";
  connection.query(sql, (err, result) => {
    if (err) return res.json({ Error: err });
    return res.send(result[0]);
  });
});
app.get("/total_sw_replace4", (req, res) => {
  const sql = "SELECT COUNT(ID) as num_sw_replace4 FROM replacement_device where device_type = 'SW' and Details = 'อื่นๆ' ";
  connection.query(sql, (err, result) => {
    if (err) return res.json({ Error: err });
    return res.send(result[0]);
  });
});

app.post("/add_sitelog", (req, res) => {
  const site_name = req.body.name
  const user_name = req.body.user_name
  const user_type = req.body.user_type
  const user_employee = req.body.user_employeeid


  const sql1 = "INSERT INTO site_log (site, username, employeeid, type) VALUES (?, ?, ?, ?)";

  connection.beginTransaction((err) => {
    if (err) throw err;

    connection.query(sql1,[site_name, user_name, user_employee, user_type], (InsertErr1, InsertResult1) => {
      if (InsertErr1) {
        connection.rollback(() => {
          throw InsertErr1;
        });
        console.log(InsertResult1)
      }
      
      connection.commit((commitErr) => {
        if (commitErr) {
          connection.rollback(() => {
            throw commitErr;
          });
        }
        console.log('Transaction Complete.');
        res.json({ added: true });
      })
      });
    });
});

app.post("/add_sitelog2", (req, res) => {
  const site_name = req.body.site
  const user_name = req.body.user_name
  const user_type = req.body.user_type
  const user_employee = req.body.user_employeeid


  const sql1 = "INSERT INTO site_log (site, username, employeeid, type) VALUES (?, ?, ?, ?)";

  connection.beginTransaction((err) => {
    if (err) throw err;

    connection.query(sql1,[site_name, user_name, user_employee, user_type], (InsertErr1, InsertResult1) => {
      if (InsertErr1) {
        connection.rollback(() => {
          throw InsertErr1;
        });
        console.log(InsertResult1)
      }
      
      connection.commit((commitErr) => {
        if (commitErr) {
          connection.rollback(() => {
            throw commitErr;
          });
        }
        console.log('Transaction Complete.');
        res.json({ added: true });
      })
      });
    });
});

app.get("/site_log", (req, res) => {
  const sql = "SELECT * FROM site_log";
  connection.query(sql, (err, result) => {
    if (err) return res.json({ Error: err });
    return res.json(result);
  });
});

app.post("/add_user_site", (req, res) => {
  const site_name = req.body.name
  const user_name = req.body.user_name
  const user_type = req.body.user_type
  const user_employee = req.body.user_employeeid

  const sql1 = "INSERT INTO site_log (site, username, employeeid, type) VALUES (?, ?, ?, ?)";

  connection.beginTransaction((err) => {
    if (err) throw err;

    connection.query(sql1,[site_name, user_name, user_employee, user_type], (InsertErr1, InsertResult1) => {
      if (InsertErr1) {
        connection.rollback(() => {
          throw InsertErr1;
        });
        console.log(InsertResult1)
      }
      
      connection.commit((commitErr) => {
        if (commitErr) {
          connection.rollback(() => {
            throw commitErr;
          });
        }
        console.log('Transaction Complete.');
        res.json({ added: true });
      })
      });
    });
});

app.post("/add_admin_acc", (req, res) => {

  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    const sql =
      "INSERT INTO users (email, password, name, role, tel, employeeid, emailverify, type) VALUES (?)";
    const values = [
      req.body.email,
      hash,
      req.body.name,
      req.body.role,
      req.body.tel,
      req.body.employee,
      req.body.email_verify,
      req.body.type,
    ];

    connection.query(sql, [values], (err) => {
      if (err) return res.json("Error");
      
      const email = req.body.email;
      
      // Save the token and email in your database for later verification
      const mailOptions = {
      from: 'happyrin1234@gmail.com',
      to: email,
      subject: 'Email Verification',
      text: "Click on the link below to veriy your account " + url 
      };
    
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send('Error sending verification email.');
        } else {
            console.log('Email sent: ' + info.response);
            res.send('Verification email sent.');
        }
      });
      
      const sql = "UPDATE users SET email_token = ? where email = ?";
      connection.query(sql, [token1, email], (err, result) => {
        if (err) return res.json({ Error: err });
        return res.json({ added: true });
      });
   });
  });
});

app.post("/add_responsible", (req, res) => {
  const site1 = req.body.responsible_site;
  const sql1 = "SELECT * FROM site where name = ?"
  
  connection.beginTransaction((err) => {
    if (err) throw err;

    connection.query(sql1,site1, (SelectErr1, SelectResult1) => {
      if (SelectErr1) {
        connection.rollback(() => {
          throw SelectErr1;
        });
      }

      const user_name = req.body.name;
      const sql_1 = "SELECT * FROM users where name = ?"

      connection.query(sql_1,user_name, (SelectErr2, SelectResult2) => {
        if (SelectErr2) {
          connection.rollback(() => {
            throw SelectErr2;
          });
      }

      const sql2 = "INSERT INTO user_site (user_ID, site, username, contact_name, contact_tel, start_period, end_period) VALUES (?)";
      const values = [SelectResult2[0].ID, req.body.responsible_site, req.body.name, SelectResult1[0].contact_name, SelectResult1[0].contact_tel, SelectResult1[0].start_period, SelectResult1[0].end_period];

      connection.query(sql2,[values], (InsertErr1, InsertResult1) => {
        if (InsertErr1) {
          connection.rollback(() => {
            throw InsertErr1;
          });
        }

        const sql3 = "UPDATE users SET type = ? where name = ?"

        connection.query(sql3,[req.body.type1, req.body.name], (UpdateErr1, UpdateResult1) => {
          if (UpdateErr1) {
            connection.rollback(() => {
              throw UpdateErr1;
            });
          }
      
      connection.commit((commitErr) => {
        if (commitErr) {
          connection.rollback(() => {
            throw commitErr;
          });
        }
        res.json({ added: true });
      })
      });
    });
    });
  });
});
});

app.get("/total_site/:username", (req, res) => {
  const sql = "SELECT COUNT(site) as num_site FROM user_site where username = ? ";
  const username = req.params.username
  connection.query(sql,[username], (err, result) => {
    if (err) return res.json({ Error: err });
    return res.send(result[0]);
  });
});

app.delete("/delete_res/:id", (req, res) => {
  const sql = "DELETE FROM user_site where id = ?";
  const id = req.params.id;
  
  connection.beginTransaction((err) => {
    if (err) throw err;

    connection.query(sql, [id], (DeleteErr, DeleteResult) => {  
      if (DeleteErr) {
        connection.rollback(() => {
          throw DeleteErr;
        });
      }
    })
  
    connection.commit((commitErr) => {
      if (commitErr) {
        connection.rollback(() => {
          throw commitErr;
        });
      }
      console.log('Transaction Complete.');
    });
  });
});

app.post("/verify_account/:email", (req, res) => {
  const sql1 = "UPDATE users SET verify_acc = 'true' WHERE email = ?";
  const email = req.params.email;
  
  connection.beginTransaction((err) => {
    if (err) throw err;

    connection.query(sql1, [email], (UpdateErr, UpdateResult) => {
      if (UpdateErr) {
        connection.rollback(() => {
          throw UpdateErr;
        });
      }

      connection.commit((commitErr) => {
        if (commitErr) {
          connection.rollback(() => {
            throw commitErr;
        });
      }
      });
      })
    })
});

app.get("/total_num_ap_new", (req, res) => {
  const sql =
    "SELECT COUNT(No) as numap_new FROM device_log WHERE etc = 'new_add' AND device_type = 'AP'";
  connection.query(sql, (err, result) => {
    if (err) return res.json({ Error: err });
    return res.send(result[0]);
  });
});

app.get("/total_num_sw_new", (req, res) => {
  const sql =
    "SELECT COUNT(No) as numsw_new FROM device_log WHERE etc = 'new_add' AND device_type = 'SW'";
  connection.query(sql, (err, result) => {
    if (err) return res.json({ Error: err });
    return res.send(result[0]);
  });
});

app.listen(3333, jsonParser, function () {
  console.log("CORS-enabled web server listening on port 3333");
});
