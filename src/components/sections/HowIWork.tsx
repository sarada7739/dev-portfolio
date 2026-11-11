import Container from "@/components/ui/Container";
import { howIWork, featured } from "@/data";

const symbols = ["✧", "◇", "/", "+"];

export default function HowIWork() {
  return (
    <section id="how-i-work" className="section about-section">
      <Container>
        <div className="section-heading assemble from-left delay-3">
          <h2>開発について</h2>
        </div>
        <div className="approach-grid">
          {howIWork.map((item, index) => (
            <article
              key={item.label}
              className={`approach-card glass-panel assemble from-bottom delay-${index + 2}`}
            >
              <span className="approach-symbol" aria-hidden="true">
                {symbols[index]}
              </span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
        <div className="technology-section assemble from-right delay-5">
          <div className="section-heading">
            <h2>使用技術</h2>
            <span className="section-note">プロジェクトで使用している技術</span>
          </div>
          <ul className="technology-list">
            {featured.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
