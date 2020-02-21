const express = require('express')
const bodyParser = require('body-parser')
const ngrok = require('ngrok')
const decodeJWT = require('did-jwt').decodeJWT
const { Credentials } = require('uport-credentials')
const transports = require('uport-transports').transport
const message = require('uport-transports').message.util

let endpoint = ''
const app = express();
app.use(bodyParser.json({ type: '*/*' }))

const qrcode = require('qrcode-terminal');

// Custom code
const registerEthrDidToResolver = require('ethr-did-resolver').getResolver
const HttpProvider = require('ethjs-provider-http')
let provider = new HttpProvider('https://rinkeby.infura.io/v3/be65a290f803479cbc77a0120fa51921')
let registryAddress = '0xdCa7EF03e98e0DC2B855bE647C39ABe984fcF21B'

registerEthrDidToResolver({
    provider,
    registry: registryAddress,
  })
  
//setup Credentials object with newly created application identity.
const credentials = new Credentials({
    appName: 'Login Example',
    did: 'did:ethr:0xfBEFa24A40C8D1a8582cE9aD4D9B960aba174BC7',
    privateKey: '38D3798C573046D8C549F7FF1EE809EE48B5EFFE7B6013F08386A8D9C380141E',
    resolver: registerEthrDidToResolver
})

console.log(credentials)
credentials.createDisclosureRequest({
    requested: ["name"],
    notifications: true,
  }).then(requestToken => {
    console.log(decodeJWT(requestToken))  //log request token to console
    const uri = message.paramsToQueryString(message.messageToURI(requestToken), {callback_type: 'post'})
    qrcode.generate(uri, {
      small: true
  });
  })