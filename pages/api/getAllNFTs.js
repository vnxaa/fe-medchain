import { gql, GraphQLClient } from "graphql-request";

async function getLatestNFTsByFromAddress() {
  const endpoint =
    "https://api.studio.thegraph.com/query/45500/medchain/v0.0.2";
  const graphQLClient = new GraphQLClient(endpoint);

  const query = gql`
    query GetLatestNFTs {
      nfts(orderBy: timestamp, orderDirection: desc) {
        tokenURI
        tokenId
        from
        to
        timestamp
      }
    }
  `;

  const data = await graphQLClient.request(query);

  // Create a map to store the latest NFT for each "from" address
  const latestNFTsByFromAddress = new Map();

  // Process the data to find the latest NFT for each "from" address
  for (const nft of data.nfts) {
    const { to, timestamp } = nft;
    if (latestNFTsByFromAddress.has(to)) {
      const currentLatestNFT = latestNFTsByFromAddress.get(to);
      if (timestamp > currentLatestNFT.timestamp) {
        latestNFTsByFromAddress.set(to, nft);
      }
    } else {
      latestNFTsByFromAddress.set(to, nft);
    }
  }

  // Convert the map values to an array to get the final result
  const latestNFTs = Array.from(latestNFTsByFromAddress.values());

  return latestNFTs;
}

export default async function handler(req, res) {
  const latestNFTs = await getLatestNFTsByFromAddress();
  res.status(200).json(latestNFTs);
}
