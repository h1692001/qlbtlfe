import rootReducer from "./store/reducers/rootReducer";
import { persistStore } from "redux-persist";
import thunk from "redux-thunk";
import { createStore, applyMiddleware } from "redux";


const reduxStore = () => {
  const store = createStore(
    rootReducer,
    applyMiddleware(thunk)
  );
  const persistor = persistStore(store);
  return { store, persistor };
};

export default reduxStore;
