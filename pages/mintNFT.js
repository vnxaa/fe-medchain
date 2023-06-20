import axios from "axios";
import { Contract, ethers } from "ethers";
import { useState } from "react";
import Web3Modal from "web3modal";
import MedicalRecordNFT from "../artifacts/contracts/MedicalRecordNFT.sol/MedicalRecordNFT.json";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [ipfsHash, setIpfsHash] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [patientWallet, setPatientWallet] = useState("");
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      // Upload the file to NFT storage
      const response = await axios.post(
        "https://api.nft.storage/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${process.env.NFT_STORAGE_KEY}`,
          },
        }
      );

      const ipfsHash = response.data.value.cid;
      // // Check if the IPFS hash already exists
      // const getResponse = await axios.get(
      //   `https://api.nft.storage/${ipfsHash}`,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${process.env.NFT_STORAGE_KEY}`,
      //     },
      //   }
      // );
      // console.log(ipfsHash);
      // if (getResponse.status === 200) {
      //   setError("NFT Medical Record already exists");
      //   setUploading(false);
      //   return;
      // }
      const tokenUrl = `https://${ipfsHash}.ipfs.nftstorage.link/${file.name}`;
      console.log(tokenUrl);
      // Create a provider and signer using Web3Modal
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      // Create an instance of the contract
      const contract = new Contract(
        process.env.NFT_ADDRESS,
        MedicalRecordNFT.abi,
        signer
      );
      // const patientWallet = "0xb394ea65086b1547bc01168f636e475b7e1f4a9e";
      // Mint the token with the patient's wallet address and the token URI
      await contract.mintToken(patientWallet, tokenUrl);

      setIpfsHash(ipfsHash);
      setUploading(false);
    } catch (error) {
      setError(error.message);
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">
        Upload NFT Medical Record to Patient's Wallet
      </h1>
      <div className="flex flex-col space-y-4">
        <label
          htmlFor="file-upload"
          className="cursor-pointer border border-gray-400 rounded-md py-2 px-4 text-gray-700 font-medium hover:bg-gray-100"
        >
          {file ? file.name : "Choose a file"}
        </label>
        <input
          id="file-upload"
          type="file"
          onChange={handleFileChange}
          className="sr-only"
        />
        <input
          type="text"
          placeholder="Address Patient's Wallet"
          value={patientWallet}
          onChange={(e) => setPatientWallet(e.target.value)}
          className="border border-gray-400 rounded-md py-2 px-4 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={handleUpload}
          disabled={!file}
          className={`${
            !file
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          } text-white font-medium py-2 px-4 rounded-md`}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
        {ipfsHash && (
          <p className="text-green-500 font-medium">IPFS hash: {ipfsHash}</p>
        )}
        {error && <p className="text-red-500 font-medium">Error: {error}</p>}
      </div>
    </div>
  );
}
