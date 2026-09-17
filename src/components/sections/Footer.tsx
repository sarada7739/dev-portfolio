import Container from "@/components/ui/Container";
import ContactForm from "@/components/ui/ContactForm";
import { site } from "@/data";

export default function Footer() {
  return (
    <footer id="contact" className="bg-cream-deep pb-section-sm pt-9 lg:pb-section">
      <Container className="flex flex-col items-center text-center">
        <h2 className="font-serif text-h2 text-ink-soft">ご一緒に、ものづくりを。</h2>
        <ContactForm />
        <a
          href={`mailto:${site.email}`}
          className="mt-8 text-lead text-ink-soft underline underline-offset-4"
        >
          {site.email}
        </a>
        <ul className="mt-6 flex flex-wrap items-center justify-center gap-2 text-body tracking-wide text-gray-light">
          {site.social.map((item, index) => (
            <li key={item.label} className="flex items-center gap-2">
              {index > 0 ? <span aria-hidden="true">/</span> : null}
              <a href={item.href} rel="noopener noreferrer" target="_blank">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-12.25 text-caption text-gray-faint">{site.copyright}</p>
      </Container>
    </footer>
  );
}
