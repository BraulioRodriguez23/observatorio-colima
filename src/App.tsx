import './App.css';
import Header from './components/Horizontalmenu'; // Importa el componente correctamente
import { Route, Routes } from 'react-router-dom';
import Barometer from './pages/barometer';
import Home from './pages/home';
import Indicators from './pages/indicators';
import Publications from './pages/publications';
import Inventory from './pages/inventory';


function App() {
  return (
    <>
      <div className=" bg-transparent">
        {' '}
        <div className="flex flex-row">
        <Header/>
        </div>
        <Routes>
          <>
          <Route path="/" element={<Home />} />
          <Route path="indicador" element={<Indicators />} />
          <Route path="barometro" element={<Barometer />} />
          <Route path="inventario" element={<Inventory />} />
          <Route path="publicaciones" element={<Publications />} />
          </>
        </Routes>
      </div>
    </>
    
  );
}

export default App;
