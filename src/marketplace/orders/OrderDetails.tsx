import * as React from 'react';

import { LoadingSpinner } from '@waldur/core/LoadingSpinner';
import { $state } from '@waldur/core/services';
import { TranslateProps } from '@waldur/i18n';
import { getOrderDetails } from '@waldur/marketplace/common/api';
import { OrderSummary } from '@waldur/marketplace/orders/OrderSummary';

import { ApproveButton } from './ApproveButton';
import { Order } from './Order';
import { OrderSteps } from './OrderSteps';
import { State } from './types';
import { StatusChange } from './types';
import { matchState } from './utils';

interface OrderDetailsProps extends TranslateProps {
  setOrderState: (orderUuid: string, state: string) => void;
  stateChangeStatus: StatusChange;
  shouldRenderApproveButton?: boolean;
}

interface OrderDetailsState {
  orderDetails: State;
  loading: boolean;
  loaded: boolean;
}

export class OrderDetails extends React.Component<OrderDetailsProps, OrderDetailsState> {
  state = {
    orderDetails: undefined,
    loading: true,
    loaded: false,
  };

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.stateChangeStatus !== this.props.stateChangeStatus) {
      this.loadData();
    }
  }

  async loadData() {
    try {
      const orderDetails = await getOrderDetails($state.params.order_uuid);
      this.setState({
        orderDetails: {
          state: matchState(orderDetails.state),
          items: orderDetails.items,
          total_cost: orderDetails.total_cost,
          file: orderDetails.file,
        },
        loading: false,
        loaded: true,
      });
    } catch {
      this.setState({
        orderDetails: {state: 'Approve', items: []},
        loading: false,
        loaded: false,
      });
    }
  }

  renderApproveButton = () => {
    return this.props.shouldRenderApproveButton && this.state.orderDetails && this.state.orderDetails.state === 'Approve';
  }

  setOrderState = () => {
    this.props.setOrderState($state.params.order_uuid, 'executing');
  }

  render() {
    if (this.state.loading) {
      return <LoadingSpinner/>;
    }

    if (!this.state.loaded) {
      return (
        <h3 className="text-center">
          {this.props.translate('Unable to load order details.')}
        </h3>
      );
    }

    return (
      <div className="row">
        <div className="col-xl-9 col-lg-8">
          <OrderSteps state={this.state.orderDetails.state} />
          <Order
            items={this.state.orderDetails.items}
            editable={false}
          />
          <div className="pull-right">
            {this.renderApproveButton() &&
              <ApproveButton
                submitting={this.props.stateChangeStatus.processing}
                onClick={this.setOrderState}/>
            }
          </div>
        </div>
        <div className="col-xl-3 col-lg-4">
          <OrderSummary
            total={this.state.orderDetails.total_cost}
            file={this.state.orderDetails.file}
          />
        </div>
      </div>
    );
  }
}
