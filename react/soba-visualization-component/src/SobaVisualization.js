import React, { Component } from 'react';
// import { XYFrame } from 'semiotic'
import {
  Line, Bar, Doughnut, Pie,
} from 'react-chartjs-2';

import {
  Tab, Tabs, TabList, TabPanel,
} from 'react-tabs';


const API_KEY = 'AIzaSyC7rROXbT3W8IP4gs0oMtDGxumkMF4CFXo';


// import { drive_v3 } from 'googleapis';
// import { GoogleSheets } from 'google-drive-sheets';
// import { GoogleSpreadsheets } from 'google-spreadsheets';


import SobaTable from './SobaTable';

import '../css/SobaVisualization.css';

// PRC TEMP

const query = `query generic_stats($dataset: String!, $fields: [GenericStatsAggregateField], $groupBy: [GenericStatsGroupBy], $filters: GenericStatsFilterGroup) {
  generic_stats(dataset: $dataset, fields: $fields, groupBy: $groupBy, filters: $filters) {
    groupTitle
    groupCategory
    fields {
      column
      aggregateFunction
      value
    }
    subitems {
      groupTitle
      groupCategory
      fields {
        column
        aggregateFunction
        value
      }
      subitems {
        groupTitle
        groupCategory
        fields {
          column
          aggregateFunction
          value
        }
        subitems {
          groupTitle
          groupCategory
          fields {
            column
            aggregateFunction
            value
          }
          subitems {
            groupTitle
            groupCategory
            fields {
              column
              aggregateFunction
              value
            }
            subitems {
              groupTitle
              groupCategory
             fields {
                column
                aggregateFunction
                value
              }
            }
          }
        }
      }
    }
  }
}`;

const chartColors = ['rgba(27,158,119, 0.8)','rgba(217,95,2, 0.8)','rgb(117,112,179)','rgb(231,41,138)','rgb(102,166,30)','rgb(230,171,2)'];

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
      filters: '',
      items: [],
      errors: [],
      chartDatasets: [],
      chartLabels: [],
      chartType: 'line',
      dataMode: 'graphql',
      spreadsheetID: false,
      showChartTypeSelect: true,
      gapiReady: false,
    };

    const {
      count, dataset, byDate, chartType, groupBy, spreadsheetId, showChartTypeSelect, filters,
    } = props;

    this.state.count = count;
    this.state.dataset = dataset;
    this.state.byDate = byDate;
    this.state.byDateText = byDate;
    this.state.chartType = chartType;
    this.state.groupBy = groupBy;
    this.state.groupByText = groupBy;
    this.state.spreadsheetID = spreadsheetId;
    this.state.filters = filters;

    console.log('patrick test', filters);

    if (typeof showChartTypeSelect !== typeof undefined) {
      this.state.showChartTypeSelect = (showChartTypeSelect == true);
    }

    if (spreadsheetId) {
      this.state.dataMode = 'google';
    }

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  // PRC - Clean this up! 
  loadGoogleAPI() {
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/client.js";

    const obj = this;

    script.onload = () => {
      gapi.load('client', () => {
        gapi.client.setApiKey(API_KEY);
        gapi.client.load('sheets', 'v4', () => {
          // console.log("GOOGLE LOADED", this, this.state.gapiReady, this.state.dataMode);

          obj.getData();
          obj.setState({ gapiReady: true });
        });
      });
    };

    document.body.appendChild(script);
  }

  componentDidMount() {
    this.getData();
    this.loadGoogleAPI();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { byDateText, groupByText } = this.state;

    // console.log('update', prevState.byDateText, this.state.byDateText)
    if (prevState.byDateText !== byDateText) {
      this.getData();
    }

    if (prevState.groupByText !== groupByText) {
      this.getData();
    }
  }

  getData() {
    const { dataMode } = this.state;

    if (dataMode === 'google') {
      if (typeof gapi === typeof undefined) {
        console.log('not ready');
        return;
      }

      // console.log('gapi', gapi);

      const {  spreadsheetID } = this.state;
      // ID of the Google Spreadsheet
      // const spreadsheetID = '1oyMRNYXrTCBLXh0166zN432k7Pg7TIvu5FrEa8znjQ4';
      const url = 'https://spreadsheets.google.com/feeds/list/' + spreadsheetID + '/od6/public/values?alt=json';

      const params = {
        // The ID of the spreadsheet to retrieve data from.
        spreadsheetId: spreadsheetID,  // TODO: Update placeholder value.

        // The A1 notation of the values to retrieve.
        range: 'A:Z',  // TODO: Update placeholder value.
      };

      var request = gapi.client.sheets.spreadsheets.values.get(params);
      request.then((response) => {
        // TODO: Change code below to process the `response` object:
        console.log('data coming back', response.result);

        if (response.result) {
          const chartData = this.processGoogleSheetForChartFromAPI(response.result.values);
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
      }, function(reason) {
        console.error('error: ' + reason.result.error.message);
      });


      // eslint-disable-next-line
      // fetch(url, {
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     // eslint-disable-next-line
      //     'Accept': 'application/json',
      //   },
      // })
      //   .then(r => r.json())
      //   .then((data) => {
      //     console.log('test123', data);
      //     if (data.feed.entry) {
      //       const chartData = this.processGoogleSheetForChart(data.feed.entry);
      //       this.setState({
      //         chartDatasets: chartData[0],
      //         chartLabels: chartData[1],
      //       });
      //       this.setState({
      //         items: chartData[2],
      //         errors: false,
      //         loadingChart: false,
      //       });
      //     } else {
      //       this.setState({
      //         errors: 'Google Sheet Error',
      //         loadingChart: false,
      //         items: [],
      //       });
      //     }
      //   });

      // $('.results').prepend('<h2>'+this.gsx$name.$t+'</h2><p>'+this.gsx$age.$t+'</p>');

      this.setState({
        loadingChart: true,
      });

      return true;
    } else {
      const {
        dataset, count, dateField, byDateText, groupByText, filters
      } = this.state;

      // const dataset = this.state.dataset;
      let byDate = false;

      if (byDateText) {
        byDate = JSON.parse(byDateText); //['year'];
      }

      let groupByOld = false;
      if ( groupByText ) {
        groupByOld = JSON.parse(groupByText);// ['name_race'];
      }

      // const count = this.state.count;
      // const dateField = this.state.dateField;

      // let filters = 
      //   // {op:"OR",
      //   //   filters:
      //   //     [
      //   //       {key: "name_race", op:"=",value:"B"},
      //   //       {key: "name_race", op:"=",value:"W"}
      //   //     ]
      //   // },
      //   {
      //     op: 'AND',
      //     filters:
      //       [
      //         { key: 'search_initiated', op: '=', value: '1' },
      //         { key: 'name_type', op: '=', value: 'DRIV' },
      //         { key: 'sbi_submission_date', op: '>=', value: '2018-01-01' },
      //         { key: 'date_occurred', op: '>=', value: '2018-01-01' },
      //       ],
      //   };

      // filters = filters.replace('"', "'");
      console.log('filters', filters, groupBy);

      const fields = [{column: count}];

      const groupBy = [];

      groupBy.push({column: byDate[0], dateField: dateField});

      if(groupByOld){
        groupByOld.map((row) => {
          groupBy.push({column: row});
        });        
      }

      const inputVariables = {
        dataset, fields, groupBy, filters,
      };

      console.log(inputVariables);
      const bodyStringArgs = {
        query,
        variables: inputVariables,
      };

      const bodyString = JSON.stringify(bodyStringArgs);

      console.log('input', inputVariables);

      this.setState({
        loadingChart: true,
      });

      // eslint-disable-next-line
      // fetch('http://localhost:8080/graphql', {
      fetch('https://graphql.prcapps.com/graphql', {
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
          if (data.data.generic_stats) {
            const chartData = this.processGraphQLForChart(data.data.generic_stats);
            this.setState({
              chartDatasets: chartData[0],
              chartLabels: chartData[1],
            });
            this.setState({
              items: data.data.generic_stats,
              errors: false,
              loadingChart: false,
            });
          } else {
            console.log(data.errors, data);
            this.setState({
              errors: data.errors[0].message,
              loadingChart: false,
              items: [],
            });
          }
        });
    }


  }

  handleInputChange(event) {
    const { target } = event;
    const name = target.name;
    const value = target.type === 'checkbox' ? target.checked : target.value;

    console.log('input change', name, value, target, event);
    this.setState({
      [name]: value,
    });
  }

  processGoogleSheetForChartFromAPI(data) {
    console.log('data', data);

    const chartLabels = [];
    const chartDatasets = [];

    // First row is headers
    const firstRow = data.shift(); 

    const yearLabel = firstRow.shift();
    firstRow.forEach((value) => {
      const dataset = {};
      dataset.label = value;
      dataset.coordinates = [];
      dataset.data = [];
      dataset.backgroundColor = chartColors[chartDatasets.length];

      chartDatasets.push(dataset);
    });

    console.log(firstRow);
    console.log(chartDatasets);

    console.log(this);
    const tableData = [];

    data.forEach((value_array, columnIndex) => {
      const tableRow = {};

      const yearTitle = value_array.shift();

      console.log('data set', yearTitle);
      chartLabels.push(yearTitle);
      tableRow.groupTitle = yearTitle;
      tableRow.groupCategory = yearLabel;
      tableRow.count = '';
      tableRow.subitems = [];

      value_array.forEach((value, dataSetIndex) => {
        chartDatasets[dataSetIndex].data[columnIndex] = value;

        tableRow.subitems[dataSetIndex] = {
          groupTitle: chartDatasets[dataSetIndex].label, groupCategory: 'category', count: value, subitems: [],
        };
      });

      tableData.push(tableRow);
    });

    // console.log('labels', chartLabels);
    // console.log('data', chartDatasets);
    // console.log('table', tableData);

    return [chartDatasets, chartLabels, tableData];
  }

  processGoogleSheetForChart(data) {
    console.log('data', data);
    const chartLabels = [];

    console.log(this);

    const chartDatasets = [];
    const chartDatasetsLookup = {}; // subitem_label => idnex
    const chartLabelLookup = {}; // key => index

    const tableData = [];


    data.forEach((row) => {
      let activeYear = false;
      const tableRow = {};

      Object.keys(row).forEach((index) => {
        // console.log('test', index);

        if (index.indexOf('gsx$') === 0) {
          const key = index.replace('gsx$', '');
          const value = row[index].$t;
          // console.log('val', value);

          if (key === 'year') {
            if (chartLabels.indexOf(key) === -1) {
              chartLabelLookup[value] = chartLabels.length;
              chartLabels.push(value);
              activeYear = value;
              tableRow.groupTitle = value;
              tableRow.groupCategory = 'Year';
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

            tableRow.subitems[targetIndex] = {
              groupTitle: key, groupCategory: 'category', count: value, subitems: [],
            };

            // chartDatasets[targetIndex].coordinates[valueIndex] = {
            //   count: row2.count, year: row.groupTitle,
            // };

            // console.log(lookupKey, valueIndex, chartDatasets, value);

            chartDatasets[targetIndex].data[valueIndex] = value;
          }
        }
      });
      tableData.push(tableRow);
    });

    // console.log('labels', chartLabels);
    // console.log('data', chartDatasets);
    // console.log('table', tableData);

    return [chartDatasets, chartLabels, tableData];
  }

  processGraphQLForChart(data) {
    const chartLabels = [];

    data.forEach((row) => {
      chartLabels.push(row.groupTitle);
    });

    const chartDatasets = [];
    const chartDatasetsLookup = {}; // subitem_label => idnex

    data.forEach((row, valueIndex) => {
      row.subitems.forEach((row2) => {
        const lookupKey = row2.groupTitle;

        if (typeof chartDatasetsLookup[lookupKey] === typeof undefined) {
          chartDatasetsLookup[lookupKey] = chartDatasets.length;

          const dataset = {};
          dataset.label = row2.groupTitle;
          dataset.coordinates = [];
          dataset.data = [];
          dataset.backgroundColor = chartColors[chartDatasets.length];

          chartDatasets.push(dataset);
        }

        const targetIndex = chartDatasetsLookup[lookupKey];

        chartDatasets[targetIndex].coordinates[valueIndex] = {
          count: row2.fields[0].value, year: row.groupTitle,
        };

        chartDatasets[targetIndex].data[valueIndex] = row2.fields[0].value;
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
    //     { key: 'xAxis', orient: 'bottom', className: 'xscale',
    //        name: 'TimeAxis', tickValues : this.state.chartLabels }
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

    const {
      chartType, chartLabels, chartDatasets, loadingChart, items, groupByText, byDateText, count,
      dateField, errors, dataMode, showChartTypeSelect,
    } = this.state;

    const { title, dataset } = this.props;


    const testData = {
      labels: chartLabels,
      datasets: chartDatasets,
    };

    const chartOptions = {
      scales: {
        // xAxes:[{
        //     ticks: {
        //         callback: function(value) {
        //           if(value.length > 10){

        //             return value.substr(0, 10) + "...";//truncate
        //           }
        //         },
        //     }
        // }],
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

    if (chartType === 'line') {
      chart = <Line data={testData} options={chartOptions} />;
    } else if (chartType === 'doughnut') {
      chart = <Doughnut data={testData} options={chartOptions} />;
    } else if (chartType === 'pie') {
      chart = <Pie data={testData} options={chartOptions} />;
    }

    if (loadingChart) {
      chart = <div className="loading-container"><h2>Loading...</h2></div>;
    }

    let table = <SobaTable items={items} />;

    if (loadingChart) {
      table = <div className="loading-container"><h2>Loading...</h2></div>;
    }

    let dateRangeFilter = false;

    if (dataMode === 'graphql') {
      dateRangeFilter = (
        <select
          name="byDateText"
          value={byDateText}
          onChange={this.handleInputChange}
        >
          <option value='["year"]'>Year</option>
          <option value='["month"]'>Month</option>
          <option value='["week"]'>Week</option>
          <option value='["day"]'>Day of Month</option>
          <option value='["dow"]'>Day of Week</option>
        </select>
      );
    }

    let settings = false;
    let settingsTab = false;
    let settingsPanel = false;
    if (dataMode === 'graphql') {
      settingsTab = <Tab>Settings</Tab>;
      settings = (
        <div className="inputs">
          <div>
            <label>Dataset:</label>
            <input
              name="dataset"
              type="text"
              value={dataset}
              onChange={this.handleInputChange}
            />
          </div>
          <div>
            <label>Count Field:</label>
            <input
              name="count"
              type="text"
              value={count}
              onChange={this.handleInputChange}
            />
          </div>
          <div>
            <label>Date Field:</label>
            <input
              name="dateField"
              type="text"
              value={dateField}
              onChange={this.handleInputChange}
            />
          </div>
          <div>
            <label>Group By:</label>
            <input
              name="groupByText"
              type="text"
              value={groupByText}
              onChange={this.handleInputChange}
            />
          </div>
          <div>
            <label>Date Field:</label>
            <input
              name="byDateText"
              type="text"
              value={byDateText}
              onChange={this.handleInputChange}
            />
          </div>
        </div>
      );

      settingsPanel = <TabPanel>{settings}</TabPanel>;
    }

    let chartTypeSelect = false;

    if (showChartTypeSelect) {
      chartTypeSelect = (
        <select
          name="chartType"
          value={chartType}
          onChange={this.handleInputChange}
        >
          <option value="line">Line</option>
          <option value="bar">Bar</option>
        </select>
      );
    }

    return (
      <div className="soba-visualization">
        <div className="user-controls">
          <h1>{ title }</h1>
          {dateRangeFilter}
        </div>
        <Tabs>
          <TabPanel>
            {chartTypeSelect}
            {chart}
          </TabPanel>
          <TabPanel>
            { table }
          </TabPanel>
          {settingsPanel}
          <TabList>
            <Tab>
              Chart
            </Tab>
            <Tab>Table</Tab>
            {settingsTab}
          </TabList>
        </Tabs>
        { errors }
      </div>
    );
  }
}

export default SobaVisualization;
