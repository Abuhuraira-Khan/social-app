import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import AuthProvider,{UnKnowNotificationsContextProvider,IsDarkModeProvider} from "./components/context/Context.jsx";
import { SocketContextProvider } from "./components/context/SocketContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <IsDarkModeProvider>
    <AuthProvider>
      <SocketContextProvider>
      <UnKnowNotificationsContextProvider>
        <App />
      </UnKnowNotificationsContextProvider>
      </SocketContextProvider>
    </AuthProvider>
    </IsDarkModeProvider>
  </React.StrictMode>
);
