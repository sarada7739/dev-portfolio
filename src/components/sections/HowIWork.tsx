import Container from "@/components/ui/Container";
import SectionLabel from "@/components/ui/SectionLabel";
import Marker from "@/components/ui/Marker";
import { howIWork } from "@/data";

// 紺地の HOW I WORK ブロック。星空は @theme の bg-stars トークンで描く
export default function HowIWork() {
  return (
    <section
      id="how-i-work"
      className="relative isolate overflow-hidden border-y border-coral-line bg-linear-to-b from-navy-light to-navy-deep py-section-sm md:py-section"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-stars" />
      <Container>
        <SectionLabel label="HOW I WORK" tone="onNavy" />
        <h2 className="mt-6 text-center font-serif text-h1 text-on-navy">
          <span className="font-display italic">AI</span>を、ていねいに使う。
        </h2>
        <div className="mt-10 flex flex-col gap-4">
          {howIWork.map((item) => (
            <div
              key={item.label}
              className="flex flex-col gap-3 rounded-panel border border-navy-border bg-navy-card px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
            >
              <div className="flex items-start gap-4">
                <Marker shape={item.marker} color={item.markerColor} />
                <div>
                  <p className="text-body font-bold text-on-navy">{item.title}</p>
                  <p className="mt-1 text-small text-on-navy-muted">
                    {item.body.split("\n").map((line, index, lines) => (
                      <span key={line}>
                        {line}
                        {index < lines.length - 1 ? <br /> : null}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
              <p className="pl-7 text-caption tracking-wide text-on-navy-muted sm:pl-0">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
