import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';

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
    },[])

    //SW API
    const [swlist, setSwList] = useState([]);   
    useEffect(() => {
        fetch("http://localhost:3333/swlist")
          .then(res => res.json())
          .then(
            (result) => {
              setSwList(result);
            }
          )
      }, [])

    //ฟังก์ชั่น Log Out
    const handleLogout = (event) => {
        event.preventDefault();
        localStorage.removeItem('token');
        window.location = '/Login'
    }

    //UI
    return (
        <div>
        <Navbar variant="dark" bg="dark" expand="lg">
        <Container fluid>
            <Navbar.Brand href="/DashboardAdmin">Switch</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbar-dark-example" />
            <Navbar.Collapse id="navbar-dark-example">
            </Navbar.Collapse>
            <Navbar.Brand onClick={ handleLogout }>Log-Out</Navbar.Brand>
        </Container>
        </Navbar>
        
        <div>
        <table class="table">
            <thead class="thead-light">
            <tr>
                <th scope="col">ID</th>
                <th scope="col">Hostname</th>
                <th scope="col">IP Address</th>
                <th scope="col">Building Name</th>
                <th scope="col">Building Group</th>
                <th scope="col">Role</th>
                <th scope="col">Model</th>
                <th scope="col">Map</th>
                <th scope="col">Config</th>
            </tr>
            </thead>
        {swlist.map (swlist => (
        <tbody>
        <tr>
            <th scope="row">{swlist.ID}</th>
            <td>{swlist.hostname}</td>
            <td>{swlist.ip}</td>
            <td>{swlist.buildname}</td>
            <td>{swlist.buildgroup}</td>
            <td>{swlist.role}</td>
            <td>{swlist.model}</td>
            <td>{swlist.map}</td>
            <td>{swlist.config}</td>
            <button>Edit Data</button>
            <button>Delete Data</button>
        </tr>
        </tbody>
        ))}    
        </table>
        </div>

        </div>          
      );
    }
    

export default function SwitchList() {
    return <SwitchContent />
}