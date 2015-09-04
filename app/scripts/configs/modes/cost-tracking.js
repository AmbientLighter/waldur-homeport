'use strict';

angular.module('ncsaas')
  .constant('MODE', {
    modeName: 'modeCostTracking',
    toBeFeatures: [
      'appstore',
      'payment',
      'eventlog'
    ],
    featuresVisible: false,
    homeTemplate: 'views/home/home.html',
    initialDataTemplate: 'views/initial-data/initial-data.html'
  });
