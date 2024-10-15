import React, { useState } from "react";
import { supabase } from "../utils/supabase";
import { Link } from "react-router-dom";

const ScheduleSearchPage = () => {
  const [streetSearch, setStreetSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const onAdresChanged = async (e) => {
    const value = e.target.value;
    setStreetSearch(value);

    if (value.length > 3) {
      const { data, error } = await supabase
        .from("adresy")
        .select("adres, strefa")
        .ilike("adres", `%${value}%`);

      console.log(data);

      if (error) {
        console.error("Błąd podczas wyszukiwania:", error);
      } else {
        setSearchResults(data);
        setIsDropdownVisible(true);
      }
    } else {
      setSearchResults([]);
      setIsDropdownVisible(false);
    }
  };

  const onSelectAddress = (result) => {
    setStreetSearch(result.adres);
    setIsDropdownVisible(false);

    localStorage.setItem("savedAddress", result.adres);
    localStorage.setItem("savedZone", result.strefa);
    // alert(`Adres "${result.adres}" z strefą "${result.strefa}" został zapisany!`);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        textAlign: "center",
      }}
    >
      <h1>WYSZUKAJ ADRES</h1>
      <input
        id="ulica"
        type="text"
        value={streetSearch}
        onChange={onAdresChanged}
        autoComplete="off"
        style={{
          marginBottom: "20px",
          padding: "8px",
          width: "70%",
          maxWidth: "400px",
        }}
      />

      {isDropdownVisible && (
        <ul
          style={{
            listStyleType: "none",
            padding: 0,
            position: "absolute",
            border: "1px solid #ccc",
            width: "200px",
            zIndex: 10,
          }}
        >
          {searchResults.map((result, index) => (
            <li
              key={index}
              onClick={() => onSelectAddress(result)}
              style={{
                cursor: "pointer",
                padding: "8px",
                margin: "0",
                backgroundColor: "#f0f0f0",
                borderBottom: "1px solid #ccc",
                color: "#000",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#e0e0e0")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#f0f0f0")
              }
            >
              {result.adres}
            </li>
          ))}
        </ul>
      )}

      <Link
        style={{
          marginTop: "20px",
          width: "40%",
          maxWidth: "300px",
          padding: "10px",
          backgroundColor: "#ff9d00",
        }}
        className="menu-link"
        to="/schedule"
      >
        Szukaj
      </Link>
      <Link
        className="menu-link"
        style={{
          marginTop: "6px",
          width: "40%",
          maxWidth: "300px",
          padding: "10px",
        }}
        to="/"
      >
        Powrót
      </Link>
    </div>
  );
};

export default ScheduleSearchPage;
