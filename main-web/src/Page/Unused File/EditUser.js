import React, { useEffect, useState } from 'react';
import {  useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import 'bootstrap/dist/css/bootstrap.min.css';

function EditUserContent() {
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

    const {Id} = useParams();
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [tel, setTel] = useState("");
    const [epid, setEmployeeId] = useState("");
    const [type, setType] = useState("");
    useEffect(() => {
        axios.get('http://localhost:3333/userlist2/'+Id)
        .then(res => {
            setName(res.data[0].name);
            setRole(res.data[0].role);
            // setSite(res.data[0].site);
            setTel(res.data[0].tel);   
            setEmployeeId(res.data[0].employeeid);   
            setType(res.data[0].type);              
        })
        .catch(err => console.log(err));
    },[Id])

    //Update AP API
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        if (name !== '' && tel !== '' && epid !== '') {
                axios.put('http://localhost:3333/updateuser2/'+Id, {name ,role, tel, epid, type}) 
                .then(res => {
                    if(res.data.updated){
                        alert("Update User Data ID : " + (Id) + " Complete!")
                        localStorage.setItem("name", name);
                        navigate('/home2')    
                    }else{
                        alert("Error! Please Try Again.")
                    }                
                })
                .catch(err => console.log(err));
        }else{
            alert("Please Complete The Information!");
        }
    }
    
    async function getDataSite() {
      const getSiteName = await axios.get("http://localhost:3333/site_name")
    //   setSiteName(getSiteName.data)
    }
    useEffect(() => {
      getDataSite();
    }, []);

    //UI
    return (
        <div>
        <Navbar variant="dark" bg="dark" expand="lg">
        <Container fluid>
            <Navbar.Brand href='/home2'>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-house-door-fill" viewBox="0 0 16 16">
                <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5"/>
            </svg>
            &nbsp; Home
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
                <h2>Edit User Profile</h2>
            </div> 

                <div className='mb-4'>
                    <label htmlFor=''>Name</label>
                    <input type="text" placeholder='' className='form-control'
                    value={name} onChange={e => setName(e.target.value)}/>
                </div>

                <div className='mb-4'>
                <label htmlFor=''>Role</label>
                <select class="form-control" value={role} onChange={e => setRole(e.target.value)} disabled>
                    <option>User</option>
                </select> 
                </div>

                <div className='mb-4'>
                    <label htmlFor=''>Tel</label>
                    <input type="text" placeholder='' className='form-control'
                    value={tel} onChange={e => setTel(e.target.value)}
                    maxLength={10}/>
                </div>

                <div className='mb-4'>
                    <label htmlFor=''>Employee ID</label>
                    <input type="text" placeholder='' className='form-control'
                    value={epid} onChange={e => setEmployeeId(e.target.value)}/>
                </div>
                {type !== '-'&& (
                <div className='mb-4'>
                    <label htmlFor=''>Type</label>
                    <select class="form-control" value={type} onChange={e => setType(e.target.value)}>
                        <option>Leader</option>
                        <option>Team Support</option>
                </select> 
                </div>
                )}

                {/* {role =='Customer' && siteName =='' &&(
                    alert("Not Found Site,Please Add New Site Before Change User Site!!!"),
                    navigate('/users')
                )} */}
                {/* {role !== 'Admin' && (
                <div className="mb-4">
                    <label>Site</label>
                    <select
                    className="form-control"
                    onChange={(e) => setSite(e.target.value)}
                    value={site}
                    >
                        {siteName.map((siteName, index) => (
                            <option key={index}>{siteName.name}</option>             
                        ))}
                </select>
                </div>
                )} */}
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
    
export default function EditUser() {
    return <EditUserContent />
}