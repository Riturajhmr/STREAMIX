import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ShowDetails from "./pages/ShowDetails";
import NotFound from "./pages/NotFound";


const App = () => (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/show/:id" element={<ShowDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
);

export default App;
