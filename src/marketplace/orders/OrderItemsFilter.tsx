import * as React from 'react';
import { connect } from 'react-redux';
import Select, { Async } from 'react-select';
import { compose } from 'redux';
import { Field, reduxForm } from 'redux-form';

import { translate } from '@waldur/i18n';
import { getCustomerList } from '@waldur/marketplace/common/api';
import { AutocompleteField } from '@waldur/marketplace/landing/AutocompleteField';
import { offeringsAutocomplete } from '@waldur/marketplace/landing/store/api';
import { getCustomer } from '@waldur/workspace/selectors';

const organizationAutocomplete = (query: string) => {
  const params: any = {
    name: query,
    field: ['name', 'uuid'],
    o: 'name',
  };
  return getCustomerList(params).then(options => ({options}));
};

const getStates = () => [
  {value: 'pending', label: translate('Pending')},
  {value: 'executing', label: translate('Executing')},
  {value: 'done', label: translate('Done')},
  {value: 'erred', label: translate('Erred')},
  {value: 'terminated', label: translate('Terminated')},
];

const PureOrderItemsFilter = props => (
  <div className="row">
    <div className="form-group col-sm-3">
      <label className="control-label">
        {translate('Offering')}
      </label>
      <Field
        name="offering"
        component={fieldProps => (
          <AutocompleteField
            placeholder={translate('Select offering...')}
            loadOfferings={query => offeringsAutocomplete(query, props.customer.uuid)}
            value={fieldProps.input.value}
            onChange={value => fieldProps.input.onChange(value)}
          />
        )}
      />
    </div>
    <div className="form-group col-sm-3">
      <label className="control-label">
        {translate('Client organization')}
      </label>
      <Field
        name="organization"
        component={fieldProps => (
          <Async
            placeholder={translate('Select organization...')}
            loadOptions={organizationAutocomplete}
            valueKey="uuid"
            labelKey="name"
            value={fieldProps.input.value}
            onChange={value => fieldProps.input.onChange(value)}
          />
        )}
      />
    </div>
    <div className="form-group col-sm-3">
      <label className="control-label">
        {translate('State')}
      </label>
      <Field
        name="state"
        component={fieldProps => (
          <Select
            placeholder={translate('Select state...')}
            options={getStates()}
            value={fieldProps.input.value}
            onChange={value => fieldProps.input.onChange(value)}
          />
        )}
      />
    </div>
  </div>
);

const mapStateToProps = state => ({
  customer: getCustomer(state),
});

const enhance = compose(
  connect(mapStateToProps),
  reduxForm({form: 'OrderItemFilter'}),
);

export const OrderItemsFilter = enhance(PureOrderItemsFilter);
