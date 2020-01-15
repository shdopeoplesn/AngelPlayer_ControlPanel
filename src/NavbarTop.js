import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import FormControl from 'react-bootstrap/FormControl'
import {NavDropdown} from 'react-bootstrap/'

class NavbarTop extends React.Component {

  render() {
      return (
        <Navbar bg="light" expand="lg">
          <Navbar.Brand href="/">Angelplayer Control System</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="/">Dashboard</Nav.Link>
              <Nav.Link href="/list">Device List</Nav.Link>
              <NavDropdown title="More" id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">test1</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">test2</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">test3</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">test4</NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Form inline>
              <FormControl type="text" placeholder="Search" className="mr-sm-2" />
              <Button variant="outline-success">Search</Button>
            </Form>
          </Navbar.Collapse>
        </Navbar>
      );
  }
}
export default NavbarTop;