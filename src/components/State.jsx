import axios from "axios";
import { useCallback } from "react";
import { useEffect } from "react";
import { useMemo } from "react";
import { useState } from "react";
import styles from "./StateSearch.module.css";

const StateSearch = () => {
  // State variables to hold data and user selections
  const [countries, setCountries] = useState([]); // Stores list of countries
  const [states, setStates] = useState([]); // Stores list of states
  const [cities, setCities] = useState([]); // Stores list of cities
  const [selectedCountry, setSelectedCountry] = useState(""); // Stores the selected country
  const [selectedState, setSelectedState] = useState(""); // Stores the selected state
  const [selectedCity, setSelectedCity] = useState(""); // Stores the selected city

  // Fetching the Countries
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://crio-location-selector.onrender.com/countries"
        ); // API Endpoint to fetch the countries
        setCountries(response.data); // Updating countries state with fetched data
      } catch (error) {
        console.error("Error infetching countries:", error);
      }
    };

    fetchData(); // Invoking the fetchData function when component mounts
  }, []); // Empty dependency array means it runs only once when component mounts

  // Fetching the States based on selected country
  useEffect(() => {
    const fetchStates = async () => {
      if (selectedCountry) {
        // Only fetch the states if a country is selected
        try {
          const response = await axios.get(
            `https://crio-location-selector.onrender.com/country=${selectedCountry}/states`
          ); // API Endpoint to fetch states for selected country
          setStates(response.data); // Updating states state with fetched data
          setSelectedState(""); // Resetting selected state
          setCities([]); // Resetting  cities when country changes
          setSelectedCity(""); // Resetting selected city
        } catch (error) {
          console.error("Error in fetching data:", error);
        }
      }
    };
    fetchStates(); // Invoking the fetchStates function when selectedCountry changes
  }, [selectedCountry]); // Dependency array ensures it runs whenever selectedCountry changes

  // Fetching the Cities based on selected country and state
  useEffect(() => {
    const fetchCities = async () => {
      if (selectedCountry && selectedState) {
        // Only fetch cities if both country and state are selected
        try {
          const response = await axios.get(
            `https://crio-location-selector.onrender.com/country=${selectedCountry}/states=${selectedState}/cities`
          ); // API Endpoint to fetch cities for the selected country and state
          setCities(response.data); // Updating cities state with fetch data
          setSelectedCity(""); // Resetting selected city
        } catch (error) {
          console.log("Error in fetching data:", error);
        }
      }
    };
    fetchCities(); // Invoking the fetchCities function when selectedCountry or selectedState changes
  }, [selectedCountry, selectedState]); // Dependency array ensures it runs whenever selectedCountry or selectedState chaneges

  // Memoizing the state variables
  const memoizedCountries = useMemo(() => countries, [countries]);
  const memoizedStates = useMemo(() => states, [states]);
  const memoizedCities = useMemo(() => cities, [cities]);

  // Following are the event handlers to update selected country, state, and city
  const handleCountryChange = useCallback((e) => {
    setSelectedCountry(e.target.value); // Updating selectedCountry state with the selected value
  }, []);

  const handleStateChange = useCallback((e) => {
    setSelectedState(e.target.value); // Updating selectedState state with the selected value
  }, []);

  const handleCityChange = useCallback((e) => {
    setSelectedCity(e.target.value); // Updating selectedCity state with the selected value
  }, []);

  return (
    <div className={styles.citySelector}>
      <h1>Select Location</h1>
      <div className={styles.dropdowns}>
        {/* Dropdown for selecting country */}
        <select
          value={selectedCountry}
          onChange={handleCountryChange}
          className={styles.dropdown}
        >
          <option value="" disabled>
            Select Country
          </option>
          {memoizedCountries.map((country) => {
            return (
              <option key={country} value={country}>
                {country}
              </option>
            );
          })}
        </select>

        {/* Dropdown for selecting state */}
        <select
          value={selectedState}
          onChange={handleStateChange}
          className={styles.dropdown}
          disabled={!selectedCountry}
        >
          <option value="" disabled>
            Select State
          </option>
          {memoizedStates.map((state) => {
            return (
              <option key={state} value={state}>
                {state}
              </option>
            );
          })}
        </select>

        {/* Dropdown for selecting city */}
        <select
          value={selectedCity}
          onChange={handleCityChange}
          className={styles.dropdown}
          disabled={!selectedState}
        >
          <option value="" disabled>
            Select City
          </option>
          {memoizedCities.map((city) => {
            return (
              <option key={city} value={city}>
                {city}
              </option>
            );
          })}
        </select>
      </div>

      {/* Displaying the seleceted location */}
      {selectedCity && (
        <h2 className={styles.result}>
          You selected <span className={styles.highlight}>{selectedCity}</span>,
          <span className={styles.fade}>
            {" "}
            {selectedState}, {selectedCountry}
          </span>
        </h2>
      )}
    </div>
  );
};

export default StateSearch;
