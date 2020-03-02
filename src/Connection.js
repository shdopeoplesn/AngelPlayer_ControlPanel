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
import Spinner from 'react-bootstrap/Spinner'

import icon_device_pc from './images/device_pc.png';



class Device {
  constructor(cid,ipv4,mac,device_name,os,cpu,mem,cpu_usage,mem_remain,user_name,apps,process,disks) {
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
    this.disks_ = disks;
  }
}

var g_devices = [];
const client = new WebSocket('ws://192.168.1.248:7779');
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
        return 0
      }
      if(flag_receive === true){
        let data_array = JSON.parse(data)
        
        for(let i = 0; i < data_array.length; i++){
          let cid = data_array[i]["cid"]
          let ipv4 = data_array[i]["ipv4"]
          let mac = data_array[i]["mac"]
          let device_name = data_array[i]["device_name"]
          let os = data_array[i]["os"]
          let cpu = data_array[i]["cpu"]
          let mem = data_array[i]["mem"]
          let cpu_usage = data_array[i]["cpu_usage"]
          let mem_remain = data_array[i]["mem_remain"]
          let user_name = data_array[i]["user_name"]
          let apps = data_array[i]["apps"]
          let process = data_array[i]["process"]
          let disks = data_array[i]["disks"]
          g_devices.push(new Device(cid,ipv4,mac,device_name,os,cpu,mem,cpu_usage,mem_remain,user_name,apps,process,disks))
        };
      }
    };
  }
  
  render() {
    return (
      null
    );
  }
}

class UIList extends React.Component{
  componentDidUpdate(){
    this.sendMessage()
  }

  sendMessage=()=>{
    //const {websocket} = this.props // websocket instance passed as props to the child component.
    try {
        const data = new Buffer('GETLIST').toString('base64');
        client.send(data) //send data to the server
    } catch (error) {
        console.log(error) // catch error
    }
  }
  render() {
    let lists = [];
    let loading_spinner = [];

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
              <Link to={ "/detail/" + g_devices[i].cid_ }><Button variant="primary">Detail</Button></Link>
            </Card.Body>
          </Card>
        </Col>
      );
    }
    if(g_devices.length === 0){
      loading_spinner.push(<Spinner animation="border" variant="primary" className="centered" />);
      return (<>{ loading_spinner }</>);
    }
    return (
      <>
        <Container>
          { loading_spinner }
          <Row>
            { lists }
          </Row>
        </Container>
      </>
    );
  }
}


class UISearch extends React.Component{

}


class UIDetail extends React.Component{
  componentDidUpdate(){
    this.sendMessage()
  }

  sendMessage=()=>{
    //const {websocket} = this.props // websocket instance passed as props to the child component.
    try {
        const data = new Buffer('GETID-' + this.props.cid).toString('base64');
        client.send(data) //send data to the server
    } catch (error) {
        console.log(error) // catch error
    }
  }
  render() {
    let apps_lists = [];
    let process_lists = [];
    let disks_lists = [];
    let main_lists = [];
    let loading_spinner = [];
    try{
      if(g_devices[0] != null){
        var apps_array = JSON.parse(g_devices[0].apps_)
        apps_lists.push(            
        <thead>
          <td col="2">Apps Name</td>
          <td col="2">Version</td>
          <td col="2">Installed Date</td>
          <td col="2">Path</td>
        </thead>);
        for(let i = 0; i < apps_array.length; i++){
          apps_lists.push(
            <tr>
            <td>{ apps_array[i]["name_"] }</td>
            <td>{ apps_array[i]["version_"] }</td>
            <td>{ apps_array[i]["date_"] }</td>
            <td>{ apps_array[i]["path_"] }</td>
            </tr>
          );
        };

        var process_array = JSON.parse(g_devices[0].process_)
        process_lists.push(            
        <thead>
          <td>PID</td>
          <td>Process Name</td>
          <td>Memory Usage</td>
        </thead>);
        for(let i = 0; i < process_array.length; i++){
          process_lists.push(
            <tr>
            <td>{ process_array[i]["pid_"] }</td>
            <td>{ process_array[i]["name_"] }</td>
            <td>{ process_array[i]["mem_usage_"]/1024/1024 }MB</td>
            </tr>
          );
        };

        var disks_array = JSON.parse(g_devices[0].disks_)
        disks_lists.push(            
        <thead>
          <td>Disk Name</td>
          <td>Disk Label</td>
          <td>Disk Type</td>
          <td>Disk Format</td>
          <td>Disk Size</td>
          <td>Disk Free Space</td>
        </thead>);
        for(let i = 0; i < disks_array.length; i++){
          disks_lists.push(
            <tr>
            <td>{ disks_array[i]["name_"] }</td>
            <td>{ disks_array[i]["label_"] }</td>
            <td>{ disks_array[i]["type_"] }</td>
            <td>{ disks_array[i]["format_"] }</td>
            <td>{ disks_array[i]["size_"]/1024/1024/1024 }GB</td>
            <td>{ disks_array[i]["remain_"]/1024/1024/1024 }GB</td>
            </tr>
          );
        };
        
        main_lists.push(
          <>
          <tr>
            <td>Custom ID</td>
            <td>{ g_devices[0].cid_ }</td>
          </tr>
          <tr>
            <td>IPv4 Address</td>
            <td>{ g_devices[0].ipv4_ }</td>
          </tr>
          <tr>
            <td>MAC Address</td>
            <td>{ g_devices[0].mac_ }</td>
          </tr>
          <tr>
            <td>Device Name</td>
            <td>{ g_devices[0].device_name_ }</td>
          </tr>
          <tr>
            <td>OS</td>
            <td>{ g_devices[0].os_ }</td>
          </tr>
          <tr>
            <td>Processor</td>
            <td>{ g_devices[0].cpu_ }</td>
          </tr>
          <tr>
            <td>RAM</td>
            <td>{ g_devices[0].mem_ }MB</td>
          </tr>
          <tr>
            <td>CPU Usage</td>
            <td><ProgressBar now={g_devices[0].cpu_usage_} label={`${g_devices[0].cpu_usage_.toString().substring(0,4)}%`} /></td>
          </tr> 
          <tr>
            <td>RAM Usage</td>
            <td><ProgressBar max = {g_devices[0].mem_} now={ g_devices[0].mem_ - g_devices[0].mem_remain_} label={`${((g_devices[0].mem_ - g_devices[0].mem_remain_) / g_devices[0].mem_ * 100).toFixed(2) }%`} />({g_devices[0].mem_ - g_devices[0].mem_remain_}/{g_devices[0].mem_}MB)</td>
          </tr>                     
          <tr>
            <td>User</td>
            <td>{ g_devices[0].user_name_ }</td>
          </tr>
          </>
        );
      }
    }catch{
      loading_spinner.push(<Spinner animation="border" variant="primary" className="centered" />);
      return (<>{ loading_spinner }</>);
    }
    return (
      <>
        <Container>
          { loading_spinner }
          <Table responsive striped bordered hover>
              { main_lists }
          </Table>
          <Table responsive striped bordered hover>
              { disks_lists }
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
}

export default Connection;
export {
  UIList,
  UIDetail,
  UISearch,
}