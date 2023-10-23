import React, { useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';


function DashboardContent() {
    useEffect(() => { //เช็ค Token ของ Account User
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
            //not do anything
        }else{
            alert('Authen Failed')
            localStorage.removeItem('token')
            window.location = '/Login'
            }
        })
        .catch((error) => {
        console.log("Error:", error);
        });
    },[])

    const handleLogout = (event) => { //ฟังก์ชั่น Log Out
        event.preventDefault();
        localStorage.removeItem('token');
        window.location = '/Login'
    }

    //ฟังก์ชั่นไปหน้า AccessPointList
    const AP = (event) => {
        event.preventDefault();
        window.location = '/accesspoint'
    }

    //ฟังก์ชั่นไปหน้า SwitchList
    const SW = (event) => {
        event.preventDefault();
        window.location = '/switch'
    }      
 
    return (
        <div>
        <Navbar variant="dark" bg="dark" expand="lg">
        <Container fluid>
            <Navbar.Brand href="#">Dashboard(User)</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbar-dark-example" />
            <Navbar.Collapse id="navbar-dark-example">
            <Nav className="me-auto">
                <Nav.Link href='/accesspoint'>Access Point</Nav.Link>    
                <Nav.Link>Switch</Nav.Link>          
                <Nav.Link>About This Website</Nav.Link>            
            </Nav>
            <Nav>
                <Nav.Link onClick={ handleLogout }>Log-Out</Nav.Link>
            </Nav>
            </Navbar.Collapse>
        </Container>
        </Navbar>
        </div>  
      );
    }

export default function Dashboard() {
  return <DashboardContent />;
}