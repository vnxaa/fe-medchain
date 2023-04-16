import { Web3Provider } from "@ethersproject/providers";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import Web3Modal from "web3modal";

const SignerContext = createContext({});
const useSigner = () => useContext(SignerContext);

const SignerProvider = ({ children }) => {
  const [signer, setSigner] = useState();
  const [address, setAddress] = useState();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const checkMetaMaskInstalled = async () => {
      const isMetaMaskInstalled = typeof window.ethereum !== "undefined";
      if (!isMetaMaskInstalled) {
        const installMetaMask = window.confirm(
          "Please install MetaMask to use this app"
        );
        if (installMetaMask) {
          window.open("https://metamask.io/download.html", "_blank");
        }
        router.push("/");
      }
    };
    checkMetaMaskInstalled();

    const web3modal = new Web3Modal();
    if (web3modal.cachedProvider) connectWallet();
    if (window.ethereum) window.ethereum.on("accountsChanged", connectWallet);
  }, []);

  const connectWallet = async () => {
    setLoading(true);
    try {
      const web3modal = new Web3Modal({ cacheProvider: true });
      const instance = await web3modal.connect();
      const provider = new Web3Provider(instance);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setSigner(signer);
      setAddress(address);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  const contextValue = { signer, address, loading, connectWallet };

  return (
    <SignerContext.Provider value={contextValue}>
      {children}
    </SignerContext.Provider>
  );
};

export { useSigner, SignerProvider };
