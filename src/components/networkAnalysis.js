import React, {Component} from 'react';
import axios from 'axios'
import { Button, Modal, Dimmer, Loader, Image, Segment } from 'semantic-ui-react'
import ReactExport from "react-data-export";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export default class NetworkAnalysis extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: true,
            top3: {ida: [], oda: [], ba: [], ca: [], ea: []}
        }
    }

    componentDidMount() {
    }

    openModal = () => {
        axios.get('/api/network_analysis', {timeout: 60 * 1000})
        .then(async (res) => {
            let result = res.data;

            let ida = result[0];
            let oda = result[1];
            let ba = result[2];
            let ca = result[3];
            let ea = result[4];

            let data = [];
            for (let key in ida){
                let row = {user: key, ida: ida[key], oda: oda[key], ba: ba[key], ca: ca[key], ea: ea[key]};
                data.push(row);
            }

            this.setState({data, loading: false});
            this.findTopThree('ida');
            this.findTopThree('oda');
            this.findTopThree('ba');
            this.findTopThree('ca');
            this.findTopThree('ea');

            console.log(this.state);
        }).catch(err => console.log(err))
    }

    findTopThree = async (target) => {
        const data = [...this.state.data];
        let profile_name_list = [];
        let value_list = [];
        let result = [];

        for (let i = 0; i < data.length; i++) {
            profile_name_list.push(data[i].user);
            value_list.push(data[i][target]);
        }

        console.log(value_list);
        console.log(profile_name_list);

        for (let i = 0; i < 3; i++) {
            let max = Math.max(...value_list);
            console.log(max);
            console.log(value_list.indexOf(max));
            result.push({user: profile_name_list[value_list.indexOf(max)], value: max});
            value_list.splice(value_list.indexOf(max), 1);
        }

        console.log(result);
        let top3 = this.state.top3;
        top3[target] = result;
        await this.setState({top3});
    }
  
    render() {
        let idaTop3 = this.state.top3.ida.map(item => <div style={{fontSize: '1.1rem'}} className="col-4">{item.user} : <span style={{fontWeight: 'bold'}}>{item.value}</span></div>);
        let odaTop3 = this.state.top3.oda.map(item => <div style={{fontSize: '1.1rem'}} className="col-4">{item.user} : <span style={{fontWeight: 'bold'}}>{item.value}</span></div>);
        let baTop3 = this.state.top3.ba.map(item => <div style={{fontSize: '1.1rem'}} className="col-4">{item.user} : <span style={{fontWeight: 'bold'}}>{item.value}</span></div>);
        let caTop3 = this.state.top3.ca.map(item => <div style={{fontSize: '1.1rem'}} className="col-4">{item.user} : <span style={{fontWeight: 'bold'}}>{item.value}</span></div>);
        let eaTop3 = this.state.top3.ea.map(item => <div style={{fontSize: '1.1rem'}} className="col-4">{item.user} : <span style={{fontWeight: 'bold'}}>{item.value}</span></div>);
        
        let modalData = this.state.loading ? (
            <div>
                <div class="d-flex justify-content-center">
                    <div class="spinner-border text-info" style={{width: "3rem", height: "3rem"}} role="status">
                    </div>
                </div>
            </div>) : 
            (<div><ul class="nav nav-pills nav-fill mb-3" id="pills-tab" role="tablist">
                <li class="nav-item">
                    <a class="nav-link active" id="pills-nv-tab" data-toggle="pill" href="#pills-nv" role="tab" aria-controls="pills-nv" aria-selected="true">Network Visualization</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" id="pills-i-d-tab" data-toggle="pill" href="#pills-i-d" role="tab" aria-controls="pills-i-d" aria-selected="false">In Degree Centrality</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" id="pills-o-d-tab" data-toggle="pill" href="#pills-o-d" role="tab" aria-controls="pills-o-d" aria-selected="false">Out Degree Centrality</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" id="pills-b-tab" data-toggle="pill" href="#pills-b" role="tab" aria-controls="pills-b" aria-selected="false">Betweenness Centrality</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" id="pills-c-tab" data-toggle="pill" href="#pills-c" role="tab" aria-controls="pills-c" aria-selected="false">Closeness Centrality</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" id="pills-e-tab" data-toggle="pill" href="#pills-e" role="tab" aria-controls="pills-e" aria-selected="false">Eigenvector Centrality</a>
                </li>
            </ul>
            <div class="tab-content" id="pills-tabContent">
                <div class="tab-pane nv-tabs fade show active" id="pills-nv" role="tabpanel" aria-labelledby="pills-nv-tab">
                    <img src='http://127.0.0.1:8000/media/network_visualization/Visualization.png'/>
                </div>
                <div class="tab-pane nv-tabs fade" id="pills-i-d" role="tabpanel" aria-labelledby="pills-i-d-tab">
                    <div className="row">
                        {idaTop3}
                    </div>
                    <img src='http://127.0.0.1:8000/media/network_visualization/In_Degree_Centrality.png'/>
                </div>
                <div class="tab-pane nv-tabs fade row" id="pills-o-d" role="tabpanel" aria-labelledby="pills-o-d-tab">
                    <div className="row">
                        {odaTop3}
                    </div>
                    <img src='http://127.0.0.1:8000/media/network_visualization/Out_Degree_Centrality.png'/>
                </div>
                <div class="tab-pane nv-tabs fade row" id="pills-b" role="tabpanel" aria-labelledby="pills-b-tab">
                    <div className="row">
                        {baTop3}
                    </div>
                    <img src='http://127.0.0.1:8000/media/network_visualization/Betweenness_Centrality.png'/>
                </div>
                <div class="tab-pane nv-tabs fade row" id="pills-c" role="tabpanel" aria-labelledby="pills-c-tab">
                    <div className="row">
                        {caTop3}
                    </div>
                    <img src='http://127.0.0.1:8000/media/network_visualization/Closeness_Centrality.png'/>
                </div>
                <div class="tab-pane nv-tabs fade row" id="pills-e" role="tabpanel" aria-labelledby="pills-e-tab">
                    <div className="row">
                        {eaTop3}
                    </div>
                    <img src='http://127.0.0.1:8000/media/network_visualization/Eigenvector_Centrality.png'/>
                </div>
            </div></div>);
        let downloadButton = this.state.loading ? '' : (
            <ExcelFile filename="Network_Visualization_Data" element={<Button className="ui button float-right mx-3">Download Data</Button>}>
                <ExcelSheet data={this.state.data} name="Data">
                    <ExcelColumn label="User" value="user"/>
                    <ExcelColumn label="In Degree Centrality" value="ida"/>
                    <ExcelColumn label="Out Degree Centrality" value="oda"/>
                    <ExcelColumn label="Betweenness Centrality" value="ba"/>
                    <ExcelColumn label="Closeness Centrality" value="ca"/>
                    <ExcelColumn label="Eigenvector Centrality" value="ea"/>
                </ExcelSheet>
            </ExcelFile>
        )
        
        return (
        <Modal size='fullscreen' closeIcon trigger={<Button onClick={this.openModal}>Network Analysis</Button>}>
            <Modal.Header>Network Analysis
            {downloadButton}
            </Modal.Header>
            <Modal.Content>
            <Modal.Description>
                {modalData}
            </Modal.Description>
            </Modal.Content>
        </Modal>);
    }
}