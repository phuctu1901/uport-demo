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

//setup Credentials object with newly created application identity.
const credentials = new Credentials({
  appName: 'Login Example',
  did: 'did:ethr: 0x83089b6f98caff43377a681157d8c447e787a2e5',
  privateKey: 'b6ebe6ac659edae63346387b2907915d554635506f934cad8d565a92c1ad0e25'
})