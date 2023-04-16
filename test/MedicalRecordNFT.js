const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MedicalRecordNFT", function () {
  let contract;
  let patientWallet;
  let hospitalWallet;
  let tokenURI;

  beforeEach(async function () {
    [patient, hospital] = await ethers.getSigners();
    const MedicalRecordNFT = await ethers.getContractFactory(
      "MedicalRecordNFT",
      hospital
    );
    contract = await MedicalRecordNFT.deploy(hospital.address);

    patientWallet = patient.address;
    hospitalWallet = hospital.address;
    tokenURI = "ipfs://QmRfRuhQ8uX7pdZ5i";
  });
  describe("mintToken", () => {
    it("should mint a new NFT and transfer it to patient Wallet", async function () {
      await contract.connect(hospital).mintToken(patientWallet, tokenURI);

      const tokenId = 1;
      const owner = await contract.ownerOf(tokenId);
      const uri = await contract.tokenURI(tokenId);

      expect(owner).to.equal(patientWallet);
      expect(uri).to.equal(tokenURI);
    });

    it("should revert when non-hospital tries to mint NFT", async function () {
      const nonHospital = patient;
      await expect(
        contract.connect(nonHospital).mintToken(patientWallet, tokenURI)
      ).to.be.revertedWith("Only hospital can perform this action");
    });
  });

  describe("addHospitalRole", () => {
    it("should add a new hospital role", async function () {
      const newHospital = await ethers.Wallet.createRandom().address;
      await contract.connect(hospital).addHospitalRole(newHospital);
      const isHospital = await contract.isHospital(newHospital);
      expect(isHospital).to.be.true;
    });

    it("should revert when non-hospital tries to add hospital role", async () => {
      const nonHospital = patient;
      await expect(
        contract.connect(nonHospital).addHospitalRole(hospitalWallet)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should revert when hospital role is already added", async () => {
      await expect(
        contract.connect(hospital).addHospitalRole(hospitalWallet)
      ).to.be.revertedWith("Hospital role already added");
    });
  });

  describe("removeHospitalRole", () => {
    it("should remove an existing hospital role", async function () {
      // Add a new hospital role
      const newHospital = await ethers.Wallet.createRandom().address;
      await contract.connect(hospital).addHospitalRole(newHospital);

      // Check that hospitalWallet is now a hospital
      let isHospital = await contract.isHospital(newHospital);
      expect(isHospital).to.be.true;

      //   Remove the hospital role
      await contract.connect(hospital).removeHospitalRole(newHospital);

      // Check that hospitalWallet is no longer a hospital
      isHospital = await contract.isHospital(newHospital);
      expect(isHospital).to.be.false;
    });

    it("should revert when non-owner tries to remove hospital role", async function () {
      const nonOwner = patient;
      await expect(
        contract.connect(nonOwner).removeHospitalRole(hospitalWallet)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should revert when trying to remove a non-existing hospital role", async function () {
      // Try to remove a hospital that doesn't exist
      const newHospital = await ethers.Wallet.createRandom().address;
      await expect(
        contract.connect(hospital).removeHospitalRole(newHospital)
      ).to.be.revertedWith("Hospital role not found");
    });
  });
});
