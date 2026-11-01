import { useState } from "react";
import { BrowserRouter, Navigate, NavLink, Route, Routes, useLocation } from "react-router-dom";

import Appendices from "./pages/Appendices";
import About from "./pages/About";
import Home from "./pages/Home";
import PartII from "./pages/PartII";
import Reflection from "./pages/Reflection";
import Works from "./pages/Works";
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
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/part-i">Part I</NavLink>
          <NavLink to="/part-ii">Part II</NavLink>
          <NavLink to="/reflection">Reflection</NavLink>
          <NavLink to="/appendices">Appendices</NavLink>
          <NavLink to="/about">About</NavLink>
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
          <Route path="/part-i" element={<Works />} />
          <Route path="/part-ii" element={<PartII />} />
          <Route path="/reflection" element={<Reflection />} />
          <Route path="/appendices" element={<Appendices />} />
          <Route path="/about" element={<About />} />
          <Route path="/works" element={<Navigate to="/part-i" replace />} />
          <Route path="/archive" element={<Navigate to="/part-ii" replace />} />
          <Route path="/collection" element={<Navigate to="/part-i" replace />} />
          <Route path="/experiments" element={<Navigate to="/part-ii" replace />} />
          <Route path="/next-chapter" element={<Navigate to="/about" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      {!introComplete && <IntroAnimation onComplete={completeIntro} />}
      <footer
        className="site-footer"
        aria-hidden={!introComplete}
        inert={!introComplete}
      >
        <span>Made slowly, with room to grow.</span>
        <span className="handwritten">sincerely, ahron</span>
      </footer>
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
