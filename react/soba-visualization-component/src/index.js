import React, { Component } from 'react'

import SobaVisualization from './SobaVisualization';


export default class extends Component {
  render() {
    return <div>
       <SobaVisualization 
      	title={this.props.title}
  			chartType={this.props.chartType}
  			dataset={this.props.dataset}
  			count={this.props.count}
  			byDate={this.props.byDate}
  			groupBy={this.props.groupBy}
        spreadsheetId={this.props.spreadsheetId}
        showChartTypeSelect={this.props.showChartTypeSelect}
  			/>
    </div>
  }
}

// export * from './SobaVisualization';