import { Link } from "react-router-dom";
import { ArrowRight, Flame } from "lucide-react";

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-grain" />
        <div className="hero-inner">
          <div className="eyebrow">
            <Flame size={13} style={{ display: "inline", marginRight: 6, verticalAlign: -2 }} />
            Ikotun-Egbe, Lagos &middot; Open Daily 9am – 10pm
          </div>
          <h1>
            Real Lagos flavor, <em>delivered hot</em> to your door.
          </h1>
          <p>
            Jollof, swallow, suya, small chops — cooked fresh and tracked from our
            kitchen to yours. Order in minutes, no stress.
          </p>
          <div className="hero-actions">
            <Link to="/menu" className="btn btn-primary">
              View Menu <ArrowRight size={16} />
            </Link>
            <Link to="/orders" className="btn btn-outline">
              Track an Order
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">How it works</h2>
          <div className="menu-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
            {[
              ["01", "Pick your plate", "Browse rice, soups, protein, small chops and drinks."],
              ["02", "Checkout fast", "Delivery or pickup, pay on delivery or by transfer."],
              ["03", "Track it live", "Watch your order move from the pot to your plate."],
            ].map(([num, title, desc]) => (
              <div key={num} className="panel">
                <div style={{ color: "var(--amber-2)", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, marginBottom: 10 }}>
                  {num}
                </div>
                <h3 style={{ margin: "0 0 8px", fontFamily: "var(--font-display)" }}>{title}</h3>
                <p style={{ margin: 0, opacity: 0.7, fontSize: 14, lineHeight: 1.5 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
