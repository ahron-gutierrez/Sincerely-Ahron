function AppendixSection({ explorations }) {
  return (
    <div className="appendix-section">
      <p className="content-intro">
        Process belongs beside the finished work. This appendix is reserved for authentic
        sketches, progress photographs, materials, dated stages, and original project screens.
      </p>
      <div className="appendix-list">
        {explorations.map((work) => (
          <section className="appendix-entry" key={work.id}>
            <div className="appendix-heading">
              <span className="appendix-pin" aria-hidden="true">✳</span>
              <div>
                <p className="eyebrow">Process file</p>
                <h3>{work.title}</h3>
              </div>
            </div>
            {work.process?.length ? (
              <ul className="evidence-list">
                {work.process.map((evidence, index) => (
                  <li key={evidence.id || evidence.src || index}>
                    {evidence.src && <img src={evidence.src} alt={evidence.alt || evidence.caption || ""} />}
                    <span>{evidence.date ? `${evidence.date} — ` : ""}{evidence.caption || "Process evidence"}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty-note">
                No process evidence added. Add only your own documentation to this work’s
                <code> process</code> list.
              </p>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}

export default AppendixSection;
