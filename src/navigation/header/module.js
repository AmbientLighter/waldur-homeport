import siteHeader from './site-header';
import logoutLink from './logout-link';
import supportLink from './support-link';
import docsLink from './docs-link';
import mainSearch from './main-search';
import ncHeader from './nc-header';
import introButton from './intro-button';

export default module => {
  module.component('siteHeader', siteHeader);
  module.directive('logoutLink', logoutLink);
  module.directive('supportLink', supportLink);
  module.directive('docsLink', docsLink);
  module.directive('mainSearch', mainSearch);
  module.directive('introButton', introButton);
  module.component('ncHeader', ncHeader);
};
