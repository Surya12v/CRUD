import { BrowserRouter as Router, Routes, Route, useRoutes } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import { routes } from './routes/routes';

function App() {
  const AppRoutes = () => {
    const element = useRoutes(routes);
    return element;
  };

  return (
    <Router>
      <Layout>
        <AppRoutes />
      </Layout>
    </Router>
  );
}

export default App;
