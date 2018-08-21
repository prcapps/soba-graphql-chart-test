<template>
  <div class='soba-visualization'>
      <h1>TEST123</h1>
      <div class='inputs'>
        <div>
          <label>Dataset:</label>
          <input v-model="dataset" placeholder="edit me">
        </div>
        <div>
          <label>Count Field:</label>
          <input v-model="count" placeholder="edit me">
        </div>
        <div>
          <label>Date Field:</label>
          <input v-model="dateField" placeholder="edit me">
        </div>
        <div>
          <label>Group By:</label>
          <input v-model="groupByText" placeholder="edit me">
        </div>
        <div>
          <label>Date Field:</label>
          <input v-model="byDateText" placeholder="edit me">
        </div>
      </div>
      <!-- <strong>{{ items[0].groupcategory }}</strong> -->
      <SobaTable v-bind:items="items"></SobaTable>
    </div>
</template>

<script>
import SobaTable from './SobaTable.vue'

// var groupBy = ['offense_group_level', 'offense_group_short_description']
// var byDate = ['year']
// var dataset = 'v_simplicity_crimes'
// var count = 'incident_id'
// var dateField = 'date_occurred'
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

export default {
  name: 'SobaVisualization',
  components: {
    SobaTable
  },
  props: {
    // items: Array
    // msg123: String,
    // items: [String],
    // groupByText: '',
    // byDateText: '',
    datasetIn: ''
    // count: '',
    // dateField: ''
  },
  data () {
    return {
      items: [],
      groupByText: '["offense_group_level", "offense_group_short_description"]',
      byDateText: '["year"]',
      groupBy: ['offense_group_level', 'offense_group_short_description'],
      byDate: ['year'],
      dataset: 'v_simplicity_crimes',
      count: 'incident_id',
      dateField: 'date_occurred'
    }
  },
  mounted: function () {
    this.dataset = this.datasetIn;
    this.doFetch()
  },
  // actions
  methods: {
    doFetch () {
      console.log(this.dataset)
      // var variables = {}
      // variables[this.dataset]
      // variables[this.byDate]
      // variables[this.groupBy]
      // variables[this.count]
      // variables[this.dateField]

      var dataset = this.dataset
      var byDate = this.byDate
      var groupBy = this.groupBy
      var count = this.count
      var dateField = this.dateField

      var variables = { dataset, byDate, groupBy, count, dateField }

      console.log(variables)
      var bodyString = JSON.stringify(
        {
          query,
          variables: variables
        })

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
          this.items = data.data.generic_month_stats
          // processGraphQLForChart(data)
        })
    }
  },
  watch: {
    // whenever question changes, this function will run
    groupByText: function (newValue, oldValue) {
      this.groupBy = JSON.parse(newValue)
      this.doFetch()
    },
    byDateText: function (newValue, oldValue) {
      this.byDate = JSON.parse(newValue)
      this.doFetch()
    },
    dataset: function (newValue, oldValue) {
      // dataset = newValue
      this.doFetch()
    },
    count: function (newValue, oldValue) {
      // count = newValue
      this.doFetch()
    },
    dateField: function (newValue, oldValue) {
      // dateField = newValue
      this.doFetch()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
