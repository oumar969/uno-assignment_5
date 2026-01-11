import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
//create root
//Render the app
// ApolloProvider Makes the GraphQL client available to all components, So we can call useQuery, useMutation anywhere 
// Provider Makes the Redux store available to all components
// Render the App component inside the Redux Provider and Apollo Provider
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "./model/apollo/client";

import { Provider } from "react-redux";
import { store } from "./stores/store";

import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <Provider store={store}>
        <App />
      </Provider>
    </ApolloProvider>
  </React.StrictMode>
);

reportWebVitals();
