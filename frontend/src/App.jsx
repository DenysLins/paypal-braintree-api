import {useEffect, useState} from 'react';
import './App.css';
import axios from 'axios';
import BraintreeDropIn from './BraintreeDropIn.jsx';

const fruitsList = [
  {
    id: 1,
    name: 'Apple',
    price: 5,
  },
  {
    id: 2,
    name: 'Orange',
    price: 5,
  },
  {
    id: 3,
    name: 'Banana',
    price: 2,
  },
  {
    id: 4,
    name: 'Grapes',
    price: 10,
  },
  {
    id: 5,
    name: 'Mango',
    price: 5,
  },
];

function App() {
  const [clientToken, setClientToken] = useState(null);
  const [show, setShow] = useState(false);
  const [requestFailed, setRequestFailed] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [response, setResponse] = useState({});
  const [fruits, setFruits] = useState({
    Apple: {quantity: 0, price: 0},
    Orange: {quantity: 0, price: 0},
    Banana: {quantity: 0, price: 0},
    Grapes: {quantity: 0, price: 0},
    Mango: {quantity: 0, price: 0},
  });

  useEffect(() => {
    getClientToken();
  }, []);

  const getClientToken = async () => {
    try {
      const response = await axios.get('http://localhost:3000/client_token');
      const clientToken = response.data;
      setClientToken(clientToken);
      setRequestFailed(false);
    } catch (err) {
      console.error(err);
      setRequestFailed(true);
    }
  };

  const reset = async () => {
    setClientToken(null);
    setRequestFailed(false);
    await getClientToken();
  };

  const renderFruit = (id, name, price) => {
    return (
      <div key={id}>
        <div>Name: {name}</div>
        <div>
          Price: {price}
          {'$ each'}
        </div>
        <button onClick={() => addToCart(name, price)}>+</button>
        <button onClick={() => removeFromCart(name, price)}>-</button>
      </div>
    );
  };

  const addToCart = (name, price) => {
    setTotalPrice(totalPrice + price);
    setFruits(prevState => {
      prevState[name].quantity += 1;
      prevState[name].price += price;
      return prevState;
    });
  };

  const removeFromCart = (name, price) => {
    if (fruits[name].quantity) {
      setTotalPrice(totalPrice - price);
      setFruits(prevState => {
        prevState[name].quantity -= 1;
        prevState[name].price -= price;
        return prevState;
      });
    }
  };

  const renderCart = () => {
    const pharoots = Object.entries(fruitsList);
    const cart = pharoots.map(([key, value]) => {
      if (value.quantity) {
        return (
          <div>
            <div>
              {key} {': '} {value.quantity} {', Price: '}
              {value.price}
            </div>
          </div>
        );
      }
    });
    return (
      <div>
        {cart}
        <div>Total Price: {totalPrice}</div>
      </div>
    );
  };

  const onPaymentCompleted = async (response) => {
    setResponse(response);
    setShow(false)

  };

  const responseLoaded = Boolean(Object.keys(response).length);
  let responseMessage = '';
  if (Object.keys(response).length) {
    if (response.data.success) {
      responseMessage = `Your purchase has been successful. Charged ${response.data.transaction.amount}`;
    } else {
      return (
        <div>
          <button onClick={() => window.location.reload()}>{response.data.message} Reset</button>
        </div>
      );
    }
  }
  if (!clientToken && !requestFailed) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  } else if (requestFailed) {
    return (
      <div>
        <button onClick={() => reset}>Request Failed! Reset</button>
      </div>
    );
  } else {
    return (
      <div>
        <div>
          <h2>Buy Fruits Using Braintree</h2>
          {fruitsList.map(f => {
            return renderFruit(f.name, f.name, f.price);
          })}

          {renderCart()}
        </div>

        <button onClick={() => setShow(true)}> Purchase</button>

        <div>
          <BraintreeDropIn
            clientToken={clientToken}
            show={show}
            onPaymentCompleted={onPaymentCompleted}
            totalPrice={totalPrice}
          />
        </div>

        <div>
          <h3>{responseMessage}</h3>
        </div>
        {responseLoaded && <div>Transaction Id: {response.data.transaction.id}</div>}
        {responseLoaded && <div>Customer Id: {response.data.transaction.customer.id}</div>}
        {responseLoaded && <div>Price Charged: {response.data.transaction.amount}</div>}
      </div>
    );
  }
}

export default App;
