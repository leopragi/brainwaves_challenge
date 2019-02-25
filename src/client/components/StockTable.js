import React, { Component } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";

import { Table } from 'antd'
import _ from 'lodash'
import moment from 'moment'

const columns = [{
	title: 'Symbol',
	dataIndex: 'symbol',
	key: 'symbol',
	render: text => <Link to={`/${text}`}>{text}</Link>
}, {
	title: 'Date',
	dataIndex: 'date',
	key: 'date',
	render: text => moment(text, 'DD/mm/YY').format('ll')
}, {
	title: 'Open',
	dataIndex: 'open',
	key: 'open',
}, {
	title: 'Close',
	dataIndex: 'close',
	key: 'close',
}, {
	title: 'Low',
	dataIndex: 'low',
	key: 'low',
}, {
	title: 'High',
	dataIndex: 'high',
	key: 'high',
}, {
	title: 'Volume',
	dataIndex: 'volume',
	key: 'volume',
}];

class StockTable extends Component {
	state = {
		data: [],
		pagination: {
			pageSize: 15
		},
		loading: false,
	};

	componentDidMount() {
		this.fetch({
			page: 1,
			results: this.state.pagination.pageSize
		});
	}

	handleTableChange = (pagination, filters, sorter) => {
		const pager = {
			...this.state.pagination
		};
		pager.current = pagination.current;
		this.setState({
			pagination: pager,
		});
		this.fetch({
			results: pagination.pageSize,
			page: pagination.current,
			sortField: sorter.field,
			sortOrder: sorter.order,
			symbol: this.props.symbol,
			...filters,
		});
	}

	UNSAFE_componentWillReceiveProps(newProps){
		let {symbol} = newProps
		this.fetch({
			page: 1,
			results: this.state.pagination.pageSize,
			symbol:symbol == '' ? undefined: symbol
		})
	}

	fetch = async (params = {}) => {
		let {
			page,
			results,
			symbol
		} = params
		this.setState({
			loading: true
		});
		let response = await axios.get('/api/stock', {
			params: {
				index: page - 1,
				size: results,
				symbol: symbol
			}
		})
		const pagination = {
			...this.state.pagination
		};
		let {data:{count, data}} = response.data
		// Read total count from server
		pagination.total = count;
		this.setState({
			loading: false,
			data,
			pagination,
		});
	}

	render() {
		return (
            <Table 
                title={() => "All stocks"}
				columns = {columns}
				rowKey = {record => record._id}
				dataSource = {this.state.data}
				pagination = {this.state.pagination}
				loading = {this.state.loading}
				onChange = {this.handleTableChange}
				size = "small" 
			/>
		);
	}
}

export default StockTable