import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { CSVLink } from "react-csv";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useLocation } from "react-router-dom";
import NavDropdown from "react-bootstrap/NavDropdown";
import AddUrl from "./AddUrl";
import SearchBar from "../components/SearchBar";
function APContent() {
  //Check Token API
  const location = useLocation();
  const [paramPath, setParamPath] = useState(location.state.site);
  const navigate = useNavigate();
  const [aplist, setApList] = useState([]);
  const [apdata, setApdata] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
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
          //ไม่ต้องทำอะไร
        } else {
          alert("Authen Failed. Please Try Login Again!");
          localStorage.removeItem("token");
          window.location = "/login";
        }
      })
      .catch((error) => {
        console.log("Error:", error);
      });
    getDataAP();
    getDataAP2();
  }, []);

  //Access Point List API
  async function getDataAP() {
    const getAP = await axios.get("http://localhost:3333/aplist");
    const dataSite = [];
    getAP.data.map((item) => {
      if (
        paramPath === item.Site &&
        item.Serialnumber != "" &&
        item.Serialnumber != null
      ) {
        dataSite.push(item);
      } else if (
        paramPath === "APList" &&
        item.Serialnumber != "" &&
        item.Serialnumber != null
      ) {
        dataSite.push(item);
      }
    });
    // console.log(dataSite);
    // console.log(paramPath);
    setApList(dataSite);
    setApdata(dataSite);
  }
  // Search bar
  const handleSearch = (searchTerm) => { 
    // Perform your search logic here and update the filtered data
    console.log(searchTerm.length);
    if (searchTerm.length > 0) {
     
      const filteredResults = aplist.filter((item) =>
        Object.values(item).some(
          (value) =>
            typeof value === "string" &&
            value.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      console.log(filteredResults);
      setApList(filteredResults);
      setApdata(filteredResults);
    } else {
      getDataAP();
    }

    console.log(searchTerm);
  };
  // Search bar
  const [ap_models, setApModel] = useState([]);
  const [ap_datasheets, setApDataSheet] = useState([]);
  async function getDataAP2() {
    const getModel = await axios.get("http://localhost:3333/ap_model");
    const getSheet = await axios.get("http://localhost:3333/ap_datasheet");
    setApModel(getModel.data);
    setApDataSheet(getSheet.data);
  }

  //AP Delete Function
  const handleDelete = async (id) => {
    try {
      alert("Delete Access Point ID : " + id + " Complete!");
      axios.delete("http://localhost:3333/deleteap/" + id);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  //Log Out
  const handleLogout = (event) => {
    event.preventDefault();
    localStorage.removeItem("token");
    window.location = "/login";
  };

  //UI
  return (
    <div>
      <Navbar variant="dark" bg="dark" expand="lg">
        <Container fluid>
          <Navbar.Brand href="/dbadmin">Back To Dashboard</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-dark-example" />
          <Navbar.Collapse id="navbar-dark-example">
            <Nav className="me-auto">
              <NavDropdown
                title="Access Point Datasheet"
                id="basic-nav-dropdown"
              >
                {ap_datasheets.map((ap_datasheets, index) => (
                  <NavDropdown.Item
                    key={index}
                    href={ap_datasheets.href}
                    target="_blank"
                  >
                    Datasheet : {ap_datasheets.name}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>

              <NavDropdown title="Access Point Model" id="basic-nav-dropdown">
                {ap_models.map((ap_models, index) => (
                  <NavDropdown.Item
                    key={index}
                    href={ap_models.href}
                    target="_blank"
                  >
                    Model : {ap_models.name}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>
            </Nav>
            <Nav>
              <Nav.Link onClick={handleLogout}>Log-Out</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="vh-100 justify-content-center align-items-center">
        <div className="bg-white p-3">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {paramPath != "APList" && (
              <>
                <h2>Access Point {paramPath}</h2>
              </>
            )}
            {paramPath === "APList" && (
              <>
                <h2>Access Point List</h2>
              </>
            )}
          </div>
          {paramPath === "APList" && (
            <>
              <Link to="/addap" className="btn btn-primary">
                Add AP Data
              </Link>
              &nbsp;
              {/* // Search bar */}
              <SearchBar data={aplist} onSearch={handleSearch} />
            </>
          )}
          <Link to="/accesspoint-excel" className="btn btn-success">
            Import Excel Data (Beta)
          </Link>
          &nbsp;
          <CSVLink
            data={apdata}
            filename="AccessPoint"
            className="btn btn-success"
          >
            Export Excel Data
          </CSVLink>
          <br />
          <br />
          <table className="table table-bordered">
            <thead className="thead-light">
              <tr>
                <th scope="col">Serial number</th>
                <th scope="col">Building Group</th>
                <th scope="col">Building Name</th>
                <th scope="col">IP Address</th>
                <th scope="col">Hostname</th>
                <th scope="col">Role</th>
                <th scope="col">Map</th>
                <th scope="col">Edit & Delete</th>
                <th scope="col">Report Deivce</th>
              </tr>
            </thead>
            <tbody>
              {aplist.map((aplist, index) => (
                <tr key={index}>
                  <td>{aplist.Serialnumber}</td>
                  <td>{aplist.Buildgroup}</td>
                  <td>{aplist.Buildname}</td>
                  <td>{aplist.IPswitch}</td>
                  <td>{aplist.APname}</td>
                  <td>{aplist.Role}</td>
                  {aplist.urlmap && (
                    <>
                      <td>
                        <Link
                          to={aplist.urlmap}
                          className="btn btn-info"
                          target="_blank"
                        >
                          Click
                        </Link>
                      </td>
                    </>
                  )}
                  {!aplist.urlmap && (
                    <>
                      <td>
                        <AddUrl id={aplist.ID} status="AP" />
                      </td>
                    </>
                  )}
                  <td>
                    <Link
                      to={`/updateap/${aplist.ID}`}
                      className="btn btn-warning"
                    >
                      Edit
                    </Link>{" "}
                    &nbsp;
                    <button
                      className="btn btn-danger ms-2"
                      onClick={(e) => handleDelete(aplist.ID)}
                    >
                      Delete
                    </button>
                  </td>
                  <td>
                    <Link
                      to={`/report_ap/${aplist.ID}`}
                      className="btn btn-dark"
                    >
                      Click
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function AccessPointList() {
  return <APContent />;
}
