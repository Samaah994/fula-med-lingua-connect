
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/login');
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-accent">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary">FulaMed</h1>
        <p className="mt-2">Redirecting to login...</p>
      </div>
    </div>
  );
};

export default Index;
