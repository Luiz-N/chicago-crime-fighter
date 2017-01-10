import Ember from 'ember';
import BOUNDARY_CODES from '../boundaries/codes';

const { computed, Component, on, inject, A: emberArray } = Ember;

export default Ember.Component.extend({
  hoodName: computed('value', function() {
    let key = this.get('value');
    return BOUNDARY_CODES[key] ? BOUNDARY_CODES[key].name : key;
  })
});
