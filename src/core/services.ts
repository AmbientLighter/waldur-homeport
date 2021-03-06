import { IHttpService, IPromise } from 'angular';

export let ENV = null;
export let $http: IHttpService;
export let $rootScope = null;
export let $state = null;
export let $filter = null;
export let ngInjector = null;
export let $q = null;

export const defaultCurrency = value => $filter('defaultCurrency')(value);

export default function injectServices($injector) {
  ENV = $injector.get('ENV');
  $http = $injector.get('$http');
  $rootScope = $injector.get('$rootScope');
  $state = $injector.get('$state');
  $filter = $injector.get('$filter');
  $q = $injector.get('$q');
  ngInjector = $injector;
}
injectServices.$inject = ['$injector'];

/*
  Previously we have scheduled multiple concurrent REST API
  requests even if previous task has not been completed yet.
  It happens if either network or backend server is slow.
  Instead new task should be scheduled if previous have been completed.
  */
export const blockingExecutor = (callback: () => IPromise<any>) => {
  let isExecuting = false;
  return () => {
    if (isExecuting) {
      return;
    }
    isExecuting = true;
    return $q.when(callback()).finally(() => isExecuting = false);
  };
};
