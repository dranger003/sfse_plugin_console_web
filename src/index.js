import { createRoot } from "react-dom/client";
import { ColorModeScript } from "@chakra-ui/react";
import { App } from "./App";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <>
    <ColorModeScript />
    <App />
  </>
);
