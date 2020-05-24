import React from 'react';
import './App.css';
// component imports //
import CombinedRoutes from './components/routes/CombinedRoutes';
import { StateProvider } from "./state/Store";

const App: React.FC<{}> = (): JSX.Element => {
  return (
    <StateProvider>
      <CombinedRoutes />
    </StateProvider>
  );
}

export default App;
