import { useNavigate } from 'react-router-dom';

export default function References() {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/Flowchart');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">References</h1>
      <button
        onClick={handleButtonClick}
        className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600"
      >
        Create My Playbook
      </button>
    </div>
  );
}
