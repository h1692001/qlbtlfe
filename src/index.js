import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import reduxStore from "./redux";
import { PersistGate } from "redux-persist/integration/react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Provider } from "react-redux";

const root = ReactDOM.createRoot(document.getElementById("root"));
const { store, persistor } = reduxStore();

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <DndProvider backend={HTML5Backend}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </DndProvider>
    </PersistGate>
  </Provider>
);
