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
        filters={this.props.filters}
        spreadsheetId={this.props.spreadsheetId}
        spreadsheetChartColumns={this.props.spreadsheetChartColumns}
        showChartTypeSelect={this.props.showChartTypeSelect}
        datasetLabels={this.props.datasetLabels}
        labelX={this.props.labelX}
        labelY={this.props.labelY}
        summaryText={this.props.summaryText}
  			/>
    </div>
  }
}

// export * from './SobaVisualization';