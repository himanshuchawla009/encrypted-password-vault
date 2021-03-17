export default class ipfsConnector {
  static ipfsClient = null;

  // eslint-disable-next-line no-undef
  static IpfsHttpClient = window.IpfsHttpClient;

  static connect() {
    if (ipfsConnector.ipfsClient) {
      return ipfsConnector.ipfsClient;
    }
    ipfsConnector.ipfsClient = ipfsConnector.IpfsHttpClient({
      host: process.env.IPFS_HOSTNAME,
      port: process.env.IPFS_PORT,
      protocol: process.env.IPFS_PROTOCOL,
      headers: {
        authorization: `Bearer ${process.env.INFURA_IPFS_AUTH_TOKEN}`,
      },
    });
    return ipfsConnector.ipfsClient;
  }

  static async uploadToIpfs(data) {
    await ipfsConnector.ipfsClient.add({ content: data, options: { onlyHash: true } });
  }

  static async downloadFromIpfs(pathHash) {
    for await (const file of ipfsConnector.ipfsClient.get(pathHash)) {
      console.log(file.type, file.path);

      if (!file.content) {
        // eslint-disable-next-line no-continue
        continue;
      }

      const content = [];

      for await (const chunk of file.content) {
        content.push(chunk);
      }

      console.log(content);
    }
  }
}
