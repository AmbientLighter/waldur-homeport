import { Section } from '@waldur/marketplace/types';
import { openModalDialog } from '@waldur/modal/actions';

import * as constants from './constants';

export const showAttributeFilter = () =>
  openModalDialog('marketplaceAttributeFilterListDialog', {size: 'sm'});

export const setFilterQuery = (filterQuery: string) => ({
  type: constants.SET_FILTER_QUERY,
  payload: {
    filterQuery,
  },
});

export const loadDataStart = (categoryId: string) => ({
  type: constants.LOAD_DATA_START,
  payload: {
    categoryId,
  },
});

export const loadDataSuccess = (sections: Section[]) => ({
  type: constants.LOAD_DATA_SUCCESS,
  payload: {
    sections,
  },
});

export const loadDataError = () => ({
  type: constants.LOAD_DATA_ERROR,
});
