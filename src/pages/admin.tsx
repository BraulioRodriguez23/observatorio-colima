// src/App.jsx
import React from "react";
import Login from "../components/login";
import Hero from '../components/Hero';
import Header from '../components/header';

function App() {
  return (
    <div>
      <Hero/>
      <Header/>
      <Login />
    </div>
  );
}

export default App;