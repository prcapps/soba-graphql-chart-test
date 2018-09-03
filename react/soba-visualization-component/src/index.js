import React, {Component} from 'react'

import SobaVisualization from './SobaVisualization';


export default class extends Component {
  render() {
    return <div>
      <SobaVisualization 
      		title='Traffic Stops' 
  			chartType='line'  
  			dataset='coa_apd_traffic_stop_name_data_table' 
  			count='traffic_stop_id' 
  			byDate='["week"]' 
  			groupBy='["name_race", "no_contraband_found"]'
  			/>
    </div>
  }
}

