import * as React from 'react';
import { connect } from 'react-redux';

import { translate } from '@waldur/i18n';
import { OrderItemResponse } from '@waldur/marketplace/orders/types';
import { connectAngularComponent } from '@waldur/store/connect';
import { getWorkspace } from '@waldur/workspace/selectors';
import { WorkspaceType } from '@waldur/workspace/types';

import { ActionButtons } from './ActionButtons';
import { ShoppingCart } from './ShoppingCart';
import { ShoppingCartSidebar } from './ShoppingCartSidebar';
import { ShoppingCartSteps } from './ShoppingCartSteps';
import * as actions from './store/actions';
import { getState, getCheckoutItems, getMaxUnit } from './store/selectors';
import { OrderState } from './types';

interface CheckoutPageProps {
  items: OrderItemResponse[];
  maxUnit: 'month' | 'day';
  state: OrderState;
  setState(state: OrderState): void;
  createOrder(): void;
  removeShoppingCartItem(item: OrderItemResponse): void;
  workspace: WorkspaceType;
}

const PureCheckoutPage = (props: CheckoutPageProps) => (
  props.items.length > 0 ? (
    <div className="row">
      <div className="col-xl-9 col-lg-8">
        <ShoppingCartSteps state={props.state}/>
        <ShoppingCart
          items={props.items}
          maxUnit={props.maxUnit}
          onShoppingCartItemRemove={props.removeShoppingCartItem}
          editable={props.state === 'Configure'}/>
        <ActionButtons
          state={props.state}
          setState={props.setState}
          createOrder={props.createOrder}
          workspace={props.workspace}
        />
      </div>
      <div className="col-xl-3 col-lg-4">
        <ShoppingCartSidebar/>
      </div>
    </div>
  ) : (
    <p className="text-center">
      {translate('Shopping cart is empty. You should add items to cart first.')}
    </p>
  )
);

const mapStateToProps = state => ({
  items: getCheckoutItems(state),
  maxUnit: getMaxUnit(state),
  state: getState(state),
  workspace: getWorkspace(state),
});

const mapDispatchToProps = {
  setState: actions.setState,
  createOrder: actions.createOrder,
  removeShoppingCartItem: actions.removeItem,
};

export const CheckoutPage = connect(mapStateToProps, mapDispatchToProps)(PureCheckoutPage);

export default connectAngularComponent(CheckoutPage);
