import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import "../styles/MapPage.css";
import { useNavigate } from "react-router-dom";

const yellowIcon = new L.Icon({
  iconUrl: "/pin-orange.png",
  iconAnchor: [18, 30],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const redIcon = new L.Icon({
  iconUrl: "/pin-red.png",
  iconAnchor: [18, 30],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const MapPage = () => {
  const [yellowMarkers, setYellowMarkers] = useState([]);
  const [redMarkers, setRedMarkers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function getMarkers() {
      let { data: punkty_specjalne, error } = await supabase
        .from("punkty_specjalne")
        .select();

      if (!error) {
        const yellowMarkers = punkty_specjalne.filter(
          (punkt) => punkt.typ === "A"
        );
        const redMarkers = punkty_specjalne.filter(
          (punkt) => punkt.typ === "B"
        );
        setYellowMarkers(yellowMarkers);
        setRedMarkers(redMarkers);
      }
    }

    getMarkers();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="background">
      <div className="container">
        <div
          className="container"
          style={{ height: "fit-content", paddingTop: "40px", width: "280px" }}
        >
          <div className="image-container" style={{ paddingBottom: "20px" }}>
            <img style={{ objectFit: "contain" }} src="/mapa.png" alt="MAPA" />
          </div>
          <div className="image-container"></div>
        </div>

        <div style={{ width: "80%" }}>
          <div
            style={{
              marginBottom: "5%",
              display: "flex",
              alignItems: "center",
            }}
          >
            <img
              style={{ objectFit: "contain", paddingRight: "10px" }}
              src="/pin-orange.png"
              alt="żółta pinezka"
            />
            <div>Apteki przyjmujące przeterminowane leki</div>
          </div>
          <div
            style={{
              marginBottom: "5%",
              display: "flex",
              alignItems: "center",
            }}
          >
            <img
              style={{ objectFit: "contain", paddingRight: "10px" }}
              src="/pin-red.png"
              alt="czerwona pinezka"
            />
            <div>
              Pojemniki na zużyte baterie oraz nieduże sprzęty elektroniczne
              (max. 40x50x20 cm)
            </div>
          </div>
        </div>

        <div className="container">
          <div>
            <MapContainer
              center={[52.53305586839205, 19.753030422048365]}
              zoom={15}
              scrollWheelZoom={false}
              style={{
                height: "100vh",
                width: "100vw",
                backgroundColor: "white",
                zIndex: 40,
              }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {yellowMarkers.map((punkt) => (
                <Marker
                  key={punkt.id}
                  position={[punkt.x, punkt.y]}
                  icon={yellowIcon}
                >
                  <Popup>
                    <b>{punkt.nazwa}</b>
                    <br />
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${punkt.x},${punkt.y}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {punkt.adres}
                    </a>
                    <br />
                    {punkt.szczegoly ? `Szczegóły: ${punkt.szczegoly}` : ""}
                  </Popup>
                </Marker>
              ))}

              {redMarkers.map((punkt) => (
                <Marker
                  key={punkt.id}
                  position={[punkt.x, punkt.y]}
                  icon={redIcon}
                >
                  <Popup>
                    <b>{punkt.nazwa}</b>
                    <br />
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${punkt.x},${punkt.y}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {punkt.adres}
                    </a>
                    <br />
                    {punkt.szczegoly ? `Szczegóły: ${punkt.szczegoly}` : ""}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>

            <button className="back-to-top" onClick={scrollToTop}>
              Wróć na górę strony
            </button>
            <button
              className="left-back-to-top"
              onClick={() => {
                navigate("/", { replace: false });
              }}
            >
              Cofnij
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
