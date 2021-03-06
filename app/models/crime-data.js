import DS from 'ember-data';
import attr from 'ember-data/attr';

export default DS.Model.extend({
  communityArea: attr(),
  arrest: attr(),
  year: attr(),
  primaryType: attr(),
  countArrest: attr(),
  date: attr(),
  latitude: attr(),
  longitude: attr()
});
