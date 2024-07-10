const hre = require("hardhat");
const { EvmPriceServiceConnection } = require("@pythnetwork/pyth-evm-js");

async function main() {
  const CFXPrice = await hre.ethers.getContractFactory("CFXPrice");
  const cfxPrice = await CFXPrice.attach(
    "0xdeFf30D6949B7Bc2F5f90C063F8669B57e97A415"
  );

  const connection = new EvmPriceServiceConnection(
    "https://hermes.pyth.network" // 使用 Hermes 价格服务
  );

  const priceIds = [
    "0x8879170230c9603342f3837cf9a8e76c61791198fb1271bb2552c9af7b33c933", // CFX/USD price feed ID
  ];

  try {
    const priceUpdateData = await connection.getPriceFeedsUpdateData(priceIds);
    
    // 估算 gas 费用
    const gasEstimate = await cfxPrice.getCFXPrice.estimateGas(priceUpdateData, {
      value: hre.ethers.parseEther("0.01"), // 发送一些 CFX 来支付更新费用，根据需要调整
    });

    console.log("Estimated gas:", gasEstimate.toString());

    // 调用 getCFXPrice 函数
    const tx = await cfxPrice.getCFXPrice(priceUpdateData, {
      value: hre.ethers.parseEther("0.01"), // 发送一些 CFX 来支付更新费用，根据需要调整
    });

    console.log("Transaction sent:", tx.hash);

    // 等待交易确认
    const receipt = await tx.wait();

    console.log("Transaction confirmed in block:", receipt.blockNumber);

    // 直接从交易结果中获取返回值
    const [price, confidence] = await cfxPrice.getCFXPrice.staticCall(priceUpdateData, {
      value: hre.ethers.parseEther("0.01"),
    });

    console.log("CFX/USD Price:", hre.ethers.formatUnits(price, 8)); // Pyth prices are usually in 8 decimals
    console.log("Confidence:", hre.ethers.formatUnits(confidence, 8));

  } catch (error) {
    console.error("Error occurred:", error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});