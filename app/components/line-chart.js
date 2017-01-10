import Ember from 'ember';
const { computed, Component, on, A: emberArray } = Ember;

export default Component.extend({
  dimension: null,
  group: null,
  // width: 900,
  // height: 300,
  order: null,

  draw: on('didInsertElement', function () {
      let id = this.get('id');
      let lineChart = dc.lineChart(`#${id}`);
      lineChart.updateMap = this.get('updateMap');
      lineChart.activeFilters = this.get('activeFilters');
      let width = this.$().parent().width();
      let height = this.$().parent().height();
      lineChart
        .width(width)
        .height(height)
        .margins({ top: 10, left: 50, right: 10, bottom: 20 })
        .dimension(this.get('dim'))
        .group(this.get('group'))
        // .colors(['slategrey'])
        // .x(d3.scale.linear().domain([1, 12]))
        .x(d3.time.scale().domain([new Date(2001, 0, 1), new Date(2016, 11, 31)]))
        .xUnits(d3.time.years)
        // .round(d3.time.years.round)
        // .xUnits(function (start, end, xDomain) {
        //     debugger;
        //     // simply calculates how many integers in the domain
        //     return Math.abs(end - start);
        //   })
        // .xyTipsOn(true)
        .elasticY(true)
        .elasticX(true)
        .y(d3.scale.linear())
        .brushOn(true)
        .interpolate('basis')
        .on('preRedraw', function (chart) {
          chart.updateMap();
          chart.activeFilters(chart.filters());
        })
        // .stack(this.get('group'), "Gap", function(d) {
        //   return Math.abs(d.value.gap);
        // })
        // .valueAccessor(function (d) {
        //   // return d.value;
        //   return Math.round(d.value.avg);
        // })

      // .label(function (i) {
      //   let units = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      //   return units[+i.key];
      // }).on('preRedraw', function (chart) {
      //   chart.hack();
      // });
    }),
});
