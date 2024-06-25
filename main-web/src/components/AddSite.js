import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';

function Example2() { 
  const [show, setShow] = useState(false);
  const [site, setSite] = useState("");
  const [contact_name, setContactName] = useState("");
  const [contact_tel, setContactTel] = useState("");
  // const [open_hour, setOpenH] = useState("");
  // const [close_hour, setCloseH] = useState("");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [s_day, setSDay] = useState("");
  const [s_month, setSMonth] = useState("");
  const [s_year, setSYear] = useState("");
  const [e_day, setEDay] = useState("");
  const [e_month, setEMonth] = useState("");
  const [e_year, setEYear] = useState("");

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
        //ไม่ต้องทำอะไร
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

    const [siteName,setSiteName] = useState([])
    async function getData() {
      const getDataSite = await axios.get("http://localhost:3333/site2")
      const dataSite = []
      getDataSite.data.map((item)=>{    
          dataSite.push(item.name)
      })
      setSiteName(dataSite)
    }
    useEffect(() => {
      getData();
    }, []);

    function handleSubmit(event) {
      event.preventDefault();
      if (site !== "" && contact_name !== "" && contact_tel !== ""
        && s_day !== "" && s_month !== "" && s_year !== ""
        && e_day !== "" && e_month !== "" && e_year !== "") {
        const lowercaseInputValue = site.toLowerCase();
        const lowercaseArray = siteName.map(element => element.toLowerCase());
        // Check if the lowercaseInputValue exists in the lowercaseArray
        if (lowercaseArray.includes(lowercaseInputValue)) {
          // If it already exists, show an alert
          alert(`Site : "${site}" already exists in database. Please try again!`);
        }
        else {
          axios
          .post("http://localhost:3333/addsite", { site, contact_name, contact_tel, s_day, s_month, s_year, e_day, e_month, e_year})
          .then((res) => {
            if (res.data.added) {
              alert("Add Site : " + (site) + " Complete!");
              //navigate("/home");
              window.location.reload();
            } else {
              alert("Error! Please Try Again.");
            }
          })
          .catch((err) => console.log(err));
        }
      }
      else{
        alert("Please Complete The Information!");
      }
    }

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle-fill" viewBox="0 0 16 16">
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"/>
      </svg> &nbsp; Site
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Site</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Site Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Please Enter site name"
                autoFocus
                onChange={(e)=>{setSite(e.target.value)}}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Contact Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Please Enter Contact Name Ex.Name1"
                autoFocus
                onChange={(e)=>{setContactName(e.target.value)}}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Contact Tel.</Form.Label>
              <Form.Control
                type="text"
                placeholder="Please Enter Contact Tel Ex.0xxxxxxxxx"
                autoFocus
                onChange={(e)=>{setContactTel(e.target.value)}}
                maxLength={10}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Start Date (DD-MM-YY)</Form.Label>
                <Form.Select className="mb-3" onChange={(e)=>{setSDay(e.target.value)}}>            
                  <option defaultValue>Select Days</option>
                  <option>01</option>
                  <option>02</option>
                  <option>03</option>
                  <option>04</option>
                  <option>05</option>
                  <option>06</option>
                  <option>07</option>
                  <option>08</option>
                  <option>09</option>
                  <option>10</option>
                  <option>11</option>
                  <option>12</option>
                  <option>13</option>
                  <option>14</option>
                  <option>15</option>
                  <option>16</option>
                  <option>17</option>
                  <option>18</option>
                  <option>19</option>
                  <option>20</option>
                  <option>21</option>
                  <option>22</option>
                  <option>23</option>
                  <option>24</option>
                  <option>25</option>
                  <option>26</option>
                  <option>27</option>
                  <option>28</option>
                  <option>29</option>
                  <option>30</option>
                  <option>31</option>
                </Form.Select>
                <Form.Select className="mb-3" onChange={(e)=>{setSMonth(e.target.value)}}>            
                  <option defaultValue>Select Months</option>
                  <option>01</option>
                  <option>02</option>
                  <option>03</option>
                  <option>04</option>
                  <option>05</option>
                  <option>06</option>
                  <option>07</option>
                  <option>08</option>
                  <option>09</option>
                  <option>10</option>
                  <option>11</option>
                  <option>12</option>
                </Form.Select>
                <Form.Select className="mb-3" onChange={(e)=>{setSYear(e.target.value)}}>            
                  <option defaultValue>Select Years</option>
                  <option>2020</option>
                  <option>2021</option>
                  <option>2022</option>
                  <option>2023</option>
                  <option>2024</option>
                  <option>2025</option>
                  <option>2026</option>
                  <option>2027</option>
                  <option>2028</option>
                  <option>2029</option>
                  <option>2030</option>
                </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>End Date (DD-MM-YY)</Form.Label>
              <Form.Select className="mb-3" onChange={(e)=>{setEDay(e.target.value)}}>            
                  <option defaultValue>Select Days</option>
                  <option>01</option>
                  <option>02</option>
                  <option>03</option>
                  <option>04</option>
                  <option>05</option>
                  <option>06</option>
                  <option>07</option>
                  <option>08</option>
                  <option>09</option>
                  <option>10</option>
                  <option>11</option>
                  <option>12</option>
                  <option>13</option>
                  <option>14</option>
                  <option>15</option>
                  <option>16</option>
                  <option>17</option>
                  <option>18</option>
                  <option>19</option>
                  <option>20</option>
                  <option>21</option>
                  <option>22</option>
                  <option>23</option>
                  <option>24</option>
                  <option>25</option>
                  <option>26</option>
                  <option>27</option>
                  <option>28</option>
                  <option>29</option>
                  <option>30</option>
                  <option>31</option>
                </Form.Select>
                <Form.Select className="mb-3" onChange={(e)=>{setEMonth(e.target.value)}}>            
                  <option defaultValue>Select Months</option>
                  <option>01</option>
                  <option>02</option>
                  <option>03</option>
                  <option>04</option>
                  <option>05</option>
                  <option>06</option>
                  <option>07</option>
                  <option>08</option>
                  <option>09</option>
                  <option>10</option>
                  <option>11</option>
                  <option>12</option>
                </Form.Select>
                <Form.Select className="mb-3" onChange={(e)=>{setEYear(e.target.value)}}>            
                  <option defaultValue>Select Years</option>
                  <option>2020</option>
                  <option>2021</option>
                  <option>2022</option>
                  <option>2023</option>
                  <option>2024</option>
                  <option>2025</option>
                  <option>2026</option>
                  <option>2027</option>
                  <option>2028</option>
                  <option>2029</option>
                  <option>2030</option>
                </Form.Select>
            </Form.Group>            
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Add Site!
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Example2;