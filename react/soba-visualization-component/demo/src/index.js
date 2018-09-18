import React, {Component} from 'react'
// import {render} from 'react-dom'
import ReactDOM from 'react-dom';

import Example from '../../src'

class Demo extends Component {


  render() {
  	const filterObj = {
		filters:[ { key: "year", dateField: "date_occurred", op: "=", value: "2018"} ]
	};
    return <div>
      <h1>soba-visualization Demo</h1>
       
      <Example 
      	title='APD Traffic Searches by Race, 2018'
		chartType='line'  
		dataset='coa_apd_traffic_stop_name_data_table' 
		count='traffic_stop_id' 
		byDate='["month"]' 
		groupBy='["name_race"]'
		filters={filterObj}
		/>
	    <Example 
      	title='patrickdemo 3'
	    spreadsheetId='1ZZbKNL4bxISIiAeUfsYZ-7ajfZPQ8VZ955WY0XP6ioE'
	    chartType='bar'  
	    showChartTypeSelect='0'
	    />

    </div>
  }
}


const domContainer = document.querySelector('#demo');
ReactDOM.render(React.createElement(Demo), domContainer);

// render(<Demo/>, document.querySelector('#demo'))
