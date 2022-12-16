import App from "./App";
import { createRoot } from "react-dom/client";

const $root = document.getElementById("root");
if ($root) {
  const root = createRoot($root);
  root.render(<App />);
} else {
  throw new Error("root element is not exist");
}
