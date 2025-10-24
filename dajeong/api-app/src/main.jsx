import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ShoppingProvider } from "./context/ShoppingProvider.jsx";

createRoot(document.getElementById("root")).render(
  <ShoppingProvider>
    <App />
  </ShoppingProvider>
);
