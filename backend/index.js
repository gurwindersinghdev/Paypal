const express = require("express");
const Moralis = require("moralis").default;
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = 3001;
const ABI = require("./abi.json");

app.use(cors());
app.use(express.json());

app.get("/getNameAndBalance", async (req, res) => {
  const { userAddress } = req.query;

  function convertArrayToObjects(arr) {
    const dataArray = arr.map((transaction, index) => ({
      key: (arr.length + 1 - index).toString(),
      type: transaction[0],
      amount: transaction[1],
      message: transaction[2],
      address: `${transaction[3].slice(0, 4)}...${transaction[3].slice(0, 4)}`,
      subject: transaction[4],
    }));

    return dataArray.reverse();
  }

  const response = await Moralis.EvmApi.utils.runContractFunction({
    chain: "0x1",
    address: "input your contract address",
    functionName: "getMyName",
    abi: ABI,
    params: { _user: userAddress },
  });

  const jsonResponseName = response.raw;

  const secResponse = await Moralis.EvmApi.balance.getNativeBalance({
    chain: "0x1",
    address: userAddress,
  });

  const jsonResponseBal = (secResponse.raw.balance / 1e18).toFixed(2);

  const thirResponse = await Moralis.EvmApi.token.getTokenPrice({
    address: "input contract address of USDT",
  });

  const jsonResponseDollars = (
    thirResponse.raw.usdPrice * jsonResponseBal
  ).toFixed(2);

  const fourResponse = await Moralis.EvmApi.utils.runContractFunction({
    chain: "0x1",
    address: "input your contract address",
    functionName: "getMyHistory",
    abi: ABI,
    params: { _user: userAddress },
  });

  const jsonResponseHistory = convertArrayToObjects(fourResponse.raw);

  const fiveResponse = await Moralis.EvmApi.utils.runContractFunction({
    chain: "0x1",
    address: "input your contract address",
    functionName: "getMyRequests",
    abi: ABI,
    params: { _user: userAddress },
  });

  const jsonResponseRequests = fiveResponse.raw;

  const jsonResponse = {
    name: jsonResponseName,
    balance: jsonResponseBal,
    dollars: jsonResponseDollars,
    history: fourResponse.raw,
    requests: jsonResponseRequests,
  };

  return res.status(200).json(jsonResponse);
});

Moralis.start({
  apiKey: process.env.MORALIS_KEY,
}).then(() => {
  app.listen(port, () => {
    console.log(`Listening for API Calls`);
  });
});
