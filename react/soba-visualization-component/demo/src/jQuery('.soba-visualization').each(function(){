jQuery('.soba-visualization').each(function(){
	var title = jQuery(this).attr('data-title');
	var spreadsheetID = jQuery(this).attr('data-spreadsheetid');
	var dataset = jQuery(this).attr('data-dataset');
	var count = jQuery(this).attr('data-count');
	var byDate = jQuery(this).attr('data-bydate');
	var groupBy = jQuery(this).attr('data-groupby');
	var chartType = jQuery(this).attr('data-charttype');
	var showChartTypeSelect = jQuery(this).attr('data-showcharttypeselect');
	var filters = jQuery(this).attr('data-filters');
	var datasetLabels = jQuery(this).attr('data-datasetLabels');
	var labelX = jQuery(this).attr('data-labelX');
	var labelY = jQuery(this).attr('data-labelY');
	
	if(filters){
		filters = JSON.parse(filters);	
	}

	if(datasetLabels){
		filters = JSON.parse(datasetLabels);	
	}

	var props = {
		title: title, 
		spreadsheetId: spreadsheetID,
		dataset: dataset,
		count: count,
		byDate: byDate,
		groupBy: groupBy,
		chartType: chartType,
		showChartTypeSelect: showChartTypeSelect,
		filters: filters,
		datasetLabels: datasetLabels,
		labelX: labelX,
		labelY: labelY
	};

	var elm = jQuery(this)[0];

	ReactDOM.render(React.createElement(SobaVisualization, props), elm);
});
//# sourceMappingURL=visualization.js.map