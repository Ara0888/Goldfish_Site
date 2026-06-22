import { createContext, useState, useContext, useEffect } from 'react';
const FavoritesContext = createContext();
export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('favorites')) || []);
  useEffect(() => { localStorage.setItem('favorites', JSON.stringify(favorites)); }, [favorites]);

  const toggleFavorite = (product) => {
    setFavorites(prev => 
      prev.some(p => p.id === product.id) 
        ? prev.filter(p => p.id !== product.id) 
        : [...prev, product]
    );
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};
export const useFavorites = () => useContext(FavoritesContext);