import React, { Component } from 'react';
import Web3 from 'web3'
import './App.css';
import Navbar from './Navbar'
import Main from './Main'
import BankMain from './BankMain'


class App extends Component {

    async componentWillMount() {
        await this.loadWeb3()
        await this.loadBlockchainData()
    }

    async loadWeb3() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
        }
        else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider)
        }
        else {
            window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
    }

    // createContract = (account) => {
    //     const web3 = new Web3("http://localhost:8545")
    //     const provider = new Web3.providers.HttpProvider("http://localhost:8545")

    //     const MyContract = contract(MyContractJSON)
    //     MyContract.setProvider(provider)

    //     web3.eth.getAccounts().then(accounts => {
    //         MyContract.new({ from: account }).then(instance => {
    //             console.log('contract created! :)')
    //         }).catch(err => {
    //             console.log('error', err)
    //         });
    //     })
    // }
    async loadBlockchainData() {
        const web3 = window.web3
        // Load account
        const accounts = await web3.eth.getAccounts()
        this.setState({ account: accounts[0] })

        new Web3("http://localhost:8545").eth.getAccounts().then(accounts => {
            this.setState({ isBank: accounts[2] === this.state.account })
        })
    }

    constructor(props) {
        super(props)
        this.state = {
            account: '',
            loading: false,
            isBank: false,
        }
    }

    render() {
        return (
            <div>
                <Navbar account={this.state.account} />
                <div className="container-fluid mt-5">


                    <main role="main" className="col-lg-12 d-flex">
                        {this.state.isBank ?
                            <BankMain account={this.state.account} />
                            :<Main account={this.state.account} />
                        }
                    </main>


                </div>
            </div>
        );
    }
}

export default App;