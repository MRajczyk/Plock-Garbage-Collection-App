import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { supabase } from "../../utils/supabase";
import parse from "html-react-parser";
import { Link } from "react-router-dom";
import "./NewsExpandedPage.css";
import FadeLoader from "react-spinners/FadeLoader.js";

const NewsExpandedPage = () => {
  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };

  const params = useParams();
  const newsId = params.newsId;
  const [expandedNews, setExpandedNews] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExpandedNews = async () => {
      let { data: wiadomosc, error } = await supabase
        .from("wiadomosci")
        .select("*")
        .eq("id", newsId);
      setExpandedNews(wiadomosc.at(0));
      setIsLoading(false);
    };

    fetchExpandedNews();
  }, []);

  return (
    <>
      {!isLoading ? (
        <div
          className="image-container"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "start",
            paddingTop: "30px",
          }}
        >
          <div className="container" style={{ height: "fit-content" }}>
            <div className="image-container">
              <img
                style={{ objectFit: "contain" }}
                src="/wiadomosc.png"
                alt="Wiadomosc"
              />
            </div>
          </div>
          <h3 style={{ borderBottom: "1px solid black" }}>
            <b>Tytuł: {expandedNews.title}</b>
          </h3>
          <h4 style={{ borderBottom: "1px solid black" }}>
            <b>Streszczenie:</b>{" "}
            <span style={{ fontWeight: 500 }}>{expandedNews.summary}</span>
          </h4>
          <div
            className="html-output-container"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "start",
              flexGrow: "0",
              maxHeight: "390px",
              overflowY: "scroll",
            }}
          >
            {expandedNews.content && parse(expandedNews.content)}
          </div>
          <Link
            style={{ marginTop: "10px", boxSizing: "border-box" }}
            className="menu-link"
            to="/news"
          >
            Powrót
          </Link>
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
    </>
  );
};

export default NewsExpandedPage;
