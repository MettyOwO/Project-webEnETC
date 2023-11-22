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
    fetch("http://localhost:3333/authen", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token, email, site1
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
  const [dcapCount2, setDcApCount2] = useState(0);
  useEffect(() => {
    const fetchCount6 = async () => {
      try {
        const fetchData = await axios.get("http://localhost:3333/total_dc_ap2");
        setDcApCount2(fetchData.data.numdcap2);
      } catch (err) {}
    };
    fetchCount6();
  }, []);
  //Total Device Corrupted Install - Switch
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
  const [dcswCount2, setDcSwCount2] = useState(0);
  useEffect(() => {
    const fetchCount8 = async () => {
      try {
        const fetchData = await axios.get("http://localhost:3333/total_dc_sw2");
        setDcSwCount2(fetchData.data.numdcsw2);
      } catch (err) {}
    };
    fetchCount8();
  }, []); 
  const dataAllDC = [
    ["Device", "1 per Units"],
    ["Switch", dcswCount + dcswCount2],
    ["AP", dcapCount + dcapCount2],
  ];
  const optionDC = {
    title: `Total Device Corrupted`,
    pieHole: 0.4,
    is3D: true,
  };

  const [apsite, setAPSite] = useState([]);
  const [swsite, setSWSite] = useState([]);
  const [dcsite, setDCSite] = useState([]);
  const [siteName,setSiteName] = useState([])
  async function getData() {
    const getAPSite = await axios.get("http://localhost:3333/ap_site");
    const getSWSite = await axios.get("http://localhost:3333/sw_site");
    const getDCSite = await axios.get("http://localhost:3333/dc_site");
    const getSiteName = await axios.get("http://localhost:3333/site_name")
    //console.log(getSWSite.data);
    setAPSite(getAPSite.data);
    setSWSite(getSWSite.data);
    setDCSite(getDCSite.data);
    setSiteName(getSiteName.data)
    //console.log(getSiteName.data);
  }
  useEffect(() => {
    getData();
  }, []);

  function handleParamUpdate(newValue, type) {
    const site = newValue;
    console.log(newValue);
    if (type === "AP") {
      navigate(`/useraccesspoint/${site}`, { state: { site } });
    } else if (type === "SW") {
      navigate(`/userswitch/${site}`, { state: { site } });
    } else if (type === "DC") {
      navigate(`/userdeviceclist/${site}`, { state: { site } });
    }
  }

  const [selectDevices,setSelectDevices] = useState([])
  const [selectSite,setSelectSite] = useState([])
  const [dataAPSite,setDataAPSite] = useState([])
  const [dataSWSite,setDataSWSite] = useState([])
  const [dataDCSite,setDataDCSite] = useState([])
  useEffect(() => {
    
    if((selectSite.length == 0 || selectSite == "Select Site") && selectDevices == "all"){
      alert('Failed! No found a Data.')
      window.location.reload();
    }
    if((selectSite.length == 0 || selectSite == "Select Site") && selectDevices == "access-point"){
      alert('Failed! No found a Data.')
      window.location.reload();
    }
    if((selectSite.length == 0 || selectSite == "Select Site") && selectDevices == "switch"){
      alert('Failed! No found a Data.')
      window.location.reload();
    }
    if((selectSite.length == 0 || selectSite == "Select Site") && selectDevices == "device-corrupted"){
      alert('Failed! No found a Data.')
      window.location.reload();
    }

    if(selectSite.length != 0 && selectDevices == "access-point" || selectDevices == "all"){
      axios.get('http://localhost:3333/getSiteAP/' + selectSite).then(res => {
        //console.log(res.data);
        const data = res.data
        let inDoorCount = 0
        let outDoorCount = 0
        data.map((item) => {
          if(item.Role == 'Indoor'){
            inDoorCount++
          }
          if(item.Role == 'Outdoor'){
            outDoorCount++
          }
        })
        //console.log('Indoor : ' + inDoorCount + " | Outdoor : " + outDoorCount);
        //console.log(dataAPChart(inDoorCount,outDoorCount));
        setDataAPSite(dataAPChart(inDoorCount,outDoorCount))
      }).catch(err => console.log(err))
    }
    if(selectSite.length != 0 && selectDevices == "switch" || selectDevices == "all"){
      axios.get('http://localhost:3333/getSiteSW/' + selectSite).then(res => {
        //console.log(res.data);
        const data = res.data
        let accessCount = 0
        let distributeCount = 0
        data.map((item) => {
          if(item.role == "Access"){
            accessCount++
          }
          if(item.role == "Distribute"){
            distributeCount++
          }
        })
        //console.log('Access : ' + accessCount + " | Distribute : " + distributeCount);
        setDataSWSite(dataSWChart(accessCount,distributeCount))
      }).catch(err => console.log(err))
    }
    if(selectSite.length != 0 && selectDevices == "device-corrupted" || selectDevices == "all"){
      axios.get('http://localhost:3333/getSiteDC/' + selectSite).then(res => {
        //console.log(res.data);
        const data = res.data
        let apIndoor = 0
        let apOutdoor = 0
        let swAccess = 0
        let swDistribute = 0
        data.map((item) => {
          //console.log(item);
          if(item.Role == "AP-Indoor"){
            apIndoor++
          }
          if(item.Role == "AP-Outdoor"){
            apOutdoor++
          }
          if(item.Role == "SW-Access"){
            swAccess++
          }
          if(item.Role == "SW-Distribute"){
            swDistribute++
          }
        })
        //console.log('Access : ' + parseInt(apIndoor+apOutdoor) + " | Distribute : " + parseInt(swAccess+swDistribute));
        setDataDCSite(dataDCChart(apIndoor+apOutdoor,swAccess+swDistribute))
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
  
  //UI
  return (
    <div>
      <Navbar variant="dark" bg="dark" expand="lg">
        <Container fluid>
          <Navbar.Brand href="#">Dashboard(Customer)</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-dark-example" />
          <Navbar.Collapse id="navbar-dark-example">
            <Nav className="me-auto">
              <NavDropdown title="Access Point" id="basic-nav-dropdown">
                <NavDropdown.Item
                  onClick={(e) => handleParamUpdate("APList", "AP")}
                >
                  Access Point List
                </NavDropdown.Item>
                {apsite.map((item, index) => (
                  <NavDropdown.Item
                    key={index}
                    onClick={(e) => handleParamUpdate(e.target.text, "AP")}
                  >
                    {item.name}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>
              <NavDropdown title="Switch" id="basic-nav-dropdown">
                <NavDropdown.Item
                  onClick={(e) => handleParamUpdate("SWList", "SW")}
                >
                  Switch List
                </NavDropdown.Item>
                {swsite.map((item, index) => (
                  <NavDropdown.Item
                    key={index}
                    onClick={(e) => handleParamUpdate(e.target.text, "SW")}
                  >
                    {item.name}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>
              <NavDropdown title="Device Corrupted" id="basic-nav-dropdown">
                <NavDropdown.Item
                  onClick={(e) => handleParamUpdate("DCList", "DC")}
                >
                  Device Corrupted List
                </NavDropdown.Item>
                {dcsite.map((item, index) => (
                  <NavDropdown.Item
                    key={index}
                    onClick={(e) => handleParamUpdate(e.target.text, "DC")}
                  >
                    {item.name}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>
              <NavDropdown title="Add" id="basic-nav-dropdown">
                  <NavDropdown.Item href="/addsite2">Add Site</NavDropdown.Item>
                  <NavDropdown.Item href="/add_model2">Add Model</NavDropdown.Item>
                  <NavDropdown.Item href="/add_datasheet2">Add Datasheet</NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Nav>
              <Nav.Link onClick={handleLogout}>Log-Out</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="my-3">
      <div className="row">
        <div className="col">
          <select className="form-select" onChange={(e) => {setSelectSite(e.target.value)}}>
            <option defaultValue>Select Site</option>
            <option value="all">All Sites</option>
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
            <option value="device-corrupted">DeviceCorrupted</option>
          </select>
        </div>

        {/* Show Chart */}
        {
          selectSite == "all" &&
          <div className="my-3">
            {
              selectDevices == "all" && 
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
               selectDevices == "access-point" && 
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
               selectDevices == "switch" && 
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
               selectDevices == "device-corrupted" && 
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
          selectSite != "all" && 
          <div>
            { selectDevices == "all" &&
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
            { selectDevices == "access-point" &&
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
            { selectDevices == "switch" &&
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
            { selectDevices == "device-corrupted" &&
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

export default function Dashboard() {
  return <DashboardContent />;
}
