import React, { Component } from 'react';
import './App.css';
const web3 = require('web3')
const contract = require('@truffle/contract')
const MyContractJSON = require('../abis/CorporateLending.json')
const MyContract = contract(MyContractJSON)
MyContract.setProvider(window.web3.currentProvider)

class Main extends Component {

    constructor(props) {
        super(props)
        this.state = {
            address: null,
            status: null,
            risk: null,
            collateral: null,
            clientAddress: null,
            loanAmount: null,
        }
    }

    handleSubmit = (event) => {
        event.preventDefault()
        const contractAddress = this.contractAddress.value
        MyContract.at(contractAddress).then(instance => {
            this.setState({ address: instance.address })
            instance.getLoanStatus.call().then(val => this.setState({ status: val }))
            instance.getRisk.call().then(val => this.setState({ risk: val }))
            instance.getCollateral.call().then(val => this.setState({ collateral: "" + web3.utils.fromWei(val, 'ether') }))
            instance.getLoanAmount.call().then(val => this.setState({ loanAmount: "" + web3.utils.fromWei(val, 'ether') }))
            instance.getClientAddress.call().then(val => this.setState({ clientAddress: val }))
        }).catch(err => console.log("ERROR: ", err))
    }

    evaluateRisk = () => {
        MyContract.at(this.state.address).then(instance => {
            instance.evaluateRiskAndCollateral({ from: this.props.account })

            instance.getLoanStatus.call().then(val => this.setState({ status: val }))
            instance.getRisk.call().then(val => {
                this.setState({ risk: val })
            })
        })
            .then(this.handleSubmit).catch(err => console.log("ERROR", err))
    }

    drawdown = () => {
        MyContract.at(this.state.address).then(instance => {

            instance.getLoanAmount.call().then(val => {
                console.log("TOOOOOO:" + this.state.clientAddress)
                instance.drawdown({
                    to: this.state.clientAddress,
                    from: this.props.account,
                    gasLimit: "6721975",
                    value: "" + val,
                }).catch(err => console.log("ERROR", err))
            })

        }).catch(err => console.log("ERROR", err))
    }

    render() {
        return (
            <div id="content" >
                Enter Contract Address:
                <form onSubmit={this.handleSubmit}>

                    <input
                        id="contractAddress"
                        type="text"
                        ref={(input) => { this.contractAddress = input }}
                        className="form-control"
                        placeholder="0x....."
                        required />
                    <button type="submit" className="btn btn-primary">Search Contract</button>
                </form>
                <br></br>
                <div>
                    {this.state.status ?
                        <ul>
                            Contract Info:
                            <li>Address: {this.state.address}</li>
                            <li>Status: {this.state.status}</li>
                            <li>Risk: {this.state.risk}</li>
                            <li>Collateral: {this.state.collateral} ether</li>
                            <li>Loan amount: {this.state.loanAmount} ether</li>
                        </ul>
                        : " "
                    }
                </div>
                <button onClick={this.evaluateRisk} className="btn btn-primary">Evaluate Risk</button>
                <button onClick={this.drawdown} className="btn btn-primary">Drawdown</button>
            </div>
        );
    }

}

export default Main;
