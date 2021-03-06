import { Action } from '@waldur/core/reducerActions';
import { OrderState } from '@waldur/marketplace/cart/types';
import { OrderItemResponse } from '@waldur/marketplace/orders/types';

import * as constants from './constants';

export const addItem = (item: OrderItemResponse): Action<{item}> => ({
  type: constants.ADD_ITEM,
  payload: {
    item,
  },
});

export const removeItem = (item: OrderItemResponse): Action<{item}> => ({
  type: constants.REMOVE_ITEM,
  payload: {
    item,
  },
});

export const setCart = cart => ({
  type: constants.SET_CART,
  payload: {
    cart,
  },
});

export const clearCart = () => ({
  type: constants.CLEAR_CART,
});

export const setState = (state: OrderState): Action<{state}> => ({
  type: constants.SET_STATE,
  payload: {
    state,
  },
});

export const createOrder = () => ({
  type: constants.CREATE_ORDER,
});
