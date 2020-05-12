import React from 'react';
import './App.css';
// component imports //
import TopNavbar from "./components/navbars/TopNav"
import HomeScreenComponent from "./components/home_screen/HomeScreenComponent";
import MainNavSidebar from './components/navbars/MainNavSidebar';

const App: React.FC<{}> = (): JSX.Element => {
  return (
    <MainNavSidebar>
      <TopNavbar>

      </TopNavbar>
      <HomeScreenComponent title={"Home Screen"} />
    </MainNavSidebar>
  );
}

export default App;
