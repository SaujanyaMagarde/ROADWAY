import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import authReducer from "./Authslice.jsx"; 
import captainauthReducer from "./CaptainSlice.jsx";

// Separate persist configs for both reducers
const authPersistConfig = {
  key: "auth",
  storage,
};

const captainAuthPersistConfig = {
  key: "captainauth",
  storage,
};

// Apply persistReducer to each reducer separately
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedCaptainAuthReducer = persistReducer(captainAuthPersistConfig, captainauthReducer);

const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    captainauth: persistedCaptainAuthReducer,
  },
});

const persistor = persistStore(store);

const StoreProvider = ({ children }) => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      {children}
    </PersistGate>
  </Provider>
);

export { StoreProvider, store };
