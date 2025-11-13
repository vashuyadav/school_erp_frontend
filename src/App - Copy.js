import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import { SessionList, AddSession } from './pages/session';
import { ClassList, AddClass, ClassListPagination } from './pages/class';
import { SectionList, AddSection } from './pages/section';

import React, { useRef, createContext } from 'react';
import LoadingBar from 'react-top-loading-bar';
// Create global context for loading bar control
export const LoadingBarContext = createContext();

function App() {
  const loadingBarRef = useRef(null);

  // Functions to control top loading bar
  const startLoading = () => loadingBarRef.current?.continuousStart();
  const completeLoading = () => loadingBarRef.current?.complete();

  return (
    <div className="app-wrapper">
      <Router>
        {/* Global top loading bar */}
        <LoadingBar color="#0d6efd" ref={loadingBarRef} height={3} />
        {/* Provide context for use in other components */}
        <LoadingBarContext.Provider value={{ startLoading, completeLoading }}>

          <Header />
          <Sidebar />

          <Routes>
            <Route path="/" element={<Dashboard setProgress={() => loadingBarRef.current?.continuousStart()} />} />
            <Route path="/session" element={<SessionList header="Class Session" />} />
            <Route path="/session/create" element={<AddSession header="Add Session" />} />
            <Route path="/session/edit/:id" element={<AddSession header="Edit Session" />} />

            {/* <Route path="/class" element={<ClassList header="Class List" />} /> */}
            <Route path="/class" element={<ClassListPagination header="Class List" />} />
            <Route path="/class/create" element={<AddClass header="Add Class" />} />
            <Route path="/class/edit/:id" element={<AddClass header="Edit Class" />} />

            <Route path="/section" element={<SectionList />} />
            {/* this file is with two types of pagination */}
            {/* <Route path="/section" element={<SectionListPagination />} /> */}
            <Route path="/section/create" element={<AddSection />} />
            <Route path="/section/edit/:id" element={<AddSection />} />
          </Routes>
          
          <Footer />

        </LoadingBarContext.Provider>
      </Router>

    </div>
  );
}

export default App;
