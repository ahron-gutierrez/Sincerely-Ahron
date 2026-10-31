import { useState } from "react";
import { BrowserRouter, Navigate, NavLink, Route, Routes, useLocation } from "react-router-dom";

import Archive from "./pages/Archive";
import About from "./pages/About";
import Home from "./pages/Home";
import Works from "./pages/Works";
import Guestbook from "./components/Guestbook";
import IntroAnimation from "./components/IntroAnimation";
import "./styles/App.css";

function PortfolioApp() {
  const location = useLocation();
  const [introComplete, setIntroComplete] = useState(() => location.pathname !== "/");

  function completeIntro() {
    setIntroComplete(true);
  }

  return (
    <div className={`site-frame ${introComplete ? "site-frame--ready" : "site-frame--intro"}`}>
      <header
        className="site-navbar"
        aria-hidden={!introComplete}
        inert={!introComplete}
      >
        <NavLink className="navbar-brand" to="/" aria-label="sincerely, ahron home">
          <img src="/website-logo.png" alt="" />
        </NavLink>
        <nav className="navbar-links" aria-label="Main navigation">
          <NavLink to="/" end>home</NavLink>
          <NavLink to="/works">works</NavLink>
          <NavLink to="/about">about</NavLink>
          <NavLink to="/archive">archive</NavLink>
        </nav>
      </header>
      <div
        className="route-page"
        key={location.pathname}
        aria-hidden={!introComplete}
        inert={!introComplete}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/works" element={<Works />} />
          <Route path="/about" element={<About />} />
          <Route path="/archive" element={<Archive />} />
          <Route path="/collection" element={<Navigate to="/works" replace />} />
          <Route path="/experiments" element={<Navigate to="/archive" replace />} />
          <Route path="/next-chapter" element={<Navigate to="/about" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      {!introComplete && <IntroAnimation onComplete={completeIntro} />}
      {introComplete && <Guestbook />}
      {introComplete && (
        <footer className="site-footer">
          <small>© 2026 AHRchives. All rights reserved.</small>
        </footer>
      )}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <PortfolioApp />
    </BrowserRouter>
  );
}

export default App;
