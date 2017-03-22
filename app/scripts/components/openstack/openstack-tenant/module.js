import actionConfig from './actions';
import tabsConfig from './tabs';
import OpenStackTenantConfig from './openstack-tenant-config';
import openstackTenantCheckoutSummary from './openstack-tenant-checkout-summary';
import openstackTenantChangePackageDialog from './openstack-tenant-change-package';
import openstackTenantSummary from './openstack-tenant-summary';
import packageTemplatesService from './package-templates-service';
import openstackPackagesService from './openstack-packages-service';
import openstackTenantChangePackageService from './openstack-tenant-change-package-service';
import openstackFlavorsService from './openstack-flavors-service';
import openstackPrices from './openstack-prices';
import openstackTenantPrices from './openstack-tenant-prices';
import filtersModule from './filters';
import eventsConfig from './events';
import costPlanningConfig from './cost-planning';

export default module => {
  module.config(fieldsConfig);
  module.config(actionConfig);
  module.config(tabsConfig);
  module.run(eventsConfig);
  module.run(costPlanningConfig);
  module.directive('openstackTenantCheckoutSummary', openstackTenantCheckoutSummary);
  module.directive('openstackTenantChangePackageDialog', openstackTenantChangePackageDialog);
  module.component('openstackTenantSummary', openstackTenantSummary);
  module.service('packageTemplatesService', packageTemplatesService);
  module.service('openstackPackagesService', openstackPackagesService);
  module.service('openstackTenantChangePackageService', openstackTenantChangePackageService);
  module.service('openstackFlavorsService', openstackFlavorsService);
  module.component('openstackPrices', openstackPrices);
  module.component('openstackTenantPrices', openstackTenantPrices);
  filtersModule(module);
};

// @ngInject
function fieldsConfig(AppstoreFieldConfigurationProvider) {
  AppstoreFieldConfigurationProvider.register('OpenStack.Tenant', OpenStackTenantConfig);
}
