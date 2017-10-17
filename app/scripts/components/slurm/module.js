import slurmRoutes from './routes';
import actionConfig from './actions';
import tabsConfig from './tabs';
import slurmAllocationConfig from './slurm-allocation-config';
import registerSidebarExtension from './sidebar';
import registerTableExtension from './table-extension';
import SlurmAllocationService from './slurm-allocation-service';
import SlurmPackagesService from './slurm-packages-service';
import slurmAllocationList from './slurm-allocation-list';
import slurmAllocationCheckoutSummary from './slurm-allocation-checkout-summary';
import quotaPie from './quota-pie';
import slurmPrices from './slurm-prices';
import detailsModule from './details/module';

export default module => {
  module.config(slurmRoutes);
  module.config(actionConfig);
  module.config(slurmAllocationConfig);
  module.config(tabsConfig);
  module.run(registerSidebarExtension);
  module.run(registerTableExtension);
  module.service('SlurmAllocationService', SlurmAllocationService);
  module.service('SlurmPackagesService', SlurmPackagesService);
  module.component('slurmAllocationList', slurmAllocationList);
  module.component('slurmAllocationCheckoutSummary', slurmAllocationCheckoutSummary);
  module.directive('quotaPie', quotaPie);
  module.component('slurmPrices', slurmPrices);
  detailsModule(module);
};
