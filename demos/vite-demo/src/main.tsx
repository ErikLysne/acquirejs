import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import mockInit from "./api/mockInit";

async function bootstrap() {
  await mockInit();

  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

bootstrap();
