import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import 'bootstrap/dist/css/bootstrap.min.css';

function AccessConfigContent() {
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
            window.location = '/login'
        }
        })
        .catch((error) => {
        console.log("Error:", error);
        });
    },[])

    //Log Out
    const handleLogout = (event) => {
        event.preventDefault();
        localStorage.removeItem('token');
        window.location = '/login'
    }

    //Access Point List With AP_ID API
    const {id} = useParams();
    const [hostname, setHostname] = useState('');
    const [ipswitch, setIpswitch] = useState('');
    const [build_name, setBuildname] = useState('');
    const [build_group, setBuildgroup] = useState('');
    const [model, setModel] = useState('');
    const [role, setRole] = useState('');
    const [maps, setMaps] = useState('');
    const [config, setConfig] = useState('');
    useEffect(() => {
        axios.get('http://localhost:3333/editap/'+id)
        .then(res => {
            setHostname(res.data[0].Hostname);
            setIpswitch(res.data[0].IPswitch);
            setBuildname(res.data[0].Buildname);
            setBuildgroup(res.data[0].Buildgroup);
            setModel(res.data[0].Model);
            setRole(res.data[0].Role);
            setMaps(res.data[0].Maps);
            setConfig(res.data[0].Config);
        })
        .catch(err => console.log(err));
    },[])

    //UI
    return (
        <div>
        
        <Navbar variant="dark" bg="dark" expand="lg">
        <Container fluid>
            <Navbar.Brand href="/accesspoint">Back To Access Point List</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbar-dark-example" />
            <Navbar.Collapse id="navbar-dark-example">
            <Nav className="me-auto"></Nav>
            <Nav>
                <Nav.Link onClick={ handleLogout }>Log-Out</Nav.Link>
            </Nav>
            </Navbar.Collapse>
        </Container>
        </Navbar>
        

        </div>          
      );
    }
    

export default function AccessConfig() {
    return <AccessConfigContent />
}