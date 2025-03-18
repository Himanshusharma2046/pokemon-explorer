import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PokemonCard from './PokemonCard';
import SearchBar from './SearchBar';
import './PokemonList.css';

const PokemonList = () => {
  const [pokemonData, setPokemonData] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=100');
        
        // Fetch detailed data for each Pokemon
        const results = response.data.results;
        const detailedData = await Promise.all(
          results.map(async (pokemon) => {
            const detailResponse = await axios.get(pokemon.url);
            return {
              id: detailResponse.data.id,
              name: detailResponse.data.name,
              image: detailResponse.data.sprites.other['official-artwork'].front_default || 
                     detailResponse.data.sprites.front_default,
              types: detailResponse.data.types.map(type => type.type.name)
            };
          })
        );
        
        setPokemonData(detailedData);
        setFilteredPokemon(detailedData);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch Pokémon data');
        setLoading(false);
        console.error('Error fetching data:', err);
      }
    };

    fetchPokemon();
  }, []);

  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setFilteredPokemon(pokemonData);
      return;
    }
    
    const filtered = pokemonData.filter(pokemon => 
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pokemon.id.toString() === searchTerm ||
      pokemon.types.some(type => type.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    setFilteredPokemon(filtered);
  };

  if (loading) return <div className="loading">Loading Pokémon...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="pokemon-container">
      <SearchBar onSearch={handleSearch} />
      
      {filteredPokemon.length === 0 ? (
        <div className="no-results">No Pokémon found. Try a different search.</div>
      ) : (
        <div className="pokemon-grid">
          {filteredPokemon.map(pokemon => (
            <PokemonCard key={pokemon.id} pokemon={pokemon} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PokemonList;