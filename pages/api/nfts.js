import { gql, GraphQLClient } from "graphql-request";
async function getNFTs() {
  const endpoint =
    "https://api.studio.thegraph.com/query/45500/medchain/v0.0.2";
  const graphQLClient = new GraphQLClient(endpoint);

  const query = gql`
    {
      nfts(
        where: { to: "0xb394ea65086b1547bc01168f636e475b7e1f4a9e" }
        orderBy: timestamp
        orderDirection: desc
      ) {
        id
        tokenId
        from
        to
        tokenURI
        timestamp
      }
    }
  `;

  const data = await graphQLClient.request(query);
  return data.nfts;
}
export default async function handler(req, res) {
  const nfts = await getNFTs();
  res.status(200).json(nfts);
}
