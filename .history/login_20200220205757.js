const express = require("express");
const bodyParser = require("body-parser");
const ngrok = require("ngrok");
const decodeJWT = require("did-jwt").decodeJWT;
const { Credentials } = require("uport-credentials");
const transports = require("uport-transports").transport;
const message = require("uport-transports").message.util;

let endpoint = "";
const app = express();
app.use(bodyParser.json({ type: "*/*" }));

const qrcode = require("qrcode-terminal");

// Custom code
const { Resolver } =require('did-resolver')
const getResolver = require("ethr-did-resolver").getResolver;
const providerConfig = { rpcUrl: 'https://ropsten.infura.io/v3/be65a290f803479cbc77a0120fa51921' }

// const HttpProvider = require("ethjs-provider-http");
// let provider = new HttpProvider(
//   "https://ropsten.infura.io/v3/be65a290f803479cbc77a0120fa51921"
// );
// let registryAddress = "0xdCa7EF03e98e0DC2B855bE647C39ABe984fcF21B";

// registerEthrDidToResolver({
//   provider,
//   registry: registryAddress
// });

//setup Credentials object with newly created application identity.
const credentials = new Credentials({
  appName: "Login Example",
  did: "did:ethr:0xfBEFa24A40C8D1a8582cE9aD4D9B960aba174BC7",
  privateKey:
    "38D3798C573046D8C549F7FF1EE809EE48B5EFFE7B6013F08386A8D9C380141E",
  resolver: new Resolver(getResolver(providerConfig))
});
// const credentials = new Credentials('MTA-Survey-System', {
//     // network: "ropsten",
//     privateKey: "c6253e6f69a649f354a05a4dad3d19702b5ed84e098a483a02a78dc87f933538",
//     resolver: new Resolver(getResolver(providerConfig))

//   })
console.log(credentials);
app.get('/', (req, res) => {
    credentials.createDisclosureRequest({
      requested: ["name"],
      notifications: true,
      callbackUrl: endpoint + '/callback'
    }).then(requestToken => {
      console.log(decodeJWT(requestToken))  //log request token to console
      const uri = message.paramsToQueryString(message.messageToURI(requestToken), {callback_type: 'post'})
      qrcode.generate(uri, {
        small: true
    });
      const qr =  transports.ui.getImageDataURI(uri)
      res.send(`<div><img src="${qr}"/></div>`)
    })
  })

// app.post("/callback", (req, res) => {
// console.log(res)
//   const jwt = req.body.access_token;
//   console.log(jwt);
//   credentials
//     .authenticateDisclosureResponse(jwt)
//     .then(credentials => {
//       console.log(credentials);
//     res.send(`<div><img Hello "${credentials.name}"/></div>`)

//       // Validate the information and apply authorization logic
//     })
//     .catch(err => {
//       console.error("Lỗi tại đây")
//     //   console.log(err);

//     });
// });

app.post('/callback', (req, res) => {
  const jwt = req.body.access_token
  console.log(jwt)
  credentials.authenticateDisclosureResponse(jwt).then(creds => {
    // take this time to perform custom authorization steps... then,
    // set up a push transport with the provided 
    // push token and public encryption key (boxPub)
    const push = transports.push.send(creds.pushToken, creds.boxPub)

    credentials.createVerification({
      sub: creds.did,
      exp: Math.floor(new Date().getTime() / 1000) + 30 * 24 * 60 * 60,
      claim: {'Identity' : {'Last Seen' : `${new Date()}`}}
      // Note, the above is a complex (nested) claim. 
      // Also supported are simple claims:  claim: {'Key' : 'Value'}
    }).then(attestation => {
      console.log(`Encoded JWT sent to user: ${attestation}`)
      console.log(`Decodeded JWT sent to user: ${JSON.stringify(decodeJWT(attestation))}`)
      return push(attestation)  // *push* the notification to the user's uPort mobile app.
    }).then(res => {
      console.log(res)
      console.log('Push notification sent and should be recieved any moment...')
      console.log('Accept the push notification in the uPort mobile application')
      ngrok.disconnect()
    })
  })
})


// run the app server and tunneling service
const server = app.listen(8088, () => {
  ngrok.connect(8088).then(ngrokUrl => {
    endpoint = ngrokUrl
    console.log(`Verification Service running, open at ${endpoint}`)
  })
})

// run the app server and tunneling service
// const server = app.listen(8088, () => {
//   ngrok.connect(8088).then(ngrokUrl => {
//     endpoint = ngrokUrl;
//     console.log(`Login Service running, open at ${endpoint}`);
//   });
// });
