import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PokemonList from './components/PokemonList';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Pokémon Explorer</h1>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<PokemonList />} />
          </Routes>
        </main>
        <footer>
          <p>Data from <a href="https://pokeapi.co" target="_blank" rel="noopener noreferrer">PokeAPI</a></p>
        </footer>
      </div>
    </Router>
  );
}

export default App;