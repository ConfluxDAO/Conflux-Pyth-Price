const hre = require("hardhat");

async function main() {
  const pythContractAddress = "0xDd24F84d36BF92C65F92307595335bdFab5Bbd21"; // Pyth contract address on Conflux eSpace Testnet

  const CFXPrice = await hre.ethers.getContractFactory("CFXPrice");
  const cfxPrice = await CFXPrice.deploy(pythContractAddress);

  await cfxPrice.waitForDeployment();

  console.log("CFXPrice deployed to:", await cfxPrice.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});