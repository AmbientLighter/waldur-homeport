import * as React from 'react';

import { translate } from '@waldur/i18n';
import { PlanDetails } from '@waldur/marketplace/details/plan/PlanDetails';
import { OrderItemDetailsField } from '@waldur/marketplace/orders/OrderItemDetailsField';
import { OrderItemDetailsSection } from '@waldur/marketplace/orders/OrderItemDetailsSection';
import { OfferingDetailsProps } from '@waldur/marketplace/types';

const renderValue = value => value ? value : <span>&mdash;</span>;

export const SlurmPackageDetails = (props: OfferingDetailsProps) => {
  const { attributes } = props.orderItem;
  return (
    <>
      <OrderItemDetailsField>
        <OrderItemDetailsSection>
          {translate('Attributes')}
        </OrderItemDetailsSection>
      </OrderItemDetailsField>
      <OrderItemDetailsField label={translate('Allocation name')}>
        {renderValue(attributes.name)}
      </OrderItemDetailsField>
      <OrderItemDetailsField label={translate('Allocation description')}>
        {renderValue(attributes.description)}
      </OrderItemDetailsField>
      <PlanDetails orderItem={props.orderItem} offering={props.offering} translate={translate}/>
    </>
  );
};
