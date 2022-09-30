
const hre = require("hardhat");

async function main() {
  const BuyMeACoffle = await hre.ethers.getContractFactory("BuyMeACoffee");
  const buyMeACoffee = await BuyMeACoffle.deploy();
  await buyMeACoffee.deployed();
  console.log(
    "Buy Me A Coffle Contract has deployed to ",
    buyMeACoffee.address
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
