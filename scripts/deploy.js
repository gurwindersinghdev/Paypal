const hre = require("hardhat");

async function main() {
  const Paypal = await hre.ethers.getContractFactory("Paypal");
  const paypal = await Paypal.deploy();

  await paypal.deployed();

  console.log("Paypal deployed to:", paypal.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
