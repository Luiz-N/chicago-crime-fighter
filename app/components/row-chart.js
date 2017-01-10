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
      let rowChart = dc.rowChart(`#${id}`);
      this.set('chart')
      rowChart.updateMap = this.get('updateMap');
      rowChart.activeFilters = this.get('activeFilters');
      let width = this.$().parent().width();
      let height = this.$().parent().height();
      rowChart
        .width(width)
        .height(height)
        // .margins({ top: 10, left: 10, right: 10, bottom: 20 })
        .group(this.get('group'))
        .dimension(this.get('dim'))
        .ordering(function (d) { return -d.value; })
        .cap(8)
        .colors(['slategrey'])
        // .x(d3.scale.linear().domain([1, 12]))
        // .x(d3.time.scale().domain([new Date(2016, 0, 1), new Date(2016, 11, 31)]))
        // .xUnits(function (start, end, xDomain) {
        //     debugger;
        //     // simply calculates how many integers in the domain
        //     return Math.abs(end - start);
        //   })
        // .xyTipsOn(true)

        .elasticX(true)
        .on('preRedraw', (chart) => {
          chart.updateMap();
          chart.activeFilters(chart.filters());
        })
      })
});
