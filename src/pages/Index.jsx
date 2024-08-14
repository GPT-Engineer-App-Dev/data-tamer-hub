import React from 'react';
import CSVEditor from '../components/CSVEditor';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">CSV Editor Tool</h1>
        <CSVEditor />
      </div>
    </div>
  );
};

export default Index;