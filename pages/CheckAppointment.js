import Quagga from "@ericblade/quagga2";
import { faHeartbeat } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
export default function CheckAppointment() {
  const router = useRouter();
  const [maphieu, setMaphieu] = useState("");
  const scannerRef = useRef();

  useEffect(() => {
    let shouldStopQuagga = false;

    const initQuagga = () => {
      Quagga?.init(
        {
          inputStream: {
            name: "LiveStream",
            type: "LiveStream",
            target: scannerRef.current,
            constraints: {
              facingMode: "environment", // Use the rear camera (change to "user" for front camera)
            },
          },
          decoder: {
            readers: ["ean_reader", "upc_reader", "code_128_reader"], // Supported barcode types
          },
        },
        (err) => {
          if (err) {
            console.error("Error initializing Quagga:", err);
            return;
          }
          Quagga.start();
        }
      );
      Quagga.onDetected(handleScan);

      return () => {
        shouldStopQuagga = true;
        Quagga.stop();
      };
    };

    initQuagga();
  }, []);
  const handleChange = (e) => {
    setMaphieu(e.target.value);
  };
  const handleScan = (data) => {
    if (data && data.codeResult && data.codeResult.code) {
      // Extract the barcode data you want to use (e.g., the code value)
      const barcodeData = data.codeResult.code;

      setMaphieu(barcodeData);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Access the maphieu value from the formData object

    if (maphieu) {
      router.push(`/AppointmentInformation/${maphieu}`);
    }
  };

  return (
    <div>
      <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a href="#" className="flex items-center">
            <div className="h-8 mr-1">
              <div className="">
                <div className="font-normal text-gray-500">
                  <FontAwesomeIcon
                    icon={faHeartbeat}
                    size="2x"
                    className="mr-2 text-blue-500"
                  />
                </div>
              </div>
            </div>
            <span className="self-center  text-2xl font-bold whitespace-nowrap dark:text-white">
              <span className="text-transparent bg-clip-text bg-gradient-to-bl  from-purple-600 to-blue-500 hover:bg-gradient-to-bl">
                Medchain
              </span>
            </span>
          </a>
          <div className="flex md:order-2">
            {/* <a
              type="button"
              href="/Hospital/LoginPage"
              target="_blank"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Hospital
            </a> */}
            <button
              data-collapse-toggle="navbar-sticky"
              type="button"
              className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="navbar-sticky"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          <div
            className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
            id="navbar-sticky"
          >
            <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <div
                  className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                  aria-current="page"
                >
                  <Link href="/">Trang chủ</Link>
                </div>
              </li>
              <li>
                <div className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">
                  <Link href="/Instruct">Hướng dẫn</Link>
                </div>
              </li>
              {/* <li>
                <a
                  href="#"
                  className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Đặt lịch khám
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Bệnh viện
                </a>
              </li> */}
            </ul>
          </div>
        </div>
      </nav>

      <div className="sm:container sm:mx-auto">
        <div
          style={{ height: "800px" }}
          className="mb-2 p-6 bg-white flex  items-center justify-center  font-medium  "
        >
          <div className="block w-96 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 ">
            <div className="flex items-start justify-center border-b rounded-t dark:border-gray-600">
              <h5 className="mb-3 text-xl uppercase font-bold tracking-tight text-gray-900 dark:text-white">
                Tra phiếu khám
              </h5>
            </div>
            <div style={{ height: "400px", width: "100%" }}>
              <div ref={scannerRef} style={{ width: "100%", height: "100%" }} />
            </div>

            {/* Display scanned barcode data */}
            {maphieu && (
              <div className="mb-2 p-6 bg-white flex items-center justify-center font-medium">
                <div
                  className="p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
                  role="alert"
                >
                  <span className="font-medium">Scan thành công</span>
                </div>
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label
                  htmlFor="maphieukham"
                  className="block mb-2 text-sm mt-2 font-medium text-gray-900 dark:text-white"
                >
                  Mã phiếu khám
                </label>
                <input
                  type="maphieukham"
                  id="maphieukham"
                  value={maphieu}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Scan barcode để lấy mã"
                  required
                />
              </div>

              <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Tra phiếu khám
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* <footer className="bg-white dark:bg-gray-900 fixed w-full bottom-0 left-0">
        <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <a
              href="https://flowbite.com/"
              className="flex items-center mb-4 sm:mb-0"
            >
              <img
                src="https://flowbite.com/docs/images/logo.svg"
                className="h-8 mr-3"
                alt="Flowbite Logo"
              />
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                Medchain
              </span>
            </a>
            <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
              <li>
                <a href="#" className="mr-4 hover:underline md:mr-6 ">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="mr-4 hover:underline md:mr-6">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="mr-4 hover:underline md:mr-6 ">
                  Licensing
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
          <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
            Medchain
          </span>
        </div>
      </footer> */}
    </div>
  );
}
