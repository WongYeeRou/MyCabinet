import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import PaymentReminders from "./pages/PaymentReminders";
import MyCollection from "./pages/MyCollection";
import Spending from "./pages/Spending";
import AddNewOrder from "./pages/AddNewOrder";
import AddCollectionItem from "./pages/AddCollectionItem";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/payment-reminders" element={<PaymentReminders />} />
        <Route path="/collection" element={<MyCollection />} />
        <Route path="/spending" element={<Spending />} />
        <Route path="/add-order" element={<AddNewOrder />} />
        <Route path="/add-collection" element={<AddCollectionItem />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App; 