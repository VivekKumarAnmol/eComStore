import { Outlet, Route, Routes } from "react-router-dom";
import Navigation from "./pages/Auth/Navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserOrders from "./pages/UserOrders"; // Add this import

const App = () => {
  return (
    <>
      <ToastContainer />
      <Navigation />
      <main className="py-3">
        <Routes>
          {/* ...existing routes... */}
          <Route path="/user-orders" element={<UserOrders />} />
          {/* ...existing routes... */}
        </Routes>
        <Outlet />
      </main>
    </>
  );
};

export default App;
