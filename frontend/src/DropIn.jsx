import React, {useEffect, useState} from 'react';
import dropin from 'braintree-web-drop-in';
import axios from 'axios';
import {Button} from 'antd';

function DropIn(props) {
  const {token, totalPrice, show, onPaymentCompleted, setLoadingDropIn} = props;

  const [braintreeInstance, setBraintreeInstance] = useState(undefined);
  const [displayPayButton, setDisplayPayButton] = useState(false);

  useEffect(() => {
    if (show) {
      setLoadingDropIn(true)
      const initializeBraintree = () =>
        dropin.create(
          {
            authorization: token,
            container: '#braintree-drop-in-div',
          },
          function (error, instance) {
            if (error) console.error(error);
            else {
              setBraintreeInstance(instance);
              setDisplayPayButton(true);
              setLoadingDropIn(false)
            }
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

  const checkout = async nonce => {
    try {
      const response = await axios.post('http://localhost:3000/checkout', {
        paymentMethodNonce: nonce,
        price: totalPrice,
      });
      onPaymentCompleted(response);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    show && (
      <div className="dropin-container">
        <div id={'braintree-drop-in-div'}/>
        <Button
          style={displayPayButton ? {visibility: 'visible'} : {visibility: 'hidden'}}
          type="primary"
          disabled={!braintreeInstance}
          onClick={() => {
            if (braintreeInstance) {
              braintreeInstance.requestPaymentMethod((error, payload) => {
                if (error) {
                  console.error(error);
                } else {
                  const nonce = payload.nonce;
                  checkout(nonce);
                }
              });
            }
          }}
        >
          {'Pay'}
        </Button>
      </div>
    )
  );
}

export default DropIn;
