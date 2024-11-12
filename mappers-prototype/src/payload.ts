import {
  Cart,
  CartLine,
  CartDiscountAllocation,
  BaseCartLineConnection,
  CartCost,
  MoneyV2,
  AppliedGiftCard,
  CartBuyerIdentity,
} from "./types/2025-01";
import {
  Checkout,
  CheckoutLineItem,
  DiscountApplicationEdge,
  PageInfo,
  CheckoutLineItemConnection,
} from "./types/2024-04";

// TODO implement user error mapping

const cartToCheckoutMapper = (cart: Cart): Checkout => {
  const {
    appliedGiftCards,
    attributes,
    buyerIdentity,
    checkoutUrl,
    cost,
    createdAt,
    deliveryGroups,
    discountAllocations,
    discountCodes,
    id,
    lines,
    note,
    updatedAt,
  } = cart;

  return {
    appliedGiftCards,
    buyerIdentity: {
      countryCode: buyerIdentity.countryCode,
    },
    createdAt,
    currencyCode: cost.totalAmount.currencyCode,
    customAttributes: attributes,
    // @ts-expect-error discountApplication nodes aren't queried in SDK
    discountApplications: discountApplicationsMapper(discountAllocations),
    email: emailMapper(buyerIdentity),
    id: idMapper(id),
    // @ts-expect-error lineItem nodes aren't queried in SDK
    lineItems: linesToLineItemsMapper(lines),
    lineItemsSubtotalPrice: cost.checkoutChargeAmount,
    note,
    paymentDue: paymentDueMapper(cost.totalAmount, appliedGiftCards),
    shippingAddress: buyerIdentity.deliveryAddressPreferences?.[0] ?? null, // TODO: should we use the delivery groups now?
    subtotalPrice: subtotalPriceMapper(cost),
    totalDuties: cost.totalDutyAmount,
    totalPrice: cost.totalAmount,
    totalTax: cost.totalTaxAmount ?? {
      amount: 0,
      currencyCode: cost.totalAmount.currencyCode,
    },
    updatedAt,
    webUrl: checkoutUrl,

    // Fields not documented in SDK
    availableShippingRates: undefined,

    // Fields we can't map
    completedAt: null,
    order: null,
    orderStatusUrl: null,
    // @ts-expect-error field removed from API
    ready: null,
    // @ts-expect-error field removed from API
    requiresShipping: null,
    shippingLine: null, // No known mapping other than `null`
    // @ts-expect-error field removed from API
    taxExempt: null,
    // @ts-expect-error field removed from API
    taxesIncluded: null,
  };
};

export const emailMapper = (buyerIdentity: CartBuyerIdentity): string | null => {
  return buyerIdentity.email || null;
};

export const idMapper = (id: string): string => {
  return id.replace("Cart", "Checkout");
};

export const paymentDueMapper = (
  cartTotalAmount: MoneyV2,
  appliedGiftCards: AppliedGiftCard[]
): MoneyV2 => {
  return {
    amount:
      cartTotalAmount.amount -
      appliedGiftCards.reduce(
        (acc, giftCard) => acc + giftCard.presentmentAmountUsed.amount,
        0
      ),
    currencyCode: cartTotalAmount.currencyCode,
  };
};

export const subtotalPriceMapper = (cost: CartCost): MoneyV2 => {
  return {
    amount:
      cost.totalAmount.amount -
      (cost.totalDutyAmount?.amount ?? 0) -
      (cost.totalTaxAmount?.amount ?? 0),
    currencyCode: cost.totalAmount.currencyCode,
  };
};

const lineNodeToLineItemNodeMapper = (line: CartLine): CheckoutLineItem => {
  return {
    customAttributes: line.attributes,
    discountAllocations: line.discountAllocations.map((discountAllocation) => ({
      allocatedAmount: discountAllocation.discountedAmount,
      discountApplication: {
        targetType: discountAllocation.targetType,
        // @ts-expect-error field will be added to this type for 2025-01
        value: discountAllocation.value,
        // @ts-expect-error field will be added to this type for 2025-01
        allocationMethod: discountAllocation.allocationMethod,
        // @ts-expect-error field will be added to this type for 2025-01
        targetSelection: discountAllocation.targetSelection,
      },
    })),
    id: line.id,
    quantity: line.quantity,
    variant: line.merchandise,
    title: line.merchandise.title,
    unitPrice: line.cost.amountPerQuantity,
  };
};

export const linesToLineItemsMapper = (
  lines: BaseCartLineConnection
): Omit<CheckoutLineItemConnection, "nodes"> => {
  return {
    edges: lines.edges.map((edge) => {
      return {
        cursor: edge.cursor,
        node: lineNodeToLineItemNodeMapper(edge.node),
      };
    }),
    pageInfo: lines.pageInfo,
  };
};

interface SDKCheckoutDiscountApplicationConnection {
  edges: Omit<DiscountApplicationEdge, "cursor">[];
  pageInfo: PageInfo;
}

export const discountApplicationsMapper = (
  discountAllocations: CartDiscountAllocation[]
): SDKCheckoutDiscountApplicationConnection => {
  return {
    pageInfo: {
      hasNextPage: false,
      hasPreviousPage: false,
    },
    edges: discountAllocations.map((discountAllocation) => ({
      node: {
        targetType: discountAllocation.targetType,
        // @ts-expect-error field will be added to this type for 2025-01
        value: discountAllocation.value,
        // @ts-expect-error field will be added to this type for 2025-01
        allocationMethod: discountAllocation.allocationMethod,
        // @ts-expect-error field will be added to this type for 2025-01
        targetSelection: discountAllocation.targetSelection,
      },
    })),
  };
};
