import React, { useEffect, useState} from 'react';
import './SelectCharacter.css';
import {ethers} from 'ethers';
import {CONTRACT_ADDRESS, transformCharacterData} from '../../constants';
import myDopeGame from '../../utils/MyDopeGame.json';

const SelectCharacter = ({setCharacterNFT}) => {
  const [characters, setCharacters] = useState([]);
  const [gameContract, setGameContract] = useState(null);

  useEffect(() => {
    const {ethereum} = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum)
      const signer = provider.getSigner()
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS, myDopeGame.abi, signer
      )

      setGameContract(gameContract)
    } else {
      console.log('Ethereum object not found')
    }
  }, [])

  useEffect(() => {
    const getCharacters = async () => {
      try {
        console.log('Getting contract characters to mint')

        const charactersTxn = await gameContract.getAllDefaultCharacters()
        console.log('charactersTxn:', charactersTxn)

        const allCharacters = charactersTxn.map((characterData) => 
        transformCharacterData(characterData)
        )

        setCharacters(allCharacters)
      } catch (error) {
        console.error('Something went wrong fetching the characters', error)
      }
    }

    if (gameContract) {
      getCharacters()
    }
  }, [gameContract])

  console.log(characters)

  // Render methods
  const renderCharacters = () => 
    characters.map((character, index) => (
      <div className='character-item' key={character.name}>
        <div className='name-container'>
          <p>{character.name}</p>
        </div>
        <img src={character.imageURI} alt={character.name} />
        <button
          type='button'
          className='character-mint-button'
          // onClick={mintCharacterNFTAction(index)}
        >{`Mint ${character.name}`}</button>
      </div>
    ))


  return (
    <div className='select-character-container'>
      <h2>Mint your hero. Choose wisely.</h2>
      {characters && (
        <div className='character-grid'>{renderCharacters()}</div>
      )}
    </div>  
  )
}

export default SelectCharacter;