require('dotenv').config()
const express = require('express')
const braintree = require("braintree");
const cors = require('cors')

const app = express()
const port = 3000

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.MERCHANT_ID,
  publicKey: process.env.PUBLIC_KEY,
  privateKey: process.env.PRIVATE_KEY
});

app.use(cors({
  origin: '*'
}))
app.use(express.json())

app.get("/client_token", (req, res) => {
  gateway.clientToken.generate({}, (err, response) => {
    res.send(response.clientToken);
  });
});

app.post("/checkout", (req, res) => {
  const nonceFromTheClient = req.body.payment_method_nonce;
  const deviceDataFromTheClient = req.body.device_data;
  gateway.transaction.sale({
    amount: "10.00",
    paymentMethodNonce: nonceFromTheClient,
    deviceData: deviceDataFromTheClient,
    options: {
      submitForSettlement: true
    }
  }, (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(result);
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
