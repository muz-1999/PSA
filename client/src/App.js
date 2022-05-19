import React, { Fragment } from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Navbar from './components/Navbar';
import BasicInfo from './components/BasicInfo';
import Symptoms from './components/Symptoms';
import PossibleDisease from './components/PossibleDisease';
import DiseaseDescription from './components/DiseaseDescription';
import Test from './components/Tests';
import History from './components/History';
import './App.css';
import './custom.css'

function App() {
  return (
    <Router>
      <Fragment>
        <Navbar />
        <Routes>
          <Route exact path='/' element={<BasicInfo/>}/>
          <Route exact path='/symptoms' element={<Symptoms/>}/>
          <Route exact path='/possibleDisease' element={<PossibleDisease/>}/>
          <Route exact path='/diseaseDiscreption' element={<DiseaseDescription/>}/>
          <Route exact path='/test' element={<Test/>}/>
          <Route exact path='/History' element={<History/>}/>
        </Routes>
      </Fragment>
    </Router>
  );
}

export default App;
