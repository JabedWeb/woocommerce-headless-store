import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Reviews from './components/reviews/reviews';
import { CartProvider } from './components/cart/CartContext';
import Checkout from './components/checkout/Checkout';
import Order from './components/order/Order';
import Customer from './components/customer/Customer';
import Home from './components/Home/Home';
import Shop from './components/shop/Shop';
import SingleProduct from './components/shop/SingleProduct';
import Landing from './components/landing/Landing';
import WooCommerceSetup from './components/isSetup/WooCommerceSetup';


const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    children: [
      {
        path: "/",
        element: <Landing />,
      },
      {
        path: "/shop",
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
      },
      {
        path: "/login",
        element: <WooCommerceSetup />,
      }
    ]
  }
]);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider>
    <RouterProvider router={router} />
    </CartProvider>
  </StrictMode>,
)
