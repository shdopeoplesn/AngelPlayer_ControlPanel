import React from 'react';
import './index.css';
import {Link} from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import Button from "react-bootstrap/Button";
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Table from 'react-bootstrap/Table'
import ProgressBar from 'react-bootstrap/ProgressBar'
import Accordion from 'react-bootstrap/Accordion'

import icon_device_pc from './images/device_pc.png';


class Device {
  constructor(cid,ipv4,mac,device_name,os,cpu,mem,cpu_usage,mem_remain,user_name,apps,process) {
    this.cid_ = cid;
    this.ipv4_ = ipv4;
    this.mac_ = mac;
    this.device_name_ = device_name;
    this.os_ = os;
    this.cpu_ = cpu;
    this.mem_ = mem;
    this.cpu_usage_ = cpu_usage;
    this.mem_remain_ = mem_remain;
    this.user_name_ = user_name;
    this.apps_ = apps;
    this.process_ = process;
  }
}

var g_devices = [];
const client = new WebSocket('ws://127.0.0.1:7779');
let flag_connected = false;
let flag_receive = false;
class Connection extends React.Component {  
  componentWillMount() {
    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    client.onmessage = (message) => {
      console.log(message);
      var data = message.data;
      if(data === "SYN"){
        g_devices = []
        flag_receive = true
        return 0
      }
      if(data === "ACK"){
        flag_receive = false
        flag_connected = true;
        return 0
      }
      if(flag_receive === true){
        let data_array = JSON.parse(data)
        let cid = data_array["cid"]
        let ipv4 = data_array["ipv4"]
        let mac = data_array["mac"]
        let device_name = data_array["device_name"]
        let os = data_array["os"]
        let cpu = data_array["cpu"]
        let mem = data_array["mem"]
        let cpu_usage = data_array["cpu_usage"]
        let mem_remain = data_array["mem_remain"]
        let user_name = data_array["user_name"]
        let apps = data_array["apps"]
        let process = data_array["process"]
        g_devices.push(new Device(cid,ipv4,mac,device_name,os,cpu,mem,cpu_usage,mem_remain,user_name,apps,process))
      }
    };
  }
  
  render() {
    return (
      null
    );
  }
}

class ChildComponent extends React.Component {
  componentDidUpdate(){
    this.sendMessage()
  }

  sendMessage=()=>{
      //const {websocket} = this.props // websocket instance passed as props to the child component.

      try {
          const data = new Buffer('GET').toString('base64');
          client.send(data) //send data to the server
      } catch (error) {
          console.log(error) // catch error
      }
  }

  render() {
      return (
        null
      );
  }
}

function UIList(){
  let lists = []
  for(let i = 0; i < g_devices.length; i++){
    lists.push(
      <Col sm>
        <Card style={{ width: '14rem' }}>
          <Card.Img variant="top" src= {icon_device_pc} />
          <Card.Body>
            <Card.Title>{ g_devices[i].cid_ }</Card.Title>
            <Card.Text>
                { g_devices[i].device_name_ }
            </Card.Text>
            <Link to={ "/detail/" + i }><Button variant="primary">Detail</Button></Link>
          </Card.Body>
        </Card>
      </Col>
    );
  }
  return (
    <>
      <Container>
        <Row>
          {lists}
        </Row>
      </Container>
    </>
  );
}


function UISearch(keyword){
  let lists = []
  let found = false;
  for(let i = 0; i < g_devices.length; i++){
    if(g_devices[i].cid_.includes(keyword) || g_devices[i].device_name_.includes(keyword) 
    || g_devices[i].user_name_.includes(keyword)){
      lists.push(
        <Col sm>
          <Card style={{ width: '14rem' }}>
            <Card.Img variant="top" src= {icon_device_pc} />
            <Card.Body>
              <Card.Title>{ g_devices[i].cid_ }</Card.Title>
              <Card.Text>
                { g_devices[i].device_name_ }
              </Card.Text>
              <Link to={ "/detail/" + i }><Button variant="primary">Detail</Button></Link>
            </Card.Body>
          </Card>
        </Col>
      );
      found = true;
    }
  }
  if(!found && flag_connected)lists.push("Not Found with keywords: " + keyword);
  return (
    <>
      <Container>
        <Row>
          {lists}
        </Row>
      </Container>
    </>
  );
}


function UIDetail(id){
  var apps_array = g_devices[id].apps_.split("|")
  let apps_lists = []
  apps_lists.push(            
  <thead>
    <td col="2">Apps Name</td>
    <td col="2">Version</td>
    <td col="2">Installed Date</td>
    <td col="2">Path</td>
  </thead>)
  for(let i = 0; i < apps_array.length; i+=4){
    apps_lists.push(
      <tr>
      <td>{ apps_array[i] }</td>
      <td>{ apps_array[i + 1] }</td>
      <td>{ apps_array[i + 2] }</td>
      <td>{ apps_array[i + 3] }</td>
      </tr>
    );
  };

  var process_array = g_devices[id].process_.split("|")
  let process_lists = []
  process_lists.push(            
  <thead>
    <td>PID</td>
    <td>Process Name</td>
    <td>Memory Usage</td>
  </thead>)
  for(let i = 0; i < process_array.length; i+=3){
    process_lists.push(
      <tr>
      <td>{ process_array[i] }</td>
      <td>{ process_array[i + 1] }</td>
      <td>{ process_array[i + 2]/1024/1024 }MB</td>
      </tr>
    );
  };

  return (
    <>
      <Container>
        <Table responsive striped bordered hover>
            <tr>
              <td>Custom ID</td>
              <td>{ g_devices[id].cid_ }</td>
            </tr>
            <tr>
              <td>IPv4 Address</td>
              <td>{ g_devices[id].ipv4_ }</td>
            </tr>
            <tr>
              <td>MAC Address</td>
              <td>{ g_devices[id].mac_ }</td>
            </tr>
            <tr>
              <td>Device Name</td>
              <td>{ g_devices[id].device_name_ }</td>
            </tr>
            <tr>
              <td>OS</td>
              <td>{ g_devices[id].os_ }</td>
            </tr>
            <tr>
              <td>Processor</td>
              <td>{ g_devices[id].cpu_ }</td>
            </tr>
            <tr>
              <td>RAM</td>
              <td>{ g_devices[id].mem_ }MB</td>
            </tr>
            <tr>
              <td>CPU Usage</td>
              <td><ProgressBar now={g_devices[id].cpu_usage_} label={`${g_devices[id].cpu_usage_.substring(0,4)}%`} /></td>
            </tr> 
            <tr>
              <td>RAM Usage</td>
              <td><ProgressBar max = {g_devices[id].mem_} now={ g_devices[id].mem_ - g_devices[id].mem_remain_} label={`${((g_devices[id].mem_ - g_devices[id].mem_remain_) / g_devices[id].mem_ * 100).toFixed(2) }%`} />({g_devices[id].mem_ - g_devices[id].mem_remain_}/{g_devices[id].mem_}MB)</td>
            </tr>                     
            <tr>
              <td>User</td>
              <td>{ g_devices[id].user_name_ }</td>
            </tr>
        </Table>
      </Container>
      <Accordion defaultActiveKey="2">
          <Card>
            <Card.Header>
              <Accordion.Toggle as={Button} variant="link" eventKey="0">
                Running Process List
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="0">
              <Card.Body>
                <Table responsive striped bordered hover>
                  { process_lists }
                </Table>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
          <Card>
            <Card.Header>
              <Accordion.Toggle as={Button} variant="link" eventKey="1">
                Installed Application List
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="1">
              <Card.Body>
                <Table responsive striped bordered hover>
                  { apps_lists }
                </Table>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
    </>
  );
}

export default Connection;
export {
  ChildComponent,
  UIList,
  UIDetail,
  UISearch,
}