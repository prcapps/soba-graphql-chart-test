{
  generic_month_stats(dataset: "v_simplicity_crimes", count: "incident_id", dateField: "date_occurred", byDate: ["year"], groupBy: ["geo_beat", "offense_group_level"]) {
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


fetch('/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  body: JSON.stringify({query: "{ generic_month_stats(dataset: \"v_simplicity_crimes\", count: \"incident_id\", dateField: \"date_occurred\", byDate: [\"year\"], groupBy: [\"geo_beat\", \"offense_group_level\"]) {
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
}"})
})
  .then(r => r.json())
  .then(data => console.log('data returned:', data));