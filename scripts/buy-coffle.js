// add hre no {}
const hre = require("hardhat");


async function getBalance(address){
    const balanceBigInt = await hre.waffle.provider.getBalance(address);
    return hre.ethers.utils.formatEther(balanceBigInt)
}

async function printBalances(addresses){
    let idx = 0;
    for(const address of addresses){
        console.log(`Address ${idx} balance is `, await getBalance(address));
        idx++;
    }
}


async function printMemos(memos){
    for(const memo of memos){
        const timestamp = memo.timestamp;
        const tipper = memo.name;
        const tipperAddress = memo.from;
        const message = memo.message;
        console.log(`At ${timestamp} , ${tipper}, ( ${tipperAddress} said ${message} ) `)
    }
}



async function main() {
  const [owner, tipper, tipper2, tipper3] = await hre.ethers.getSigners();
  const BuyMeACoffle = await hre.ethers.getContractFactory("BuyMeACoffee");
  const buyMeACoffee = await BuyMeACoffle.deploy();
  await buyMeACoffee.deployed();
  console.log(
    "Buy Me A Coffle Contract has deployed to ",
    buyMeACoffee.address
  );

  const addresses = [owner.address, tipper.address, buyMeACoffee.address];
  console.log(" =========  start =========");
  await printBalances(addresses)

  // start buy coffle 
  const tip = {value: hre.ethers.utils.parseEther("1")}
  await buyMeACoffee.connect(tipper).buyCoffee("Carolina", 'You are the best', tip);
  await buyMeACoffee.connect(tipper2).buyCoffee("Vitto", "Amazing teacher", tip);
  await buyMeACoffee.connect(tipper3).buyCoffee("Kay", "I love my Proof of Knowledge", tip);
  console.log("== bought coffee ==");
  await printBalances(addresses);

  await buyMeACoffee.connect(owner).withdrawTips();
  console.log("== withdrawTips ==");
  await printBalances(addresses);

    // Check out the memos.
  console.log("== memos ==");
  const memos = await buyMeACoffee.getMemos();
  await printMemos(memos)

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
