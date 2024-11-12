import {CartErrorCode, CartWarningCode, CartUserError, CartWarning} from './types/2025-01'
import {CheckoutErrorCode, CheckoutUserError} from './types/2024-04'

const CartErrorCodeToCheckoutErrorCode: Record<
  CartErrorCode,
  CheckoutErrorCode
> = {
  ADDRESS_FIELD_CONTAINS_EMOJIS: CheckoutErrorCode.NOT_SUPPORTED,
  ADDRESS_FIELD_CONTAINS_HTML_TAGS: CheckoutErrorCode.NOT_SUPPORTED,
  ADDRESS_FIELD_CONTAINS_URL: CheckoutErrorCode.NOT_SUPPORTED,
  ADDRESS_FIELD_DOES_NOT_MATCH_EXPECTED_PATTERN:
    CheckoutErrorCode.NOT_SUPPORTED,
  ADDRESS_FIELD_IS_REQUIRED: CheckoutErrorCode.PRESENT,
  ADDRESS_FIELD_IS_TOO_LONG: CheckoutErrorCode.TOO_LONG,
  INVALID: CheckoutErrorCode.INVALID,
  INVALID_COMPANY_LOCATION: CheckoutErrorCode.INVALID,
  INVALID_DELIVERY_GROUP: CheckoutErrorCode.INVALID,
  INVALID_DELIVERY_OPTION: CheckoutErrorCode.INVALID,
  INVALID_INCREMENT: CheckoutErrorCode.INVALID,
  INVALID_MERCHANDISE_LINE: CheckoutErrorCode.LINE_ITEM_NOT_FOUND,
  INVALID_METAFIELDS: CheckoutErrorCode.INVALID,
  INVALID_PAYMENT: CheckoutErrorCode.INVALID,
  INVALID_PAYMENT_EMPTY_CART: CheckoutErrorCode.INVALID,
  INVALID_ZIP_CODE_FOR_COUNTRY: CheckoutErrorCode.INVALID_FOR_COUNTRY,
  INVALID_ZIP_CODE_FOR_PROVINCE:
    CheckoutErrorCode.INVALID_FOR_COUNTRY_AND_PROVINCE,
  LESS_THAN: CheckoutErrorCode.LESS_THAN,
  MAXIMUM_EXCEEDED: CheckoutErrorCode.NOT_ENOUGH_IN_STOCK,
  MINIMUM_NOT_MET: CheckoutErrorCode.GREATER_THAN_OR_EQUAL_TO,
  MISSING_CUSTOMER_ACCESS_TOKEN: CheckoutErrorCode.PRESENT,
  MISSING_DISCOUNT_CODE: CheckoutErrorCode.PRESENT,
  MISSING_NOTE: CheckoutErrorCode.PRESENT,
  NOTE_TOO_LONG: CheckoutErrorCode.TOO_LONG,
  PAYMENT_METHOD_NOT_SUPPORTED: CheckoutErrorCode.NOT_SUPPORTED,
  PROVINCE_NOT_FOUND: CheckoutErrorCode.INVALID_PROVINCE_IN_COUNTRY,
  UNSPECIFIED_ADDRESS_ERROR: CheckoutErrorCode.INVALID,
  VALIDATION_CUSTOM: CheckoutErrorCode.INVALID,
  ZIP_CODE_NOT_SUPPORTED: CheckoutErrorCode.NOT_SUPPORTED,
};

const CartWarningCodeToCheckoutErrorCode: Record<
  CartWarningCode,
  CheckoutErrorCode
> = {
  MERCHANDISE_NOT_ENOUGH_STOCK: CheckoutErrorCode.NOT_ENOUGH_IN_STOCK,
  MERCHANDISE_OUT_OF_STOCK: CheckoutErrorCode.NOT_ENOUGH_IN_STOCK,
  PAYMENTS_GIFT_CARDS_UNAVAILABLE: CheckoutErrorCode.NOT_SUPPORTED,
};

export const userErrorsMapper = (userErrors: CartUserError[]): CheckoutUserError[] => {
  return userErrors.map(({ code, field, message }) => ({
    code: code ? CartErrorCodeToCheckoutErrorCode[code] : undefined,
    field,
    message,
  }));
};

export const warningsMapper = (warnings: CartWarning[]): CheckoutUserError[] => {
  // Deliberately ignoring target, since checkout doesn't have an equivalent
  return warnings.map(({ code, message }) => ({
    code: code ? CartWarningCodeToCheckoutErrorCode[code] : undefined,
    message,
  }));
}
