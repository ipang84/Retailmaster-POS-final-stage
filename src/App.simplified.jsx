import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function Dashboard() {
  return <div>Dashboard Page</div>;
}

function Layout({ children }) {
  return (
    <div>
      <header>RetailMaster POS Header</header>
      <main>{children}</main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
