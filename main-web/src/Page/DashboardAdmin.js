import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import { Chart } from "react-google-charts";
import NavDropdown from "react-bootstrap/NavDropdown";
import axios from "axios";
import { useNavigate} from "react-router-dom";

function DashboardAdminContent() {
  const navigate = useNavigate();
  
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

  //TEST
  // const [num_ap, setNumAP] = useState(0);
  // const [num_sw, setNumSwitch] = useState(0);
  // useEffect(() => {
  //   const fetchCount = async () => {
  //     try {
  //       const fetchData = await axios.get("http://localhost:3333/total_num_ap");
  //       setNumAP(fetchData.data.numap);
  //     } catch (err) {}
  //   };
  //   const fetchCount2 = async () => {
  //     try {
  //       const fetchData = await axios.get("http://localhost:3333/total_num_sw");
  //       setNumSwitch(fetchData.data.numsw);
  //     } catch (err) {}
  //   };
  //   fetchCount();
  //   fetchCount2();
  // }, []);

  //Total Replace AP List API Graph
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

  //Site
  const [siteName,setSiteName] = useState([])
  async function getData() {
    const getSiteName = await axios.get("http://localhost:3333/site_name")
    setSiteName(getSiteName.data)
    console.log(getSiteName.data);
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
    
    if((selectSite.length === 0 || selectSite === "Select Site") && selectDevices === "All"){
      alert('Failed! Please Try Select Site Again!')
      window.location.reload();
    }

    //Graph Display When Select Site
    if(selectSite.length !== 0 && selectDevices === "All"){
      axios.get('http://localhost:3333/getSiteDC/' + selectSite).then(res => {
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
    }
  },[selectSite,selectDevices])

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

  const [apdata, setApdata] = useState([]);
  const [swdata, setSwdata] = useState([]);
  const [dcdata, setDcdata] = useState([]);
  async function getDeviceData() {
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
    getDeviceData();
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
                {siteName !== "" && (
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
              {siteName !== "" && (
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
              <NavDropdown title="Replacement Device" id="basic-nav-dropdown">
              {siteName !== "" && (
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
      <div className="row">
        <div className="col">       
          <select className="form-select" onChange={(e) => {setSelectSite(e.target.value)}}>
            <option defaultValue>Select Site</option>
            {siteName !== "" && (
            <option value="All">All</option>
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
            <option value="All">All Devices</option>
          </select>
        </div>

        {/* Show Chart */}
        {
          selectSite === "All" &&
          <div className="my-3">
            {
              selectDevices === "All" && 
              <div>
                <h1>Site : {selectSite}</h1>
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
            }
          </div>
        }
        {
          selectSite !== "All" && 
          <div className="my-3">
            { selectDevices === "All" &&
              <div>
                  <h1>Site : {selectSite}</h1>
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
        }
      </div>
      </Container>
    </div>
  );
}

export default function DashboardAdmin() {
  return <DashboardAdminContent />;
}
