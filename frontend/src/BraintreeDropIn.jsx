import React, { useEffect, useState } from 'react';
import dropin from 'braintree-web-drop-in';
import { Button } from 'primereact/button';
import axios from "axios";

function BraintreeDropIn(props) {
  const { clientToken, show, onPaymentCompleted, totalPrice } = props;

  console.log(show, clientToken, show);

  const [braintreeInstance, setBraintreeInstance] = useState(undefined);

  useEffect(() => {
    if (show) {
      const initializeBraintree = () =>
        dropin.create(
          {
            authorization: clientToken,
            container: '#braintree-drop-in-div',
          },
          function (error, instance) {
            if (error) console.error(error);
            else setBraintreeInstance(instance);
          },
        );

      if (braintreeInstance) {
        braintreeInstance.teardown().then(() => {
          initializeBraintree();
        });
      } else {
        initializeBraintree();
      }
    }
  }, [show]);

  const buy = async (paymentMethodNonce) => {
    try {
      const response = await axios.post('http://localhost:3000/checkout', {
        paymentMethodNonce: paymentMethodNonce,
        price: totalPrice,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ display: `${show ? 'block' : 'none'}` }}>
      <div id={'braintree-drop-in-div'} />
      <Button
        className={'braintreePayButton'}
        type="primary"
        disabled={!braintreeInstance}
        onClick={() => {
          if (braintreeInstance) {
            braintreeInstance.requestPaymentMethod((error, payload) => {
              if (error) {
                console.error(error);
              } else {
                const paymentMethodNonce = payload.nonce;
                console.log('payment method nonce', payload.nonce);

                buy(paymentMethodNonce)

                alert(`Payment completed with nonce=${paymentMethodNonce}`);

                onPaymentCompleted();
              }
            });
          }
        }}
      >
        {'Pay'}
      </Button>
    </div>
  );
}

export default BraintreeDropIn;
