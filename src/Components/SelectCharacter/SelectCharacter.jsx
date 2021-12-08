import React, { useEffect, useState} from 'react';
import './SelectCharacter.css';
import {ethers} from 'ethers';
import {CONTRACT_ADDRESS, transformCharacterData} from '../../constants';
import myDopeGame from '../../utils/MyDopeGame.json';

const SelectCharacter = ({setCharacterNFT}) => {
  const [characters, setCharacters] = useState([]);
  const [gameContract, setGameContract] = useState(null);
  const [mintingCharacter, setMintingCharacter] = useState(false)

  const mintCharacterNFT = (characterId) => async () => {
    try {
      if (gameContract) {
        console.log('Minting character in progress...')
        const mintTxn = await gameContract.mintCharacterNFT(characterId)
        await mintTxn.wait()
        console.log('mintTxn:', mintTxn)

        setMintingCharacter(false)
      }
    } catch (error) {
      console.warn('MintCharacter Error:', error)

      setMintingCharacter(false)
    }
  }

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

    const onCharacterMint = async (sender, tokenId, characterIndex) => {
      console.log(
        `CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId} characterIndex: ${characterIndex}`
      )

      if (gameContract) {
        const characterNFT = await gameContract.checkIfUserHasNFT();
        console.log('CharacterNFT:', characterNFT)
        setCharacterNFT(transformCharacterData(characterNFT))
      }
    }

    if (gameContract) {
      getCharacters()

      gameContract.on('CharacterNFTMinted', onCharacterMint)
    }

    return () => {
      if (gameContract) {
        gameContract.off('CharacterNFTMinted', onCharacterMint)
      }
    }
  }, [gameContract])


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
          onClick={mintCharacterNFT(index)}
        >{`Mint ${character.name}`}</button>
      </div>
    ))


  return (
    <div className='select-character-container'>
      <h2>Mint your hero. Choose wisely.</h2>
      {characters.length > 0 && (
        <div className='character-grid'>{renderCharacters()}</div>
      )}
      {mintingCharacter && (
        <div className="loading">
        <div className="indicator">
          <LoadingIndicator />
          <p>Minting In Progress...</p>
        </div>
        <img
          src="https://media0.giphy.com/media/iJSpqpVU7L2Ks/giphy.gif?cid=ecf05e4790c573a1c0934909541da0fea20c17df8e285154&rid=giphy.gif&ct=g"
          alt="Minting loading indicator"
        />
      </div>
      )

      }
    </div>  
  )
}

export default SelectCharacter;