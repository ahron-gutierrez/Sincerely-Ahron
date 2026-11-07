import HandwritingText from "./components/HandwritingText";
import { useState } from "react";
import { BrowserRouter, Navigate, NavLink, Route, Routes, useLocation } from "react-router-dom";

import Appendices from "./pages/Appendices";
import About from "./pages/About";
import Home from "./pages/Home";
import PartII from "./pages/PartII";
import Reflection from "./pages/Reflection";
import Works from "./pages/Works";
import ArtworkDetail from "./pages/ArtworkDetail";
import ExplorationDetail from "./pages/ExplorationDetail";
import IntroAnimation from "./components/IntroAnimation";
import ScrollToTopButton from "./components/ScrollToTopButton";
import CrayonTrail from "./components/CrayonTrail";
import "./styles/App.css";

function PortfolioApp() {
  const location = useLocation();
  const [introComplete, setIntroComplete] = useState(() => location.pathname !== "/");
  const isPartI = location.pathname.startsWith("/part-i");
  const isArtworkDetail = /^\/part-[12]\//.test(location.pathname);

  function completeIntro() {
    setIntroComplete(true);
  }

  return (
    <div className={`site-frame ${introComplete ? "site-frame--ready" : "site-frame--intro"}${isPartI ? " site-frame--part-i" : ""}${isArtworkDetail ? " site-frame--detail" : ""}`}>
      <header
        className="site-navbar"
        aria-hidden={!introComplete}
        inert={!introComplete}
      >
        <NavLink className="navbar-brand" to="/" aria-label="sincerely, ahron home">
          <img src="/website-logo.png" alt="" />
        </NavLink>
        <nav className="navbar-links" aria-label="Main navigation">
          <NavLink to="/" end><HandwritingText tracking={0.045} compactNav>Home</HandwritingText></NavLink>
          <NavLink to="/part-i"><HandwritingText tracking={0.045} compactNav>Part I</HandwritingText></NavLink>
          <NavLink to="/part-ii"><HandwritingText tracking={0.045} compactNav>Part II</HandwritingText></NavLink>
          <NavLink to="/reflection"><HandwritingText tracking={0.045} compactNav>Reflection</HandwritingText></NavLink>
          <NavLink to="/appendices"><HandwritingText tracking={0.045} compactNav>Appendices</HandwritingText></NavLink>
          <NavLink to="/about"><HandwritingText tracking={0.045} compactNav>About</HandwritingText></NavLink>
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
          <Route path="/part-i/:artworkId" element={<ArtworkDetail />} />
          <Route path="/part-i" element={<Works />} />
          <Route path="/part-ii/:explorationId" element={<ExplorationDetail />} />
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
      {introComplete && <ScrollToTopButton routeKey={location.pathname} />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <CrayonTrail />
      <PortfolioApp />
    </BrowserRouter>
  );
}

export default App;
