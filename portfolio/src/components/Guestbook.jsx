import Giscus from "@giscus/react";
import { useLocation } from "react-router-dom";
import {
  getGiscusTheme,
  giscusConfig,
  isGiscusConfigured,
} from "../config/giscus";

function Guestbook() {
  const { pathname } = useLocation();

  return (
    <section className="guestbook" aria-labelledby="guestbook-title">
      <div className="guestbook__inner">
        <h2 id="guestbook-title">Leave a Little Note</h2>
        <p className="guestbook__intro">
          If you&apos;ve made it this far, I&apos;d love to hear from you. Leave a little note before you go!
        </p>
        <div className="guestbook__comments">
          {isGiscusConfigured() ? (
            <Giscus
              key={pathname}
              repo={giscusConfig.repo}
              repoId={giscusConfig.repoId}
              category={giscusConfig.category}
              categoryId={giscusConfig.categoryId}
              mapping={giscusConfig.mapping}
              strict="0"
              reactionsEnabled={giscusConfig.reactionsEnabled}
              emitMetadata="0"
              inputPosition={giscusConfig.inputPosition}
              theme={getGiscusTheme()}
              lang={giscusConfig.lang}
              loading="lazy"
            />
          ) : (
            <p className="guestbook__setup-note">
              The guestbook is getting ready.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default Guestbook;