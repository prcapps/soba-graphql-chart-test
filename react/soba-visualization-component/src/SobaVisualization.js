import React, { Component } from 'react';
// import { XYFrame } from 'semiotic'
import {
  Line, Bar, Doughnut, Pie,
} from 'react-chartjs-2';

import {
  Tab, Tabs, TabList, TabPanel,
} from 'react-tabs';

// import { GoogleSpreadsheets } from 'google-spreadsheets';


import SobaTable from './SobaTable';

import '../css/SobaVisualization.css';

// PRC TEMP

const query = `query generic_month_stats($dataset: String!, $byDate: [String], $groupBy: [String], $count : String!, $dateField: String!, $filters: [GenericStatsFilterGroup]) {
  generic_month_stats(dataset: $dataset, count: $count, dateField: $dateField, byDate: $byDate, groupBy: $groupBy, filters: $filters) {
    count
    grouptitle
    groupcategory
    subitems {
      count
      grouptitle
      groupcategory
      subitems {
        count
        grouptitle
        groupcategory
        subitems {
          count
          grouptitle
          groupcategory
          subitems {
            count
            grouptitle
            groupcategory
            subitems {
              count
              grouptitle
              groupcategory
            }
          }
        }
      }
    }
  }
}`;

class SobaVisualization extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataset: '',
      groupByText: '["offense_group_level", "offense_group_short_description"]',
      byDateText: '["year"]',
      groupBy: ['offense_group_level', 'offense_group_short_description'],
      byDate: [],
      count: 'incident_id',
      dateField: 'date_occurred',
      items: [],
      errors: [],
      chartDatasets: [],
      chartLabels: [],
      chartType: 'line',
    };

    this.state.count = props.count;
    this.state.dataset = props.dataset;
    this.state.byDate = props.byDate;
    this.state.byDateText = props.byDate;
    this.state.chartType = props.chartType;
    this.state.groupBy = props.groupBy;
    this.state.groupByText = props.groupBy;

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // console.log('update', prevState.byDateText, this.state.byDateText)
    if (prevState.byDateText !== this.state.byDateText) {
      this.getData();
    }

    if (prevState.groupByText !== this.state.groupByText) {
      this.getData();
    }
  }

  getData() {

    if (true) {
      console.log('test123');
      // ID of the Google Spreadsheet
      // const spreadsheetID = '1oyMRNYXrTCBLXh0166zN432k7Pg7TIvu5FrEa8znjQ4';
      const spreadsheetID = '1bzdwPn0ZT_hTt80RNPDPBPBSloMQpmErVjvOn88GL-s';

      const url = 'https://spreadsheets.google.com/feeds/list/' + spreadsheetID + '/od6/public/values?alt=json';

      // const opts = { key: spreadsheetID, worksheet: 1 };
      // console.log(GoogleSpreadsheets);
      // GoogleSpreadsheets.rows(opts).then((data) => {
      //   console.log('patrick', data);

      // });


      // eslint-disable-next-line
      fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // eslint-disable-next-line
          'Accept': 'application/json',
        },
      })
        .then(r => r.json())
        .then((data) => {
          console.log('full data', data);
          if (data.feed.entry) {
            const chartData = this.processGoogleSheetForChart(data.feed.entry);
            this.setState({
              chartDatasets: chartData[0],
              chartLabels: chartData[1],
            });
            this.setState({
              items: chartData[2],
              errors: false,
              loadingChart: false,
            });
          } else {
            this.setState({
              errors: 'Google Sheet Error',
              loadingChart: false,
              items: [],
            });
          }
        });

      // $('.results').prepend('<h2>'+this.gsx$name.$t+'</h2><p>'+this.gsx$age.$t+'</p>');

      this.setState({
        loadingChart: true,
      });

      return true;
    }





    const dataset = this.state.dataset;
    const byDate = JSON.parse(this.state.byDateText);
    const groupBy = JSON.parse(this.state.groupByText);
    const count = this.state.count;
    const dateField = this.state.dateField;

    const filters = [
      // {op:"OR",
      //   filters:
      //     [
      //       {key: "name_race", op:"=",value:"B"},
      //       {key: "name_race", op:"=",value:"W"}
      //     ]
      // },
      {
        op: 'AND',
        filters:
          [
            { key: 'search_initiated', op: '=', value: '1' },
            { key: 'name_type', op: '=', value: 'DRIV' },
            { key: 'sbi_submission_date', op: '>=', value: '2018-01-01' },
            { key: 'date_occurred', op: '>=', value: '2018-01-01' },
          ],
      },
    ];

    console.log(this.state.byDateText);

    const inputVariables = {
      dataset, byDate, groupBy, count, dateField, filters,
    };

    console.log(inputVariables);
    const bodyString = JSON.stringify(
      {
        query,
        variables: inputVariables,
      },
    );


    console.log(bodyString);

    this.setState({
      loadingChart: true,
    });

    // eslint-disable-next-line
    fetch('http://localhost:8080/graphql', {
    // fetch('https://graphql.prcapps.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // eslint-disable-next-line
        'Accept': 'application/json',
      },
      body: bodyString,
    })
      .then(r => r.json())
      .then((data) => {
        console.log('data', data);

        if (data.data.generic_month_stats) {
          const chartData = this.processGraphQLForChart(data.data.generic_month_stats);
          this.setState({
            chartDatasets: chartData[0],
            chartLabels: chartData[1],
          });
          this.setState({
            items: data.data.generic_month_stats,
            errors: false,
            loadingChart: false,
          });
        } else {
          this.setState({
            errors: data.errors[0].message,
            loadingChart: false,
            items: [],
          });
        }
      });
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  }

  processGoogleSheetForChart(data) {
    console.log('dta', data);
    const chartLabels = [];

    console.log(this);

    const chartDatasets = [];
    const chartDatasetsLookup = {}; // subitem_label => idnex
    const chartLabelLookup = {}; // key => index

    const tableData = [];

    const chartColors = ['rgba(0, 255, 0, 0.4)', 'rgba(0, 0, 255, 0.4)'];

    data.forEach((row) => {
      let activeYear = false;
      const tableRow = {};

      Object.keys(row).forEach((index) => {
        console.log('test', index);

        if (index.indexOf('gsx$') === 0) {
          const key = index.replace('gsx$', '');
          const value = row[index].$t;
          console.log('val', value);

          if (key === 'year') {
            if (chartLabels.indexOf(key) === -1) {
              chartLabelLookup[value] = chartLabels.length;
              chartLabels.push(value);
              activeYear = value;
              tableRow.grouptitle = value;
              tableRow.groupcategory = 'Year';
              tableRow.count = '';
              tableRow.subitems = [];
            }
          } else {
            const lookupKey = key;

            if (typeof chartDatasetsLookup[lookupKey] === typeof undefined) {
              chartDatasetsLookup[lookupKey] = chartDatasets.length;

              const dataset = {};
              dataset.label = lookupKey;
              dataset.coordinates = [];
              dataset.data = [];
              dataset.backgroundColor = chartColors[chartDatasets.length];

              chartDatasets.push(dataset);
            }

            const targetIndex = chartDatasetsLookup[lookupKey];
            const valueIndex = chartLabelLookup[activeYear];

            tableRow.subitems[targetIndex] = {grouptitle: key, groupcategory: 'category', count: value, subitems: [] };

            // chartDatasets[targetIndex].coordinates[valueIndex] = {
            //   count: row2.count, year: row.grouptitle,
            // };

            console.log(lookupKey, valueIndex, chartDatasets, value);

            chartDatasets[targetIndex].data[valueIndex] = value;
          }
        }
      });
      tableData.push(tableRow);
    });

    console.log('labels', chartLabels);
    console.log('data', chartDatasets);
    console.log('table', tableData);

    return [chartDatasets, chartLabels, tableData];
  }

  processGraphQLForChart(data) {
    console.log('result', data, this);

    const chartLabels = [];

    data.forEach((row) => {
      chartLabels.push(row.grouptitle);
    });
    console.log('labels', chartLabels);

    const chartDatasets = [];
    const chartDatasetsLookup = {}; // subitem_label => idnex

    const chartColors = ['rgba(0, 255, 0, 0.4)', 'rgba(0, 0, 255, 0.4)'];

    data.forEach((row, valueIndex) => {
      row.subitems.forEach((row2) => {
        const lookupKey = row2.grouptitle;

        if (typeof chartDatasetsLookup[lookupKey] === typeof undefined) {
          chartDatasetsLookup[lookupKey] = chartDatasets.length;

          const dataset = {};
          dataset.label = row2.grouptitle;
          dataset.coordinates = [];
          dataset.data = [];
          dataset.backgroundColor = chartColors[chartDatasets.length];

          chartDatasets.push(dataset);
        }

        const targetIndex = chartDatasetsLookup[lookupKey];

        chartDatasets[targetIndex].coordinates[valueIndex] = {
          count: row2.count, year: row.grouptitle,
        };

        chartDatasets[targetIndex].data[valueIndex] = row2.count;
      });
    });

    return [chartDatasets, chartLabels];
  }

  render() {
    // const frameProps = {
    //   title: "Chart",
    //   size: [800,400],
    //   lines: [{ label: "Queens Park Rangers", coordinates: this.state.chartDatasets }],
    //   xAccessor: "grouptitle",
    //   yAccessor: "count",
    //   lineStyle: { stroke: "blue" },
    //   hoverAnnotation: true,
    //   margin: {top: 50, left: 50, bottom: 50, right: 50},
    //   axes: [
    //     { key: 'yAxis', orient: 'left', className: 'yscale', name: 'CountAxis' },
    //     { key: 'xAxis', orient: 'bottom', className: 'xscale', name: 'TimeAxis', tickValues : this.state.chartLabels }
    //   ],
    //   hoverAnnotation : true,
    // };

    // frameProps.lines = this.state.lines;

    // <XYFrame
    //       {...frameProps}
    //       tooltipContent={d =>
    //      <div className="tooltip-content" >
    //        <p>{d.x} : {d.y}</p>
    //     </div>}
    //       />

    const testData = {
      labels: this.state.chartLabels,
      datasets: this.state.chartDatasets,
    };

    const chartOptions = {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
            stacked: false,
          },
        ],
      },
    };

    let chart = <Bar data={testData} options={chartOptions} />;

    if (this.state.chartType === 'line') {
      chart = <Line data={testData} options={chartOptions} />;
    } else if (this.state.chartType === 'doughnut') {
      chart = <Doughnut data={testData} options={chartOptions} />;
    } else if (this.state.chartType == 'pie') {
      chart = <Pie data={testData} options={chartOptions} />;
    }

    if (this.state.loadingChart) {
      chart = <div className="loading-container"><h2>Loading...</h2></div>;
    }

    let table = <SobaTable items={this.state.items} />;

    if (this.state.loadingChart) {
      table = <div className="loading-container"><h2>Loading...</h2></div>;
    }

    return (
      <div className="soba-visualization">
        <div className="user-controls">
          <h1>{ this.props.title }</h1>
          <h4>
            {this.props.dataset}
            &nbsp; group by &nbsp;
            {this.state.groupByText}
            &nbsp; and date &nbsp;
            {this.state.byDateText}
          </h4>
          <select
            name="byDateText"
            value={this.state.byDateText}
            onChange={this.handleInputChange}
          >

            <option value='["year"]'>Year</option>
            <option value='["month"]'>Month</option>
            <option value='["week"]'>Week</option>
            <option value='["day"]'>Day of Month</option>
            <option value='["dow"]'>Day of Week</option>
          </select>
        </div>
        <Tabs>
          <TabPanel>
            <select
              name="chartType"
              value={this.state.chartType}
              onChange={this.handleInputChange}
            >
              <option value="line">Line Chart</option>
              <option value="bar">Bar Chart</option>
              <option value="doughnut">Doughnut Chart</option>
              <option value="pie">Pie Chart</option>
            </select>
            {chart}
          </TabPanel>
          <TabPanel>
            { table }
          </TabPanel>
          <TabPanel>
            <div className="inputs">
              <div>
                <label>Dataset:</label>
                <input
                  name="dataset"
                  type="text"
                  value={this.state.dataset}
                  onChange={this.handleInputChange}
                  />
              </div>
              <div>
                <label>Count Field:</label>
                <input
                  name="count"
                  type="text"
                  value={this.state.count}
                  onChange={this.handleInputChange}
                />
              </div>
              <div>
                <label>Date Field:</label>
                <input
                  name="dateField"
                  type="text"
                  value={this.state.dateField}
                  onChange={this.handleInputChange}
                />
              </div>
              <div>
                <label>Group By:</label>
                <input
                  name="groupByText"
                  type="text"
                  value={this.state.groupByText}
                  onChange={this.handleInputChange}
                />
              </div>
              <div>
                <label>Date Field:</label>
                <input
                  name="byDateText"
                  type="text"
                  value={this.state.byDateText}
                  onChange={this.handleInputChange}
                />
              </div>
            </div>
          </TabPanel>
          <TabList>
            <Tab>Chart</Tab>
            <Tab>Table</Tab>
            <Tab>Settings</Tab>
          </TabList>
        </Tabs>
        { this.state.errors }
      </div>
    );
  }
}

export default SobaVisualization;
