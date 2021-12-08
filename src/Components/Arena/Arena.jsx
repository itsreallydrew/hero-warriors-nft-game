import React, {useEffect, useState} from 'react';
import {ethers} from 'ethers';
import {CONTRACT_ADDRESS, transformCharacterData} from '../../constants';
import myDopeGame from '../../utils/MyDopeGame.json';
import './Arena.css';

const Arena = ({characterNFT}) => {
  const [gameContract, setGameContract] = useState(null)
  const [boss, setBoss] = useState(null)

  useEffect(() => {
    const {ethereum} = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum)
      const signer = provider.getSigner()
      const gameContract = new ethers.Contract(CONTRACT_ADDRESS, myDopeGame.abi, signer)

      setGameContract(gameContract)
    } else {
      console.log('Ethereum object not found')
    }
  }, [])

  useEffect(() => {
    const fetchBoss = async () => {
      const bossTxn = await gameContract.getBigBoss()
      console.log(bossTxn)
      setBoss(transformCharacterData(bossTxn))
    }

    if (gameContract) {
      fetchBoss()
    }
  }, [gameContract])

  return (
    <div className='arena-container'>
      <p>Boss</p>

      <p>Character</p>
    </div>
  )
 }

 export default Arena;