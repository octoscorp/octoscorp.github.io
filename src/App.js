// Filename - App.js

import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import About from "./components/About";
import Coding from "./components/Coding";
import Games from "./components/Games";
import Art from "./components/Art";

function App() {
	return (
		<>
		<Router>
			<Navbar />
			<Routes>
				<Route path='/' exact element={<About />}/>
				<Route index element={<About />}/>
				<Route path='/coding' exact element={<Coding />}/>
				<Route path='/games' exact element={<Games />}/>
				<Route path='/art' exact element={<Art />}/>
			</Routes>
		</Router>
		</>
	);
}

export default App;
