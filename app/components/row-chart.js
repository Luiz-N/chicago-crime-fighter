import Ember from 'ember';
const { computed, Component, on, A: emberArray } = Ember;

export default Component.extend({
  dimension: null,
  group: null,

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
        .group(this.get('group'))
        .dimension(this.get('dim'))
        .ordering(function (d) { return -d.value; })
        .cap(7)
        .colors('rgb(70, 130, 180)')
        .elasticX(true)
        .on('preRedraw', (chart) => {
          chart.updateMap();
          chart.activeFilters(chart.filters());
        })
      })
});
