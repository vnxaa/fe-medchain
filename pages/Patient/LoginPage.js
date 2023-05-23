import axios from "axios";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import Web3Modal from "web3modal";

const LoginPage = () => {
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const message = "Login";
      const signedMessage = await signer.signMessage(message);
      const address = await signer.getAddress();

      const response = await axios.post(
        `${process.env.service}/api/auth/patient/login`,
        {
          walletAddress: address,
          message: message,
          sign: signedMessage,
        }
      );

      const token = response.data;
      // console.log(token);
      // Store the token in localStorage
      localStorage.setItem("token", token);

      // Redirect to the desired page after successful login
      router.push("/Patient/Dashboard"); // Replace "/patient" with your desired page
    } catch (error) {
      // Handle any errors
      console.error(error);
    }
  };

  return (
    <div>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginPage;
