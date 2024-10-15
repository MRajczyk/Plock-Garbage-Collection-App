import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/NewsPage.css";
import NewsPreview from "../components/news/NewsPreview.jsx";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase.js";
import FadeLoader from "react-spinners/FadeLoader.js";

const NewsPage = () => {
  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };

  const navigate = useNavigate();
  const [newsObjectTable, setNewsObjectTable] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWiadomosci = async () => {
      let { data: wiadomosci, error } = await supabase
        .from("wiadomosci")
        .select("*")
        .order("id", { ascending: false });

      setNewsObjectTable(wiadomosci);
      setIsLoading(false);
    };

    fetchWiadomosci();
  }, []);

  const handleClick = (id) => {
    navigate(`/news/${id}`, { replace: false });
  };

  return (
    <div className="background">
      {!isLoading ? (
        <div className="main-container">
          <div
            className="container"
            style={{
              height: "fit-content",
              paddingTop: "60px",
            }}
          >
            <div className="image-container">
              <img
                style={{ objectFit: "contain" }}
                src="/wiadomosci.png"
                alt="Wiadomosci"
              />
            </div>
          </div>
          <div
            className="container"
            style={{ width: "80%", maxWidth: "600px" }}
          >
            <div
              style={{
                width: "100%",
                marginTop: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                maxHeight: "420px",
                overflowY: "scroll",
                boxShadow: "0 8px 8px -4px rgba(0, 0, 0, 0.2)",
                borderRadius: "8px",
              }}
            >
              {newsObjectTable.map((newsObject) => {
                return (
                  <NewsPreview
                    key={newsObject.id}
                    id={newsObject.id}
                    title={newsObject.title}
                    summary={newsObject.summary}
                    isUrgent={newsObject.is_urgent}
                    onClick={handleClick}
                  />
                );
              })}
            </div>
            <Link style={{ marginTop: "30px" }} className="menu-link" to="/">
              Powrót
            </Link>
          </div>
        </div>
      ) : (
        <div
          className="container"
          style={{
            width: "340px",
            height: "600px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <FadeLoader
            color={"#939393"}
            loading={isLoading}
            cssOverride={override}
            size={150}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      )}
    </div>
  );
};

export default NewsPage;
