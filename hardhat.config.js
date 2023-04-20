require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");

const ALCHEMY_API_KEY = "add your api key alchemy";

const PRIVATE_KEY = "add your private walley key";

module.exports = {
  // ...rest of your config...
  solidity: {
    compilers: [
      {
        version: "0.8.9",
      },
    ],
  },
  networks: {
    sepolia: {
      url: `add  your alchemy api key and url`,
      accounts: [PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: "add your api-key for verification on sepolia etherscan",
  },
};
