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
  }
]);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider>
    <RouterProvider router={router} />
    </CartProvider>
  </StrictMode>,
)
