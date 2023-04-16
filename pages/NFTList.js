import { faHeartbeat } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

export default function NFTList() {
  const [nfts, setNFTs] = useState([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 4;
  const itemsPerRow = 2;

  useEffect(() => {
    fetch("/api/nfts")
      .then((res) => res.json())
      .then((data) => setNFTs(data));
  }, []);

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setPage((prevPage) => prevPage - 1);
  };

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNFTs = nfts.slice(startIndex, endIndex);

  const rows = currentNFTs.reduce((rows, nft, index) => {
    if (index % itemsPerRow === 0) {
      rows.push([nft]);
    } else {
      rows[rows.length - 1].push(nft);
    }
    return rows;
  }, []);

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">My Medical Records</h1>
      {rows.map((row, index) => (
        <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {row.map((nft) => (
            <div
              key={nft.id}
              className="bg-white shadow-md rounded-md p-4 mb-4"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FontAwesomeIcon
                    icon={faHeartbeat}
                    className="mr-2 text-red-500"
                  />
                </div>
                <div className="ml-4">
                  <p className="text-gray-500">
                    Created:{" "}
                    {new Date(nft.timestamp * 1000).toLocaleDateString()} at{" "}
                    {new Date(nft.timestamp * 1000).toLocaleTimeString()}
                  </p>
                </div>
                <div className="ml-auto">
                  <button
                    onClick={() => window.open(nft.tokenURI)}
                    className="bg-blue-500 text-white py-2 ml-2 px-4 rounded-full hover:bg-blue-600"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
      <div className="flex mt-4">
        <button
          onClick={handlePrevPage}
          className={`${
            page === 1 ? "opacity-50 cursor-default" : ""
          } bg-gray-200 py-2 px-4 mr-2 rounded-lg`}
          disabled={page === 1}
        >
          Previous
        </button>
        <button
          onClick={handleNextPage}
          className={`${
            currentNFTs.length < itemsPerPage ? "opacity-50 cursor-default" : ""
          } bg-blue-500 hover:bg-blue-600 py-2 px-4 text-white rounded-lg`}
          disabled={currentNFTs.length < itemsPerPage}
        >
          Next
        </button>
      </div>
    </div>
  );
}
