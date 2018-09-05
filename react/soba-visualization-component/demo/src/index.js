import React, {Component} from 'react'
// import {render} from 'react-dom'
import ReactDOM from 'react-dom';

import Example from '../../src'

class Demo extends Component {
  render() {
    return <div>
      <h1>soba-visualization Demo</h1>
      

      <Example 
      	title='patrickdemo'
		chartType='line'  
		dataset='coa_apd_traffic_stop_name_data_table' 
		count='traffic_stop_id' 
		byDate='["year"]' 
		groupBy='["name_race"]'
		/>
	    <Example 
      	title='patrickdemo 2'
	    spreadsheetId='1bzdwPn0ZT_hTt80RNPDPBPBSloMQpmErVjvOn88GL-s'
	    chartType='bar'  
	    />
	    <Example 
      	title='patrickdemo 3'
	    spreadsheetId='1oyMRNYXrTCBLXh0166zN432k7Pg7TIvu5FrEa8znjQ4'
	    chartType='bar'  
	    />

    </div>
  }
}


const domContainer = document.querySelector('#demo');
ReactDOM.render(React.createElement(Demo), domContainer);

// render(<Demo/>, document.querySelector('#demo'))
