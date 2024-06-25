import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import { Chart } from "react-google-charts";
import NavDropdown from "react-bootstrap/NavDropdown";
import axios from "axios";
import { useNavigate, useLocation} from "react-router-dom";

function DashboardContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  
  //Check Token API
  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    const site1 = localStorage.getItem("site");
    const name1 = localStorage.getItem("name");
    fetch("http://localhost:3333/authen", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token, email, site1, name1
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "ok") {
        } else {
          alert("Authen Failed. Please Try Login Again!");
          localStorage.removeItem("token");
          localStorage.removeItem("email");
          localStorage.removeItem("site");
          localStorage.removeItem("name");
          window.location = "/login";
        }
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }, []);

  //Log Out
  const handleLogout = (event) => {
    event.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("site");
    localStorage.removeItem("name");
    window.location = "/login";
  };

  const [apreplaceCount1, setApReplaceCount1] = useState(0);
  const [apreplaceCount2, setApReplaceCount2] = useState(0);
  const [apreplaceCount3, setApReplaceCount3] = useState(0);
  const [apreplaceCount4, setApReplaceCount4] = useState(0);
  useEffect(() => {
    const fetchCount1 = async () => {
      try {
        const fetchData = await axios.get("http://localhost:3333/total_ap_replace1");
        setApReplaceCount1(fetchData.data.num_ap_replace1);
      } catch (err) {}
    };
    const fetchCount2 = async () => {
      try {
        const fetchData = await axios.get("http://localhost:3333/total_ap_replace2");
        setApReplaceCount2(fetchData.data.num_ap_replace2);
      } catch (err) {}
    };
    const fetchCount3 = async () => {
      try {
        const fetchData = await axios.get("http://localhost:3333/total_ap_replace3");
        setApReplaceCount3(fetchData.data.num_ap_replace3);
      } catch (err) {}
    };
    const fetchCount4 = async () => {
      try {
        const fetchData = await axios.get("http://localhost:3333/total_ap_replace4");
        setApReplaceCount4(fetchData.data.num_ap_replace4);
      } catch (err) {}
    };
    fetchCount1();
    fetchCount2();
    fetchCount3();
    fetchCount4();
  }, []);

  const sum_replace_ap = apreplaceCount1+apreplaceCount2+apreplaceCount3+apreplaceCount4;
  const replaceapdata = [
    ["Device", "1 per Units"],
    ["โดนน้ำ", apreplaceCount1],
    ["ไฟช็อต", apreplaceCount2],
    ["พอร์ตไม่จ่ายไฟ", apreplaceCount3],
    ["อื่นๆ", apreplaceCount4]
  ];
  const replaceapoption = {
    title: `Total Replace Access Point : ` + sum_replace_ap,
    pieHole: 0.4,
    is3D: true,
  };
  
  //Total Replace SW List API With Graph
  const [swreplaceCount1, setSwReplaceCount1] = useState(0);
  const [swreplaceCount2, setSwReplaceCount2] = useState(0);
  const [swreplaceCount3, setSwReplaceCount3] = useState(0);
  const [swreplaceCount4, setSwReplaceCount4] = useState(0);
  useEffect(() => {
    const fetchCount1 = async () => {
      try {
        const fetchData = await axios.get("http://localhost:3333/total_sw_replace1");
        setSwReplaceCount1(fetchData.data.num_sw_replace1);
      } catch (err) {}
    };
    const fetchCount2 = async () => {
      try {
        const fetchData = await axios.get("http://localhost:3333/total_sw_replace2");
        setSwReplaceCount2(fetchData.data.num_sw_replace2);
      } catch (err) {}
    };
    const fetchCount3 = async () => {
      try {
        const fetchData = await axios.get("http://localhost:3333/total_sw_replace3");
        setSwReplaceCount3(fetchData.data.num_sw_replace3);
      } catch (err) {}
    };
    const fetchCount4 = async () => {
      try {
        const fetchData = await axios.get("http://localhost:3333/total_sw_replace4");
        setSwReplaceCount4(fetchData.data.num_sw_replace4);
      } catch (err) {}
    };
    fetchCount1();
    fetchCount2();
    fetchCount3();
    fetchCount4();
  }, []);
  const sum_replace_sw = swreplaceCount1+swreplaceCount2+swreplaceCount3+swreplaceCount4;
  const replaceswdata = [
    ["Device", "1 per Units"],
    ["โดนน้ำ", swreplaceCount1],
    ["ไฟช็อต", swreplaceCount2],
    ["พอร์ตไม่จ่ายไฟ", swreplaceCount3],
    ["อื่นๆ", swreplaceCount4]
  ];
  const replaceswoption = {
    title: `Total Replace Switch : ` +  sum_replace_sw,
    pieHole: 0.4,
    is3D: true,
  };

  const [siteName,setSiteName] = useState([]);
  async function getData() {
    // const getSiteName = await axios.get("http://localhost:3333/site_name")
    const getSiteName = await axios.get("http://localhost:3333/site2")
    const siteLocation = localStorage.getItem("site");
    const dataSite = []
    getSiteName.data.map((item)=>{    
      if(siteLocation === item.name){
        dataSite.push(item)
      }
    })
    setSiteName(dataSite);
  }
  useEffect(() => {
    getData();
  }, []);

  const [selectDevices,setSelectDevices] = useState([])
  const [selectSite,setSelectSite] = useState([])
  const [dataReplaceAP_Site,setDataReplaceAP] = useState([])
  const [optionReplaceAP_Site,setOptionReplaceAP] = useState([])
  const [dataReplaceSW_Site,setDataReplaceSW] = useState([])
  const [optionReplaceSW_Site,setOptionReplaceSW] = useState([])
  
  useEffect(() => {
    
    // if((selectSite.length === 0 || selectSite === "Select Site") && selectDevices === "All"){
    //   alert('Failed! Please Try Select Site Again!')
    //   window.location.reload();
    // }

    //Graph Display When Select Site
    // if(selectSite.length !== 0 && selectDevices === "All"){
      axios.get('http://localhost:3333/getSiteDC/' + siteLocation).then(res => {
        const data = res.data
        //AP
        let ReplaceData1 = 0
        let ReplaceData2 = 0
        let ReplaceData3 = 0
        let ReplaceData4 = 0
        //SW
        let ReplaceData5 = 0
        let ReplaceData6 = 0
        let ReplaceData7 = 0
        let ReplaceData8 = 0
        data.map((item) => {
          //AP
          if(item.device_type === "AP" && item.Details === "โดนน้ำ"){
            ReplaceData1++
          }
          if(item.device_type === "AP" && item.Details === "ไฟช็อต"){
            ReplaceData2++
          }
          if(item.device_type === "AP" && item.Details === "พอร์ตไม่จ่ายไฟ"){
            ReplaceData3++
          }
          if(item.device_type === "AP" && item.Details === "อื่นๆ"){
            ReplaceData4++
          }
          //SW
          if(item.device_type === "SW" && item.Details === "โดนน้ำ"){
            ReplaceData5++
          }
          if(item.device_type === "SW" && item.Details === "ไฟช็อต"){
            ReplaceData6++
          }
          if(item.device_type === "SW" && item.Details === "พอร์ตไม่จ่ายไฟ"){
            ReplaceData7++
          }
          if(item.device_type === "SW" && item.Details === "อื่นๆ"){
            ReplaceData8++
          }                   
        })
        setDataReplaceAP(dataReplaceAPChart(ReplaceData1,ReplaceData2,ReplaceData3,ReplaceData4))
        setOptionReplaceAP(optionReplaceAPChart(ReplaceData1,ReplaceData2,ReplaceData3,ReplaceData4))
        setDataReplaceSW(dataReplaceSWChart(ReplaceData5,ReplaceData6,ReplaceData7,ReplaceData8))
        setOptionReplaceSW(optionReplaceSWChart(ReplaceData5,ReplaceData6,ReplaceData7,ReplaceData8))
      }).catch(err => console.log(err))
    // }
  },[])

  //Test
  function dataReplaceAPChart(value1,value2,value3,value4){
    const data = [
      ["Device", "1 per Units"],
      ["โดนน้ำ", value1],
      ["ไฟช็อต", value2],
      ["พอร์ตไม่จ่ายไฟ", value3],
      ["อื่นๆ", value4]
    ]
    return data
  }
  function optionReplaceAPChart(value1,value2,value3,value4){
    const sum = value1+value2+value3+value4;
    const option = {
      title: `Total Replace Access Point : ` + sum,
      pieHole: 0.4,
      is3D: true,
    }
    return option
  }
  function dataReplaceSWChart(value1,value2,value3,value4){
    const data = [
      ["Device", "1 per Units"],
      ["โดนน้ำ", value1],
      ["ไฟช็อต", value2],
      ["พอร์ตไม่จ่ายไฟ", value3],
      ["อื่นๆ", value4]
    ]
    return data
  }
  function optionReplaceSWChart(value1,value2,value3,value4){
    const sum = value1+value2+value3+value4;
    const option = {
      title: `Total Replace Switch : ` + sum,
      pieHole: 0.4,
      is3D: true,
    }
    return option
  }
  
  function handleParamUpdate(newValue, type) {
    const site = newValue;
    console.log(newValue);
    if (type === "AP" && apdata2 == 0) {
      alert("No information of Access Point Data. Please Import CSV File!!")
      navigate('/dbusers');
    }else if (type === "AP" && apdata2 !== 0){
      navigate(`/useraccesspoint/${site}`, { state: { site } });
    } 
    if (type === "SW" && swdata2 == 0) {
      alert("No information of Switch Data. Please Import CSV File!!")
      navigate('/dbusers');
    }else if (type === "SW" && swdata2 !== 0){
      navigate(`/userswitch/${site}`, { state: { site } });
    }
    if (type === "DC" && dcdata2 == 0) {
      alert("No information of Report Device Data.")
      navigate('/dbusers');
    }else if(type === "DC" && dcdata2 !== 0){
      navigate(`/userdeviceclist/${site}`, { state: { site } });
    }
  }

  // const [apdata, setApdata] = useState([]);
  // const [swdata, setSwdata] = useState([]);
  // const [dcdata, setDcdata] = useState([]);
  // async function getDataAP() {
  //   const getAP = await axios.get("http://localhost:3333/aplist");
  //   const getSW = await axios.get("http://localhost:3333/swlist");
  //   const getDC = await axios.get("http://localhost:3333/deviceclist");
  //   const dataSite = [];
  //   const dataSite2 = [];
  //   const dataSite3 = [];
  //   getAP.data.map((item) => {
  //       dataSite.push(item);
  //   });
  //   getSW.data.map((item) => {
  //       dataSite2.push(item);
  //   });
  //   getDC.data.map((item) => {
  //       dataSite3.push(item);
  //   });
  //   setApdata(dataSite);
  //   setSwdata(dataSite2);
  //   setDcdata(dataSite3);
  // }
  // useEffect(() => {
  //   getDataAP();
  // }, []);

  const [apdata2, setApdata2] = useState([]);
  const [swdata2, setSwdata2] = useState([]);
  const [dcdata2, setDcdata2] = useState([]);
  const siteLocation = localStorage.getItem("site");
  const username1 = localStorage.getItem("name");
  
  useEffect(() => {   
    axios.get('http://localhost:3333/getSiteAP/' + siteLocation).then(res => {
      const data = res.data
      let inDoorCount = 0
      let outDoorCount = 0
      data.map((item) => {
        if(item.Role === 'Indoor'){
          inDoorCount++
        }
        if(item.Role === 'Outdoor'){
          outDoorCount++
        }
      })
      let sum = inDoorCount + outDoorCount;
      setApdata2(sum)
    }).catch(err => console.log(err))  
    
    axios.get('http://localhost:3333/getSiteSW/' + siteLocation).then(res => {
        const data = res.data
        let accessCount = 0
        let distributeCount = 0
        data.map((item) => {
          if(item.role === "Access"){
            accessCount++
          }
          if(item.role === "Distribute"){
            distributeCount++
          }
        })
        let sum = accessCount + distributeCount
        setSwdata2(sum)
    }).catch(err => console.log(err))
  
    axios.get('http://localhost:3333/getSiteDC/' + siteLocation).then(res => {
      const data = res.data
      let ApData = 0
      let SwData = 0
      data.map((item) => {
        if(item.device_type === "AP"){
          ApData++
        }
        if(item.device_type === "SW"){
          SwData++
        }          
      })
      let sum = ApData + SwData
      setDcdata2(sum)
    }).catch(err => console.log(err))         
  }, []);
  
  //Back To Home
  const handleHome = (event) => {
    event.preventDefault();
    localStorage.removeItem("site");
    window.location = "/home2";
  };

  const [ApCount1, setApCount1] = useState(0);
  const [SwCount1, setSwCount1] = useState(0);

  const [ApCount2, setApCount2] = useState(0);
  const [SwCount2, setSwCount2] = useState(0);
  useEffect(() => {
    const APfetchCount = async () => {
      try {
        const fetchData = await axios.get("http://localhost:3333/total_num_ap");
        setApCount1(fetchData.data.numap);
      } catch (err) {}
    };
    const SWfetchCount = async () => {
      try {
        const fetchData = await axios.get("http://localhost:3333/total_num_sw");
        setSwCount1(fetchData.data.numsw);
      } catch (err) {}
    };
    const APfetchCount2 = async () => {
      try {
        const fetchData = await axios.get("http://localhost:3333/total_num_ap_new");
        setApCount2(fetchData.data.numap_new);
      } catch (err) {}
    };
    const SWfetchCount2 = async () => {
      try {
        const fetchData = await axios.get("http://localhost:3333/total_num_sw_new");
        setSwCount2(fetchData.data.numsw_new);
      } catch (err) {}
    };
    APfetchCount();
    SWfetchCount();
    APfetchCount2();
    SWfetchCount2();
  }, []);

  //UI
  return (
    <div>
      <Navbar variant="dark" bg="dark" expand="lg">
        <Container fluid>
          <Navbar.Brand href="#">Dashboard ({siteLocation})</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-dark-example" />
          <Navbar.Collapse id="navbar-dark-example">
            <Nav className="me-auto">
              <Nav.Link onClick={(e) => handleParamUpdate("APList", "AP")}>
                Access Point
              </Nav.Link>
              <Nav.Link onClick={(e) => handleParamUpdate("SWList", "SW")}>
                Switch
              </Nav.Link>
              <Nav.Link onClick={(e) => handleParamUpdate("DCList", "DC")}>
                Replacement Device
              </Nav.Link>
              <NavDropdown title="Import CSV File" id="basic-nav-dropdown">          
                <NavDropdown.Item href="/accesspoint-excel2">Access Point</NavDropdown.Item>
                <NavDropdown.Item href="/switch-excel2">Switch</NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Nav>
              <NavDropdown title={"Profile : " + username1} id="basic-nav-dropdown">         
              <NavDropdown.Item onClick={handleLogout}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-door-closed-fill" viewBox="0 0 16 16">
                    <path d="M12 1a1 1 0 0 1 1 1v13h1.5a.5.5 0 0 1 0 1h-13a.5.5 0 0 1 0-1H3V2a1 1 0 0 1 1-1zm-2 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
                  </svg>
                  &nbsp; Log Out
                </NavDropdown.Item>
                <NavDropdown.Item onClick={handleHome}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-left" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"/>
                    <path fill-rule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"/>
                  </svg>
                  &nbsp; Back To Site
                  </NavDropdown.Item>
              </NavDropdown>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="my-3">
      <div className="row">
        {/* <div className="col">
          <select className="form-select" onChange={(e) => {setSelectSite(e.target.value)}}>
            <option defaultValue>Select Site</option>
            {siteName.map((item, index) => (                 
                  <option key={index}>
                    {item.name}
                  </option> 
            ))}
          </select>
        </div> */}
        
        {/* <div className="col">
          <select className="form-select" onChange={(e) => {setSelectDevices(e.target.value)}}>
            <option defaultValue>Select Device</option>
            <option value="All">All Devices</option>
          </select>
        </div> */}

        {/* Show Chart */}       
          {/* <div className="my-3">                   
              <div>
                <h1>Site : {siteLocation}</h1>
                <Chart
                  chartType="PieChart"
                  width="100%"
                  height="250px"
                  data={replaceapdata}
                  options={replaceapoption}
                />
                <Chart
                  chartType="PieChart"
                  width="100%"
                  height="250px"
                  data={replaceswdata}
                  options={replaceswoption}
                />
              </div>            
          </div> */}         
          
          <div className="my-3">
              {
              dcdata2 === 0 &&
              <div>
                  <h3>Number Of Replace Device</h3>
                  <h5>---Not Found Replace Device Data---</h5>
              </div>
              }
              {
              dcdata2 !== 0 &&
              <div>
                  <h3>Number Of Replace Device</h3>
                  <Chart
                    chartType="PieChart"
                    width="100%"
                    height="250px"
                    data={dataReplaceAP_Site}
                    options={optionReplaceAP_Site}
                  />
                  <Chart
                    chartType="PieChart"
                    width="100%"
                    height="250px"
                    data={dataReplaceSW_Site}
                    options={optionReplaceSW_Site}
                  />
              </div>
            } 
          </div>
          <div className="my-3">
          <table className="table table-bordered">
            <thead className="thead-light">
              <tr>
                <th scope="col">Device</th>
                <th scope="col">Total Device</th>
                <th scope="col">Total New Device</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Access Point</td>
                <td>{ApCount1}</td>
                <td>{ApCount2}</td>
              </tr>
              <tr>
                <td>Switch</td>
                <td>{SwCount1}</td>
                <td>{SwCount2}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      </Container>
    </div>
  );
}

export default function Dashboard() {
  return <DashboardContent />;
}
