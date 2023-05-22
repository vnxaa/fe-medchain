import "../styles/globals.css";
// import { SignerProvider } from "./state/useSigner";
function MyApp({ Component, pageProps }) {
  return (
    // <SignerProvider>
    <Component {...pageProps} />
    // </SignerProvider>
  );
}

export default MyApp;
