import { useRouter } from "next/router";
import React, { useEffect } from "react";
const Footer = () => {
  const router = useRouter();

  useEffect(() => {}, []);

  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <footer className="bg-white rounded-lg dark:bg-gray-900 m-4 ">
      <div
        className="w-full max-w-screen-xl mx-auto p-4 md:py-8 fixed  bottom-0"
        style={{ marginLeft: "300px" }}
      >
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <a className="flex items-center mb-4 sm:mb-0">
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
        </div>{" "}
        <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © 2023 Medchain . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
