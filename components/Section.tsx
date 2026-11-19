import type { ReactNode } from "react";

/** A numbered page section: the kicker on the left, the title and lead beside it. */
export function Section({ id, n, title, lead, children }: { id: string; n: string; title: string; lead: string; children: ReactNode }) {
  return (
    <section id={id}>
      <div className="wrap">
        <div className="head">
          <div className="kicker">
            <span className="sq" />
            <b>{n}</b>~/{id === "map" ? "overview" : id}
          </div>
          <div>
            <h2>{title}</h2>
            <p>{lead}</p>
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}
