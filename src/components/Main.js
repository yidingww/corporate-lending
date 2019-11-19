import React, { Component } from 'react';
const contract = require('@truffle/contract')
const MyContractJSON = require('../abis/MetaCoin.json')
const Web3 = require("web3")

class Main extends Component {

  createContract = (account) => {
    
    const provider = new Web3.providers.HttpProvider("http://localhost:8545")

    const MyContract = contract(MyContractJSON)
    MyContract.setProvider(provider)

    MyContract.new({ from: account }).then(instance => {
      console.log('contract created! :)')
    }).catch(err => {
      console.log('error', err)
    })
  }

  render() {
    return (
      <div id="content">
        <h1>Application</h1>
        <form onSubmit={(event) => {
          event.preventDefault()
          const earnings = this.earnings.value
          const capital = this.capital.value
          const loanAmount = window.web3.utils.toWei(this.loanAmount.value.toString(), 'Ether')
          this.props.createContract()
        }}>
          <div className="form-group mr-sm-2">
            <input
              id="earnings"
              type="text"
              ref={(input) => { this.earnings = input }}
              className="form-control"
              placeholder="Earnings"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="capital"
              type="text"
              ref={(input) => { this.capital = input }}
              className="form-control"
              placeholder="Capital"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="loanAmount"
              type="text"
              ref={(input) => { this.loanAmount = input }}
              className="form-control"
              placeholder="Loan Amount"
              required />
          </div>
          <button type="submit" className="btn btn-primary" onClick={this.createContract()}>Submit Application</button>
        </form>
        {/* <p>&nbsp;</p>
        <h2>Buy Product</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Price</th>
              <th scope="col">Owner</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody id="productList">
            { this.props.products.map((product, key) => {
              return(
                <tr key={key}>
                  <th scope="row">{product.id.toString()}</th>
                  <td>{product.name}</td>
                  <td>{window.web3.utils.fromWei(product.price.toString(), 'Ether')} Eth</td>
                  <td>{product.owner}</td>
                  <td>
                    { !product.purchased
                      ? <button
                          name={product.id}
                          value={product.price}
                          onClick={(event) => {
                            this.props.purchaseProduct(event.target.name, event.target.value)
                          }}
                        >
                          Buy
                        </button>
                      : null
                    }
                    </td>
                </tr>
              )
            })}
          </tbody>
        </table> */}
      </div>
    );
  }
}

export default Main;
