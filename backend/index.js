require('dotenv').config()
const express = require('express')
const braintree = require('braintree')
const cors = require('cors')
const path = require('path')

const app = express()
const port = 3000

const DIST_DIR = path.join(__dirname, '../frontend/dist')
const HTML_FILE = path.join(DIST_DIR, 'index.html')

app.use(express.static(DIST_DIR))
app.use(express.urlencoded({ extended: true }))
app.use(
  cors({
    origin: '*'
  })
)
app.use(express.json())

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.MERCHANT_ID,
  publicKey: process.env.PUBLIC_KEY,
  privateKey: process.env.PRIVATE_KEY
})

app.get('/client_token', async (req, res) => {
  const { customer } = await gateway.customer.create({
    first_name: 'Jon',
    last_name: 'Doe',
    company: 'Braintree',
    email: 'Jon@example.com',
    phone: '312.555.1234',
    fax: '614.555.5678',
    website: 'www.example.com'
  })
  gateway.clientToken.generate(
    {
      customerId: customer.id
    },
    (err, response) => {
      res.send(response.clientToken)
    }
  )
})

app.post('/checkout', async (req, res) => {
  try {
    console.log(req.body)
    const nonceFromTheClient = req.body.payment_method_nonce
    const price = req.body.price
    const id = Math.floor(Math.random() * 1000) + 100
    const deviceDataFromTheClient = req.body.device_data
    gateway.transaction.sale(
      {
        amount: price,
        paymentMethodNonce: nonceFromTheClient,
        orderId: id,
        deviceData: deviceDataFromTheClient,
        options: {
          submitForSettlement: true,
          storeInVaultOnSuccess: true
        }
      },
      (err, result) => {
        if (err) {
          res.status(500).send(err)
        } else {
          res.send(result)
        }
      }
    )
  } catch (err) {
    console.log(err)
    res.send(err)
  }
})

app.get('/health', (req, res) => {
  res.send('Braintree backend is up and running')
})

app.get('/', (req, res) => {
  res.sendFile(HTML_FILE)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
