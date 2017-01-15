'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './labs.routes';

export class LabsComponent {
  /*@ngInject*/
  constructor() {
    this.message = 'Hello';
  }
}

export default angular.module('labManagerApp.labs', [uiRouter])
  .config(routes)
  .component('labs', {
    template: require('./labs.html'),
    controller: LabsComponent,
    controllerAs: 'labsCtrl'
  })
  .name;
