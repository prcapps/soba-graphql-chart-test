

var groupBy = [ "offense_group_level", "offense_group_short_description"];
var byDate = ["year"];
var dataset = "v_simplicity_crimes";
var count = "incident_id";
var dateField = "date_occurred";


var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
  }
})


var example1 = new Vue({
  el: '#example-1',
  data: {
    items: [
      { message: 'Foo' },
      { message: 'Bar' }
    ],
    groupByText: "",
    byDateText : "",
    dataset : "",
    count : "",
    dateField : ""
  },
  watch: {
	    // whenever question changes, this function will run
	    groupByText: function (newValue, oldValue) {
	    	console.log(newValue);
	    	groupBy =  JSON.parse(newValue);
	    	doFetch();
	    },
	    byDateText: function (newValue, oldValue) {
	    	console.log(newValue);
	    	byDate =  JSON.parse(newValue);
	    	doFetch();
	    },
	    dataset: function (newValue, oldValue) {
	    	console.log(newValue, 'test');
	    	dataset = newValue;
	    	doFetch();
	    },
	    count: function (newValue, oldValue) {
	    	count = newValue;
	    	doFetch();
	    },
	    dateField: function (newValue, oldValue) {
	    	dateField = newValue;
	    	doFetch();
	    }
	}
})

function processGraphQLForChart(data){
	var result = data.data.generic_month_stats;
	console.log('result', data);
	example1.items = result;

	var chartLabels = [];

	// [{
            // label: '# of Votes',
 //            data: [12, 19, 3, 5, 2, 3],
 //            backgroundColor: [
 //                'rgba(255, 99, 132, 0.2)',
 //                'rgba(54, 162, 235, 0.2)',
 //                'rgba(255, 206, 86, 0.2)',
 //                'rgba(75, 192, 192, 0.2)',
 //                'rgba(153, 102, 255, 0.2)',
 //                'rgba(255, 159, 64, 0.2)'
 //            ],
 //            borderColor: [
 //                'rgba(255,99,132,1)',
 //                'rgba(54, 162, 235, 1)',
 //                'rgba(255, 206, 86, 1)',
 //                'rgba(75, 192, 192, 1)',
 //                'rgba(153, 102, 255, 1)',
 //                'rgba(255, 159, 64, 1)'
 //            ],
 //            borderWidth: 1
 //        }]

	result.forEach((row) => {
		chartLabels.push(row.grouptitle);
	});


	var chartDatasets = [];
	var chartDatasetsLookup = {}; // subitem_label => idnex

	result.forEach((row, value_index) => {

		row.subitems.forEach((row2) => {
			var lookup_key = row2.grouptitle;

			if(typeof chartDatasetsLookup[lookup_key] === typeof undefined){
				chartDatasetsLookup[lookup_key] = chartDatasets.length;

				var dataset = {};
				dataset.label = row2.grouptitle;
				dataset.data = [];

				chartDatasets.push(dataset);
			}

			var target_index = chartDatasetsLookup[lookup_key];

			chartDatasets[target_index].data[value_index] = row2.count;
		});

		// chartDatasets[index] = dataset;

		// dataset.label = the_label;

		// chartDatasets.push(dataset);

		// top_level_keys[row[top_level_key] ] = true;
	});

	console.log('lookup', chartDatasetsLookup);
	console.log('datasets', chartDatasets);

	myChart.config.data.labels = chartLabels;
	myChart.config.data.datasets = chartDatasets;

	myChart.update();





	console.log('full data', result);
	console.log(chartLabels);
	// example1.items.push({message : "TEST"});
}


example1.groupByText = JSON.stringify(groupBy);
example1.byDateText = JSON.stringify(byDate);
example1.dataset = dataset;
example1.count = count;
example1.dateField = dateField;

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
}`;


function doFetch(){

	var body_string = JSON.stringify({
	    query,
	    variables: { dataset, byDate, groupBy, count, dateField },
	  });

	console.log(body_string); 
 // fetch('http://localhost:8080/graphql', {   method: 'POST',   
 fetch('https://graphql.prcapps.com/graphql', {   method: 'POST',   
 	headers: {     'Content-Type': 'application/json',     'Accept': 'application/json',   },   
 	// body: JSON.stringify({query: "{ generic_month_stats(dataset: \"v_simplicity_crimes\", count: \"incident_id\", dateField: \"date_occurred\", byDate: [\"year\"], groupBy: [\"offense_group_level\", \"geo_beat\"]) {     count     grouptitle     groupcategory     subitems {       count       grouptitle       groupcategory       subitems {         count         grouptitle         groupcategory         subitems {           count           grouptitle           groupcategory           subitems {             count             grouptitle             groupcategory           }         }       }     }   } }"}) })  
 	body: body_string
 })
 .then(r => r.json())
 .then(data => {
 		processGraphQLForChart(data);

 	});
};

doFetch();

var ctx = document.getElementById("myChart");
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
                    beginAtZero:true
                }
            }]
        }
    }
});
