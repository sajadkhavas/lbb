import {
  STORE_SETTINGS,
  canOfferPayment,
  canPublishReturns,
  getPublicShippingMethods,
  type StoreSettings,
} from "./store-settings";

export type CommerceReadiness = {
  shippingPublic: boolean;
  returnsPublic: boolean;
  paymentPublic: boolean;
  orderSubmissionReady: boolean;
  paymentVerificationReady: boolean;
};

/**
 * Frontend-only readiness. F14E deliberately does not infer a checkout capability
 * from public settings: order creation and payment verification require backend evidence.
 */
export function getCommerceReadiness(settings: StoreSettings = STORE_SETTINGS): CommerceReadiness {
  return {
    shippingPublic: getPublicShippingMethods(settings).length > 0,
    returnsPublic: canPublishReturns(settings),
    paymentPublic: canOfferPayment(settings),
    orderSubmissionReady: false,
    paymentVerificationReady: false,
  };
}

export function canSubmitOrder(settings: StoreSettings = STORE_SETTINGS): boolean {
  const readiness = getCommerceReadiness(settings);
  return Boolean(
    readiness.shippingPublic &&
      readiness.paymentPublic &&
      readiness.orderSubmissionReady &&
      readiness.paymentVerificationReady,
  );
}
