import Ember from 'ember';
// import TableCommon from '../mixins/table-common';
import Table from 'ember-light-table';


const { computed, Component, on, inject, A: emberArray } = Ember;

export default Ember.Component.extend({

  columns: computed(function() {
    return [
    {
      label: 'Date',
      valuePath: 'date',
      cellComponent: 'date-cell'
      // width: '60px'
    },
    {
      label: 'Type',
      valuePath: 'primaryType',
      // width: '60px'
    },
    {
      label: 'Arrested',
      valuePath: 'arrest',
      width: '60px'
    },
    {
      label: 'Neighborhood',
      valuePath: 'communityArea',
      cellComponent: 'neighborhood-cell'
      // width: '60px'
    }
  ]
}),

  didUpdateAttrs(attrs) {
    let table = this.get('table');
    table.setRows(this.get('records'));
  },

  initTable: on('init', function() {
    this._super(...arguments);
    this.set('table', new Table(this.get('columns'), this.get('records')));
  })
});
