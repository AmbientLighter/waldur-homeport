import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { getFormValues } from 'redux-form';

import { $state } from '@waldur/core/services';
import { withTranslation } from '@waldur/i18n';
import { TranslateProps } from '@waldur/i18n';
import { MARKETPLACE_FILTER_FORM } from '@waldur/marketplace/category/store/constants';
import { getAllOfferings } from '@waldur/marketplace/common/api';
import { OfferingGrid } from '@waldur/marketplace/common/OfferingGrid';
import { FilterQuery } from '@waldur/marketplace/offerings/types';
import { Offering } from '@waldur/marketplace/types';

import { selectFilterQuery } from './store/selectors';

interface OfferingGridWrapperState {
  items: Offering[];
  loading: boolean;
  loaded: boolean;
}

interface OfferingGridWrapperProps extends TranslateProps {
  filterQuery: FilterQuery;
}

export class OfferingGridWrapper extends React.Component<OfferingGridWrapperProps, OfferingGridWrapperState> {
  state = {
    items: [],
    loading: true,
    loaded: false,
  };

  componentDidUpdate(prevProps) {
    if (this.filterQueryHasDiff(prevProps)) {
      this.loadData(this.props.filterQuery);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.filterQueryHasDiff(nextProps)) {
      return true;
    }
    if (this.state !== nextState) {
      return true;
    }
    return false;
  }

  filterQueryHasDiff = prevProps => {
    if (prevProps.filterQuery.name !== this.props.filterQuery.name
      || prevProps.filterQuery.attributes !== this.props.filterQuery.attributes) {
        return true;
      }
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData(filterQuery?) {
    const options = {
      params: {
        state: 'Active',
        category_uuid: $state.params.category_uuid,
        ...filterQuery,
      },
    };
    try {
      this.setState({
        loading: true,
      });
      const offerings = await getAllOfferings(options);
      this.setState({
        items: offerings,
        loading: false,
        loaded: true,
      });
    } catch {
      this.setState({
        items: [],
        loading: false,
        loaded: false,
      });
    }
  }

  render() {
    return <OfferingGrid {...this.state} width={4}/>;
  }
}

export const formatAttributesFilter = query => {
  if (query) {
    const formattedQuery = {};
    Object.keys(query).forEach(key => {
      const attributeType = key.split('-')[0];
      const attributeKey = key.split('-')[1];
      const queryKey = query[key];
      if (attributeType === 'list') {
        if (Object.keys(formattedQuery).indexOf(attributeKey) === -1) {
          formattedQuery[attributeKey] = [queryKey];
        } else {
          formattedQuery[attributeKey].push(queryKey);
        }
      } else if (attributeType === 'boolean') {
        formattedQuery[attributeKey] = JSON.parse(queryKey);
      } else {
        formattedQuery[attributeKey] = queryKey;
      }
    });
    return formattedQuery;
  }
};

const mapStateToProps = state => ({
  filterQuery: {
    name: selectFilterQuery(state),
    attributes: formatAttributesFilter(getFormValues(MARKETPLACE_FILTER_FORM)(state)),
  },
});

const enhance = compose(
  connect(mapStateToProps),
  withTranslation,
);

export const OfferingGridContainer = enhance(OfferingGridWrapper);
