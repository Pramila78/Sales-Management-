import React from 'react';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  return (
    <div className="min-h-screen font-sans antialiased text-elite-black selection:bg-elite-darkBeige selection:text-elite-black">
      <Dashboard />
    </div>
  );
};

export default App;