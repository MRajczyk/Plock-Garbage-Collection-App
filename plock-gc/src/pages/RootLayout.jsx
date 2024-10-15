import React from "react";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div
      style={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        flexDirection: "column",
        justifyContent: "start",
        alignItems: "center",
      }}
      className="bg"
    >
      <Outlet />
    </div>
  );
};

export default RootLayout;
