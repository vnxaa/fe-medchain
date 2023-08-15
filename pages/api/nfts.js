import { gql, GraphQLClient } from "graphql-request";

async function getNFTs(address) {
  const endpoint =
    "https://api.studio.thegraph.com/query/45500/medchain/v0.0.2";
  const graphQLClient = new GraphQLClient(endpoint);

  const query = gql`
    query GetNFTs($address: String!) {
      nfts(where: { to: $address }, orderBy: timestamp, orderDirection: desc) {
        id
        tokenId
        from
        to
        tokenURI
        blockNumber
        timestamp
        transactionHash
      }
    }
  `;

  const variables = { address };
  const data = await graphQLClient.request(query, variables);
  return data.nfts;
}

export default async function handler(req, res) {
  const { address } = req.query;
  const nfts = await getNFTs(address);
  res.status(200).json(nfts);
}
