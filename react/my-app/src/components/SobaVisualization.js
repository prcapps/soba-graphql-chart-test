import React, { Component } from 'react';

import SobaTable from './SobaTable.js'

import './SobaVisualization.css';

var query = `query generic_month_stats($dataset: String!, $byDate: [String], $groupBy: [String], $count : String!, $dateField: String!) {
  generic_month_stats(dataset: $dataset, count: $count, dateField: $dateField, byDate: $byDate, groupBy: $groupBy) {
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
}`

class SobaVisualization extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataset: 'v_simplicity_crimes',
      groupByText: '["offense_group_level", "offense_group_short_description"]',
      byDateText: '["year"]',
      groupBy: ['offense_group_level', 'offense_group_short_description'],
      byDate: ['year'],
      count: 'incident_id',
      dateField: 'date_occurred',
      items: [],
      errors : []
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });

    this.getData()
  }

  componentDidMount() {
    this.getData()
  }

  getData() {
    var dataset = this.state.dataset
    var byDate = JSON.parse(this.state.byDateText)
    var groupBy = JSON.parse(this.state.groupByText)
    var count = this.state.count
    var dateField = this.state.dateField

    var variables = { dataset, byDate, groupBy, count, dateField }

    console.log(variables)
    var bodyString = JSON.stringify(
    {
    query,
    variables: variables
    });


    console.log(bodyString)
    fetch('http://localhost:8080/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: bodyString
      })
        .then(r => r.json())
        .then(data => {
          console.log(data);

          if(data.data.generic_month_stats){
             this.setState({
              items: data.data.generic_month_stats
            });
            this.setState({ errors : false })
          }
          else{
            this.setState({ errors : data.errors[0].message })
          }

         
          // processGraphQLForChart(data)
        });

  }

  render() {
    

    const items = [
                    {grouptitle : "TEST123", groupcategory : "TESTCAT", count: 123, subitems: [
                      {grouptitle : "TEST123456", groupcategory : "TESTCAT1", count: 1234, subitems: []}
                    ]},
                    {grouptitle : "TEST12345", groupcategory : "TESTCAT1", count: 1234, subitems: []}
                  ]
    return (
      <div class='soba-visualization'>
        <h1>TEST123</h1>
        <div class='inputs'>
          <div>
            <label>Dataset:</label>
            <input
              name="dataset"
              type="text"
              value={this.state.dataset}
              onChange={this.handleInputChange} />
          </div>
          <div>
            <label>Count Field:</label>
            <input
              name="count"
              type="text"
              value={this.state.count}
              onChange={this.handleInputChange} />
          </div>
          <div>
            <label>Date Field:</label>
            <input
              name="dateField"
              type="text"
              value={this.state.dateField}
              onChange={this.handleInputChange} />
          </div>
          <div>
            <label>Group By:</label>
            <input
              name="groupByText"
              type="text"
              value={this.state.groupByText}
              onChange={this.handleInputChange} />
          </div>
          <div>
            <label>Date Field:</label>
            <input
              name="byDateText"
              type="text"
              value={this.state.byDateText}
              onChange={this.handleInputChange} />
          </div>
        </div>
        { this.state.errors }
        <SobaTable items={this.state.items}></SobaTable>
      </div>
    );
  }
}

export default SobaVisualization;



  


// var groupBy = ['offense_group_level', 'offense_group_short_description']
// var byDate = ['year']
// var dataset = 'v_simplicity_crimes'
// var count = 'incident_id'
// var dateField = 'date_occurred'


// export default {
//   name: 'SobaVisualization',
//   components: {
//     SobaTable
//   },
//   props: {
//     // items: Array
//     // msg123: String,
//     // items: [String],
//     // groupByText: '',
//     // byDateText: '',
//     datasetIn: ''
//     // count: '',
//     // dateField: ''
//   },
//   data () {
//     return {
//       items: [],
//       groupByText: '["offense_group_level", "offense_group_short_description"]',
//       byDateText: '["year"]',
//       groupBy: ['offense_group_level', 'offense_group_short_description'],
//       byDate: ['year'],
//       dataset: 'v_simplicity_crimes',
//       count: 'incident_id',
//       dateField: 'date_occurred'
//     }
//   },
//   mounted: function () {
//     this.dataset = this.datasetIn;
//     this.doFetch()
//   },
//   // actions
//   methods: {
//     doFetch () {
//       console.log(this.dataset)
//       // var variables = {}
//       // variables[this.dataset]
//       // variables[this.byDate]
//       // variables[this.groupBy]
//       // variables[this.count]
//       // variables[this.dateField]

//       var dataset = this.dataset
//       var byDate = this.byDate
//       var groupBy = this.groupBy
//       var count = this.count
//       var dateField = this.dateField

//       var variables = { dataset, byDate, groupBy, count, dateField }

//       console.log(variables)
//       var bodyString = JSON.stringify(
//         {
//           query,
//           variables: variables
//         })

//       console.log(bodyString)

//       fetch('http://localhost:8080/graphql', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json'
//         },
//         body: bodyString
//       })
//         .then(r => r.json())
//         .then(data => {
//           this.items = data.data.generic_month_stats
//           // processGraphQLForChart(data)
//         })
//     }
//   },
//   watch: {
//     // whenever question changes, this function will run
//     groupByText: function (newValue, oldValue) {
//       this.groupBy = JSON.parse(newValue)
//       this.doFetch()
//     },
//     byDateText: function (newValue, oldValue) {
//       this.byDate = JSON.parse(newValue)
//       this.doFetch()
//     },
//     dataset: function (newValue, oldValue) {
//       // dataset = newValue
//       this.doFetch()
//     },
//     count: function (newValue, oldValue) {
//       // count = newValue
//       this.doFetch()
//     },
//     dateField: function (newValue, oldValue) {
//       // dateField = newValue
//       this.doFetch()
//     }
//   }
// }

