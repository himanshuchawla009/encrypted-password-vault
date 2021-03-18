export default class ipfsConnector {
  static ipfsClient = null;

  static connect() {
    if (ipfsConnector.ipfsClient) {
      return ipfsConnector.ipfsClient;
    }
    // eslint-disable-next-line no-undef
    ipfsConnector.ipfsClient = window.IpfsHttpClient({
      host: process.env.IPFS_HOSTNAME,
      port: process.env.IPFS_PORT,
      protocol: "https",
      headers: {
        authorization: `Bearer ${process.env.INFURA_IPFS_AUTH_TOKEN}`,
      },
    });
    return ipfsConnector.ipfsClient;
  }

  static async uploadToIpfs(data) {
    const hash = await ipfsConnector.ipfsClient.add({ content: data, options: { onlyHash: true } });
    return hash;
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
