import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Armory from "./pages/Armory";
import Orders from "./pages/Orders";
import Track from "./pages/Track";
import AdminCommandCentre from "./pages/AdminCommandCentre";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/armory" element={<Armory />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/track" element={<Track />} />
      <Route path="/track/:orderId" element={<Track />} />
      <Route path="/admin" element={<AdminCommandCentre />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
