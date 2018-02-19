import ansibleRoutes from './routes';
import AnsiblePlaybooksService from './playbook-jobs/ansible-playbook-service';
import AnsibleJobsService from './playbook-jobs/ansible-jobs-service';
import ansibleJobState from './playbook-jobs/ansible-job-state';
import pythonManagementState from './python-management/python-management-state';
import ansibleJobsList from './ansible-jobs-list';
import registerPlaybookJobsAppstoreCategory from './playbook-jobs/appstore-category';
import registerPythonManagementAppstoreCategory from './python-management/appstore-category';
import registerJupyterHubManagementAppstoreCategory from './jupyter-hub-management/appstore-category';
import registerSidebarExtension from './sidebar';
import createModule from './playbook-jobs/create/module';
import detailsModule from './playbook-jobs/details/module';
import createPythonManagementModule from './python-management/module';
import createJupyterHubManagementModule from './jupyter-hub-management/module';
import ApplicationService from './applications.service';

export default module => {
  module.config(ansibleRoutes);
  module.service('AnsiblePlaybooksService', AnsiblePlaybooksService);
  module.service('AnsibleJobsService', AnsibleJobsService);
  module.service('ApplicationService', ApplicationService);
  module.component('ansibleJobState', ansibleJobState);
  module.component('pythonManagementState', pythonManagementState);
  module.component('ansibleJobsList', ansibleJobsList);
  module.run(registerPlaybookJobsAppstoreCategory);
  module.run(registerPythonManagementAppstoreCategory);
  module.run(registerJupyterHubManagementAppstoreCategory);
  module.run(registerSidebarExtension);
  createModule(module);
  detailsModule(module);
  createPythonManagementModule(module);
  createJupyterHubManagementModule(module);
};
