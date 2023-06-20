import { gql, GraphQLClient } from "graphql-request";

async function getNFTsByTokenId(address, tokenId) {
  const endpoint =
    "https://api.studio.thegraph.com/query/45500/medchain/v0.0.2";
  const graphQLClient = new GraphQLClient(endpoint);

  const query = gql`
    query GetNFTs($address: String!, $tokenId: String!) {
      nfts(
        where: { to: $address, tokenId: $tokenId }
        orderBy: timestamp
        orderDirection: desc
      ) {
        id
        tokenId
        from
        to
        tokenURI
        timestamp
        transactionHash
      }
    }
  `;

  const variables = { address, tokenId };
  const data = await graphQLClient.request(query, variables);
  return data.nfts;
}

export default async function handler(req, res) {
  const { address, tokenId } = req.query;
  const nfts = await getNFTsByTokenId(address, tokenId);
  res.status(200).json(nfts);
}
