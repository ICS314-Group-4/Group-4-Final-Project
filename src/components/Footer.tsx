import { Col, Container } from 'react-bootstrap';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
const Footer = () => (
  <footer className="mt-auto py-3 bg-dark">
    <Container>
      <Col className="text-center">
        UH ITS Email Helper
        <br />
        University of Hawaii Information Technology Services
        <br />
        Honolulu, HI 96822
      </Col>
    </Container>
  </footer>
);

export default Footer;
