import { Col, Container } from 'react-bootstrap';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
const Footer = () => (
  <footer className="mt-auto bg-dark" style={{ paddingTop: '1.5rem', paddingBottom: '1.5rem' }}>
    <Container>
      <Col className="text-center" style={{ fontSize: '0.85rem', opacity: 0.85, lineHeight: 1.7 }}>
        <span style={{ fontWeight: 600 }}>UH ITS Email Helper</span>
        <br />
        University of Hawaii Information Technology Services
        <br />
        Honolulu, HI 96822
      </Col>
    </Container>
  </footer>
);

export default Footer;
