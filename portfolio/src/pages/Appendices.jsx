import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";
import AppendixSection from "../components/AppendixSection";
import "../styles/Appendices.css";

function Appendices() {
  const { hash, key } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (hash === "#scrap-capture-dates") {
      const heading = document.getElementById("scrap-capture-dates");
      heading?.focus({ preventScroll: true });
      heading?.scrollIntoView();
    }

    if (hash === "#appendix-crochet") {
      const heading = document.getElementById("appendix-crochet-title");
      const chapter = document.getElementById("appendix-crochet");
      const smooth = navigationType === "PUSH" &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      heading?.focus({ preventScroll: true });
      chapter?.scrollIntoView({ behavior: smooth ? "smooth" : "instant" });
    }
  }, [hash, key, navigationType]);

  return (
    <main className="site-page-shell">
      <div className="diary-spread appendices-scrapbook">
        <AppendixSection />
      </div>
    </main>
  );
}

export default Appendices;
