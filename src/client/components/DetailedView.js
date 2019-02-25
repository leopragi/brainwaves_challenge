import React, { Component } from 'react';
import axios from 'axios';
import { AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area, Legend } from 'recharts'
import { Card, Row, Col, Statistic, Icon, Button } from 'antd';
import moment from 'moment'

class SymbolView extends Component{

    state = {
        data: [],
        width: window.innerWidth,
        height: window.innerHeight,
    }

    async componentDidMount(){
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
        let {match} = this.props
        let symbol = match.params.symbol
        let response = await axios.get(`/api/stock/${symbol}`)
        this.setState({data:response.data.data})
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }
    
    updateWindowDimensions = () => {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    render() {
        let data = this.state.data
        let _data_value = data.map(d => ({date: moment(d.date, 'DD/mm/YY').format('ll'), value: d.close}))
        let _data_high_low = data.map(d => ({date: moment(d.date, 'DD/mm/YY').format('ll'), high: d.high, low: d.low}))
        let totalVolume = 0, topHigh = 0, topLow = Number.MAX_SAFE_INTEGER, rateChange = 0;
        for(let i = 0; i < data.length; i++){
            let d = data[i]
            totalVolume += d.volume
            if(d.high > topHigh) {
                rateChange = ((d.high / data[i+1].high) - 1) * 100;
                topHigh = d.high
            }
            if(d.low < topLow) {
                topLow = d.low
            }
        }
        return (
                <div>
                    <h1>{this.props.match.params.symbol}</h1>
                    <Row style={{padding:40}} gutter={16}>
                        <Col span={4}>
                            <Statistic title="Top value" value={topHigh} precision={2} />
                        </Col>
                        <Col span={4}>
                            <Statistic title="Least value" value={topLow} precision={2} />
                        </Col>
                        <Col span={4}>
                            <Statistic title="Rate change" value={rateChange} precision={2}/>
                        </Col>
                        <Col span={4}>
                            <Statistic title="Total volumes" value={totalVolume} />
                        </Col>
                    </Row>
                    <Row style={{padding:40}} gutter={16}>
                        <Col span={2}>
                            <Button type="primary">Buy share</Button>
                        </Col>
                        <Col span={2}>
                            <Button type="primary">Sell share</Button>
                        </Col>
                    </Row>
                    <Row style={{display:'flex'}}>
                        <Card title="Value chart" style={{margin:10}}>
                            <AreaChart width={this.state.width/3} height={200} data={_data_value} margin={{top: 10, right: 30, left: 0, bottom: 0}}>
                                <CartesianGrid vertical={false}/>
                                <XAxis dataKey="date"/>
                                <YAxis/>
                                <Tooltip/>
                                <Legend />
                                <Area type='monotone' dataKey='value' strokeWidth={2} stroke='#0052d4' fill='#0052d4' />
                            </AreaChart>
                        </Card>
                        <Card title="Highs and lows chart" style={{margin:10}}>
                            <AreaChart  width={this.state.width/3} height={200} data={_data_high_low} margin={{top: 10, right: 30, left: 0, bottom: 0}}>
                                <CartesianGrid vertical={false}/>
                                <XAxis dataKey="date"/>
                                <YAxis/>
                                <Tooltip/>       
                                <Legend />
                                <Area type='monotone' dataKey='high' strokeWidth={2} stroke='#1d976c' fill="#1d976c" />
                                <Area type='monotone' dataKey='low' strokeWidth={2} stroke='#ff4b1f' fill="#ff4b1f" />
                            </AreaChart>
                        </Card>
                    </Row>
                </div>
        )
    }
}

export default SymbolView
