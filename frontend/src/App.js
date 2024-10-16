import './App.css';
import Home from './Pages/Home';
import { Route } from "react-router-dom";
import chat from './Pages/Chat';

function App() {
  return (
    <div className="App">
      <Route path="/" component={Home} exact />
      <Route path="/chats" component={chat} />
  
    </div>
  );
}

export default App;
