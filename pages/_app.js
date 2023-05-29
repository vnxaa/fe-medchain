import "../styles/globals.css";
// import Footer from "./Common/Footer";
function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Component {...pageProps} />
      {/* <Footer /> */}
    </div>
  );
}

export default MyApp;
