import { Col, Container, Image, Row } from 'react-bootstrap';
import { Mailbox2Flag, People, PeopleFill } from 'react-bootstrap-icons';

/** The Home page. */
const Home = () => (
  <main>
    <Container id="landing-page" fluid className="py-5">
      <Container>
      <Row className="align-middle text-center">
        <Col lg={6}>
          <h1>Save time and help more, get started with UH ITS Email Helper</h1>
          <p>Create and share your own templates or browse and save your favorites. Save time with templates created by fellow ITS student workers</p>
          <div className='d-flex gap-3 mb-4 flex-wrap'>
            <button>
              Explore templates
            </button>
            <button>
              Create a template
            </button>
          </div>
        </Col>
      </Row>
      </Container>
    </Container>
  </main>
);


export default Home;
