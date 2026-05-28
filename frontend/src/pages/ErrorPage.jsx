import { Container } from 'react-bootstrap';

const ErrorPage = ({ message }) => {
  return (
    <Container className="text-center mt-5">
      <h1 className="display-1 text-danger">404</h1>
      <h2>¡Ups! Algo salió mal</h2>
      <p className="text-muted">{message}</p>
    </Container>
  );
};

export default ErrorPage;
