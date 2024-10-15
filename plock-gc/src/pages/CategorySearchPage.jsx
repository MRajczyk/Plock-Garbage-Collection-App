import React, { useState } from "react";
import { debounce } from "lodash";
import { Link } from "react-router-dom";
import "../styles/CategorySearchPage.css";
import axios from "axios";

const CategorySearchPage = () => {
  const [search, setSearch] = useState("");
  const [options, setOptions] = useState([]);
  const [searchResult, setSearchResult] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // Przechowywanie obrazu
  const [visionResponse, setVisionResponse] = useState(null); // Wynik Google Vision
  const [translatedDescription, setTranslatedDescription] = useState(null); // Tłumaczenie opisu
  const [geminiQuestion, setGeminiQuestion] = useState(""); // Zmienna na pytanie do Gemini
  const [geminiAnswer, setGeminiAnswer] = useState(null); // Zmienna na odpowiedź z Gemini

  const fetchOptions = async (criteria) => {
    try {
      const formData = new URLSearchParams();
      formData.append("lng", "pl");
      formData.append("communityId", "108");
      formData.append("name", criteria);

      const res = await fetch("/api/v1/rubbish/v1/findRubbish", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      const data = await res.json();
      setOptions(
        data.map((item) => ({
          id: item.id,
          name: item.name,
        }))
      );
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  };

  const debouncedSearch = debounce(async (criteria) => {
    if (criteria.length >= 3) {
      await fetchOptions(criteria);
    } else {
      setOptions([]);
    }
  }, 300);

  const handleChange = (event) => {
    const newSearch = event.target.value;
    setSearch(newSearch);
    if (newSearch.length < 3) {
      debouncedSearch.cancel();
      setOptions([]);
      return;
    }
    debouncedSearch(newSearch);
  };

  const handleOptionClick = (option) => {
    setSearch(option.name);
    setOptions([]);
  };

  const handleSearchClick = async (criteria) => {
    try {
      setSearchResult(false);
      const formData = new URLSearchParams();
      formData.append("lng", "pl");
      formData.append("communityId", "108");
      formData.append("name", criteria);

      const res = await fetch("/api/v1/rubbish/v1/findRubbish", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      const data = await res.json();
      const result = data.at(0);
      setSearchResult(result);
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  };

  const mapIdsToTrashColor = (id) => {
    if (id.includes("6587")) {
      return {
        category: "Papier",
        color: "Niebieski",
        hex: "#0000FF",
      };
    } else if (id.includes("6586")) {
      return {
        category: "Plastik i Metal",
        color: "Żółty",
        hex: "#EFCB00",
      };
    } else if (id.includes("6588")) {
      return {
        category: "Szkło",
        color: "Zielony",
        hex: "#008000",
      };
    } else if (id.includes("6589")) {
      return {
        category: "BIO",
        color: "Brązowy",
        hex: "#964b00",
      };
    } else if (id.includes("6591")) {
      return {
        category: "Opony",
        color: "Szary",
        hex: "#474545",
      };
    } else if (id.includes("6590")) {
      return {
        category: "Gabaryty",
        color: "Czerwony",
        hex: "#FF0000",
      };
    } else
      return {
        category: "Zmieszane",
        color: "Czarny",
        hex: "#000000",
      };
  };

  // Funkcja do obsługi wyboru obrazka
  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  // Funkcja do wysyłania obrazka do backendu
  const handleImageSubmit = async () => {
    if (!selectedImage) {
      alert("Proszę wybrać obrazek");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      // Wysyłamy obrazek na backend (Node.js)
      const response = await axios.post(
        // lokalnie, w przeglądarce
        // "http://localhost:5000/api/upload",
        // na komputerze MRajczyk
        process.env.REACT_APP_API_URL + "/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Ustawiamy odpowiedź z Google Vision
      setVisionResponse(response.data);

      // Tłumaczenie pierwszego wyniku na polski
      const firstAnnotation = response.data[0].description;
      await translateDescription(firstAnnotation);
    } catch (error) {
      console.error("Błąd podczas wysyłania obrazu:", error);
    }
  };

  // Funkcja do tłumaczenia opisu na polski
  const translateDescription = async (description) => {
    try {
      const response = await axios.post(
        // lokalnie, w przeglądarce
        // "http://localhost:5000/translate",
        // na komputerze MRajczyk
        process.env.REACT_APP_API_URL + "/translate",
        {
          text: description,
          target: "pl",
        }
      );

      // setTranslatedDescription(response.data.translatedText);
      setSearch(response.data.translatedText);
      handleSearchClick(response.data.translatedText);
    } catch (error) {
      console.error("Błąd podczas tłumaczenia:", error);
    }
  };

  // Funkcja do zadawania pytania do Gemini API
  const handleGeminiQuestionSubmit = async () => {
    if (!geminiQuestion) {
      alert("Proszę wpisać pytanie");
      return;
    }

    try {
      const response = await axios.post(
        // "http://localhost:5000/api/gemini", // Upewnij się, że endpoint jest poprawny
        process.env.REACT_APP_API_URL + "/api/gemini",
        {
          input: geminiQuestion,
        }
      );
      setGeminiAnswer(response.data); // Zapisz odpowiedź z Gemini API
    } catch (error) {
      console.error("Błąd podczas zadawania pytania do Gemini API:", error);
    }
  };

  return (
    <div className="container">
      <div className="container" style={{ height: "fit-content" }}>
        <div className="image-container">
          <img
            style={{ objectFit: "contain", marginTop: "50px" }}
            src="/wyszukaj.png"
            alt="wyszukaj"
          />
        </div>
      </div>
      <p style={{ marginTop: "5%" }}>
        Wyszukaj odpad po <b>nazwie...</b>
      </p>
      <input
        id="smiecio-search"
        type="text"
        className="options-input"
        value={search}
        onChange={handleChange}
        placeholder={"Wpisz nazwę odpadu"}
        style={{ marginTop: "5%", marginBottom: "4px" }}
      />
      <div className="options-list">
        {options.map((option, index) => {
          return (
            <div
              key={index}
              className="option-item"
              onClick={() => handleOptionClick(option)}
            >
              {option.name}
            </div>
          );
        })}
      </div>
      <button
        className="menu-link"
        style={{ boxSizing: "border-box", width: "70%", padding: "12px" }}
        onClick={() => handleSearchClick(search)}
      >
        Szukaj
      </button>

      <p style={{ marginTop: "5%" }}>
        ...lub znajdź po <b>zdjęciu:</b>
      </p>
      <div
        style={{
          marginTop: "5%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button className="category-button" onClick={handleImageSubmit}>
          Prześlij obrazek do analizy
        </button>
      </div>

      {searchResult && (
        <>
          <p style={{ marginTop: "10px", fontSize: "1.5em" }}>
            Kategoria <b>{mapIdsToTrashColor(searchResult.ids).category}</b>
          </p>
          <p style={{ marginBottom: "8px" }}>
            Kolor{" "}
            <span
              style={{
                color: mapIdsToTrashColor(searchResult.ids).hex,
                fontWeight: 600,
              }}
            >
              {mapIdsToTrashColor(searchResult.ids).color}
            </span>
          </p>
          <svg
            fill={mapIdsToTrashColor(searchResult.ids).hex}
            version="1.1"
            id="Capa_1"
            width="100px"
            height="100px"
            viewBox="0 0 408.483 408.483"
            style={{
              border: "2px solid" + mapIdsToTrashColor(searchResult.ids).hex,
              padding: "16px",
              borderRadius: "10px",
            }}
          >
            <g>
              <g>
                <path
                  d="M87.748,388.784c0.461,11.01,9.521,19.699,20.539,19.699h191.911c11.018,0,20.078-8.689,20.539-19.699l13.705-289.316
        H74.043L87.748,388.784z M247.655,171.329c0-4.61,3.738-8.349,8.35-8.349h13.355c4.609,0,8.35,3.738,8.35,8.349v165.293
        c0,4.611-3.738,8.349-8.35,8.349h-13.355c-4.61,0-8.35-3.736-8.35-8.349V171.329z M189.216,171.329
        c0-4.61,3.738-8.349,8.349-8.349h13.355c4.609,0,8.349,3.738,8.349,8.349v165.293c0,4.611-3.737,8.349-8.349,8.349h-13.355
        c-4.61,0-8.349-3.736-8.349-8.349V171.329L189.216,171.329z M130.775,171.329c0-4.61,3.738-8.349,8.349-8.349h13.356
        c4.61,0,8.349,3.738,8.349,8.349v165.293c0,4.611-3.738,8.349-8.349,8.349h-13.356c-4.61,0-8.349-3.736-8.349-8.349V171.329z"
                />
                <path
                  d="M343.567,21.043h-88.535V4.305c0-2.377-1.927-4.305-4.305-4.305h-92.971c-2.377,0-4.304,1.928-4.304,4.305v16.737H64.916
        c-7.125,0-12.9,5.776-12.9,12.901V74.47h304.451V33.944C356.467,26.819,350.692,21.043,343.567,21.043z"
                />
              </g>
            </g>
          </svg>
        </>
      )}

      <div
        style={{
          marginTop: "30px",
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <p style={{ textAlign: "center", marginBottom: "8px" }}>
          Nie jesteś przekonany do uzyskanej odpowiedzi? Zapytaj{" "}
          <b>sztuczną inteligencję!</b>
        </p>
        <input
          type="text"
          value={geminiQuestion}
          onChange={(e) => setGeminiQuestion(e.target.value)}
          placeholder="Wpisz pytanie..."
          style={{ width: "100%", marginBottom: "10px" }}
        />
        <button
          className="category-button"
          style={{ width: "230px" }}
          onClick={handleGeminiQuestionSubmit}
        >
          Wyślij pytanie
        </button>
        {geminiAnswer && (
          <div style={{ marginTop: "20px" }}>
            <h4>Odpowiedź SI:</h4>
            <p>{geminiAnswer}</p>
          </div>
        )}
      </div>

      <Link
        className="menu-link"
        style={{ boxSizing: "border-box", marginTop: "30px" }}
        to="/"
      >
        Powrót
      </Link>
    </div>
  );
};

export default CategorySearchPage;
