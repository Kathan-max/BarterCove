import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './pages/Home';
import Auth from './pages/Auth';


function App(){
  return (
    <Router>
      <Routes>
        <Route exact path="/" component={Home} />
        <Route path="/auth" component={Auth} />
      </Routes>     
    </Router>
  );
}


export default App;