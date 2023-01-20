import axios from "axios";
import { createContext, useEffect, useState } from "react";
import {
  AllPokemonsResult,
  PokemonsByTypeResult,
  PokeType,
} from "../interfaces/types";

interface PokemonContextProps {
  types: PokeType[];
  filterSelected: PokeType;
  pokemonsFiltered: string[] | null;
  changeTypeSelected: (type: PokeType) => void;
}

export const PokemonContext = createContext<PokemonContextProps>(
  {} as PokemonContextProps
);

const PokemonProvider = ({ children }: any) => {
  let allPokemonsUrl = "https://pokeapi.co/api/v2/pokemon?limit=10000&offset=0";

  const defaultState: PokeType = {
    name: "All",
    url: allPokemonsUrl,
  };

  const [allPokemons, setAllPokemons] = useState(null);
  const [pokemonsFiltered, setPokemonsFiltered] = useState(null);

  const [types, setTypes] = useState([defaultState]);
  const [filterSelected, setFilterSelected] = useState(defaultState);

  const changeTypeSelected = async (type: PokeType) => {
    setFilterSelected(type);

    const { data } = await axios.get(type?.url!);
    let pokemons = data?.pokemon?.map(
      ({ pokemon }: PokemonsByTypeResult) => pokemon?.url
    );

    type.name !== "All"
      ? setPokemonsFiltered(pokemons)
      : setPokemonsFiltered(allPokemons);
  };

  const getPokemonsType = async () => {
    // De aqui traemos todos los tipos disponibles
    const { data } = await axios.get("https://pokeapi.co/api/v2/type");
    setTypes([...types, ...data.results]);
  };

  const getAllPokemons = async () => {
    const { data } = await axios.get(allPokemonsUrl);

    let pokemons = data?.results?.map(
      (pokemon: AllPokemonsResult) => pokemon?.url
    );

    // Inicialmente los pokemon filtrados son todos
    setAllPokemons(pokemons);
    setPokemonsFiltered(pokemons);
  };

  useEffect(() => {
    getPokemonsType();
    getAllPokemons();
  }, []);

  //   console.log("These are all the types:", types);
  //   console.log("These are all the Pokemons:", allPokemons);

  return (
    <PokemonContext.Provider
      value={{ types, filterSelected, pokemonsFiltered, changeTypeSelected }}
    >
      {children}
    </PokemonContext.Provider>
  );
};

export default PokemonProvider;
