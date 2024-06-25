import React, { useEffect, useState } from 'react';
import {  useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import 'bootstrap/dist/css/bootstrap.min.css';

function ReportSWContent() {
    //Check Token API
    useEffect(() => {
        const token = localStorage.getItem('token')
        const name1 = localStorage.getItem("name");
        fetch ('http://localhost:3333/authen', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": 'Bearer '+ token, name1
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
    },[])

    const {id} = useParams();
    const site1 = localStorage.getItem("site");
    const [site, setSite] = useState('');
    const [build_group, setBuildgroup] = useState('');
    const [build_name, setBuildname] = useState('');
    const [hostname, setHostname] = useState('');
    const [ipswitch, setIpswitch] = useState('');
    const [role, setRole] = useState('');
    const [detail, setDetail] = useState('');
    const [url, setUrl] = useState('');
    const [urlconfig, setUrlConfig] = useState('');
    const [device_type, SetDVType] = useState("SW");
    const [num_report, SetNumberReport] = useState('');
    const [serial_numberOld, setSrOld] = useState('');
    const [serial_number, setSR] = useState('');
    const [mac_address, setMac] = useState('');
    const [mac_addressOld, setOldMac] = useState('');

    const [id2, SetID2] = useState('');
    const username1 = localStorage.getItem("name");
    const [model, setModel] = useState('');

    const [note, setNote] = useState('');

    useEffect(() => {
        axios.get('http://localhost:3333/switchlistwithid/'+id)
        .then(res => {
            setSite(res.data[0].site);
            setHostname(res.data[0].hostname);
            setBuildname(res.data[0].buildname);
            setBuildgroup(res.data[0].buildgroup);
            setIpswitch(res.data[0].ip);
            setUrl(res.data[0].urlmap);
            setUrlConfig(res.data[0].urlconfig);
            SetNumberReport(res.data[0].num_report);
            setRole(res.data[0].role);
            setSrOld(res.data[0].serialno);
            setOldMac(res.data[0].macaddress);
            SetID2(res.data[0].ID);
            setModel(res.data[0].model);
        })
        .catch(err => console.log(err));
    },[id])

    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        if (serial_number !== '' && detail !== '' && mac_address !== ''){
        axios
        .post('http://localhost:3333/addreport_sw/'+ id, {site, device_type, build_group, build_name,
        ipswitch, hostname, role, serial_numberOld, serial_number, mac_addressOld, mac_address, detail, url, urlconfig, 
        num_report, username1, model, id2, note}) 
        .then(res => {
            if(res.data.added){
                alert("Report Switch Replacement Device Data Complete!")
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
                <h2>Report Corrupt Device (Switch)</h2>
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

                <div className="mb-4">
                    <label>Device Type</label>
                    <input
                        type="text"
                        className="form-control"
                        value="Switch"
                        disabled
                        onChange={(e) => SetDVType(e.target.value)}
                    />
                </div>                 
                
                <div className='mb-4'>
                    <label htmlFor=''>Building Group</label>
                    <input 
                    type="text" 
                    placeholder='' 
                    className='form-control'
                    value={build_group} 
                    onChange={e => setBuildgroup(e.target.value)} 
                    disabled/>
                </div>

                <div className='mb-4'>
                    <label htmlFor=''>Building Name</label>
                    <input 
                    type="text" 
                    placeholder='' 
                    className='form-control'
                    value={build_name} 
                    onChange={e => setBuildname(e.target.value)} 
                    disabled/>
                </div>

                <div className='mb-4'>
                    <label>IP Address (IP Switch)</label>
                    <input 
                    type="text" 
                    className='form-control'
                    value={ipswitch} 
                    onChange={e => setIpswitch(e.target.value)} 
                    disabled/>
                </div>

                <div className='mb-4'>
                    <label htmlFor=''>Hostname</label>
                    <input 
                    type="text" 
                    placeholder='' 
                    className='form-control'
                    value={hostname} 
                    onChange={e => setHostname(e.target.value)} 
                    disabled/>
                </div>

                <div className='mb-4'>
                    <label htmlFor=''>Model</label>
                    <input 
                    className="form-control" 
                    onChange={e => setModel(e.target.value)}
                    value={model}
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
                    <label>Old Serial No.</label>
                    <input 
                    type="text" 
                    className='form-control'
                    onChange={e => setSrOld(e.target.value)}
                    value={serial_numberOld}
                    disabled
                    />
                </div>

                <div className='mb-4'>
                    <label>Old Mac Address</label>
                    <input 
                    type="text" 
                    className='form-control'
                    onChange={e => setOldMac(e.target.value)}
                    value={mac_addressOld}
                    disabled
                    />
                </div>

                <div className='mb-4'>
                    <label>Replace Serial No.</label>
                    <input 
                    type="text" 
                    className='form-control'
                    placeholder='Enter New Serial Number' 
                    onChange={e => setSR(e.target.value)}
                    required/>
                </div>

                <div className='mb-4'>
                    <label>Replace Mac Address</label>
                    <input 
                    type="text" 
                    className='form-control'
                    placeholder='Enter New Mac Address' 
                    onChange={e => setMac(e.target.value)}
                    required/>
                </div>

                <div className='mb-4'>
                <label htmlFor='Select Details'>Details Of Replace</label>
                <select 
                    className="form-control" 
                    onChange={e => setDetail(e.target.value)}>
                    <option defaultValue>Select Details</option>
                    <option>โดนน้ำ</option>
                    <option>ไฟช็อต</option>
                    <option>พอร์ตไม่จ่ายไฟ</option>
                    <option>อื่นๆ</option>                     
                </select>
                </div>

                {detail == "อื่นๆ" && (
                    <div className='mb-4'>
                        <label>Note</label>
                        <input 
                        type="text" 
                        className='form-control'
                        placeholder='Enter Note For Detail' 
                        onChange={e => setNote(e.target.value)}
                        required/>
                    </div>
                )}  
                <div
                    style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <button className="btn btn-primary" onClick={ handleSubmit }>Report Data!</button>  
                </div>
                 
            </form>
        </div> 
    </div>
    );
}
    
export default function ReportSW() {
    return <ReportSWContent />
}