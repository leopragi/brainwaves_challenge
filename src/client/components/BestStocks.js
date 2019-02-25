import React, { Component } from 'react';
import axios from 'axios';
import { Card, Col, Row, Statistic, Spin } from 'antd';
import { Line, LineChart } from 'recharts'

let colors = [
    ['#0052d4', '#4364f7', '#6fb1fc'],
    ['#ff4b1f','#ff9068'],
    ['#1d976c','#93f9b9'],
]


class BestStocks extends Component {
    state = {
        status: false,
        stocks: []
    }

    async componentDidMount(){
        this.setState({status:true})
        let response = await axios.get('/api/bestStock')
        this.setState({stocks:response.data.data, status:false})
    }

    render() {
        return (
            <React.Fragment>
    			<h1>Best stocks</h1>
                <Row gutter={16}>
                {this.state.status ? <Spin size="large" /> : this.state.stocks.map((stock, i) => {
                    let data = [{point:stock.open}, {point:stock.low}, {point:stock.high}, {point:stock.close}]
                    return (
                        <Col key={i} span={6}>
                            <Card style={{background: `linear-gradient(to right, ${colors[i].join(',')})`}} bordered={false}>
                                <Col span={12}>
                                    <Statistic style={{color:'#fff'}} title="Symbol" value={stock.symbol}/>
                                </Col>
                                <Col span={12}>
                                    <Statistic style={{color:'#fff'}} title="High" value={stock.high} precision={2}/>
                                </Col>
                                <Col>
                                    <LineChart margin={{top: 20, right: 10, left: 10, bottom: 0}} width={200} height={80} data={data}>
                                        <Line type='monotone' dataKey='point' stroke='#fff' strokeWidth={2} />
                                    </LineChart>
                                </Col>
                            </Card>
                        </Col>
                    )
                })}
                </Row>
            </React.Fragment>
        )
    }
}

export default BestStocks