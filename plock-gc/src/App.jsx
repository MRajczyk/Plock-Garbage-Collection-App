import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import RootLayout from "./pages/RootLayout.jsx";
import HomePage from "./pages/HomePage.jsx";
import Error404Page from "./pages/Error404Page.jsx";
import CategorySearchPage from "./pages/CategorySearchPage.jsx";
import MapPage from "./pages/MapPage.jsx";
import NewsPage from "./pages/NewsPage.jsx";
import SchedulePage from "./pages/SchedulePage.jsx";
import ScheduleSearchPage from "./pages/ScheduleSearchPage.jsx";
import TempEditorPage from "./pages/TempEditorPage.jsx";
import NewsExpandedPage from "./components/news/NewsExpandedPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="category-search" element={<CategorySearchPage />} />
          <Route path="map" element={<MapPage />} />
          <Route path="news" element={<NewsPage />} />
          <Route path="news/:newsId" element={<NewsExpandedPage />} />
          <Route path="schedule" element={<SchedulePage />} />
          <Route path="schedule-search" element={<ScheduleSearchPage />} />
          <Route path="tempEditorPage" element={<TempEditorPage />} />
          <Route path="*" element={<Error404Page />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
