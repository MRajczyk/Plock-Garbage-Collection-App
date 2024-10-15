import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { supabase } from "../utils/supabase";
import axios from "axios";
import "../styles/Calendar.css";

const SchedulePage = () => {
  const [savedAddress, setSavedAddress] = useState(null);
  const [markedDates, setMarkedDates] = useState([]);
  const [repeatDays, setRepeatDays] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [phoneNumber, setPhoneNumber] = useState("");
  const [newsletterConsent, setNewsletterConsent] = useState(false);
  const navigate = useNavigate();

  const sendSms = async (recipientPhoneNumber) => {
    const message = "Zostałeś zapisany do śmieciowego newslettera!";

    try {
      const response = await axios.post("http://localhost:5000/send-sms", {
        recipientPhoneNumber,
        message,
      });
      console.log("SMS wysłany:", response.data);
    } catch (error) {
      console.error("Błąd podczas wysyłania SMS:", error);
    }
  };

  const fetchScheduleData = async (strefaId) => {
    try {
      const { data: harmonogramMies, error: errorMies } = await supabase
        .from("harmonogramy_mies")
        .select("data, frakcje(kolor, nazwa)")
        .eq("strefa", strefaId);

      if (errorMies) {
        console.error("Błąd podczas pobierania harmonogramy_mies:", errorMies);
        return;
      }

      const markedDatesData = harmonogramMies.map((item) => ({
        date: new Date(item.data),
        color: item.frakcje.kolor,
        name: item.frakcje.nazwa,
      }));

      setMarkedDates(markedDatesData);

      const { data: harmonogramCykliczne, error: errorCykliczne } =
        await supabase
          .from("harmonogramy_cykliczne")
          .select("dzien_tygodnia, frakcje(kolor, nazwa)")
          .eq("strefa", strefaId);

      if (errorCykliczne) {
        console.error(
          "Błąd podczas pobierania harmonogramy_cykliczne:",
          errorCykliczne
        );
        return;
      }

      const repeatDaysData = harmonogramCykliczne.map((item) => ({
        day: item.dzien_tygodnia + 1,
        color: item.frakcje.kolor,
        name: item.frakcje.nazwa,
      }));

      setRepeatDays(repeatDaysData);
    } catch (error) {
      console.error("Błąd podczas pobierania danych:", error);
    }
  };

  useEffect(() => {
    const address = localStorage.getItem("savedAddress");
    const strefa = localStorage.getItem("savedZone");

    if (address) {
      setSavedAddress(address);
      fetchScheduleData(strefa);
    } else {
      navigate("/schedule-search");
    }
  }, [navigate]);

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const dayMatches = markedDates.filter(
        (markedDate) =>
          markedDate.date.getFullYear() === date.getFullYear() &&
          markedDate.date.getMonth() === date.getMonth() &&
          markedDate.date.getDate() === date.getDate()
      );

      const repeatDayMatches = repeatDays.filter(
        (repeatDay) => date.getDay() === repeatDay.day
      );

      const allMatches = [...dayMatches, ...repeatDayMatches];

      if (allMatches.length > 0) {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "5px",
            }}
          >
            {allMatches.map((match, index) => (
              <div
                key={index}
                style={{
                  height: "5px",
                  width: "5px",
                  borderRadius: "50%",
                  backgroundColor: match.color,
                  marginLeft: index > 0 ? "5px" : "0",
                }}
              ></div>
            ))}
          </div>
        );
      }
    }
    return null;
  };

  const getColorsAndNamesForSelectedDate = () => {
    const dayMatches = markedDates.filter(
      (markedDate) =>
        markedDate.date.toDateString() === selectedDate.toDateString()
    );

    const repeatDayMatches = repeatDays.filter(
      (repeatDay) => selectedDate.getDay() === repeatDay.day
    );

    return [...dayMatches, ...repeatDayMatches];
  };

  // Funkcja do zapisania numeru telefonu do Supabase
  const handleSave = async () => {
    const strefa = localStorage.getItem("savedZone");

    if (!phoneNumber) {
      alert("Proszę wprowadzić numer telefonu.");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("powiadomienia")
        .insert([{ telefon: phoneNumber, strefa }]);

      if (error) {
        console.error("Błąd podczas zapisywania:", error);
      } else {
        alert("Zapisano pomyślnie!");
        const number = phoneNumber;
        console.log(number, newsletterConsent);
        if (newsletterConsent) {
          sendSms(number);
        }
        setPhoneNumber(""); // Resetowanie pola po zapisaniu
        setNewsletterConsent(false); // Resetowanie checkboxa
      }
    } catch (error) {
      console.error("Błąd podczas zapisu:", error);
    }
  };

  const handleBack = () => {
    navigate("/", { replace: false });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      {savedAddress ? (
        <div style={{ textAlign: "center", paddingBottom: "18px" }}>
          <h1>{savedAddress}</h1>
          <Link
            style={{ display: "inline-block", width: "70%" }}
            className="menu-link"
            to="/schedule-search"
          >
            Zmień adres
          </Link>

          <div style={{ marginTop: "10px", display: "inline-block" }}>
            <h2>Twój harmonogram:</h2>
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              tileContent={tileContent}
              className="custom-calendar"
            />
          </div>

          <div style={{ marginTop: "10px" }}>
            <h3>Wywozy odpadów dla wybranej daty:</h3>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              {getColorsAndNamesForSelectedDate().map((item, index) => (
                <div
                  key={index}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <div
                    style={{
                      height: "10px",
                      width: "10px",
                      borderRadius: "50%",
                      backgroundColor: item.color,
                      marginRight: "5px",
                    }}
                  />
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Przerwa przed formularzem */}
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <p>
              Chcesz otrzymywać powiadomienia e-mail, kiedy zbliżać się będzie
              termin wywozu śmieci? Zapisz się do newslettera!
            </p>
            <input
              type="text"
              placeholder="Numer telefonu"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              style={{
                marginTop: "10px",
                marginBottom: "10px",
                width: "200px",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
            <div>
              <input
                type="checkbox"
                checked={newsletterConsent}
                onChange={() => setNewsletterConsent(!newsletterConsent)}
              />
              <label> Chcę otrzymać SMS potwierdzający</label>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <button
                onClick={handleBack}
                className="menu-link"
                style={{
                  marginTop: "10px",
                  marginRight: "10px",
                  padding: "5px 10px",
                  backgroundColor: "#ff9d00",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                  width: "20%",
                }}
              >
                Wróć
              </button>
              <button
                onClick={handleSave}
                className="menu-link"
                style={{
                  marginTop: "10px",
                  padding: "5px 10px",
                  backgroundColor: "#ff9d00",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                  width: "20%",
                }}
              >
                Zapisz
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p>Ładowanie...</p>
      )}
    </div>
  );
};

export default SchedulePage;
