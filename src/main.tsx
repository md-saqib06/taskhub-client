import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/Index";
import { QueryProvider } from "./providers/QueryProvider";

import "./index.css";

document.documentElement.classList.add("dark");

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <QueryProvider>
      <RouterProvider router={router} />
    </QueryProvider>
  </React.StrictMode>
);