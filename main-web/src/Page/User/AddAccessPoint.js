import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import 'bootstrap/dist/css/bootstrap.min.css';

function UserAddAPContent() {
    //Check Token API
    useEffect(() => {
        const token = localStorage.getItem("token");
        const email = localStorage.getItem("email");
        const site1 = localStorage.getItem("site");
        fetch ('http://localhost:3333/authen', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": 'Bearer '+ token, email, site1
            },
        })   
        .then(response => response.json())
        .then(data => {
        if(data.status === 'ok'){
        }else{
            alert('Authen Failed. Please Try Login Again!')
            localStorage.removeItem("token");
            localStorage.removeItem("email");
            localStorage.removeItem("site");
            window.location = '/login'
        }
        })
        .catch((error) => {
        console.log("Error:", error);
        });
        getDataSite()
        getDataAPModel()
    },[])

    const [hostname, setHostname] = useState('');
    const [ipswitch, setIpswitch] = useState('');
    const [build_name, setBuildname] = useState('');
    const [build_group, setBuildgroup] = useState('');
    const [serial_number, setSRNumber] = useState('');
    const [role, setRole] = useState("Select AP Role");
    const [site, setSite] = useState("Select Site");
    const [model, setModel] = useState("Select AP Model");
    const navigate = useNavigate();

    function handleSubmit(event) {        
        event.preventDefault();
        if (site != "Select Site" && hostname != '' 
            && ipswitch != '' && build_name != '' 
            && build_group != '' && role != "Select AP Role" && model != "Select AP Model"
            && serial_number != ''){      
            axios.
            post('http://localhost:3333/addap', {site, build_name, build_group,
            ipswitch, hostname, role, model, serial_number})        
            .then(res => {            
                if(res.data.added){
                    alert("Add Access Point Data Complete!")
                    //navigate('/accesspoint')
                    navigate('/dbusers') 
                }else{
                    alert("Error! Please Try Again.")
                }       
            })
            .catch(err => console.log(err));
        }else{
            alert("Please Complete The Information!");
        }    
    }
    
    const [siteName2,setSiteName2] = useState([]);
    async function getDataSite(){
        const siteLocation = localStorage.getItem("site");
        setSiteName2(siteLocation);
    }

    const [ap_models, setApModel] = useState([]);
    async function getDataAPModel() {
      const getModel = await axios.get("http://localhost:3333/ap_model");
      setApModel(getModel.data);
    }
    
    return (
    <div>
    <Navbar variant="dark" bg="dark" expand="lg">
    <Container fluid>
    <Navbar.Brand href='/dbusers'>Back To Dashboard</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-dark-example" />
        <Navbar.Collapse id="navbar-dark-example">
        <Nav className="me-auto"></Nav>
        </Navbar.Collapse>
    </Container>
    </Navbar>

        <div>
            <form className="container mt-3 mb-3" onSubmit={handleSubmit}>
            <div       
            style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            }}>
                <h2>Add Access Point Data</h2>
            </div>              
            
            <div className='mb-4'>
            <label htmlFor='Select Site'>Site</label>
                <select className="form-control" 
                onChange={e => setSite(e.target.value)}
                >
                    <option>Select Site</option>
                    <option>{siteName2}</option>           
                </select>
            </div>          
            
            <div className='mb-4'>
                <label>Building Group</label>
                <input type="text" 
                className='form-control' 
                required
                placeholder="Enter Building Group"
                onChange={e => setBuildgroup(e.target.value)}
                />
            </div>

            <div className='mb-4'>
                <label>Building Name</label>
                <input type="text" 
                className='form-control' 
                required
                placeholder="Enter Building Name"
                onChange={e => setBuildname(e.target.value)}
                />
            </div>

            <div className='mb-4'>
                <label>IP Switch</label>
                <input type="text" 
                className='form-control' 
                required
                placeholder="Enter IP Switch"
                onChange={e => setIpswitch(e.target.value)}
                />
            </div>

            <div className='mb-4'>
                <label>Hostname</label>
                <input type="text" 
                className='form-control' 
                required
                placeholder="Enter Hostname"
                onChange={e => setHostname(e.target.value)}
                />
            </div>
            
            <div className='mb-4'>
                <label htmlFor='Select Model'>Model</label>
                <select 
                    className="form-control" 
                    onChange={e => setModel(e.target.value)}>
                    <option>Select AP Model</option>                    
                    {ap_models.map((ap_models, index) => (
                    <option key={index}>{ap_models.name}</option>
                    ))}
                </select>
            </div>
            
            <div className='mb-4'>
            <label>Role</label>
                <select className="form-control" 
                onChange={e => setRole(e.target.value)}>
                    <option>Select AP Role</option>
                    {ap_models.map((ap_models, index) => (
                    <option key={index}>{ap_models.role}</option>
                    ))}
                </select>
            </div>

            <div className='mb-4'>
                <label>Serial Number</label>
                <input type="text" 
                className='form-control' 
                required
                placeholder="Enter Serial Number"
                onChange={e => setSRNumber(e.target.value)}
                />
            </div>

            <div 
            style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            }}>
                <button className="btn btn-primary" onClick={ handleSubmit }>Add Data</button>   
            </div>
        </form>
        </div> 
    </div>
)}

export default function AddAccessPoint() {
    return <UserAddAPContent />
}