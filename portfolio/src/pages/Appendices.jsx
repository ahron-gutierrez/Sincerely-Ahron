import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import AppendixSection from "../components/AppendixSection";
import "../styles/Appendices.css";

function Appendices() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash !== "#scrap-capture-dates") return;
    const heading = document.getElementById("scrap-capture-dates");
    heading?.focus({ preventScroll: true });
    heading?.scrollIntoView();
  }, [hash]);

  return (
    <main className="site-page-shell">
      <div className="diary-spread appendices-scrapbook">
        <AppendixSection />
      </div>
    </main>
  );
}

export default Appendices;
