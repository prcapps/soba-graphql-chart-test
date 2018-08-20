<div style='width: 600px; height: 400px; display: block;'>
	<canvas id="myChart" width="800" height="400"></canvas>
</div>




import Chart from 'chart.js'


var ctx = document.getElementById('myChart')
// PRC FIX
// eslint-disable-next-line
var myChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: []
  },
  options: {
    scales: {
      yAxes: [{
        stacked: false,
        ticks: {
          beginAtZero: true
        }
      }]
    }
  }
})

function processGraphQLForChart (data) {
  var result = data.data.generic_month_stats
  console.log('result', data)
  // PRC FIX
  // example1.items = result

  var chartLabels = []

  result.forEach((row) => {
    chartLabels.push(row.grouptitle)
  })

  var chartDatasets = []
  var chartDatasetsLookup = {} // subitem_label => idnex

  result.forEach((row, valueIndex) => {
    row.subitems.forEach((row2) => {
      var lookupKey = row2.grouptitle

      if (typeof chartDatasetsLookup[lookupKey] === typeof undefined) {
        chartDatasetsLookup[lookupKey] = chartDatasets.length

        var dataset = {}
        dataset.label = row2.grouptitle
        dataset.data = []

        chartDatasets.push(dataset)
      }

      var targetIndex = chartDatasetsLookup[lookupKey]

      chartDatasets[targetIndex].data[valueIndex] = row2.count
    })

    // chartDatasets[index] = dataset;
    // dataset.label = the_label;
    // chartDatasets.push(dataset);
    // top_level_keys[row[top_level_key] ] = true;
  })

  console.log('lookup', chartDatasetsLookup)
  console.log('datasets', chartDatasets)

  myChart.config.data.labels = chartLabels
  myChart.config.data.datasets = chartDatasets

  myChart.update()

  console.log('full data', result)
  console.log(chartLabels)
  // example1.items.push({message : "TEST"});
}