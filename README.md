# PayPal Braintree API

A modern payment integration application that combines PayPal and Braintree payment processing capabilities, built with
React and Express.

## Technologies

### Frontend

- React
- Ant Design
- Braintree Web Drop-in
- Vite

### Backend

- Express
- Braintree SDK

## Prerequisites

- Node.js (LTS version)
- npm package manager
- Braintree/PayPal merchant account
- Valid API credentials from Braintree

## Installation

1. Clone the repository

```bash
git clone https://github.com/DenysLins/paypal-braintree-api.git
cd paypal-braintree-api
``` 

2. Install backend dependencies

```bash
cd backend
npm install
``` 

3. Install frontend dependencies

```bash
cd ../frontend
npm install
``` 

4. Configure environment variables:

Create `.env` file in the backend directory:

```
MERCHANT_ID=
PUBLIC_KEY=
PRIVATE_KEY=
``` 

## Development

### Starting the Backend Server

```bash
cd backend
npm run dev
``` 

The server will start on `http://localhost:3000`

### Starting the Frontend Development Server

```bash
cd frontend
npm run dev
``` 

The application will be available at `http://localhost:5173`

## Available Scripts

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint with fixes
- `npm run format`: Run prettier
- `npm run preview` - Preview production build

### Backend

- `npm run dev` - Start development server with Nodemon
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint with fixes
- `npm run format`: Run prettier

## Features

- PayPal payment integration
- Braintree Drop-in UI implementation
- Secure payment processing
- Modern React components with Ant Design

## API Endpoints

The backend provides the following endpoints:

- `GET /client_token` - Generate a client token
- `POST /checkout` - Process payment transaction

## Deployment

### Frontend

1. Build the production files:

```bash
cd frontend
npm run build
``` 

2. Deploy the contents of the `dist` directory to your web server

### Backend

1. Set up your production environment variables
2. Install dependencies using `npm install --production`
3. Start the server using `npm start`

