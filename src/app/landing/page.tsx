'use client';

import { Col, Container, Image, Row } from 'react-bootstrap';
import { BookmarkPlus, Search, Pen, Share } from 'react-bootstrap-icons';
import Button from 'react-bootstrap/Button';
import Carousel from 'react-bootstrap/Carousel';
import Card from 'react-bootstrap/Card';

/** The Home page. */
const Home = () => (
  <main>
    {/* Hero section */}
    <Container id="landing-page" fluid className="py-5">
      <Container>
      <Row className="align-middle text-center">
        <Col md="6">
          <h1>Save time and help more, get started with UH ITS Email Helper</h1>
          <p className='text-center'>Create and share your own templates or browse and save your favorites. Save time with templates created by fellow ITS student workers.</p>
          <h2>Get started now!</h2>
          <div className='d-flex justify-content-center gap-3 flex-wrap'>
            <Button size='lg' className='button' href='/list'>
              Explore templates
            </Button>
            <Button size='lg' className='button' href='/add'>
              Create a template
            </Button>
          </div>
        </Col>
        <Col md="6">
        <Image
              src="/ITS-Building.jpg"
              alt='ITS Building'
              fluid
            />
        </Col>
      </Row>
      </Container>
    </Container>

    {/* Features buttons for quick access */}
    <Container id='Features' fluid className='py-5'>
      <Container>
        <Row className="align-middle text-center">
          <Col md='3'>
            <Card style={{ width: '18rem' }}>
              <div className='text-center mt-3'>
              <Pen size={40}/>
                <Card.Body>
                  <Card.Title>Create a Template</Card.Title>
                  <Card.Text>
                  Create your own email templates from scratch
                  </Card.Text>
                <Button variant="primary" className='button' href='/add'>Get creating</Button>
                </Card.Body>
              </div>
            </Card>
          </Col>
          <Col md='3'>
            <Card style={{ width: '18rem' }}>
              <div className='text-center mt-3'>
              <Share size={40}/>
                <Card.Body>
                  <Card.Title>Share a Template</Card.Title>
                  <Card.Text>
                  Share a template for your fellow ITS students to utilize
                  </Card.Text>
                <Button variant="primary" className='button'>Go share</Button>
                </Card.Body>
              </div>
            </Card>
          </Col>
          <Col md='3'>
            <Card style={{ width: '18rem' }}>
              <div className='text-center mt-3'>
              <Search size={40}/>
                <Card.Body>
                  <Card.Title>Browse Templates</Card.Title>
                  <Card.Text>
                  View and explore templates shared by other students
                  </Card.Text>
                <Button variant="primary" className='button' href='temp'>Explore now</Button>
                </Card.Body>
              </div>
            </Card>
          </Col>
          <Col md='3'>
            <Card style={{ width: '18rem' }}>
              <div className='text-center mt-3'>
              <BookmarkPlus size={40}/>
                <Card.Body>
                  <Card.Title>Save a Template</Card.Title>
                  <Card.Text>
                  Save your favorite templates and keep them all in one place
                  </Card.Text>
                <Button variant="primary" className='button' href='temp'>Save now</Button>
                </Card.Body>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </Container>

    {/* Top templates thing */}
    {/* I was thinking in this carousel, we would have popular templates rotating for quick and easy access. Can remove if impossible */}
 <Container id="Templates carousel" fluid className='py-5'>
      <Container>
        <Carousel data-bs-theme="dark">
          <Carousel.Item>
            <Image
              src="/Placeholder-image.jpg"
              alt='Placeholder slide 1'
              fluid
            />
            <Carousel.Caption>
              <h3>Placeholder slide 1</h3>
              <p>This will contain a template</p>
              <Button size='lg' className='button'>
              Use this template
              </Button>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <Image
              src="/Placeholder-image.jpg"
              alt='Placeholder slide 2'
              fluid
            />
            <Carousel.Caption>
              <h3>Placeholder slide 2</h3>
              <p>This will contain a template</p>
              <Button size='lg' className='button'>
              Use this template
              </Button>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <Image
              src="/Placeholder-image.jpg"
              alt='Placeholder slide 3'
              fluid
            />
            <Carousel.Caption>
              <h3>Placeholder slide 3</h3>
              <p>This will also contain a template</p>
              <Button size='lg' className='button'>
              Use this template
              </Button>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </Container>
    </Container>
  </main>
);


export default Home;
