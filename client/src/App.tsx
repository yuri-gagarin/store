import React from 'react';
import './App.css';
// component imports //
import CombinedRoutes from './components/routes/CombinedRoutes';

const App: React.FC<{}> = (): JSX.Element => {
  return (
    <CombinedRoutes />
  );
}

export default App;
