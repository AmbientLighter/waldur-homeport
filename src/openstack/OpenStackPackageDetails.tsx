import * as React from 'react';

import { translate } from '@waldur/i18n';
import { PlanDetails } from '@waldur/marketplace/details/plan/PlanDetails';
import { OrderItemDetailsField } from '@waldur/marketplace/orders/OrderItemDetailsField';
import { OrderItemDetailsSection } from '@waldur/marketplace/orders/OrderItemDetailsSection';
import { OfferingDetailsProps } from '@waldur/marketplace/types';
import BooleanField from '@waldur/table-react/BooleanField';

import { SecretValueField } from './SecretValueField';

const renderValue = value => value ? value : <span>&mdash;</span>;

const renderBooleanValue = value =>
  value !== undefined ? <BooleanField value={value}/> : <span>&mdash;</span>;

export const OpenStackPackageDetails = (props: OfferingDetailsProps) => {
  const { attributes } = props.orderItem;
  return (
    <>
      <OrderItemDetailsField>
        <OrderItemDetailsSection>
          {translate('Attributes')}
        </OrderItemDetailsSection>
      </OrderItemDetailsField>
      <OrderItemDetailsField label={translate('Tenant name')}>
        {renderValue(attributes.name)}
      </OrderItemDetailsField>
      <OrderItemDetailsField label={translate('Tenant description')}>
        {renderValue(attributes.description)}
      </OrderItemDetailsField>
      <OrderItemDetailsField label={translate('Initial admin username')}>
        {renderValue(attributes.user_username)}
      </OrderItemDetailsField>
      <OrderItemDetailsField label={translate('Initial admin password')}>
        <SecretValueField className="max-w-300" value={attributes.user_password}/>
      </OrderItemDetailsField>
      <OrderItemDetailsField label={translate('Internal network mask (CIDR)')}>
        {renderValue(attributes.subnet_cidr)}
      </OrderItemDetailsField>
      <OrderItemDetailsField label={translate('Skip connection to external network')}>
        {renderBooleanValue(attributes.skip_connection_extnet)}
      </OrderItemDetailsField>
      <PlanDetails orderItem={props.orderItem} offering={props.offering} translate={translate}/>
    </>
  );
};
