### Server Side Login Example using uPort Credential

Xây dựng giải pháp đăng nhập một cách đơn giản bằng cách sử dụng ứng dung uPort. Quy trình hoạt động như sau.

![Login schemas](./images/server-login.png)
Sơ đồ đăng nhập bằng uPort

In a minimal example, data is requested and a uPort client representing the ethereum identity approves the disclosure of the requested information. This is called a selective disclosure request and is the primary means by which to validate the credentials of a user.

After server-side business logic has been satisfied with the disclosed data, a user can be considered authenticated by virtue of the of verified credentials they disclosed.

The intention of this content is to provide a simple solution to bring familiarity to core concepts in uPort's ecosystem.

The following examples utilize the selective disclosure flow and request/response patterns to provide an example of how to use these concepts for a login scenario:


    Selective Disclosure flow
    Selective Disclosure Request
    Selective Disclosure Response

In addition to the above concepts and uport-credentials, also note the following requirements before starting this example:

    NodeJS
    Create a folder for the example and cd ./example && npm init
    Install dependencies npm install --save ngrok express did-jwt uport-transports uport-credentials

This content is best if followed by interacting with a node console.
```js
const { Resolver } =require('did-resolver')
const getResolver = require("ethr-did-resolver").getResolver;
const providerConfig = { rpcUrl: 'https://ropsten.infura.io/v3/be65a290f803479cbc77a0120fa51921' }

const credentials = new Credentials({
  appName: "Login Example",
  did: "did:ethr:0xfBEFa24A40C8D1a8582cE9aD4D9B960aba174BC7",
  privateKey:
    "38D3798C573046D8C549F7FF1EE809EE48B5EFFE7B6013F08386A8D9C380141E",
  resolver: new Resolver(getResolver(providerConfig))
});
console.log(credentials);
```

```js
```