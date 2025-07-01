import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import DropIn from './DropIn.jsx';
import { Button } from 'antd';

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
  const [token, setToken] = useState(null);
  const [show, setShow] = useState(false);
  const [requestFailed, setRequestFailed] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [response, setResponse] = useState({});
  const [loadingDropIn, setLoadingDropIn] = useState(false);
  const [fruits, setFruits] = useState({
    Apple: { quantity: 0, price: 0 },
    Orange: { quantity: 0, price: 0 },
    Banana: { quantity: 0, price: 0 },
    Grapes: { quantity: 0, price: 0 },
    Mango: { quantity: 0, price: 0 },
  });

  useEffect(() => {
    getClientToken();
  }, []);

  const getClientToken = async () => {
    try {
      const response = await axios.get('http://localhost:3000/client_token');
      const token = response.data;
      setToken(token);
      setRequestFailed(false);
    } catch (err) {
      console.error(err);
      setRequestFailed(true);
    }
  };

  const reset = async () => {
    setToken(null);
    setRequestFailed(false);
    await getClientToken();
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

  const renderFruit = (id, name, price) => {
    return (
      <div key={id} className="fruit-container">
        <div>Name: {name}</div>
        <div>
          Price: {price}
          {'$ each'}
        </div>
        <div>
          <Button type="primary" className="button" onClick={() => addToCart(name, price)}>
            +
          </Button>
          <Button type="primary" className="button" onClick={() => removeFromCart(name, price)}>
            -
          </Button>
        </div>
      </div>
    );
  };

  const renderCart = () => {
    const fruits = Object.entries(fruitsList);
    const cart = fruits.map(([key, value]) => {
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
        <div className="total">Total Price: {totalPrice}$</div>
      </div>
    );
  };

  const onPaymentCompleted = async response => {
    setResponse(response);
    setShow(false);
  };

  const responseLoaded = Boolean(Object.keys(response).length);
  let responseMessage = '';
  if (Object.keys(response).length) {
    if (response.data.success) {
      responseMessage = `Your purchase has been successful.`;
    } else {
      return (
        <div>
          <Button type="primary" onClick={() => window.location.reload()}>
            {response.data.message} Reset
          </Button>
        </div>
      );
    }
  }
  if (!token && !requestFailed) {
    return (
      <div className="container">
        <h1>Loading...</h1>
      </div>
    );
  } else if (requestFailed) {
    return (
      <div className="container">
        <Button type="primary" onClick={() => reset}>
          Request Failed! Reset
        </Button>
      </div>
    );
  } else {
    return (
      <div className="container">
        <div className="main">
          <h2>Buy Fruits Using Braintree</h2>
          {fruitsList.map(f => {
            return renderFruit(f.name, f.name, f.price);
          })}

          {renderCart()}
        </div>

        <Button
          type="primary"
          disabled={totalPrice === 0 || loadingDropIn === true}
          className="button"
          onClick={() => (totalPrice ? setShow(true) : false)}
        >
          {' '}
          Purchase
        </Button>

        <div>
          <DropIn token={token} show={show} onPaymentCompleted={onPaymentCompleted} totalPrice={totalPrice} setLoadingDropIn={setLoadingDropIn}/>
        </div>

        <div>
          <h3>{responseMessage}</h3>
        </div>
        {responseLoaded && <div className="transaction">Transaction Id: {response.data.transaction.id}</div>}
        {responseLoaded && <div className="transaction">Customer Id: {response.data.transaction.customer.id}</div>}
        {responseLoaded && <div className="transaction">Price Charged: {response.data.transaction.amount}</div>}
      </div>
    );
  }
}

export default App;
