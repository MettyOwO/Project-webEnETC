import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import { Chart } from "react-google-charts";
import NavDropdown from "react-bootstrap/NavDropdown";
import axios from "axios";
import { useNavigate, useLocation} from "react-router-dom";
import { Link } from "react-router-dom";
import { CSVLink } from "react-csv";

function DashboardAdminContent() {
  
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  
  //Check Token API
  useEffect(() => {
    const token = localStorage.getItem("token");
    const name1 = localStorage.getItem("name");
    fetch("http://localhost:3333/authen", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token, name1,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "ok") {
        } else {
          alert("Authen Failed. Please Try Login Again!");
          localStorage.removeItem("token");
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
    localStorage.removeItem("name");
    window.location = "/login";
  };

   //Total AP Indoor, Outdoor Install
  const [apinCount, setApInCount] = useState(0);
  useEffect(() => {
    const fetchCount3 = async () => {
      try {
        const fetchData = await axios.get("http://localhost:3333/total_ap_in");
        setApInCount(fetchData.data.numap);
      } catch (err) {}
    };
    fetchCount3();
  }, []);
  const [apoutCount, setApOutCount] = useState(0);
  useEffect(() => {
    const fetchCount4 = async () => {
      try {
        const fetchData = await axios.get("http://localhost:3333/total_ap_out");
        setApOutCount(fetchData.data.numap2);
      } catch (err) {}
    };
    fetchCount4();
  }, []);
  const dataAllAP = [
    ["Device", "1 per Units"],
    ["AP Indoor", apinCount],
    ["AP Outdoor", apoutCount],
  ];
  const optionAP = {
    title: `Total Access Point Install`,
    pieHole: 0.4,
    is3D: true,
  };

  //Total Access,Dist Switch Install
  const [switchCount, setSwitchCount] = useState(0);
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const fetchData = await axios.get(
          "http://localhost:3333/total_switch_as"
        );
        setSwitchCount(fetchData.data.numswitch);
      } catch (err) {}
    };
    fetchCount();
  }, []);  
  const [switchCount2, setSwitchCount2] = useState(0);
  useEffect(() => {
    const fetchCount2 = async () => {
      try {
        const fetchData = await axios.get(
          "http://localhost:3333/total_switch_ds"
        );
        setSwitchCount2(fetchData.data.numswitch2);
      } catch (err) {}
    };
    fetchCount2();
  }, []);  
  const dataAllSW = [
    ["Device", "1 per Units"],
    ["Switch Access", switchCount],
    ["Switch Dist", switchCount2],
  ];
  const optionSW = {
    title: `Total Switch Install`,
    pieHole: 0.4,
    is3D: true,
  };

  //Total Device Corrupted Install - AP
  const [dcapCount, setDcApCount] = useState(0);
  useEffect(() => {
    const fetchCount5 = async () => {
      try {
        const fetchData = await axios.get("http://localhost:3333/total_dc_ap");
        setDcApCount(fetchData.data.numdcap);
      } catch (err) {}
    };
    fetchCount5();
  }, []); 
  const [dcswCount, setDcSwCount] = useState(0);
  useEffect(() => {
    const fetchCount7 = async () => {
      try {
        const fetchData = await axios.get("http://localhost:3333/total_dc_sw");
        setDcSwCount(fetchData.data.numdcsw);
      } catch (err) {}
    };
    fetchCount7();
  }, []);
  const dataAllDC = [
    ["Device", "1 per Units"],
    ["Switch", dcswCount],
    ["AP", dcapCount],
  ];
  const optionDC = {
    title: `Total Corrupt Device`,
    pieHole: 0.4,
    is3D: true,
  };

  const [siteName,setSiteName] = useState([])
  async function getData() {
    const getSiteName = await axios.get("http://localhost:3333/site_name")
    setSiteName(getSiteName.data)
    console.log(getSiteName.data);
  }
  useEffect(() => {
    getData();
  }, []);

  function handleParamUpdate(newValue, type) {
    const site = newValue;
    console.log(newValue);
    if (type === "AP" && apdata == 0) {
      alert("No information of Access Point Data. Please Import CSV File!!")
      navigate('/dbadmin');
    }else if (type === "AP" && apdata !== 0){
      navigate(`/accesspoint/${site}`, { state: { site } });
    } 
    if (type === "SW" && swdata == 0) {
      alert("No information of Switch Data. Please Import CSV File!!")
      navigate('/dbadmin');
    }else if (type === "SW" && swdata !== 0){
      navigate(`/switch/${site}`, { state: { site } });
    }
    if (type === "DC" && dcdata == 0) {
      alert("No information of Report Device Data.")
      navigate('/dbadmin');
    }else if(type === "DC" && dcdata !== 0){
      navigate(`/deviceclist/${site}`, { state: { site } });
    }
  }

  const [selectDevices,setSelectDevices] = useState([])
  const [selectSite,setSelectSite] = useState([])
  const [dataAPSite,setDataAPSite] = useState([])
  const [dataSWSite,setDataSWSite] = useState([])
  const [dataDCSite,setDataDCSite] = useState([])
  useEffect(() => {
    
    if((selectSite.length === 0 || selectSite === "Select Site") && selectDevices === "all"){
      alert('Failed! No found a Data.')
      window.location.reload();
    }
    if((selectSite.length === 0 || selectSite === "Select Site") && selectDevices === "access-point"){
      alert('Failed! No found a Data.')
      window.location.reload();
    }
    if((selectSite.length === 0 || selectSite === "Select Site") && selectDevices === "switch"){
      alert('Failed! No found a Data.')
      window.location.reload();
    }
    if((selectSite.length === 0 || selectSite === "Select Site") && selectDevices === "corrupt-device"){
      alert('Failed! No found a Data.')
      window.location.reload();
    }

    //Graph Display When Select Site
    if(selectSite.length !== 0 && selectDevices === "access-point" || selectDevices === "all"){
      axios.get('http://localhost:3333/getSiteAP/' + selectSite).then(res => {
        //console.log(res.data);
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
        //console.log('Indoor : ' + inDoorCount + " | Outdoor : " + outDoorCount);
        //console.log(dataAPChart(inDoorCount,outDoorCount));
        setDataAPSite(dataAPChart(inDoorCount,outDoorCount))
      }).catch(err => console.log(err))
    }
    if(selectSite.length !== 0 && selectDevices === "switch" || selectDevices === "all"){
      axios.get('http://localhost:3333/getSiteSW/' + selectSite).then(res => {
        //console.log(res.data);
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
        //console.log('Access : ' + accessCount + " | Distribute : " + distributeCount);
        setDataSWSite(dataSWChart(accessCount,distributeCount))
      }).catch(err => console.log(err))
    }
    if(selectSite.length !== 0 && selectDevices === "corrupt-device" || selectDevices === "all"){
      axios.get('http://localhost:3333/getSiteDC/' + selectSite).then(res => {
        //console.log(res.data);
        const data = res.data
        let ApData = 0
        let SwData = 0
        data.map((item) => {
          //console.log(item);
          if(item.device_type === "AP"){
            ApData++
          }
          if(item.device_type === "SW"){
            SwData++
          }          
        })
        //console.log('Access : ' + parseInt(apIndoor+apOutdoor) + " | Distribute : " + parseInt(swAccess+swDistribute));
        setDataDCSite(dataDCChart(ApData,SwData))
      }).catch(err => console.log(err))
    }
  },[selectSite,selectDevices])

  function dataAPChart(value1,value2){
    const data = [
      ["Device", "1 per Units"],
      ["AP Indoor", value1],
      ["AP Outdoor", value2],
    ]
    return data
  }
  function dataSWChart(value1,value2){
    const data = [
      ["Device", "1 per Units"],
      ["Switch Access", value1],
      ["Switch Distribute", value2],
    ]
    return data
  }
  function dataDCChart(value1,value2){
    const data = [
      ["Device", "1 per Units"],
      ["Access Point", value1],
      ["Switch", value2],
    ]
    return data
  }

  const [apdata, setApdata] = useState([]);
  const [swdata, setSwdata] = useState([]);
  const [dcdata, setDcdata] = useState([]);
  async function getDataAP() {
    const getAP = await axios.get("http://localhost:3333/aplist");
    const getSW = await axios.get("http://localhost:3333/swlist");
    const getDC = await axios.get("http://localhost:3333/deviceclist");
    const dataSite = [];
    const dataSite2 = [];
    const dataSite3 = [];
    getAP.data.map((item) => {
        dataSite.push(item);
    });
    getSW.data.map((item) => {
        dataSite2.push(item);
    });
    getDC.data.map((item) => {
        dataSite3.push(item);
    });
    setApdata(dataSite);
    setSwdata(dataSite2);
    setDcdata(dataSite3);
  }
  useEffect(() => {
    getDataAP();
  }, []);
  
  const username1 = localStorage.getItem("name");
  //UI
  return (
    <div>
      <Navbar variant="dark" bg="dark" expand="lg">
        <Container fluid>
          <Navbar.Brand href="#">Dashboard (Admin)</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-dark-example" />
          <Navbar.Collapse id="navbar-dark-example">
            <Nav className="me-auto">
              <NavDropdown title="Access Point" id="basic-nav-dropdown">              
                {siteName != "" && (
                <NavDropdown.Item
                  onClick={(e) => handleParamUpdate("APList", "AP")}
                >
                  All Site
                </NavDropdown.Item>
                )}
                {siteName.map((item, index) => (
                  <NavDropdown.Item
                    key={index}
                    onClick={(e) => handleParamUpdate(e.target.text, "AP")}
                  >
                    {item.name}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>
              <NavDropdown title="Switch" id="basic-nav-dropdown">
              {siteName != "" && (
                <NavDropdown.Item
                  onClick={(e) => handleParamUpdate("SWList", "SW")}
                >
                  All Site
                </NavDropdown.Item>
                )}
                {siteName.map((item, index) => (
                  <NavDropdown.Item
                    key={index}
                    onClick={(e) => handleParamUpdate(e.target.text, "SW")}
                  >
                    {item.name}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>
              <NavDropdown title="Corrupt Device List" id="basic-nav-dropdown">
              {siteName != "" && (
                <NavDropdown.Item
                  onClick={(e) => handleParamUpdate("DCList", "DC")}
                >
                  All Site
                </NavDropdown.Item>
                )}
                {siteName.map((item, index) => (
                  <NavDropdown.Item
                    key={index}
                    onClick={(e) => handleParamUpdate(e.target.text, "DC")}
                  >
                    {item.name}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>
              <NavDropdown title="Import CSV File" id="basic-nav-dropdown">          
                <NavDropdown.Item href="/accesspoint-excel">Access Point</NavDropdown.Item>
                <NavDropdown.Item href="/switch-excel">Switch</NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Nav>
              {/* <Nav.Link onClick={handleLogout}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-in-left" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M10 3.5a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 1 1 0v2A1.5 1.5 0 0 1 9.5 14h-8A1.5 1.5 0 0 1 0 12.5v-9A1.5 1.5 0 0 1 1.5 2h8A1.5 1.5 0 0 1 11 3.5v2a.5.5 0 0 1-1 0z"/>
                <path fill-rule="evenodd" d="M4.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H14.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z"/>
              </svg>
              &nbsp; LOG OUT
              </Nav.Link> */}
              <NavDropdown title={"Profile : " + username1} id="basic-nav-dropdown">         
              <NavDropdown.Item href="/home">Back to home</NavDropdown.Item>
                <NavDropdown.Item onClick={handleLogout}>Log Out</NavDropdown.Item>
              </NavDropdown>
              &nbsp;&nbsp;&nbsp;&nbsp;
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="my-3">
      
      {/* <Link
        to={'/home'}
        className="btn btn-dark"
        >
        Back To Home
        </Link>
        <br/><br/> */}
      
      <div className="row">
        <div className="col">       
          <select className="form-select" onChange={(e) => {setSelectSite(e.target.value)}}>
            <option defaultValue>---Select Site---</option>
            {siteName != "" && (
            <option value="all">All</option>
            )}
            {siteName.map((item, index) => (                 
                  <option key={index}>
                    {item.name}
                  </option> 
            ))}
          </select>
        </div>
        <div className="col">
          <select className="form-select" onChange={(e) => {setSelectDevices(e.target.value)}}>
            <option defaultValue>Select Device</option>
            <option value="all">All Devices</option>
            <option value="access-point">Access Point</option>
            <option value="switch">Switch</option>
            <option value="corrupt-device">Corrupt Device</option>
          </select>
        </div>

        {/* Show Chart */}
        {
          selectSite === "all" &&
          <div className="my-3">
            {
              selectDevices === "all" && 
              <div>
                <Chart
                  chartType="PieChart"
                  width="100%"
                  height="250px"
                  data={dataAllAP}
                  options={optionAP}
                />
                <Chart
                  chartType="PieChart"
                  width="100%"
                  height="250px"
                  data={dataAllSW}
                  options={optionSW}
                />
                <Chart
                  chartType="PieChart"
                  width="100%"
                  height="250px"
                  data={dataAllDC}
                  options={optionDC}
                />
              </div>
            }
            {
               selectDevices === "access-point" && 
               <div>
                  <Chart
                    chartType="PieChart"
                    width="100%"
                    height="250px"
                    data={dataAllAP}
                    options={optionAP}
                  />
               </div>
            }
            {
               selectDevices === "switch" && 
               <div>
                  <Chart
                    chartType="PieChart"
                    width="100%"
                    height="250px"
                    data={dataAllSW}
                    options={optionSW}
                  />
               </div>
            }
            {
               selectDevices === "corrupt-device" && 
               <div>
                  <Chart
                    chartType="PieChart"
                    width="100%"
                    height="250px"
                    data={dataAllDC}
                    options={optionDC}
                  />
               </div>
            }
          </div>
        }
        {
          selectSite !== "all" && 
          <div>
            { selectDevices === "all" &&
              <div>
                  <h1>{selectSite} : {selectDevices}</h1>
                  <Chart
                    chartType="PieChart"
                    width="100%"
                    height="250px"
                    data={dataAPSite}
                    options={optionAP}
                  />
                  <Chart
                    chartType="PieChart"
                    width="100%"
                    height="250px"
                    data={dataSWSite}
                    options={optionSW}
                  />
                  <Chart
                    chartType="PieChart"
                    width="100%"
                    height="250px"
                    data={dataDCSite}
                    options={optionDC}
                  />
              </div>
            }
            { selectDevices === "access-point" &&
              <div>
                  <h1>{selectSite} : {selectDevices}</h1>
                  <Chart
                    chartType="PieChart"
                    width="100%"
                    height="250px"
                    data={dataAPSite}
                    options={optionAP}
                  />
              </div>
            }
            { selectDevices === "switch" &&
              <div>
                  <h1>{selectSite} : {selectDevices}</h1>
                  <Chart
                    chartType="PieChart"
                    width="100%"
                    height="250px"
                    data={dataSWSite}
                    options={optionSW}
                  />
              </div>
            }
            { selectDevices === "corrupt-device" &&
              <div>
                  <h1>{selectSite} : {selectDevices}</h1>
                  <Chart
                    chartType="PieChart"
                    width="100%"
                    height="250px"
                    data={dataDCSite}
                    options={optionDC}
                  />
              </div>
            }
          </div>
        }
      </div>
      </Container>
    </div>
  );
}

export default function DashboardAdmin() {
  return <DashboardAdminContent />;
}
