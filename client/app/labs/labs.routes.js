'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('labs', {
      url: '/labs',
      template: '<labs></labs>',
      authenticate: 'user'
    });
}
