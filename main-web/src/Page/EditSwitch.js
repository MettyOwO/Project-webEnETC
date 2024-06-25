import React, { useEffect, useState } from 'react';
import {  useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import 'bootstrap/dist/css/bootstrap.min.css';

function EditSWContent() {
    //Check Token API
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
        getDataSWModel()
    },[])

    //Switch List With AP_ID API
    const site1 = localStorage.getItem("site");
    const {id} = useParams();
    const [hostname, setHostname] = useState('');
    const [ipswitch, setIpswitch] = useState('');
    const [build_name, setBuildname] = useState('');
    const [build_group, setBuildgroup] = useState('');
    const [model, setModel] = useState("");
    const [role, setRole] = useState("");
    const [url, setUrl] = useState("");
    const [urlconfig, setUrlConfig] = useState("");
    const [serial_number, setSRNumber] = useState('');
    const [mac_address, setMacNumber] = useState('');

    const username1 = localStorage.getItem("name");
    const [id2, SetID2] = useState('');
    const [num_report, SetNumberReport] = useState('');
    const [site, setSite] = useState('');

    //Old
    const [old_hostname, setOldHostname] = useState('');
    const [old_ipswitch, setOldIpswitch] = useState('');
    const [old_build_name, setOldBuildname] = useState('');
    const [old_build_group, setOldBuildgroup] = useState('');
    const [old_model, setOldModel] = useState("");
    const [old_role, setOldRole] = useState("");
    const [old_serial_number, setOldSRNumber] = useState('');
    const [old_mac_address, setOldMacNumber] = useState('');
    const [device_type, SetDVType] = useState("SW");

    useEffect(() => {
        axios
        .get('http://localhost:3333/switchlistwithid/'+id)
        .then(res => {
            setHostname(res.data[0].hostname);
            setIpswitch(res.data[0].ip);
            setBuildname(res.data[0].buildname);
            setBuildgroup(res.data[0].buildgroup);
            setModel(res.data[0].model);
            setRole(res.data[0].role);
            setUrl(res.data[0].urlmap);
            setUrlConfig(res.data[0].urlconfig);
            setSRNumber(res.data[0].serialno);
            setMacNumber(res.data[0].macaddress);

            SetNumberReport(res.data[0].num_report);
            SetID2(res.data[0].ID)
            setSite(res.data[0].site);

            //Old
            setOldHostname(res.data[0].hostname);
            setOldIpswitch(res.data[0].ip);
            setOldBuildname(res.data[0].buildname);
            setOldBuildgroup(res.data[0].buildgroup);
            setOldModel(res.data[0].model);
            setOldRole(res.data[0].role);
            setOldSRNumber(res.data[0].serialno);
            setOldMacNumber(res.data[0].macaddress);
        })
        .catch(err => console.log(err));
    },[])

    //Update AP API
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        if (hostname !== ''&& ipswitch !== '' && build_name !== '' 
        && build_group !== '' && serial_number !== '' && mac_address !== ''){
        axios
        .put('http://localhost:3333/updatesw/'+id, {role, build_name, build_group,
         ipswitch, model, hostname ,url, urlconfig, serial_number, mac_address,
        username1, id2, num_report, site, old_hostname, old_build_name, old_build_group,
        old_ipswitch, old_model, old_role, old_serial_number, old_mac_address, device_type}) 
        .then(res => {
            if(res.data.updated){
                alert("Update Switch ID : " + (id) + " Complete!")
                navigate(`/dbadmin/${site1}`)  
            }else{
                alert("Error! Please Try Again.")
            }                
        })
        .catch(err => console.log(err));
        }else{
            alert("Please Complete The Information!");
        }
    }
    
    const [sw_models, setSwModel] = useState([]);
    const [sw_models2, setSwModel2] = useState([]);
    async function getDataSWModel() {
      const getModel = await axios.get("http://localhost:3333/sw_model");
      const getModel2 = await axios.get("http://localhost:3333/sw_model2");
      setSwModel(getModel.data);
      setSwModel2(getModel2.data);
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
                <h2>Edit Switch Data</h2>
            </div> 

                <div className='mb-4'>
                    <label htmlFor=''>HostName</label>
                    <input type="text" 
                    placeholder='' 
                    className='form-control'
                    value={hostname} 
                    onChange={e => setHostname(e.target.value)}/>
                </div>
 
                <div className='mb-4'>
                    <label htmlFor=''>IP Address</label>
                    <input 
                    type="text" 
                    placeholder='' 
                    className='form-control'
                    value={ipswitch} 
                    onChange={e => setIpswitch(e.target.value)}/>
                </div>
                
                <div className='mb-4'>
                    <label htmlFor=''>Building Name</label>
                    <input 
                    type="text"
                    placeholder='' 
                    className='form-control'
                    value={build_name} 
                    onChange={e => setBuildname(e.target.value)}/>
                </div>

                <div className='mb-4'>
                    <label htmlFor=''>Building Group</label>
                    <input 
                    type="text" 
                    placeholder='' 
                    className='form-control'
                    value={build_group} 
                    onChange={e => setBuildgroup(e.target.value)}/>
                </div>

                <div className='mb-4'>
                    <label htmlFor='Select Model'>Model</label>
                    <select 
                    className="form-control" 
                    value={model} 
                    onChange={e => setModel(e.target.value)}>                
                        {sw_models.map((sw_models, index) => (
                            <option key={index}>{sw_models.name}</option>
                        ))}
                    </select>
                </div>

                <div className='mb-4'>
                    <label htmlFor=''>Role</label>
                    <select 
                    className="form-control" 
                    value={role} 
                    onChange={e => setRole(e.target.value)}>             
                        {sw_models2.map((sw_models2, index) => (
                            <option key={index}>{sw_models2.role}</option>
                        ))}
                    </select>
                </div>

                <div className='mb-4'>
                    <label htmlFor=''>Serial Number</label>
                    <input type="text" 
                    placeholder='' 
                    className='form-control'
                    value={serial_number} 
                    onChange={e => setSRNumber(e.target.value)}/>
                </div>

                <div className='mb-4'>
                <label>Mac Address</label>
                    <input type="text" 
                    className='form-control' 
                    value={mac_address}
                    onChange={e => setMacNumber(e.target.value)}
                />
                </div>                
                
                {url !== "" && (
                <div className='mb-4'>
                    <label htmlFor=''>Map Url</label>
                    <input type="text" 
                    placeholder='' 
                    className='form-control'
                    value={url} 
                    onChange={e => setUrl(e.target.value)}/>
                </div>
                )}

                {urlconfig !== "" && (
                <div className='mb-4'>
                    <label htmlFor=''>Config Url</label>
                    <input type="text" 
                    placeholder='' 
                    className='form-control'
                    value={urlconfig} 
                    onChange={e => setUrlConfig(e.target.value)}/>
                </div>
                )}

                <div
                    style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <button className="btn btn-primary" onClick={ handleSubmit }>Update!</button>  
                </div>
                 
            </form>
        </div> 
        </div>
      );
    }
    
export default function EditSwitch() {
    return <EditSWContent />
}