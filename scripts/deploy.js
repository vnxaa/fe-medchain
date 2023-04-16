// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  //0xD0667152C96f78777891E50F8C777139837C40Ff
  const MedicalRecordNFT = await hre.ethers.getContractFactory(
    "MedicalRecordNFT"
  );
  const medicalRecordNFT = await MedicalRecordNFT.deploy(deployer.address);

  await medicalRecordNFT.deployed();

  console.log(
    "MedicalRecordNFT contract deployed to address:",
    medicalRecordNFT.address
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
