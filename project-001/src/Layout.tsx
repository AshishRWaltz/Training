import React from "react";
import { AppRoutes } from "./Routes";
import Header from "./components/layout/Header";
import { Outlet } from "react-router-dom";

const Layout: React.FC = () => {
  return (
    <main className="layout w-[100vw] relative">
      <Header />
      <section className="section relative top-20">
        <div className="container">
          <Outlet />
        </div>
      </section>
    </main>
  );
};

export default Layout;
