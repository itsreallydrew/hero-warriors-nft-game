const CONTRACT_ADDRESS = '0x43B3E5A218B3F673B5bE77685Dc4De756Ac46625';

const transformCharacterData = (characterData) => {
  return {
    name: characterData.name,
    imageURI: characterData.imageURI,
    hp: characterData.hp.toNumber(),
    maxHp: characterData.maxHp.toNumber(),
    attackDamage: characterData.attackDamage.toNumber()
  }
};

export { CONTRACT_ADDRESS, transformCharacterData };