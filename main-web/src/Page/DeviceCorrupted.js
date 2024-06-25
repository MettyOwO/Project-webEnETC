import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate,useLocation } from "react-router-dom";
import AddUrl from "../components/AddUrl";
import SearchBar from "../components/SearchBar";
import { CSVLink } from "react-csv";

function DCContent() {
    //Check Token API
    const location = useLocation();
    const [paramSite] = useState(location.state.site) 
    const [deviceclist, setDcList] = useState([]); 
    useEffect(() => {
        const token = localStorage.getItem('token')
        const name1 = localStorage.getItem("name");
        fetch ('http://localhost:3333/authen', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": 'Bearer '+token, name1
            },
        })   
        .then(response => response.json())
        .then(data => {
        if(data.status === 'ok'){
            //ไม่ต้องทำอะไร
        }else{
            alert('Authen Failed. Please Try Login Again!')
            localStorage.removeItem('token')
            localStorage.removeItem("name");
            window.location = '/login'
        }
        })
        .catch((error) => {
        console.log("Error:", error);
        });
        getDataDC()
    },[])

    const site1 = localStorage.getItem("site");
    const [siteName2,setSiteName2] = useState([]);
    const navigate = useNavigate();
    // async function getDataDC(){
    //     const getDc = await axios.get('http://localhost:3333/deviceclist')
    //     const dataSite = []
    //     console.log(getDc.data);
    //     getDc.data.map((item)=>{
    //         if(paramSite === item.Site){
    //             dataSite.push(item)
    //         }else if(paramSite === 'DCList'){
    //             dataSite.push(item)   
    //         }
    //     })
    // console.log(dataSite);
    // setDcList(dataSite)
    // }

    async function getDataDC(){
        const getDc = await axios.get('http://localhost:3333/deviceclist')   
        const siteLocation = localStorage.getItem("site");
        const dataSite = []
        //console.log(getDc.data);
        getDc.data.map((item)=>{
            console.log(siteLocation);
            console.log( item.Site);
            console.log(siteLocation === item.Site);
              if( siteLocation === item.Site){
                  if(paramSite === item.Site ){
                  dataSite.push(item)
              }else if(paramSite === 'DCList'){
                  dataSite.push(item)   
              }
              }
              if(paramSite === 'DCListAll'){
                dataSite.push(item) 
              }
              
          })
        console.log(dataSite);
        setDcList(dataSite)
        setSiteName2(siteLocation);
    }


  // Search bar
  const handleSearch = (searchTerm) => { 
    // Perform your search logic here and update the filtered data
    console.log(searchTerm.length);
    if (searchTerm.length > 0) {
     
      const filteredResults = deviceclist.filter((item) =>
        Object.values(item).some(
          (value) =>
            typeof value === "string" &&
            value.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      console.log(filteredResults);
      setDcList(filteredResults);
    } else {
        getDataDC()
    }
    console.log(searchTerm);
  };    

    //Delete Function
    const handleDelete = async (id) => {
        try {           
            alert("Delete Corrupt Device ID : " + (id) + " Complete!")
            axios.delete('http://localhost:3333/deletedc/'+id)
            window.location.reload();          
        }
        catch(err){            
            console.log(err);        
        }
    }

    const [num_dc, setNumDC] = useState(0);
    const [num_dc_site, setDcdata2] = useState([]);
    useEffect(() => {
    const fetchCount = async () => {
      try {
        const fetchData = await axios.get("http://localhost:3333/total_num_dc");
        setNumDC(fetchData.data.numdc);
      } catch (err) {}
    };
    fetchCount();     
    }, []);

    const siteLocation = localStorage.getItem("site");
    useEffect(() => {        
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

    if(num_dc_site === 0 && num_dc === 0){
        alert("Failed! Can't Found Replacement Device Data.")
        navigate(`/dbadmin/${site1}`) 
    }

    //UI
    return (
        <div>       
        <Navbar variant="dark" bg="dark" expand="lg">
        <Container fluid>
            <Navbar.Brand href={`/dbadmin/${site1}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-back" viewBox="0 0 16 16">
                <path d="M0 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1z"/>
            </svg>
            &nbsp; Dashboard
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbar-dark-example" />
            <Navbar.Collapse id="navbar-dark-example">
            <Nav className="me-auto">        
            </Nav>
            </Navbar.Collapse>
        </Container>
        </Navbar>
        
        <div className='vh-100 justify-content-center align-items-center'>
            <div className='bg-white p-3'>   
                <div       
                    style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    {paramSite === "DCList" && <>
                    <h2>Replacement Device List ({siteName2})</h2>
                    </>}
                    {paramSite === "DCListAll" && <>
                    <h2>Replacement Device List</h2>
                    </>}               
                </div><br/>
                {/* // Search bar */}
                Filter : &nbsp;&nbsp; <SearchBar data={deviceclist} onSearch={handleSearch} />
                <br />
                {paramSite === "DCList" && <>
                <CSVLink
                    data={deviceclist}
                    filename={`Replacement Device ${siteName2}`}
                    className="btn btn-success"
                >
                    Export &nbsp;
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-filetype-csv" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M14 4.5V14a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5zM3.517 14.841a1.13 1.13 0 0 0 .401.823c.13.108.289.192.478.252.19.061.411.091.665.091.338 0 .624-.053.859-.158.236-.105.416-.252.539-.44.125-.189.187-.408.187-.656 0-.224-.045-.41-.134-.56a1.001 1.001 0 0 0-.375-.357 2.027 2.027 0 0 0-.566-.21l-.621-.144a.97.97 0 0 1-.404-.176.37.37 0 0 1-.144-.299c0-.156.062-.284.185-.384.125-.101.296-.152.512-.152.143 0 .266.023.37.068a.624.624 0 0 1 .246.181.56.56 0 0 1 .12.258h.75a1.092 1.092 0 0 0-.2-.566 1.21 1.21 0 0 0-.5-.41 1.813 1.813 0 0 0-.78-.152c-.293 0-.551.05-.776.15-.225.099-.4.24-.527.421-.127.182-.19.395-.19.639 0 .201.04.376.122.524.082.149.2.27.352.367.152.095.332.167.539.213l.618.144c.207.049.361.113.463.193a.387.387 0 0 1 .152.326.505.505 0 0 1-.085.29.559.559 0 0 1-.255.193c-.111.047-.249.07-.413.07-.117 0-.223-.013-.32-.04a.838.838 0 0 1-.248-.115.578.578 0 0 1-.255-.384h-.765ZM.806 13.693c0-.248.034-.46.102-.633a.868.868 0 0 1 .302-.399.814.814 0 0 1 .475-.137c.15 0 .283.032.398.097a.7.7 0 0 1 .272.26.85.85 0 0 1 .12.381h.765v-.072a1.33 1.33 0 0 0-.466-.964 1.441 1.441 0 0 0-.489-.272 1.838 1.838 0 0 0-.606-.097c-.356 0-.66.074-.911.223-.25.148-.44.359-.572.632-.13.274-.196.6-.196.979v.498c0 .379.064.704.193.976.131.271.322.48.572.626.25.145.554.217.914.217.293 0 .554-.055.785-.164.23-.11.414-.26.55-.454a1.27 1.27 0 0 0 .226-.674v-.076h-.764a.799.799 0 0 1-.118.363.7.7 0 0 1-.272.25.874.874 0 0 1-.401.087.845.845 0 0 1-.478-.132.833.833 0 0 1-.299-.392 1.699 1.699 0 0 1-.102-.627v-.495Zm8.239 2.238h-.953l-1.338-3.999h.917l.896 3.138h.038l.888-3.138h.879l-1.327 4Z"/>
                    </svg>
                    &nbsp; File
                </CSVLink>
                </>}
                {paramSite === "DCListAll" && <>
                <CSVLink
                    data={deviceclist}
                    filename="Replacement Device"
                    className="btn btn-success"
                >
                    Export &nbsp;
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-filetype-csv" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M14 4.5V14a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5zM3.517 14.841a1.13 1.13 0 0 0 .401.823c.13.108.289.192.478.252.19.061.411.091.665.091.338 0 .624-.053.859-.158.236-.105.416-.252.539-.44.125-.189.187-.408.187-.656 0-.224-.045-.41-.134-.56a1.001 1.001 0 0 0-.375-.357 2.027 2.027 0 0 0-.566-.21l-.621-.144a.97.97 0 0 1-.404-.176.37.37 0 0 1-.144-.299c0-.156.062-.284.185-.384.125-.101.296-.152.512-.152.143 0 .266.023.37.068a.624.624 0 0 1 .246.181.56.56 0 0 1 .12.258h.75a1.092 1.092 0 0 0-.2-.566 1.21 1.21 0 0 0-.5-.41 1.813 1.813 0 0 0-.78-.152c-.293 0-.551.05-.776.15-.225.099-.4.24-.527.421-.127.182-.19.395-.19.639 0 .201.04.376.122.524.082.149.2.27.352.367.152.095.332.167.539.213l.618.144c.207.049.361.113.463.193a.387.387 0 0 1 .152.326.505.505 0 0 1-.085.29.559.559 0 0 1-.255.193c-.111.047-.249.07-.413.07-.117 0-.223-.013-.32-.04a.838.838 0 0 1-.248-.115.578.578 0 0 1-.255-.384h-.765ZM.806 13.693c0-.248.034-.46.102-.633a.868.868 0 0 1 .302-.399.814.814 0 0 1 .475-.137c.15 0 .283.032.398.097a.7.7 0 0 1 .272.26.85.85 0 0 1 .12.381h.765v-.072a1.33 1.33 0 0 0-.466-.964 1.441 1.441 0 0 0-.489-.272 1.838 1.838 0 0 0-.606-.097c-.356 0-.66.074-.911.223-.25.148-.44.359-.572.632-.13.274-.196.6-.196.979v.498c0 .379.064.704.193.976.131.271.322.48.572.626.25.145.554.217.914.217.293 0 .554-.055.785-.164.23-.11.414-.26.55-.454a1.27 1.27 0 0 0 .226-.674v-.076h-.764a.799.799 0 0 1-.118.363.7.7 0 0 1-.272.25.874.874 0 0 1-.401.087.845.845 0 0 1-.478-.132.833.833 0 0 1-.299-.392 1.699 1.699 0 0 1-.102-.627v-.495Zm8.239 2.238h-.953l-1.338-3.999h.917l.896 3.138h.038l.888-3.138h.879l-1.327 4Z"/>
                    </svg>
                    &nbsp; File
                </CSVLink>                    
                </>}
                <br /><br />   
                <table className="table table-bordered">
                    <thead className="thead-light">
                        <tr>
                            <th scope="col">Site</th>
                            <th scope="col">Building Group</th>
                            <th scope="col">Building Name</th>
                            <th scope="col">IP Address</th>
                            <th scope="col">Hostname</th>
                            <th scope="col">Model</th>
                            <th scope="col">Role</th>
                            <th scope="col">Replace Serial No.</th>
                            <th scope="col">Replace Mac Address</th>
                            <th scope="col">Detail</th>
                            <th scope="col">Datetime</th>
                            <th scope="col">Log</th>
                            <th scope="col">Map</th>
                            <th scope="col">Config</th>
                            <th scope="col">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {deviceclist.map ((deviceclist, i) => (
                            <tr key={i}>
                                <td>{deviceclist.Site}</td>
                                <td>{deviceclist.Buildgroup}</td>
                                <td>{deviceclist.Buildname}</td>
                                <td>{deviceclist.Ipaddress}</td>
                                <td>{deviceclist.Hostname}</td>
                                <td>{deviceclist.Model}</td>
                                <td>{deviceclist.Role}</td>
                                <td>{deviceclist.Serialnumber}</td>
                                <td>{deviceclist.Macaddress}</td>
                                {deviceclist.Details === "อื่นๆ" && (
                                    <td>{deviceclist.note}</td>
                                )}
                                {deviceclist.Details !== "อื่นๆ" && (
                                    <td>{deviceclist.Details}</td>
                                )}
                                <td>{deviceclist.Datatime1}</td>
                                <td>
                                <Link
                                to={`/device_log/${deviceclist.ID}`}
                                 className="btn btn-warning"
                                >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-binoculars-fill" viewBox="0 0 16 16">
                                    <path d="M4.5 1A1.5 1.5 0 0 0 3 2.5V3h4v-.5A1.5 1.5 0 0 0 5.5 1zM7 4v1h2V4h4v.882a.5.5 0 0 0 .276.447l.895.447A1.5 1.5 0 0 1 15 7.118V13H9v-1.5a.5.5 0 0 1 .146-.354l.854-.853V9.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v.793l.854.853A.5.5 0 0 1 7 11.5V13H1V7.118a1.5 1.5 0 0 1 .83-1.342l.894-.447A.5.5 0 0 0 3 4.882V4zM1 14v.5A1.5 1.5 0 0 0 2.5 16h3A1.5 1.5 0 0 0 7 14.5V14zm8 0v.5a1.5 1.5 0 0 0 1.5 1.5h3a1.5 1.5 0 0 0 1.5-1.5V14zm4-11H9v-.5A1.5 1.5 0 0 1 10.5 1h1A1.5 1.5 0 0 1 13 2.5z"/>
                                </svg>
                                </Link>
                                </td>
                                {deviceclist.urlmap && <>
                                    <td><Link to={deviceclist.urlmap} className="btn btn-info" target="_blank">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-alt" viewBox="0 0 16 16">
                                        <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10"/>
                                        <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                                    </svg>
                                    </Link></td>
                                </>}
                                {!deviceclist.urlmap && <>
                                    <td><AddUrl id={deviceclist.ID} status="DC"/></td>
                                </>}
                                {deviceclist.urlconfig && <>
                                    <td><Link to={deviceclist.urlconfig} className="btn btn-info" target="_blank">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-alt" viewBox="0 0 16 16">
                                        <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10"/>
                                        <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                                    </svg>
                                    </Link></td>
                                </>}
                                {!deviceclist.urlconfig && <>
                                    <td><AddUrl id={deviceclist.ID} status="DCSWConfig"/></td>
                                </>}
                                <td><button className='btn btn-danger ms-2' onClick={ e => handleDelete(deviceclist.ID)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                                </svg>
                                </button></td>    
                            </tr>
                        ))}   
                    </tbody> 
                </table>
            </div>
        </div>
    </div>          
    );
}
    

export default function DeviceCorrupted() {
    return <DCContent />
}