import React, { useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Chart } from "react-google-charts";

function DashboardContent() {
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
    
    //Log Out
    const handleLogout = (event) => {
        event.preventDefault();
        localStorage.removeItem('token');
        window.location = '/login'
    }
    
    const data = [
        ["Device", "1 per Units"],
        ["AP Indoor", 80],
        ["AP Outdoor", 20],
    ];
      
    const options = {
        title: "Total AP Install",
        pieHole: 0.4,
        is3D: false,
    };

    const data2 = [
        ["Device", "1 per Units"],
        ["Switch Access", 80],
        ["Switch Dist", 20],
    ];
      
    const options2 = {
        title: "Total Switch Install",
        pieHole: 0.4,
        is3D: false,
    };

    const data3 = [
        ["Device", "1 per Units"],
        ["Switch", 50],
        ["AP", 50],
    ];
      
    const options3 = {
        title: "Total Device Problem",
        pieHole: 0.4,
        is3D: false,
    };

    //UI
    return (
        <div>
        <Navbar variant="dark" bg="dark" expand="lg">
        <Container fluid>
            <Navbar.Brand href="#">Dashboard(Admin)</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbar-dark-example" />
            <Navbar.Collapse id="navbar-dark-example">
            <Nav className="me-auto">
                <Nav.Link href="/users">Users Manager</Nav.Link>
                <Nav.Link href="/accesspoint">Access Point</Nav.Link>    
                <Nav.Link href="#">Switch</Nav.Link>       
                <Nav.Link href="#">About This Website</Nav.Link>            
            </Nav>
            <Nav>
                <Nav.Link onClick={ handleLogout }>Log-Out</Nav.Link>
            </Nav>
            </Navbar.Collapse>
        </Container>
        </Navbar>
        
    <Chart
      chartType="PieChart"
      width="100%"
      height="400px"
      data={data}
      options={options}
    />

    <Chart
      chartType="PieChart"
      width="100%"
      height="400px"
      data={data2}
      options={options2}
    />

    <Chart
      chartType="PieChart"
      width="100%"
      height="400px"
      data={data3}
      options={options3}
    />              
        </div>          
      );
    }
    

export default function DashboardAdmin() {
    return <DashboardContent />
}