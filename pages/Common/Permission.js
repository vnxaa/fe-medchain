import { useRouter } from "next/router";
import React, { useEffect } from "react";

const Permission = () => {
  const router = useRouter();

  useEffect(() => {}, []);

  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <section className="text-gray-600 body-font">
      <div className="container mx-auto flex  py-24 md:flex-row flex-col items-center">
        <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 mb-10 md:mb-0">
          <img
            className="object-cover object-center rounded"
            alt="hero"
            src="https://dummyimage.com/720x600"
          />
        </div>
        <div className="lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center">
          <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
            Access Denied
          </h1>
          <p className="mb-8 leading-relaxed">
            You don't have permission to access on this site
          </p>
        </div>
      </div>
    </section>
  );
};

export default Permission;
