import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { createContext, useState } from 'react';
import LoadingBar from 'react-top-loading-bar';
import ProtectedRoute from "./components/common/ProtectedRoute";
import Login from "./pages/Login";
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import { SessionList, AddSession } from './pages/session';
import { ClassListPaginationLoader, AddClass } from './pages/class';
import { SectionList, AddSection } from './pages/section';
import { ClassMappingList, AddClassMapping } from './pages/class-mapping';
import { SubjectTypeList, AddSubjectType } from './pages/subject-type';
// import { SubjectList, AddSubject } from './pages/subject';
import SubjectList from './pages/subject/SubjectList';
import AddSubject from './pages/subject/AddSubject';
import { SubjectMappingList, AddSubjectMapping } from './pages/subject-mapping';


export const LoadingBarContext = createContext();

function App() {
  const [progress, setProgress] = useState(0);

  const startLoading = () => setProgress(30); // start thoda sa progress
  const updateLoading = (value) => setProgress(value); // agar chaho to mid-progress set kar sakte ho
  const completeLoading = () => setProgress(100); // full complete

  return (
    <div className="app-wrapper">
      <Router>
        <LoadingBar color="#0d6efd" progress={progress} height={3} onLoaderFinished={() => setProgress(0)} />
        <LoadingBarContext.Provider value={{ startLoading, updateLoading, completeLoading }}>
          
          <Routes>
            {/* Public route */}
            <Route path="/login" element={<Login />} />

            {/* Protected routes */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <>
                    <Header />
                    <Sidebar />

                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/session" element={<SessionList header="Class Session" />} />
                      <Route path="/session/create" element={<AddSession header="Add Session" />} />
                      <Route path="/session/edit/:id" element={<AddSession header="Edit Session" />} />

                      {/* <Route path="/class" element={<ClassList header="Class List" />} /> */}
                      {/* <Route path="/class" element={<ClassListPagination header="Class List" />} /> */}
                      <Route path="/class" element={<ClassListPaginationLoader header="Class List" />} />
                      <Route path="/class/create" element={<AddClass header="Add Class" />} />
                      <Route path="/class/edit/:id" element={<AddClass header="Edit Class" />} />

                      <Route path="/section" element={<SectionList />} />
                      {/* <Route path="/section" element={<SectionListPagination />} /> */}
                      <Route path="/section/create" element={<AddSection />} />
                      <Route path="/section/edit/:id" element={<AddSection />} />

                      <Route path="/class-mapping" element={<ClassMappingList />} />
                      <Route path="/class-mapping/create" element={<AddClassMapping />} />
                      <Route path="/class-mapping/edit/:id" element={<AddClassMapping />} />

                      <Route path="/subject-type" element={<SubjectTypeList />} />
                      <Route path="/subject-type/create" element={<AddSubjectType />} />
                      <Route path="/subject-type/edit/:id" element={<AddSubjectType />} />

                      <Route path="/subject" element={<SubjectList />} />
                      <Route path="/subject/create" element={<AddSubject />} />
                      <Route path="/subject/edit/:id" element={<AddSubject />} />

                      <Route path="/subject-mapping" element={<SubjectMappingList />} />
                      <Route path="/subject-mapping/create" element={<AddSubjectMapping />} />
                      <Route path="/subject-mapping/edit/:id" element={<AddSubjectMapping />} />
                    </Routes>

                    <Footer />
                  </>
                </ProtectedRoute>
              }
            />
          </Routes>
          
        </LoadingBarContext.Provider>
      </Router>
    </div>
  );
}

export default App;
