import React, { useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';
import SelectCharacter from './Components/SelectCharacter/SelectCharacter';
import {CONTRACT_ADDRESS, transformCharacterData} from './constants';
import myDopeGame from './utils/MyDopeGame.json';
import {ethers} from 'ethers';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {

const [currentAccount, setCurrentAccount] = useState(null)
const [characterNFT, setCharacterNFT] = useState(null)

const checkIfWalletIsConnected = async () => {
  try {

  const {ethereum} = window;

  if (!ethereum) {
    console.log('Make sure you have Metamask')
    return
  } else {
    console.log('We have the Ethereum object', ethereum)
  }

  const accounts = await ethereum.request({method: 'eth_accounts'})

  if (accounts !== 0) {
    const account = accounts[0]
    console.log('Found an authorized account:', account)
    setCurrentAccount(account)
  } else {
    console.log('No authorized account found')
  }
  } catch (error) {
    console.log(error)
  }
}

const connectWallet = async () => {
  try {
    const { ethereum } = window

    if (!ethereum) {
      alert('Get MetaMask!')
      return
    }

    const accounts = await ethereum.request({
      method: 'eth_requestAccounts'
    })

    console.log('Conected', accounts[0])
    setCurrentAccount(accounts[0])
  } catch (error) {
    console.log(error)
  }
}

// Render methods
const renderContent = () => {
  if (!currentAccount) {
    return (
          <div className="connect-wallet-container">
            <img
              src="https://64.media.tumblr.com/tumblr_mbia5vdmRd1r1mkubo1_500.gifv"
              alt="Monty Python Gif"
            />
            <button className='cta-button connect-wallet-button' onClick={connectWallet}>
            Connect Wallet to Get Started
            </button>
          </div>
    );
  } else if (currentAccount && !characterNFT) {
    return <SelectCharacter setCharacterNFT={setCharacterNFT} />;
  }
}

useEffect(() => {
  checkIfWalletIsConnected()
}, [])

useEffect(() => {

  const fetchNFTMetadata = async () => {
    console.log('Checking for Character NFT on address:', currentAccount);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const gameContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      myDopeGame.abi,
      signer
    );

    const txn = await gameContract.checkIfUserHasNFT();
    console.log(txn)
    if (txn.name) {
      console.log('User has character NFT')
      setCharacterNFT(transformCharacterData(txn))
    } else {
      console.log('No character NFT found')
    }
  }

  if (currentAccount) {
    console.log('Current Account:', currentAccount)
    fetchNFTMetadata()
  }
}, [currentAccount])

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">⚔️ Metaverse Slayer ⚔️</p>
          <p className="sub-text">Team up to protect the Metaverse!</p>
          {renderContent()}
        </div>
      </div>
      <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built with @${TWITTER_HANDLE}`}</a>
      </div>
    </div>
  );
};

export default App;
