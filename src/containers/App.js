import React, { Component, Fragment } from 'react';
import './App.css';
import Web3 from '../../node_modules/web3';
import Example from '../ethreum/build/contracts/Example.json';

class App extends Component {

  constructor() {
    super();
    this.state = {
      account: '',
      contract: null,
      hash: '',
      send: ''
    };
  };

  async checkingEthereum() {
    if (window.ethereum) {
      // setting the provider for web3.js inside Web3(provider); window.ethereum will look for Metamask
      // there are many ways to connect to Metamask https://web3js.readthedocs.io/en/v1.2.0/web3.html#id4
      window.web3 = new Web3(window.ethereum)
      // wait to enable Metamask for this site
      await window.ethereum.enable()
    } else {
        // no Metamask installed
        window.alert('Non-Ethereum browser detected. Consider installing MetaMask.')
    }
  }

  async loadInfo() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    const networkId = await web3.eth.net.getId();
    const networkData = Example.networks[networkId];
    if(networkData) {
      const abi = Example.abi
      const address = networkData.address //same as Example.networks[networkId].address;
      const contract = new web3.eth.Contract(abi, address)
      this.setState({ contract: contract});
      const hash = await contract.methods.get().call({ from: this.state.account} );
      this.setState({ hash: hash});
      console.log(this.state.hash);
    } else {
      window.alert("Smart contract not deployed to detected network");
    }
  }

  async componentDidMount() {
    await this.checkingEthereum();
    await this.loadInfo();
    setInterval(() => this.loadInfo(), 1000)
  }

  sendHash = (event) => {
    this.state.contract.methods.set(this.state.send).send({ from: this.state.account })
    .then((receipt, error) => {
      if(error) {
        alert("Error " + error);
      } 
      else {
        alert("Hash has been changed successfully.");
      }
    }) 
  }

  inputHash = (event) => {
    this.setState({send: event.target.value});
  }

  render() {
    return (
      <Fragment id='input'>
        <h1>Example Contract</h1>
        <p>Welcome to the example contract!</p>
        <p>Text: {this.state.hash}</p>
        <input type='text' onChange={this.inputHash}/>
        <button type='submit' onClick={this.sendHash}>Submit</button>
      </Fragment>
    )
  }
}

export default App;
