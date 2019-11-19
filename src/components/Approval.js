import React, { Component } from 'react';
const contract = require('@truffle/contract')
const MyContractJSON = require('../abis/CorporateLending.json')
const MyContract = contract(MyContractJSON)
MyContract.setProvider(window.web3.currentProvider)

class Approval extends Component {
    constructor() {
        super()
        this.state = {
            collateral: 0,
            riskClass: ""
        }
    }

    handleClick = () => {
        this.props.location
    }

    render() {
        <div>
            <form onSubmit={(event) => {
                const contractAddress = this.contractAddress.value
                MyContract.at(contractAddress).then(instance => {
                    const loan = instance
                    this.setState({ collateral: loan.getCollateral() })
                    this.setState({ riskClass: loan.getRisk() })
                })
            }}>
                <div className="form-group mr-sm-2">
                    ContractAddress
            <input
                        id="contractAddress"//needs to be a better one
                        type="text"
                        ref={(input) => { this.contractAddress = input }}
                        className="form-control"
                        placeholder="in thousands"
                        required />
                </div>
            </form>
            <div class="alert alert-warning">
                <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                After evaluated your financial situation, your risk level is classified as {this.state.riskClass}
            </div>

            <h1>Your collateral of value: {this.state.collateral} ether has been collected for collateral</h1>
            <button onClick={this.handleClick}>Ok!</button>
        </div>
    }
}