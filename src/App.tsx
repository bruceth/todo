import React from 'react';
import { nav, NavView, start } from 'tonva';
import logo from './logo.svg';
import './App.css';
import { CApp } from './CApp';
import { appConfig } from './tonvaApp';

nav.setSettings(appConfig);

const App: React.FC = () => {
    const onLogined = async () => {
        await start(CApp, appConfig);
    }
    return <NavView onLogined={onLogined} />;
}

export default App;
