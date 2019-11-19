import React, { Component } from 'react';
import './App.css';
import { writeFileSync } from 'fs';
const contract = require('@truffle/contract')
const MyContractJSON = require('../abis/CorporateLending.json')
const Web3 = require("web3")
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
      loanAmount: null,
    }
  }

  handleSearch = (event) => {
    event.preventDefault()
    const contractAddress = this.contractAddress.value
    MyContract.at(contractAddress).then(instance => {
      this.setState({ address: instance.address })
      instance.getLoanStatus.call().then(val => this.setState({ status: val }))
      instance.getRisk.call().then(val => this.setState({ risk: val }))
      instance.getCollateral.call().then(val => this.setState({ collateral: "" + Web3.utils.fromWei(val, 'ether')  }))
      instance.getLoanAmount.call().then(val => this.setState({ loanAmount: "" + Web3.utils.fromWei(val, 'ether')  }))
    }).catch(err => console.log("ERROR: ", err))
  }

  createContract = (account, loanAmount, maturity, earnings, capital) => {
    const web3 = new Web3("http://localhost:8545")
    web3.eth.getAccounts().then(accounts => {
      //accounts[2] is the lender/bank's account
      console.log(accounts, "----------------------------------------")
      this.createContractInner(accounts[2], account, loanAmount, maturity, earnings, capital)
    })
  }

  handleSubmit = (event) => {
    event.preventDefault()
    const earnings = this.earnings.value
    const capital = this.capital.value
    // const loanAmount = window.web3.utils.toWei(this.loanAmount.value.toString(), 'Ether')
    const loanAmount = this.loanAmount.value
    const maturity = this.maturity.value
    this.createContract(this.props.account, loanAmount, maturity, earnings, capital)
  }


  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h3>Application</h3>
            <form onSubmit={this.handleSubmit}>
              <div className="form-group mr-sm-2">
                Company Earnings
            <input
                  id="earnings"
                  type="text"
                  ref={(input) => { this.earnings = input }}
                  className="form-control"
                  placeholder="in thousands"
                  required />
              </div>
              <div className="form-group mr-sm-2">
                Capital Amount
            <input
                  id="capital"
                  type="text"
                  ref={(input) => { this.capital = input }}
                  className="form-control"
                  placeholder="Capital"
                  required />
              </div>
              <div className="form-group mr-sm-2">
                Loan Amount
            <input
                  id="loanAmount"
                  type="text"
                  ref={(input) => { this.loanAmount = input }}
                  className="form-control"
                  placeholder="Loan Amount"
                  required />
              </div>
              <div className="form-group mr-sm-2">
                Maturity
            <input
                  id="maturity"
                  type="text"
                  ref={(input) => { this.maturity = input }}
                  className="form-control"
                  placeholder="maturity"
                  required />
              </div>
              <button type="submit" className="btn btn-primary">Submit Application</button>
            </form>
          </div >

          <div className="col-md-6">
            Search Previous Contracts:
              <form onSubmit={this.handleSearch}>

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
          </div >

        </div >
      </div>

    );
  }

  createContractInner(bankaccount, account, loanAmount, maturity, earnings, capital) {
    const MyContract = contract(MyContractJSON)
    MyContract.setProvider(window.web3.currentProvider)

    //uses random for now
    const credit = this.genCredit()
    console.log('bankaccount: ' + bankaccount)
    console.log('account' + account)
    console.log('loanAmount' + loanAmount)
    console.log('maturity' + maturity)
    console.log('earnings' + earnings)
    console.log('credit' + credit)
    console.log('capital' + capital)

    MyContract.new(bankaccount, account, loanAmount, maturity, earnings, credit, capital, { from: account }).then(instance => {
      console.log('contract created! at ' + instance.address)
    }).catch(err => {
      console.log('error', err)
    })
  }

  genCredit() {
    //random from ABCD
    return ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)]
  }
}

export default Main;
