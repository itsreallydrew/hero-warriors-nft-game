const CONTRACT_ADDRESS = '0xc0ef218C09411B4F288856BaC33422fd8dCAe944';

// Because I used a uint32 in the Character Attributes struct in my smart contract I didn't need to have the "toNumber()" function on the data being returned. If I was using a uint or uint256 then that function would have been needed

const transformCharacterData = (characterData) => {
  return {
    name: characterData.name,
    imageURI: characterData.imageURI,
    hp: characterData.hp,
    maxHp: characterData.maxHp,
    attackDamage: characterData.attackDamage
  }
};

export { CONTRACT_ADDRESS, transformCharacterData };