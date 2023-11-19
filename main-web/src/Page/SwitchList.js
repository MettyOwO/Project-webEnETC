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

function SwitchContent() {
    //Check Token API
    const location = useLocation();
  const navigate = useNavigate();
  const [swdata, setSwdata]= useState([]); 
  const [swlist, setSwList] = useState([]);   
  const [paramPath,setParamPath] = useState(location.state.site)

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
        getDataSW()
    },[])

    //SW API
    async function getDataSW(){
        const getSw = await axios.get("http://localhost:3333/swlist")  
        const dataSite = []
        getSw.data.map((item)=>{
            if(paramPath === item.Site){
                dataSite.push(item)
            }else if(paramPath === 'SWList'){
                dataSite.push(item)   
            }
        })
        setSwList(dataSite)
        setSwdata(dataSite);

    }
  

    //ฟังก์ชั่น Log Out
    const handleLogout = (event) => {
        event.preventDefault();
        localStorage.removeItem('token');
        window.location = '/Login'
    }

    //Export Excel


    //AP Delete Function
    const handleDelete = async (id) => {
        try {           
            alert("Delete Switch Data Complete!")
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
                <NavDropdown.Item href="https://e.huawei.com/en/material/networking/a7d76a8a16614cefb9943336bb224d69" target="_blank">Type-Access (S5735-L24P4X-A1)</NavDropdown.Item>
                <NavDropdown.Item href="https://e.huawei.com/en/material/networking/campus-network/campusswitch/767ee329a806443b8d874ef052c1384d" target="_blank">Type-Distribute (S5736-S24S4XC)</NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="Switch Model" id="basic-nav-dropdown">
                <NavDropdown.Item href="https://support.huawei.com/enterprise/en/doc/EDOC1000013597/9399f949/s5735-l24p4x-a1" target="_blank">Type-Access (S5735-L24P4X-A1)</NavDropdown.Item>
                <NavDropdown.Item href="https://support.huawei.com/enterprise/en/doc/EDOC1000013597/a3e92592/s5736-s24s4xc" target="_blank">Type-Distribute (S5736-S24S4XC)</NavDropdown.Item>
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
                    <h2>Switch List</h2>
                </div> 
                <Link to="/addsw" className='btn btn-primary'>Add SW Data</Link>&nbsp;
                <Link to="http://localhost:3333/import-switch" className='btn btn-success'>Import Excel Data (Beta)</Link>&nbsp;
                <CSVLink  data={ swdata } filename="Switch"  className="btn btn-success">Export Excel Data</CSVLink><br/><br/>
                <table class="table table-bordered">
                    <thead class="thead-light">
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
                    {swlist.map ((swlist,index) => (
                        <tbody>
                            <tr key={index}>
                                <td>{swlist.buildgroup}</td>
                                <td>{swlist.buildname}</td>
                                <td>{swlist.hostname}</td>
                                <td>{swlist.ip}</td>
                                <td>{swlist.role}</td>
                                <td><Link to="/maps" className="btn btn-info">Click</Link></td>
                                <td><Link to="/config" className="btn btn-info">Click</Link></td>
                                <td><Link to= {`/updatesw/${swlist.ID}`} className="btn btn-warning">Edit</Link> &nbsp;
                                <button className='btn btn-danger ms-2' onClick={ e => handleDelete(swlist.ID)}>Delete</button>
                                </td>
                                <td><Link to={`/report_sw/${swlist.ID}`} className="btn btn-dark">Click</Link></td>
                            </tr>
                        </tbody>
                    ))}    
                 </table>
            </div>                                              
        </div>                                        
    </div>          
    );
}
    

export default function SwitchList() {
    return <SwitchContent />
}