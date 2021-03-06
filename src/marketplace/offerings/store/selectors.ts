import { formValueSelector } from 'redux-form';

import { OfferingComponent } from '@waldur/marketplace/types';
import { getUser } from '@waldur/workspace/selectors';

import { FORM_ID } from './constants';
import { PlanFormData } from './types';
import { formatComponents } from './utils';

const getOffering = state => state.marketplace.offering;
export const getStep = state => getOffering(state).step;
export const isLoading = state => getOffering(state).loading;
export const isLoaded = state => getOffering(state).loaded;
export const isErred = state => getOffering(state).erred;
export const getCategories = state => getOffering(state).categories;

export const getComponents = (state, type): OfferingComponent[] => {
  let components = getOffering(state).plugins[type];
  if (components.length === 0) {
    components = getForm(state, 'components');
    if (components) {
      components = formatComponents(components);
    }
  }
  return components;
};

const getForm = formValueSelector(FORM_ID);

export const getType = (state: any): string => {
  const option = getForm(state, 'type');
  if (option) {
    return option.value;
  }
};

export const getCategory = state => getForm(state, 'category');

export const getPlanData = (state, planPath: string): PlanFormData => getForm(state, planPath);

export const getPlanPrice = (state, planPath) => {
  const planData = getPlanData(state, planPath);
  if (planData && planData.quotas && planData.prices) {
    const type = getType(state);
    const components = (type ? getComponents(state, type) : [])
      .filter(component => component.billing_type === 'fixed')
      .map(component => component.type);
    const keys = Object.keys(planData.quotas).filter(key => components.indexOf(key) !== -1);
    return keys.reduce((total, item) => total + (planData.quotas[item] || 0) * (planData.prices[item] || 0), 0);
  }
  return 0;
};

export const isOfferingManagementDisabled = state => {
  const user = getUser(state);
  return user.is_support && !user.is_staff;
};
