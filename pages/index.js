import Head from "next/head";
import Link from "next/link";

export default function MedicalRecordHome() {
  return (
    <div className="bg-gray-100">
      <Head>
        <title>Medical Record Homepage</title>
        <meta name="description" content="Homepage for medical records" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Welcome to the NFT Medical Record Homepage
        </h1>
        <p className="text-gray-600 leading-loose mb-8">
          Here you can access and manage your medical records securely.
        </p>
        <Link href="/NFTList" passHref>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            View Medical Records
          </button>
        </Link>
        <Link href="/MedicalRecordForm" passHref>
          <button className="ml-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Medical Record Form
          </button>
        </Link>
        <Link href="/mintNFT" passHref>
          <button className="ml-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Mint NFT Medical Record
          </button>
        </Link>
      </main>
    </div>
  );
}