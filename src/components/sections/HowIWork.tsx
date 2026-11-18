import Container from "@/components/ui/Container";
import { howIWork, featured } from "@/data";

export default function HowIWork() {
  return (
    <section
      id="how-i-work"
      className="about-section section"
      aria-labelledby="approach-heading"
    >
      <Container className="split-section">
        <div className="about-heading">
          <h2 className="section-title" id="approach-heading">
            開発について
          </h2>
          <h3 className="technology-title">使用技術</h3>
          <ul className="tag-list">
            {featured.tags.map((tag) => (
              <li className="tech-tag" key={tag}>
                {tag}
              </li>
            ))}
          </ul>
        </div>
        <div className="approach-list">
          {howIWork.map((item) => (
            <article key={item.label} className="approach-item">
              <span
                className={`approach-mark mark-${item.marker}`}
                aria-hidden="true"
              />
              <div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
