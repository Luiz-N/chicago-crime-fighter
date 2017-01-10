import Ember from 'ember';
import config from '../config/environment';
import Soda from 'npm:soda-js';

export default Ember.Route.extend({
  queryParams: {
    year: { refreshModel: true },
    community_area: { refreshModel: true },
    primary_type: { refreshModel: true }
  },

  model(params) {
    let promises = {};
    let typesFilter = [];
    let yearsFilter = [];
    let recordQuery = {where: []};
    let q = {where: [], group: []};
    if (!this.get('controller')) {
      q.limit = 50000;
      q.group.push("community_area,primary_type,arrest,year");
      q.select = ["community_area,arrest,primary_type,year,count(arrest)"];
      q.where = ['year > 2001'];
      let dataRepo = config.socrata.dataRepo;
      let dataSet = config.socrata.dataSet;
      let consumer = new Soda.Consumer(dataRepo);
      let queryBuilder = consumer.query().withDataset(dataSet);
      queryBuilder.select(...q.select)
      queryBuilder.limit(q.limit)
      queryBuilder.group(...q.group)
      queryBuilder.where(...q.where)
      promises.dashboardData =
        new Ember.RSVP.Promise(function(resolve, reject) {
        queryBuilder
          .getRows()
          .on('success', function(data) {
            Ember.run(null, resolve, data);
          })
          .on('error', function(error) {
            Ember.run(null, reject, error);
          });
        });
    }
    if (params.primary_type) {
      let types = params.primary_type.split(',');
      types.forEach(
        (type) => {
          typesFilter.push(`primary_type = '${type}'`)
        }
      )
      recordQuery.where.push(...[Soda.expr.or.apply(this, typesFilter)]);
    }

    if (params.year) {
      let years = params.year.split(',');
      years.forEach(
        (year) => {
          yearsFilter.push(`year = '${year}'`)
        }
      )
      recordQuery.where.push(...[Soda.expr.or.apply(this, yearsFilter)]);
    }

    if (params.community_area) {
      recordQuery.where.push(`community_area = '${params.community_area}'`);
    }


    // q.query = "$where=(primary_type = 'THEFT' OR primary_type = 'THEFT'";
    // q.where.push("primary_type = 'ROBBERY'");
    // q.where.push("primary_type = 'THEFT'");
    // q.where = [Soda.expr.or.apply(this, q.where)];
    // q.where.push("year = 2013")
    promises.records = this.store.query('crime-data', recordQuery);
    this.store.unloadAll()
    return Ember.RSVP.hash(promises);
  },
  setupController(controller, responses) {
    if (responses.dashboardData) {
      controller.set('dashboardData', responses.dashboardData);
    }
    controller.set('records', responses.records);
  },

  actions: {
    setTypeFilters(filters) {
      this.get('controller').set('primary_type', filters);
    },
    setYearFilters(filters) {
      filters = filters[0] || [];
      this.get('controller').set('year', filters.invoke('getFullYear'));
    }
  }
});
