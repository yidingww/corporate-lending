import React, { Component } from 'react';
import Web3 from 'web3'
import './App.css';
import Navbar from './Navbar'
import Main from './Main'


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
        const networkId = await web3.eth.net.getId()
        // const networkData = Marketplace.networks[networkId]
        // if (networkData) {
        //     const marketplace = web3.eth.Contract(Marketplace.abi, networkData.address)
        //     this.setState({ marketplace })
        //     const productCount = await marketplace.methods.productCount().call()
        //     this.setState({ productCount })
        //     // Load products
        //     for (var i = 1; i <= productCount; i++) {
        //         const product = await marketplace.methods.products(i).call()
        //         this.setState({
        //             products: [...this.state.products, product]
        //         })
        //     }
        //     this.setState({ loading: false })
        // } else {
        //     window.alert('Marketplace contract not deployed to detected network.')
        // }
    }

    constructor(props) {
        super(props)
        this.state = {
            account: '',
            loading: false
        }
    }

    render() {
        return (
            <div>
                <Navbar account={this.state.account} />
                <div className="container-fluid mt-5">
                    <div className="row">
                        <main role="main" className="col-lg-12 d-flex">
                            {this.state.loading
                                ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
                                : <Main 
                                    account={this.state.account}
                                    createContract={this.createContract}/>
                            }
                            {/* <button onClick={this.createContract(this.state.account)}>Create Contract</button> */}
                        </main>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;