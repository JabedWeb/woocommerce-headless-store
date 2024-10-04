import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SingleProduct from './components/SingleProduct';
import Shop from './components/Shop';
import './index.css'
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Shop />} />
        <Route path="/product/:id" element={<SingleProduct />} />
      </Routes>
    </Router>
  );
};

export default App;

