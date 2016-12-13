import { ISSUE_TYPE_CHOICES } from './constants';
import template from './issue-registration.html';

export default function issueRegistration() {
  return {
    restrict: 'E',
    template: template,
    controller: IssueRegistrationController,
    controllerAs: '$ctrl',
    scope: {
      onSearch: '&'
    },
    bindToController: true
  };
}

// @ngInject
class IssueRegistrationController {
  constructor($state,
              $scope,
              $q,
              $uibModal,
              ENV,
              features,
              issuesService,
              ncUtilsFlash,
              usersService,
              customersService,
              projectsService,
              resourcesService) {
    this.$state = $state;
    this.$scope = $scope;
    this.$q = $q;
    this.$uibModal = $uibModal;
    this.ENV = ENV;
    this.features = features;
    this.service = issuesService;
    this.issue = {};
    this.types = ISSUE_TYPE_CHOICES;
    this.ncUtilsFlash = ncUtilsFlash;
    this.usersService = usersService;
    this.customersService = customersService;
    this.projectsService = projectsService;
    this.resourcesService = resourcesService;
    this.init();
  }

  init() {
    this.$scope.$watch(() => this.issue.caller, caller => {
      this.issue.customer = null;
      this.refreshCustomers();
    });
    this.$scope.$watch(() => this.issue.customer, customer => {
      this.issue.project = null;
      this.refreshProjects();
    });
    this.$scope.$watch(() => this.issue.project, project => {
      this.issue.resource = null;
      this.refreshResources();
    });
    this.$scope.$watch(() => this.issue.scope, scope => {
      this.issue.resource = null;
      this.refreshResources();
    });
    this.scopes = this.getScopes();
  }

  getScopes() {
    const filterResourceType = resourceType => this.features.isVisible(
      this.ENV.resourceCategory[resourceType]
    );

    const formatChoice = resourceType => ({
      display_name: resourceType.split('.').join(' '),
      value: resourceType
    });

    const types = Object.keys(this.ENV.resourceCategory);
    return types.filter(filterResourceType).sort().map(formatChoice);
  }

  refreshUsers(name) {
    const params = name && {full_name: name};
    return this.usersService.getList(params).then(users => {
      this.users = users;
    });
  }

  refreshCustomers(name) {
    if (!this.issue.caller) {
      return;
    }
    let params = {
      user_uuid: this.issue.caller.uuid
    };
    if (name) {
      params.name = name;
    }
    return this.customersService.getList(params).then(customers => {
      this.customers = customers;
    });
  }

  refreshProjects(name) {
    if (!this.issue.customer) {
      return;
    }
    let params = {
      customer: this.issue.customer.uuid
    };
    if (name) {
      params.name = name;
    }
    this.projectsService.filterByCustomer = false;
    return this.projectsService.getList(params).then(projects => {
      this.projects = projects;
    });
    this.projectsService.filterByCustomer = true;
  }

  refreshResources(name) {
    if (!this.issue.project || !this.issue.scope) {
      return;
    }

    let params = {
      project_uuid: this.issue.project.uuid,
      resource_type: this.issue.scope.value,
      field: ['name', 'url']
    };
    if (name) {
      params.name = name;
    }
    this.resourcesService.filterByCustomer = false;
    return this.resourcesService.getList(params).then(resources => {
      this.resources = resources;
    });
    this.resourcesService.filterByCustomer = true;
  }

  save() {
    this.IssueForm.$submitted = true;
    if (this.IssueForm.$invalid) {
      return this.$q.reject();
    }
    let issue = {
      type: this.issue.type.id,
      customer: this.issue.customer.url,
      project: this.issue.project.url,
      summary: this.issue.summary,
      description: this.issue.description,
      caller: this.issue.caller.url
    };
    if (this.issue.resource) {
      issue.resource = this.issue.resource.url;
    }
    this.saving = true;
    return this.service.createIssue(issue).then(issue => {
      this.service.clearAllCacheForCurrentEndpoint();
      this.ncUtilsFlash.success(`Issue ${issue.key} has been created`);
      return this.$state.go('support.detail', {uuid: issue.uuid});
    }).finally(() => {
      this.saving = false;
    });
  }

  openUserDialog(user) {
    this.$uibModal.open({
      component: 'userPopover',
      resolve: {
        user: () => user
      }
    });
  }

  openCustomerDialog(customer) {
    this.$uibModal.open({
      component: 'customerPopover',
      resolve: {
        customer: () => customer
      }
    });
  }
}
