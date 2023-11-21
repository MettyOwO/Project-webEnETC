import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from "react-router-dom";
import { CSVLink} from 'react-csv';
import Nav from 'react-bootstrap/Nav';
import axios from 'axios';
import { useNavigate, useLocation } from "react-router-dom";
import AddUrl from "./AddUrl";

function SwitchContent() {
    
    //Check Token API
    useEffect(() => {
        const token = localStorage.getItem('token')
        fetch ('http://localhost:3333/authen', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": 'Bearer '+token
            },
        })   
        .then(response => response.json())
        .then(data => {
        if(data.status === 'ok'){
            //ไม่ต้องทำอะไร
        }else{
            alert('Authen Failed. Please Try Login Again!')
            localStorage.removeItem('token')
            window.location = '/Login'
        }
        })
        .catch((error) => {
        console.log("Error:", error);
        
        });
        getSwitchData();
        getDataSW2();
    },[])
 
    const location = useLocation();
    const navigate = useNavigate();
    const [swdata, setSwdata]= useState([]); 
    const [swlist, setSwList] = useState([]);   
    const [paramPath,setParamPath] = useState(location.state.site)

    async function getSwitchData(){
        const dataSw = await axios("http://localhost:3333/swlist")
        //console.log(dataSw.data);
        const dataSite = []
        dataSw.data.map((item)=>{
            if(paramPath === item.site){
                dataSite.push(item)
            }else if(paramPath === "SWList"){
                dataSite.push(item)
            }
        })
        console.log(dataSite);
        setSwList(dataSite)
        setSwdata(dataSite);
    }

    const [sw_models, setSwModel] = useState([]);
    const [sw_datasheets, setSwDataSheet] = useState([]);
    async function getDataSW2(){
        const getModel = await axios.get('http://localhost:3333/sw_model')
        const getSheet = await axios.get('http://localhost:3333/sw_datasheet')
        setSwModel(getModel.data);
        setSwDataSheet(getSheet.data)
    };

    //Log Out
    const handleLogout = (event) => {
        event.preventDefault();
        localStorage.removeItem('token');
        window.location = '/Login'
    }
    
    //SW Delete
    const handleDelete = async (id) => {
        try {           
            alert("Delete Switch ID : " + (id) + " Complete!")
            axios.delete('http://localhost:3333/deletesw/'+id)
            window.location.reload();          
        }
        catch(err){            
            console.log(err);        
        }
    }    

    //UI
    return (
        <div>
        <Navbar variant="dark" bg="dark" expand="lg">
        <Container fluid>
            <Navbar.Brand href="/dbadmin">Back To Dashboard</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbar-dark-example" />
            <Navbar.Collapse id="navbar-dark-example">
            <Nav className="me-auto">
            <NavDropdown title="Switch Datasheet" id="basic-nav-dropdown">
            {sw_datasheets.map ((sw_datasheets,index) => (
                <NavDropdown.Item key={index} href={sw_datasheets.href} target="_blank">Datasheet : {sw_datasheets.name}</NavDropdown.Item>        
            ))}  
            </NavDropdown>

            <NavDropdown title="Switch Model" id="basic-nav-dropdown">
            {sw_models.map ((sw_models,index) => (
                <NavDropdown.Item key={index} href={sw_models.href} target="_blank">Model : {sw_models.name}</NavDropdown.Item>        
            ))}  
            </NavDropdown> 
            </Nav>
            </Navbar.Collapse>
            <Navbar.Brand onClick={ handleLogout }>Log-Out</Navbar.Brand>
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
                    {paramPath != "SWList" && <>
                        <h2>Switch {paramPath}</h2>
                    </>}
                    {paramPath === "SWList" && <>
                        <h2>Switch List</h2>
                    </>}
                </div> 
                
                {paramPath === "SWList" && <>
                    <Link to="/addsw" className='btn btn-primary'>Add SW Data</Link>&nbsp;
                    <Link to="/switch-excel" className='btn btn-success'>Import Excel Data (Beta)</Link>&nbsp;
                </>}
               
                <CSVLink  data={ swdata } filename="Switch"  className="btn btn-success">Export Excel Data</CSVLink><br/><br/>
                <table className="table table-bordered">
                    <thead className="thead-light">
                        <tr>
                            <th scope="col">Building Group</th>
                            <th scope="col">Building Name</th>
                            <th scope="col">Hostname</th>
                            <th scope="col">IP Address</th>
                            <th scope="col">Role</th>
                            <th scope="col">Map</th>
                            <th scope="col">Config</th>
                            <th scope="col">Edit & Delete</th>
                            <th scope="col">Report Deivce</th>
                        </tr>
                    </thead>
                    <tbody>
                    {swlist.map ((swlist,index) => (                       
                        <tr key={index}>
                            <td>{swlist.buildgroup}</td>
                            <td>{swlist.buildname}</td>
                            <td>{swlist.hostname}</td>
                            <td>{swlist.ip}</td>
                            <td>{swlist.role}</td>
                            {swlist.urlmap && <>
                                <td><Link to={swlist.urlmap} className="btn btn-info" target="_blank">Click</Link></td>
                            </>}
                            {!swlist.urlmap && <>
                                <td><AddUrl id={swlist.ID} status="SW"/></td>
                            </>}
                            {swlist.urlconfig && <>
                                <td><Link to={swlist.urlconfig} className="btn btn-info" target="_blank">Click</Link></td>
                            </>}
                            {!swlist.urlconfig && <>
                                <td><AddUrl id={swlist.ID} status="SWConfig"/></td>
                            </>}       
                            <td><Link to= {`/updatesw/${swlist.ID}`} className="btn btn-warning">Edit</Link> &nbsp;
                            <button className='btn btn-danger ms-2' onClick={ e => handleDelete(swlist.ID)}>Delete</button>
                            </td>
                            <td><Link to={`/report_sw/${swlist.ID}`} className="btn btn-dark">Click</Link></td>
                        </tr>                   
                        ))}
                     </tbody>    
                 </table>
            </div>                                              
        </div>                                        
    </div>          
    );
}
    

export default function SwitchList() {
    return <SwitchContent />
}