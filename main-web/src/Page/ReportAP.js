import React, { useEffect, useState } from 'react';
import {  useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import 'bootstrap/dist/css/bootstrap.min.css';

function ReportAPContent() {
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
        }else{
            alert('Authen Failed. Please Try Login Again!')
            localStorage.removeItem('token')
            window.location = '/login'
        }
        })
        .catch((error) => {
        console.log("Error:", error);
        });
    },[])

    const {id} = useParams();
    const [site, setSite] = useState('');
    const [device_type, SetDVType] = useState("Select Device Type");
    const [build_group, setBuildgroup] = useState('');
    const [build_name, setBuildname] = useState('');
    const [hostname, setHostname] = useState('');
    const [ipswitch, setIpswitch] = useState('');
    const [role, setRole] = useState('');
    const [serial_number, setSR] = useState('');
    const [serial_numberOld, setSrOld] = useState('');
    const [detail, setDetail] = useState('');
    const [url, SetUrl] = useState('');
    const [num_report, SetNumberReport] = useState('');
    useEffect(() => {
        axios.get('http://localhost:3333/aplistwithid/'+id)
        .then(res => {
            setSite(res.data[0].Site);
            setHostname(res.data[0].APname);
            setBuildname(res.data[0].Buildname);
            setBuildgroup(res.data[0].Buildgroup);
            setIpswitch(res.data[0].IPswitch);
            SetUrl(res.data[0].urlmap);
            setSrOld(res.data[0].Serialnumber);
            setRole(res.data[0].Role);
            SetNumberReport(res.data[0].num_report);
        })
        .catch(err => console.log(err));
    },[id])

    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        if (device_type !== "Select Device Type" && serial_number !== "" && detail !== ""){
        axios
        .post('http://localhost:3333/addreport_ap/'+ id, {site, build_group, build_name, 
        ipswitch, hostname, role, serial_number, serial_numberOld, detail, url, device_type, num_report}) 
        .then(res => {
            console.log(res);
            if(res.data.added){
                alert("Add Corrupt Device Data Complete!")
                //navigate('/deviceclist')
                navigate('/dbadmin')
            }else{
                alert("Error! Please Try Again.")
            }                
        })
        .catch(err => console.log(err));
        }else{
            alert("Please Complete The Information!");
        }
    }
    
    //UI
    return (
        <div>
        <Navbar variant="dark" bg="dark" expand="lg">
        <Container fluid>
            <Navbar.Brand href='/dbadmin'>Back To Dashboard</Navbar.Brand>
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
                <h2>Report Corrupt Device (Access Point)</h2>
            </div> 
     
                <div className='mb-4'>
                    <label htmlFor=''>Site</label>
                    <input type="text" 
                    placeholder='' 
                    className='form-control'
                    value={site} 
                    onChange={e => setSite(e.target.value)} 
                    disabled/>
                </div>

                <div className='mb-4'>
                    <label htmlFor=''>Device Type</label>
                    <select 
                    className="form-control" 
                    onChange={e => SetDVType(e.target.value)}>
                        <option>Select Device Type</option>                  
                        <option value="AP">Access Point</option>     
                </select>
                </div>
                
                <div className='mb-4'>
                    <label htmlFor=''>Building Group</label>
                    <input type="text" 
                    placeholder='' 
                    className='form-control'
                    value={build_group} 
                    onChange={e => setBuildgroup(e.target.value)} 
                    disabled/>
                </div>

                <div className='mb-4'>
                    <label htmlFor=''>Building Name</label>
                    <input 
                    type="text" placeholder='' 
                    className='form-control'
                    value={build_name} 
                    onChange={e => setBuildname(e.target.value)} 
                    disabled/>
                </div>

                <div className='mb-4'>
                    <label>IP Address (IP Switch)</label>
                    <input type="text" 
                    className='form-control'
                    value={ipswitch} 
                    onChange={e => setIpswitch(e.target.value)} 
                    disabled/>
                </div>

                <div className='mb-4'>
                    <label htmlFor=''>Hostname</label>
                    <input type="text" 
                    placeholder='' 
                    className='form-control'
                    value={hostname} 
                    onChange={e => setHostname(e.target.value)} 
                    disabled/>
                </div>

                <div className='mb-4'>
                    <label htmlFor=''>Role</label>
                    <input 
                    className="form-control" 
                    onChange={e => setRole(e.target.value)}
                    value={role}
                    disabled/>
                </div>

                <div className='mb-4'>
                    <label>Old Serial Number</label>
                    <input 
                    type="text" 
                    className='form-control'
                    onChange={e => setSrOld(e.target.value)}
                    value={serial_numberOld}
                    disabled
                    />
                </div>

                <div className='mb-4'>
                    <label>New Serial Number</label>
                    <input 
                    type="text" 
                    className='form-control'
                    placeholder='Enter New Serial Number' 
                    onChange={e => setSR(e.target.value)}
                    required/>
                </div>

                <div className='mb-4'>
                    <label>Detail</label>
                    <input type="text" 
                    className='form-control'
                    placeholder='Enter Detail of Corrupt Device' 
                    onChange={e => setDetail(e.target.value)}
                    required/>
                </div>
                <div
                    style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <button className="btn btn-primary" onClick={ handleSubmit }>Add Data!</button>  
                </div>          
            </form>
        </div> 
    </div>
    );
}
    
export default function ReportAP() {
    return <ReportAPContent />
}