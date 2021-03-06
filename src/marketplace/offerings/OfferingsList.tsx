import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { withTranslation } from '@waldur/i18n';
import { TABLE_NAME } from '@waldur/marketplace/offerings/store/constants';
import { connectAngularComponent } from '@waldur/store/connect';
import { Table, connectTable, createFetcher } from '@waldur/table-react';
import { getCustomer } from '@waldur/workspace/selectors';

import { OfferingLink } from '../links/OfferingLink';
import { OfferingActions } from './actions/OfferingActions';
import { OfferingCreateButton } from './actions/OfferingCreateButton';
import { isOfferingManagementDisabled } from './store/selectors';

export const TableComponent = props => {
  const { translate } = props;

  const columns = [
    {
      title: translate('Name'),
      render: ({ row }) => <OfferingLink offering_uuid={row.uuid}>{row.name}</OfferingLink>,
    },
    {
      title: translate('Category'),
      render: ({ row }) => row.category_title,
    },
    {
      title: translate('State'),
      render: ({ row }) => row.state,
    },
  ];

  if (!props.actionsDisabled) {
    columns.push({
      title: translate('Actions'),
      render: ({ row }) => <OfferingActions row={row}/>,
    });
  }

  return (
    <Table
      {...props}
      columns={columns}
      verboseName={translate('Offerings')}
      actions={<OfferingCreateButton/>}
    />
  );
};

const TableOptions = {
  table: TABLE_NAME,
  fetchData: createFetcher('marketplace-offerings'),
  mapPropsToFilter: props => ({
    customer_uuid: props.customer.uuid,
  }),
  exportRow: row => [
    row.name,
    row.native_name,
    row.category_title,
    row.state,
  ],
  exportFields: [
    'Name',
    'Native name',
    'Category',
    'State',
  ],
};

const mapStateToProps = state => ({
  customer: getCustomer(state),
  actionsDisabled: isOfferingManagementDisabled(state),
});

const enhance = compose(
  connect(mapStateToProps),
  connectTable(TableOptions),
  withTranslation,
);

export const VendorOfferingsList = enhance(TableComponent);

export default connectAngularComponent(VendorOfferingsList);
