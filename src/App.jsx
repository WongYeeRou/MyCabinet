import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import ViewOrder from "./pages/ViewOrder";
import PaymentReminders from "./pages/PaymentReminders";
import MyCollection from "./pages/MyCollection";
import Spending from "./pages/Spending";
import AddNewOrder from "./pages/AddNewOrder";
import AddCollectionItem from "./pages/AddCollectionItem";
import ViewCollectionItem from "./pages/ViewCollectionItem";
import ManageCollectionItem from "./pages/ManageCollectionItem";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/orders/:id" element={<ProtectedRoute><ViewOrder /></ProtectedRoute>} />
        <Route path="/payment-reminders" element={<ProtectedRoute><PaymentReminders /></ProtectedRoute>} />
        <Route path="/collection" element={<ProtectedRoute><MyCollection /></ProtectedRoute>} />
        <Route path="/spending" element={<ProtectedRoute><Spending /></ProtectedRoute>} />
        <Route path="/add-order" element={<ProtectedRoute><AddNewOrder /></ProtectedRoute>} />
        <Route path="/add-collection" element={<ProtectedRoute><AddCollectionItem /></ProtectedRoute>} />
        <Route path="/collection/:id" element={<ProtectedRoute><ViewCollectionItem /></ProtectedRoute>} />
        <Route path="/manage-collection/:id" element={<ProtectedRoute><ManageCollectionItem /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;