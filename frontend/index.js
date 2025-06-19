let button = document.querySelector('#submit-button');
let successMessage = document.querySelector('#success-message');

fetch('http://localhost:3000/client_token')
  .then(response => response.text())
  .then(clientToken => {
    braintree.dropin.create({
      authorization: clientToken, selector: '#dropin-container', dataCollector: true
    }, (err, instance) => {
      if (err) console.error(err);
      button.addEventListener('click', () => {
        instance.requestPaymentMethod((err, payload) => {
          fetch('http://localhost:3000/checkout', {
            method: 'POST', headers: {
              'Content-Type': 'application/json'
            }, body: JSON.stringify({
              payment_method_nonce: payload.nonce, device_data: payload.deviceData
            })
          }).then(response => {
            successMessage.innerHTML = 'Payment successful!';
          })
            .catch(error => {
              console.error('Error:', error);
              successMessage.innerHTML = 'Payment failed.';
            })
        });
      })
    });
  });
