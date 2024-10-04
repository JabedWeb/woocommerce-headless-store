import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import Shop from './components/Shop'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import SingleProduct from './components/SingleProduct';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Shop/>,
  },
  {
    path: "/product/:id",
    element: <SingleProduct/>,
  }
]);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
