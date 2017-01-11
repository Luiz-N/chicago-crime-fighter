import Ember from 'ember';
import Table from 'ember-light-table';


const { computed, Component, on, inject, A: emberArray } = Ember;

export default Ember.Component.extend({
  records: [],
  communityArea: null,

  communityRecords: computed('records', function() {
    if (this.get('communityArea')) {
      return this.get('records');
    }
    return [];
  }),

  columns: computed(function() {
    return [
    {
      label: 'Date',
      valuePath: 'date',
      cellComponent: 'date-cell',
      // width: '60px'
    },
    {
      label: 'Type',
      valuePath: 'primaryType',
    },
    {
      label: 'Arrested',
      valuePath: 'arrest',
      // width: '60px'
    },
    {
      label: 'Neighborhood',
      valuePath: 'communityArea',
      cellComponent: 'neighborhood-cell'
    }
  ]
}),

  didUpdateAttrs(attrs) {
    let table = this.get('table');
    table.setRows(this.get('communityRecords'));
  },

  initTable: on('init', function() {
    this._super(...arguments);
    this.set('table', new Table(this.get('columns'), this.get('communityRecords')));
  })
});
