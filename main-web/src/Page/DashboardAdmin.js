import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import { Chart } from "react-google-charts";
import NavDropdown from "react-bootstrap/NavDropdown";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import axios from "axios";
import AccessPointList from "../Page/AccessPointList";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useNavigate, useLocation, Link } from "react-router-dom";

function DashboardAdminContent() {
  //Check Token API
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:3333/authen", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "ok") {
        } else {
          alert("Authen Failed. Please Try Login Again!");
          localStorage.removeItem("token");
          window.location = "/login";
        }
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }, []);

  //Total Access Switch
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
  //Total Dist Switch
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

  //Total AP Indoor
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
  //Total AP Outdoor
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

  //Total Device Corrupted - AP
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

  //Total Device Corrupted - Switch
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

  //KKU
  //Total AP Indoor
  const [apinkkuCount, setApInKkuCount] = useState(0);
  useEffect(() => {
    const fetchCount9 = async () => {
      try {
        const fetchData = await axios.get(
          "http://localhost:3333/total_ap_in_kku"
        );
        setApInKkuCount(fetchData.data.numapinkku);
      } catch (err) {}
    };
    fetchCount9();
  }, []);
  //Total AP Outdoor
  const [apoutkkuCount, setApOutKkuCount] = useState(0);
  useEffect(() => {
    const fetchCount10 = async () => {
      try {
        const fetchData = await axios.get(
          "http://localhost:3333/total_ap_out_kku"
        );
        setApOutKkuCount(fetchData.data.numapoutkku);
      } catch (err) {}
    };
    fetchCount10();
  }, []);

  //Total Access Switch
  const [switchCountkku, setSwitchKkuCount] = useState(0);
  useEffect(() => {
    const fetchCount11 = async () => {
      try {
        const fetchData = await axios.get(
          "http://localhost:3333/total_switch_as_kku"
        );
        setSwitchKkuCount(fetchData.data.numswitchaskku);
      } catch (err) {}
    };
    fetchCount11();
  }, []);
  //Total Dist Switch
  const [switchCountkku2, setSwitchKkuCount2] = useState(0);
  useEffect(() => {
    const fetchCount12 = async () => {
      try {
        const fetchData = await axios.get(
          "http://localhost:3333/total_switch_ds_kku"
        );
        setSwitchKkuCount2(fetchData.data.numswitchdskku);
      } catch (err) {}
    };
    fetchCount12();
  }, []);

  //Total Device Corrupted - AP
  const [dcapkkuCount, setDcApKkuCount] = useState(0);
  useEffect(() => {
    const fetchCount13 = async () => {
      try {
        const fetchData = await axios.get(
          "http://localhost:3333/total_dc_ap_kku"
        );
        setDcApKkuCount(fetchData.data.numdcapkku);
      } catch (err) {}
    };
    fetchCount13();
  }, []);
  const [dcapkkuCount2, setDcApKkuCount2] = useState(0);
  useEffect(() => {
    const fetchCount14 = async () => {
      try {
        const fetchData = await axios.get(
          "http://localhost:3333/total_dc_ap2_kku"
        );
        setDcApKkuCount2(fetchData.data.numdcapkku2);
      } catch (err) {}
    };
    fetchCount14();
  }, []);

  //Total Device Corrupted - Switch
  const [dcswkkuCount, setDcSwKkuCount] = useState(0);
  useEffect(() => {
    const fetchCount15 = async () => {
      try {
        const fetchData = await axios.get(
          "http://localhost:3333/total_dc_sw_kku"
        );
        setDcSwKkuCount(fetchData.data.numdcswkku);
      } catch (err) {}
    };
    fetchCount15();
  }, []);
  const [dcswkkuCount2, setDcSwKkuCount2] = useState(0);
  useEffect(() => {
    const fetchCount16 = async () => {
      try {
        const fetchData = await axios.get(
          "http://localhost:3333/total_dc_sw2_kku"
        );
        setDcSwKkuCount2(fetchData.data.numdcswkku2);
      } catch (err) {}
    };
    fetchCount16();
  }, []);

  //NCK
  //Total AP Indoor
  const [apinnkcCount, setApInNkcCount] = useState(0);
  useEffect(() => {
    const fetchCount17 = async () => {
      try {
        const fetchData = await axios.get(
          "http://localhost:3333/total_ap_in_nkc"
        );
        setApInNkcCount(fetchData.data.numapinnkc);
      } catch (err) {}
    };
    fetchCount17();
  }, []);
  //Total AP Outdoor
  const [apoutnkcCount, setApOutNkcCount] = useState(0);
  useEffect(() => {
    const fetchCount18 = async () => {
      try {
        const fetchData = await axios.get(
          "http://localhost:3333/total_ap_out_nkc"
        );
        setApOutNkcCount(fetchData.data.numapoutnkc);
      } catch (err) {}
    };
    fetchCount18();
  }, []);

  //Total Access Switch
  const [switchCountnkc, setSwitchNkcCount] = useState(0);
  useEffect(() => {
    const fetchCount19 = async () => {
      try {
        const fetchData = await axios.get(
          "http://localhost:3333/total_switch_as_nkc"
        );
        setSwitchNkcCount(fetchData.data.numswitchasnkc);
      } catch (err) {}
    };
    fetchCount19();
  }, []);
  //Total Dist Switch
  const [switchCountnkc2, setSwitchNkcCount2] = useState(0);
  useEffect(() => {
    const fetchCount20 = async () => {
      try {
        const fetchData = await axios.get(
          "http://localhost:3333/total_switch_ds_nkc"
        );
        setSwitchNkcCount2(fetchData.data.numswitchdsnkc);
      } catch (err) {}
    };
    fetchCount20();
  }, []);

  //Total Device Corrupted - AP
  const [dcapnkcCount, setDcApNkcCount] = useState(0);
  useEffect(() => {
    const fetchCount21 = async () => {
      try {
        const fetchData = await axios.get(
          "http://localhost:3333/total_dc_ap_nkc"
        );
        setDcApNkcCount(fetchData.data.numdcapnkc);
      } catch (err) {}
    };
    fetchCount21();
  }, []);
  const [dcapnkcCount2, setDcApNkcCount2] = useState(0);
  useEffect(() => {
    const fetchCount22 = async () => {
      try {
        const fetchData = await axios.get(
          "http://localhost:3333/total_dc_ap2_nkc"
        );
        setDcApNkcCount2(fetchData.data.numdcapnkc2);
      } catch (err) {}
    };
    fetchCount22();
  }, []);

  //Total Device Corrupted - Switch
  const [dcswnkcCount, setDcSwNkcCount] = useState(0);
  useEffect(() => {
    const fetchCount23 = async () => {
      try {
        const fetchData = await axios.get(
          "http://localhost:3333/total_dc_sw_nkc"
        );
        setDcSwNkcCount(fetchData.data.numdcswnkc);
      } catch (err) {}
    };
    fetchCount23();
  }, []);
  const [dcswnkcCount2, setDcSwNkcCount2] = useState(0);
  useEffect(() => {
    const fetchCount24 = async () => {
      try {
        const fetchData = await axios.get(
          "http://localhost:3333/total_dc_sw2_nkc"
        );
        setDcSwNkcCount2(fetchData.data.numdcswnkc2);
      } catch (err) {}
    };
    fetchCount24();
  }, []);

  //Log Out
  const handleLogout = (event) => {
    event.preventDefault();
    localStorage.removeItem("token");
    window.location = "/login";
  };

  //All Device
  const data = [
    ["Device", "1 per Units"],
    ["AP Indoor", apinCount],
    ["AP Outdoor", apoutCount],
  ];
  const options = {
    title: "Total AP Install",
    pieHole: 0.4,
    is3D: true,
  };

  const data2 = [
    ["Device", "1 per Units"],
    ["Switch Access", switchCount],
    ["Switch Dist", switchCount2],
  ];
  const options2 = {
    title: "Total Switch Install",
    pieHole: 0.4,
    is3D: true,
  };

  const data3 = [
    ["Device", "1 per Units"],
    ["Switch", dcswCount + dcswCount2],
    ["AP", dcapCount + dcapCount2],
  ];
  const options3 = {
    title: "Total Device Corrupted",
    pieHole: 0.4,
    is3D: true,
  };

  //KKU Device
  const data4 = [
    ["Device", "1 per Units"],
    ["AP Indoor", apinkkuCount],
    ["AP Outdoor", apoutkkuCount],
  ];
  const options4 = {
    title: "Total AP KKU Install",
    pieHole: 0.4,
    is3D: true,
  };

  const data5 = [
    ["Device", "1 per Units"],
    ["Switch Access", switchCountkku],
    ["Switch Dist", switchCountkku2],
  ];
  const options5 = {
    title: "Total Switch KKU Install",
    pieHole: 0.4,
    is3D: true,
  };

  const data6 = [
    ["Device", "1 per Units"],
    ["Switch", dcswkkuCount + dcswkkuCount2],
    ["AP", dcapkkuCount + dcapkkuCount2],
  ];
  const options6 = {
    title: "Total KKU Device Corrupted",
    pieHole: 0.4,
    is3D: true,
  };

  //NKC Device
  const data7 = [
    ["Device", "1 per Units"],
    ["AP Indoor", apinnkcCount],
    ["AP Outdoor", apoutnkcCount],
  ];
  const options7 = {
    title: "Total AP NKC Install",
    pieHole: 0.4,
    is3D: true,
  };

  const data8 = [
    ["Device", "1 per Units"],
    ["Switch Access", switchCountnkc],
    ["Switch Dist", switchCountnkc2],
  ];
  const options8 = {
    title: "Total Switch NKC Install",
    pieHole: 0.4,
    is3D: true,
  };

  const data9 = [
    ["Device", "1 per Units"],
    ["Switch", dcswnkcCount + dcswnkcCount2],
    ["AP", dcapnkcCount + dcapnkcCount2],
  ];
  const options9 = {
    title: "Total NKC Device Corrupted",
    pieHole: 0.4,
    is3D: true,
  };
  const [apsite, setAPSite] = useState([]);
  const [swsite, setSWSite] = useState([]);
  const [dcsite, setDCSite] = useState([]);
  async function getData() {
    const getAPSite = await axios.get("http://localhost:3333/ap_site");
    const getSWSite = await axios.get("http://localhost:3333/sw_site");
    const getDCSite = await axios.get("http://localhost:3333/dc_site");
    console.log(getSWSite.data);
    setAPSite(getAPSite.data);
    setSWSite(getSWSite.data);
    setDCSite(getDCSite.data);
  }
  useEffect(() => {
    getData();
  }, []);


  function handleParamUpdate(newValue, type) {
    const site = newValue;
    console.log(newValue);
    if (type === "AP") {
      navigate(`/accesspoint/${site}`, { state: { site } });
    } else if (type === "SW") {
      navigate(`/switch/${site}`, { state: { site } });
    } else if (type === "DC") {
      navigate(`/deviceclist/${site}`, { state: { site } });
    }
  }
  //UI
  return (
    <div>
      <Navbar variant="dark" bg="dark" expand="lg">
        <Container fluid>
          <Navbar.Brand href="#">Dashboard(Admin)</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-dark-example" />
          <Navbar.Collapse id="navbar-dark-example">
            <Nav className="me-auto">
              <Nav.Link href="/users">Users List</Nav.Link>
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
                  Device Corrupted
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
              <Nav.Link href="/addsite">Add New Site For Device</Nav.Link>
            </Nav>
            <Nav>
              <Nav.Link onClick={handleLogout}>Log-Out</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Tabs
        defaultActiveKey="home"
        id="justify-tab-example"
        className="mb-3"
        fill
      >
        <Tab eventKey="home" title="Home">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <h2>Welcome To Network Maintenance Information System Website</h2>
          </div>
          <br />
          <p>
            Hello! This website is a for collecting information about various
            devices used in Network work, such as Access Point (AP) or Switch
            (SW), etc. Under Of G-Able Company
          </p>
          <p>
            You can also add, edit, delete information of various devices and
            can also choose to view the datasheet and model of the device.
          </p>
          <p>
            This website has been created for use by company and organization
            only and not seeking any benefits at all.
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src="https://imagebee.org/movies/thank-you/thank-you-wallpaper-12-1024x538.jpg"
              alt="thanks_image"
            />
          </div>
        </Tab>
        <Tab eventKey="all" title="All Device Graph">
          <Chart
            chartType="PieChart"
            width="100%"
            height="250px"
            data={data}
            options={options}
          />
          <Chart
            chartType="PieChart"
            width="100%"
            height="250px"
            data={data2}
            options={options2}
          />
          <Chart
            chartType="PieChart"
            width="100%"
            height="250px"
            data={data3}
            options={options3}
          />
        </Tab>
        <Tab eventKey="kku" title="KKU Device Graph">
          <Chart
            chartType="PieChart"
            width="100%"
            height="250px"
            data={data4}
            options={options4}
          />
          <Chart
            chartType="PieChart"
            width="100%"
            height="250px"
            data={data5}
            options={options5}
          />
          <Chart
            chartType="PieChart"
            width="100%"
            height="250px"
            data={data6}
            options={options6}
          />
        </Tab>
        <Tab eventKey="nkc" title="NKC Device Graph">
          <Chart
            chartType="PieChart"
            width="100%"
            height="250px"
            data={data7}
            options={options7}
          />
          <Chart
            chartType="PieChart"
            width="100%"
            height="250px"
            data={data8}
            options={options8}
          />
          <Chart
            chartType="PieChart"
            width="100%"
            height="250px"
            data={data9}
            options={options9}
          />
        </Tab>
      </Tabs>
    </div>
  );
}

export default function DashboardAdmin() {
  return <DashboardAdminContent />;
}
