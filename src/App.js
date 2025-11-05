import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import { SessionList, AddSession } from './pages/session';
import { ClassList, AddClass, ClassListPagination } from './pages/class';
import { SectionList, AddSection } from './pages/section';

function App() {
  let sessions = [];
  return (
    <div className="app-wrapper">
      <Router>
        <Header />
        <Sidebar />

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/session" element={<SessionList header="Class Session" sessions={sessions} />} />
          <Route path="/session/create" element={<AddSession header="Add Session" />} />
          <Route path="/session/edit/:id" element={<AddSession header="Edit Session" />} />

          {/* <Route path="/class" element={<ClassList header="Class List" />} /> */}
          <Route path="/class" element={<ClassListPagination header="Class List" />} />
          <Route path="/class/create" element={<AddClass header="Add Class" />} />
          <Route path="/class/edit/:id" element={<AddClass header="Edit Class" />} />

          <Route path="/section" element={<SectionList />} />
          <Route path="/section/create" element={<AddSection />} />
          <Route path="/section/edit/:id" element={<AddSection />} />
        </Routes>
        
        <Footer />
      </Router>

    </div>
  );
}

export default App;
