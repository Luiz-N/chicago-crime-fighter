import Ember from 'ember';
import { task, timeout } from 'ember-concurrency';
import BOUNDARY_CODES from '../boundaries/codes';

const { computed, Component, on, inject, A: emberArray } = Ember;

export default Ember.Component.extend({

  lat: 41.8781,
  lng: -87.6298,
  zoom: 10,

  // didRender() {
  //   this._super(...arguments);
  //   this.get('updateMap').perform();
  // },
  renderAll: on('didInsertElement', function () {
    dc.renderAll();
  }),

  cfData: computed('data', function () {
    let transformedData = this.get('data').map(
      (rec) => {
        return {
          arrest: rec.arrest,
          community_area: +rec.community_area,
          count_arrest: +rec.count_arrest,
          primary_type: rec.primary_type,
          year: new Date(`01/01/${rec.year}`),
        }
      }
    )
    return crossfilter(transformedData);
    // }
  }),

  markers: computed('records', function() {
    let records = this.get('records');
    if (this.get('community_area') && records.length) {
      return records.filter(
        (d) => {
          return !!d.get('latitude') && !!d.get('longitude');
        }
      )
      // this.get('records')
    }
  }),

  updateMap: task(function* () {
    let community_area = +this.get('community_area');
    let boundaries = BOUNDARY_CODES;
    let group = this.get('areaGroupSum').all();
    let comms = null;
    if (community_area) {
      let selected = group.findBy('key', community_area);
      let boundary = boundaries[selected.key];
      comms = [{
        key: selected.key,
        geom: boundary.geom,
        name: boundary.name,
        value: selected.value,
        color: 'rgba(0, 0, 255,0.5)'
      }]
    }
    else {
      let max = Math.max(...group.getEach('value'));
      let min = Math.min(...group.getEach('value'));
      let color = d3.scale.linear().domain([min,max]).range(['rgba(0, 0, 255,0)', 'rgba(0, 0, 255, 1)'])
      comms = group.map(
        (d) => {
          let boundary = boundaries[d.key];
          if (boundary) {
            return {
              key: d.key,
              geom: boundary.geom,
              name: boundary.name || 'Unknown',
              value: d.value,
              color: color(d.value),
            }
          }
        }
      ).compact();
    }
    console.log(`updating map with ${comms.length} layers`);
    this.set('communities', comms);
    yield timeout(100)
  }).on('didInsertElement').drop(),

  areaDim: computed('cfData', function() {
    return this.get('cfData').dimension((d) => {return d.community_area;});
  }),

  areaGroupSum: computed('areaDim', function () {
    return this.get('areaDim').group().reduceSum((d) => {return d.count_arrest;});
  }),

  yearDim: computed('cfData', function () {
    return this.get('cfData').dimension((d) => {return d.year;});
  }),

  yearGroupSum: computed('yearDim', function() {
    return this.get('yearDim').group().reduceSum((d) => {return d.count_arrest;});
  }),

  typeDim: computed('cfData', function () {
    return this.get('cfData').dimension((d) => {return d.primary_type;});
  }),

  typeGroupSum: computed('typeDim', function() {
    return this.get('typeDim').group().reduceSum((d) => {return d.count_arrest;});
  }),

  actions: {
    filterComm(boundaryKey, event) {
      let currentBoundary = this.get('community_area');
      if (currentBoundary == boundaryKey) {
        boundaryKey = undefined;
        this.setProperties({
          zoom: 10,
          lat: 41.8781,
          lng: -87.6298
        })
      }
      else {
        this.setProperties({
          lat: event.latlng.lat,
          lng: event.latlng.lng,
        })
        Ember.run.later((() => {
          this.set('zoom', 12);
        }), 300);
      }
      this.get('areaDim').filter(boundaryKey);
      this.set('community_area', boundaryKey);
      dc.redrawAll();
    }
  }
});
