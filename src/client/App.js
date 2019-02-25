import React, { Component } from 'react';
// import './app.css';
// import ReactImage from './react.png';
import 'antd/dist/antd.css'

import StockTable from './components/StockTable'
import BestStocks from './components/BestStocks';
import DetailedView from './components/DetailedView';

import { HashRouter as Router, Route } from "react-router-dom";
import { Input, Layout } from 'antd'
const Search = Input.Search;
const Header = Layout.Header;

class Home extends Component{
	state = {
		symbol:""
	}
	render() {
		return (
			<React.Fragment>
				<BestStocks />
				<div style={{marginTop:20}}/>
				<h1>Search</h1>
				<Search
					placeholder="search ticker / symbol"
					enterButton="Search"
					size="large"
					onSearch={symbol => this.setState({symbol})}
				/>
				<div style={{marginTop:20}}/>
				<StockTable symbol={this.state.symbol}/>
			</React.Fragment>
		)
	}
}

function App() {
	return (
		<Router>
			<div>
				<Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
					<h1 style={{color:'white'}}>Stock app</h1>
				</Header>
				<div style={{ padding:20 }}>
					<div style={{marginTop:50}}/>
					<Route path="/" exact component={Home} />
					<Route path="/:symbol/" component={DetailedView} />
				</div>
			</div>
		</Router>	
	)
}

export default App