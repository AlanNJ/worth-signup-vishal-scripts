const dsteem = require('dsteem'); // Creates a suggested password
const SuggestPassword = () => {
  const array = new Uint32Array(10);
  window.crypto.getRandomValues(array);
  return 'P' + dsteem.PrivateKey.fromSeed(array).toString();
};

export default SuggestPassword;
