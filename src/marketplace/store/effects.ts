import { all, fork } from 'redux-saga/effects';

import cartEffects from '../cart/store/effects';
import categoryEffects from '../category/store/effects';
import landingEffects from '../landing/store/effects';
import offeringEffects from '../offerings/store/effects';
import ordersEffects from '../orders/store/effects';

export default function*() {
  yield all([
    fork(cartEffects),
    fork(categoryEffects),
    fork(landingEffects),
    fork(offeringEffects),
    fork(ordersEffects),
  ]);
}
