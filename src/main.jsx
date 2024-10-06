import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import Shop from './components/Shop'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import SingleProduct from './components/SingleProduct';
import Reviews from './components/reviews/reviews';
import { CartProvider } from './components/cart/CartContext';
import Checkout from './components/checkout/Checkout';
import Order from './components/order/Order';
import Customer from './components/customer/Customer';
// import Checkout from './components/checkout/Checkout';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Shop/>,
  },
  {
    path: "/product/:id",
    element: <SingleProduct/>,
  },
  {
    path : "/reviews",
    element: <Reviews/>
  },
  {
    path: "/checkout",
    element: <Checkout/>,
  },
  {
    path: "/orders",
    element: <Order/>,
  },
  {
    path : "/customers",
    element: <Customer/>
  }
]);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider>
    <RouterProvider router={router} />
    </CartProvider>
  </StrictMode>,
)
