import React from "react";
import "../styles/HomePage.css";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="background">
      <div className="main-container">
        <div
          className="title-container"
          style={{ height: "fit-content", paddingTop: "40px" }}
        >
          <div className="image-container" style={{ paddingBottom: "20px" }}>
            <img
              style={{ objectFit: "contain" }}
              src="/plock-banner.jpg"
              alt="Banner Płock"
            />
          </div>
          <div className="image-container">
            <img
              style={{ objectFit: "contain" }}
              src="/dla-ziemi.png"
              alt="Banner Dla Ziemi"
            />
          </div>
        </div>
        <div className="container" style={{ paddingTop: "60px" }}>
          <Link
            style={{ marginTop: "20px" }}
            className="menu-link"
            to="/schedule"
          >
            Harmonogram
          </Link>
          <Link style={{ marginTop: "20px" }} className="menu-link" to="/map">
            Mapa punktów zbierania odpadów
          </Link>
          <Link
            style={{ marginTop: "20px" }}
            className="menu-link"
            to="/category-search"
          >
            Gdzie wyrzucić?
          </Link>
          <Link style={{ marginTop: "20px" }} className="menu-link" to="/news">
            Wiadomości
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
