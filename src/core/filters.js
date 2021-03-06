import { formatFilesize, formatSnakeCase, minutesToHours, titleCase, dateTime } from './utils';
import { formatDate } from './dateUtils';

// @ngInject
function trustAsHtml($sce) {
  return function(value) {
    return $sce.trustAsHtml(value);
  };
}

function replace() {
  return function(input, search, replacement) {
    return input.replace(new RegExp(search, 'g'), replacement);
  };
}

// @ngInject
function defaultCurrency(ENV, $filter) {
  return function(value) {
    if (value === undefined || value === null || value.indexOf && value.indexOf(ENV.currency) !== -1) {
      return value;
    }
    let fractionSize = 2;
    if (value !== 0 && value < 0.01) {
      fractionSize = 3;
    }
    if (value !== 0 && value < 0.001) {
      fractionSize = 4;
    }
    return $filter('currency')(value, ENV.currency, fractionSize);
  };
}

function shortDate() {
  return function(input) {
    if (input) {
      return formatDate(input);
    }
  };
}

// @ngInject
function decodeHtml($sce) {
  return function(value) {
    return $sce.trustAsHtml(angular.element('<span>').html(value).text());
  };
}

export default module => {
  module.filter('trustAsHtml', trustAsHtml);
  module.filter('decodeHtml', decodeHtml);
  module.filter('filesize', () => formatFilesize);
  module.filter('titleCase', () => titleCase);
  module.filter('snakeCase', () => formatSnakeCase);
  module.filter('replace', replace);
  module.filter('defaultCurrency', defaultCurrency);
  module.filter('shortDate', shortDate);
  module.filter('dateTime', () => dateTime);
  module.filter('minutesToHours', () => minutesToHours);
};
