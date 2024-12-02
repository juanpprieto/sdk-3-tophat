import {
  Cart,
  CartLine as BaseCartLine,
  CartLineCost as BaseCartLineCost,
  CartAutomaticDiscountAllocation,
  CartCodeDiscountAllocation,
  CartCustomDiscountAllocation,
  CartDiscountAllocation as CDiscountAllocation,
  CartDiscountCode,
} from "./types/2025-01";

import {
  DiscountApplication as CheckoutDiscountApplication,
  PricingValue,
  MoneyV2,
  CheckoutLineItem as BaseCheckoutLineItem,
} from "./types/SDK-checkout-2024-04";

type CartLineCost = Omit<BaseCartLineCost, "amountPerQuantity" | "subtotalAmount">;
type CartDiscountAllocation =
  | CartAutomaticDiscountAllocation
  | CartCodeDiscountAllocation
  | CartCustomDiscountAllocation
type CartLine = Omit<
  BaseCartLine,
  "attributes" | "estimatedCost" | "merchandise" | "cost" | "discountAllocations"
> & {
  cost: CartLineCost;
  discountAllocations: CartDiscountAllocation[];
};
type CheckoutLineItem = Omit<
  BaseCheckoutLineItem,
  "customAttributes" | "title" | "variant"
>;

type Code = {
  code: string;
}

type Title = {
  title: string;
}

type CheckoutDiscountApplicationWithId = CheckoutDiscountApplication & (Code | Title);

interface DiscountAllocationForLineItem {
  id: string; // ID of line item
  discountAllocation: CartDiscountAllocation;
}

interface Return {
  checkoutDiscountApplications: CheckoutDiscountApplication[];
  cartLinesWithAllDiscountAllocations: CartLine[];
}

interface Params {
  cartLineItems: CartLine[];
  cartDiscountAllocations: CartDiscountAllocation[];
  cartDiscountCodes: CartDiscountCode[];
}

interface ReturnForTests {
  checkoutDiscountApplications: CheckoutDiscountApplication[];
  checkoutLines: CheckoutLineItem[];
}

// Sanity check = this should never happen, so we want to know if it's happening by mistake

export const discountAndLineMapperForTests = ({
  cartLineItems,
  cartDiscountAllocations,
  cartDiscountCodes,
}: Params): ReturnForTests => {
  const { checkoutDiscountApplications, cartLinesWithAllDiscountAllocations } =
    discountMapper({
      cartLineItems,
      cartDiscountAllocations,
      cartDiscountCodes,
    });

  // In the JS Buy SDK, this whole function won't exist since this step will happen as part of the line items mapper
  // But for now to easily make sure the code works, I've simulated the relevant behaviour here
  const checkoutLines = cartLinesWithAllDiscountAllocations.map(({cost, ...line}) => {
    return {
      ...line,
      discountAllocations: line.discountAllocations.map(
        (discountAllocation) => {
          const discountApplication = checkoutDiscountApplications.find(
            (application) =>
              getDiscountAllocationId(discountAllocation) ===
              getDiscountApplicationId(application)
          );

          if (!discountApplication) {
            throw new Error(`No discount application for discount allocation.
              Discount allocation: ${JSON.stringify(discountAllocation)}.
              Discount applications: ${JSON.stringify(checkoutDiscountApplications)}`)
          }
          return {
            allocatedAmount: discountAllocation.discountedAmount,
            discountApplication,
          };
        }
      ),
    };
  });

  return { checkoutDiscountApplications, checkoutLines };
};

const discountMapper = ({
  cartLineItems,
  cartDiscountAllocations,
  cartDiscountCodes,
}: Params): Return => {
  if (
    !cartLineItems.some(
      ({ discountAllocations }) => discountAllocations.length
    ) &&
    !cartDiscountAllocations.length
  ) {
    return {
      checkoutDiscountApplications: [],
      cartLinesWithAllDiscountAllocations: [],
    };
  }

  const cartOrderLevelDiscountAllocationsForLines =
    mapCartOrderLevelDiscountAllocationsToLineDiscountAllocations(
      cartLineItems,
      cartDiscountAllocations
    );

  const cartLinesWithAllDiscountAllocations =
    mergeOrderLevelDiscountAllocationsToLineDiscountAllocations(
      cartLineItems,
      cartOrderLevelDiscountAllocationsForLines
    );

  const discountIdToDiscountApplicationMap = generateDiscountApplications(
    cartLinesWithAllDiscountAllocations,
    cartDiscountCodes
  );

  // Sanity check
  cartDiscountCodes.forEach(({ code }) => {
    if (!discountIdToDiscountApplicationMap.has(code)) {
      throw new Error(
        `Discount code ${code} not found in discount application map. 
        Discount application map: ${JSON.stringify(
          discountIdToDiscountApplicationMap
        )}`
      );
    }
  });

  return {
    checkoutDiscountApplications: Array.from(
      discountIdToDiscountApplicationMap.values()
    ),
    cartLinesWithAllDiscountAllocations,
  };
};

// As opposed to a percentage discount application, which has a percentage field
const isFixedDiscountApplication = (
  discountPricingValue: PricingValue
): discountPricingValue is MoneyV2 => {
  return "amount" in discountPricingValue;
};
const mapCartOrderLevelDiscountAllocationsToLineDiscountAllocations = (
  cartLineItems: CartLine[],
  cartDiscountAllocations: CartDiscountAllocation[]
): DiscountAllocationForLineItem[] => {
  if (!cartLineItems.length || !cartDiscountAllocations.length) {
    return [];
  }

  // Sanity check
  if (cartDiscountAllocations.length % cartLineItems.length !== 0) {
    throw new Error(
      `Invalid number of order-level discount allocations. For each order-level discount, there must be 1 order-level discount allocation for each line item. 
      Number of line items: ${cartLineItems.length}. Number of discount allocations: ${cartDiscountAllocations.length}`
    );
  }

  // May have multiple order-level discount allocations for a given line item
  const discountIdToDiscountAllocationsMap =
    groupOrderLevelDiscountAllocationsByDiscountId(cartDiscountAllocations);

  // Sort each array within the Map by discountedAmount so that the lowest discounted amount appears first
  discountIdToDiscountAllocationsMap.forEach((allocations) => {
    allocations.sort(
      (a, b) => a.discountedAmount.amount - b.discountedAmount.amount
    );
  });

  // Sort cart line items so that the item with the lowest cost (after line-level discounts) appears first
  const sortedCartLineItems = cartLineItems.sort((a, b) => {
    return (
      a.cost.totalAmount.amount -
      b.cost.totalAmount.amount
    );
  });

  // For each discount, the discount allocation with the smallest amount should be applied
  // to the item with the lowest cost (after line-level discounts)
  return Array.from(discountIdToDiscountAllocationsMap.values()).flatMap(
    (allocations) => {
      return sortedCartLineItems.map((lineItem, index) => {
        return {
          id: lineItem.id,
          discountAllocation: allocations[index],
        };
      });
    }
  );
};

const groupOrderLevelDiscountAllocationsByDiscountId = (
  cartDiscountAllocations: CartDiscountAllocation[]
): Map<string, CartDiscountAllocation[]> => {
  return cartDiscountAllocations.reduce((acc, discountAllocation) => {
    const id = getDiscountAllocationId(discountAllocation);
    acc.set(id, [...(acc.get(id) || []), discountAllocation]);
    return acc;
  }, new Map());
};

const getDiscountAllocationId = (
  discountAllocation: CartDiscountAllocation
): string => {
  // discountId = discountAllocaton's code or title property
  // @ts-expect-error must have either code or title
  const discountId = discountAllocation.code || discountAllocation.title;

  // Sanity check
  if (!discountId) {
    throw new Error(
      `Discount allocation must have either code or title: ${JSON.stringify(
        discountAllocation
      )}`
    );
  }
  return discountId;
};

const getDiscountApplicationId = (
  discountApplication: CheckoutDiscountApplication
): string => {
  // discountId = discountAllocaton's code or title property
  // @ts-expect-error must have either code or title
  const discountId = discountApplication.code || discountApplication.title;

  // Sanity check
  if (!discountId) {
    throw new Error(
      `Discount application must have either code or title: ${JSON.stringify(
        discountApplication
      )}`
    );
  }
  return discountId;
};

const mergeOrderLevelDiscountAllocationsToLineDiscountAllocations = (
  lineItems: CartLine[],
  orderLevelDiscountAllocationsForLines: DiscountAllocationForLineItem[]
): CartLine[] => {
  return lineItems.map((line) => {
    const lineItemId = line.id;
    // Could have multiple order-level discount allocations for a given line item
    const orderLevelDiscountAllocationsForLine =
      orderLevelDiscountAllocationsForLines
        .filter(({ id }) => id === lineItemId)
        .map(({ discountAllocation }) => discountAllocation);

    return {
      ...line,
      discountAllocations: [
        ...line.discountAllocations,
        ...orderLevelDiscountAllocationsForLine,
      ],
    };
  });
};

const generateDiscountApplications = (
  cartLinesWithAllDiscountAllocations: CartLine[],
  discountCodes: CartDiscountCode[]
): Map<string, CheckoutDiscountApplication> => {
  const discountIdToDiscountApplicationMap = new Map<
    string,
    CheckoutDiscountApplicationWithId
  >();

  cartLinesWithAllDiscountAllocations.map(({ discountAllocations }) => {
    discountAllocations.map((discountAllocation) => {
      const discountId = getDiscountAllocationId(discountAllocation);

      // Sanity check
      if (!discountId) {
        throw new Error(
          `Discount allocation must have either code or title: ${JSON.stringify(
            discountAllocation
          )}`
        );
      }

      if (discountIdToDiscountApplicationMap.has(discountId)) {
        const existingDiscountApplication =
          discountIdToDiscountApplicationMap.get(discountId)!;
        // if existingDiscountApplication.value is of type MoneyV2 (has an amount field rather than a percentage field)
        if (isFixedDiscountApplication(existingDiscountApplication.value)) {
          existingDiscountApplication.value.amount +=
            discountAllocation.discountedAmount.amount;
        }
      } else {
        let discountApplication = {
          targetSelection: discountAllocation.targetSelection,
          allocationMethod: discountAllocation.allocationMethod,
          targetType: discountAllocation.targetType,
          value: discountAllocation.value,
        };

        if ('code' in discountAllocation) {
          const discountCode = discountCodes.find(({ code }) => code === discountId);

          if (!discountCode) {
            throw new Error(`Discount code ${discountId} not found in cart discount codes. Discount codes: ${JSON.stringify(discountCodes)}`)
          }
          discountApplication = { ...discountApplication, code: discountAllocation.code, applicable: discountCode.applicable } as CheckoutDiscountApplicationWithId;
        } else { 
          discountApplication = { ...discountApplication, title: discountAllocation.title } as CheckoutDiscountApplicationWithId;
        }

        // @ts-expect-error must have either code or title
        discountIdToDiscountApplicationMap.set(discountId, discountApplication);
      }
    });
  });

  return discountIdToDiscountApplicationMap;
};

/*
 * Map cart discount logic to checkout discount logic
 *
 * variables:
 * discountCodeNoLines (1-4)
 * isOrderLevelDiscount (7,11,...
 * isPercentageDiscount (value.percentage)
 * isFixedDiscount (value.amount)
 * isAutomaticDiscount (as opposed to isDiscountCodeDiscount)
 *
 * mapCartDiscountAllocationToCheckoutDiscountAllocation
 *   - createDiscountApplication
 *   - mapDiscountedAmountToAllocatedAmount(discountAllocation.discountedAmount)
 *
 * Generic branching logic:
 *   if (discountCodeNoLines) return empty arrays
 *
 *   if (discountCodeDiscount) {
 *     if (!isOrderLevelDiscount) {
 *     // product-level discount..
 *     if (isPercentageDiscount)
 *       mapLineItemDiscountAllocationToDiscountApplication
 *       SAME - mapLineDiscountedAmountToAllocatedAmount
 *       SAME - copyLineItemDiscountApplicationToRoot
 *
 *     if (isFixedDiscount)
 *       mapLineItemAllocationToDiscountApplicationSummed
 *       SAME - mapLineDiscountedAmountToAllocatedAmount
 *       SAME - copyLineItemDiscountApplicationToRoot
 *    }
 *
 *   isOrderLevelDiscount...
 *
 *     if (isFixedDiscount)
 *       mapCartDiscountAllocationsToCheckoutLineItemDiscountAllocations
 *         - for each cart discount allocation, figure out which cart line item it maps to
 *         - for all cart line items, determine (using cart line item costs) what the discount allocation is for that specific line item
 *         - create a checkoutLineItemDiscountAllocation for each cart line item, using the information from ^
 *            mapLineItemAllocationToDiscountApplicationSummed
 *            SAME - mapLineDiscountedAmountToAllocatedAmount
 *            SAME - copyLineItemDiscountApplicationToRoot
 *
 *    if (isPercentageDiscount)
 *       mapCartDiscountAllocationsToCheckoutLineItemDiscountAllocations
 *        - for each cart discount allocation, figure out which cart line item it maps to
 *        - for all cart line items, determine (using cart line item costs) what the discount allocation is for that specific line item
 *        - create a checkoutLineItemDiscountAllocation for each cart line item, using the information from ^
 *            mapLineItemAllocationToDiscountApplication
 *            SAME - mapLineDiscountedAmountToAllocatedAmount
 *            SAME - copyLineItemDiscountApplicationToRoot
 *
 *   }
 *   if (isAutomaticDiscount) {
 *     - Cart.discountCodes is empty
 *
 *   }
 *
 *
 *
 *
 *
 *
 * Scenario 1: Empty cart with fixed amount discount
 * Scenario 2: Empty cart with percentage discount
 *  discountApplications:
 *    1. if discountCode && no lines return an empty array
 *  lineItems:
 *    1. if discountCode && return the empty array
 *
 * Scenario 3: Empty cart with order-level fixed amount discount
 * Scenario 4: Empty cart with order-level percentage discount
 *  discountApplications:
 *   1. if discountCode && no lines return an empty array (not supported case)
 *  lineItems:
 *   1. if discountCode && return the empty array (not supported case)
 *
 * Scenario 5: Single line item with fixed amount discount
 * Scenario 9: Multi line item with fixed amount discount
 *  discountApplications:
 *    1. copy discountApplication of a line item
 *
 *  lineItems:
 *    1. map discountedAmount to allocatedAmount
 *    2. identitfy that this is a fixed-line by checking value.amount exists
 *    3. build lineItem discountApplication (One is shared for all items with the same code)
 *      - Map targetSelection, allocationMethod, targetType, value, code, applicable = true
 *      - if its a fixed-allocation (with value.amount) then we need to sum all line items value.amount with the same code
 *
 *  Scenario 6: Single line item with percentage discount
 *  Scenario 10: Multi line item with percentage discount
 *   discountApplications:
 *    1. copy discountApplication of a line item
 *
 *   lineItems:
 *     1. map discountedAmount to allocatedAmount (THIS IS THE SAME AS FIXED AMOUNT)
 *     2. identitfy that this is a percentage-line by checking value.percentage exists
 *     3. build lineItem discountApplication (One is shared for all items with the same code)
 *      - Map targetSelection, allocationMethod, targetType, value, code, applicable = true
 *
 *   Scenario 7: Single line item with order-level fixed amount discount
 *   Scenario 11: Multi line item with order-level fixed amount discount
 *     discountApplications:
 *
 *     lineItems:
 *       1.
 */

export const discountsPayloadMapper = (cart: Cart) => {
  const {
    lines,
    discountCodes,
    discountAllocations,
    ...cartWithoutCartDiscountFields
  } = cart;

  // Scenarios 1-4
  if (!lines.edges.length && discountCodes.length)
    return {
      discountApplications: [],
      lineItems: [],
    };

  //

  const isOrderLevelDiscount =
    cart.discountAllocations.length > 0 &&
    cart.discountAllocations[0].allocationMethod === "ACROSS";
  const isPercentageDiscount =
    cart.discountAllocations.length > 0 &&
    typeof cart.discountAllocations[0].value !== "undefined" &&
    // @ts-expect-error in the new API value percentage is a possible field
    typeof cart.discountAllocations[0].value.percentage !== "undefined";
  const isMultilineCart = lines.edges.length > 1;

  const firstLine = lines.edges[0].node;
  const firstLineDiscountAllocation = firstLine.discountAllocations[0];
  const baseDiscountAllocation =
    cart.discountAllocations[0] || firstLineDiscountAllocation;

  // NOTE: root level discount application is the combination of all line items discount allocations
  let rootDiscountApplication;

  if (isMultilineCart) {
    rootDiscountApplication = mapCombinedDiscountApplication(
      lines.edges,
      cart.discountCodes[0],
      cart.id
    );
  } else {
    rootDiscountApplication = mapDiscountApplication(
      true,
      baseDiscountAllocation,
      cart.discountCodes[0],
      cart.id
    );
  }

  const discountApplications = rootDiscountApplication
    ? [rootDiscountApplication]
    : [];

  let lineItems;
  if (isOrderLevelDiscount) {
    // map root level discount allocations to line item allocations
    lineItems = mapRootDiscountAllocationsToLineItems(cart);
  } else {
    lineItems = mapLineItemsDiscountAllocation(cart);
  }

  return { ...cartWithoutCartDiscountFields, discountApplications, lineItems };
};

function mapCombinedDiscountApplication(
  lines: Cart["lines"]["edges"],
  discountCode: Cart["discountCodes"][0],
  cartId: Cart["id"]
) {
  const amount = lines.reduce((acc, { node: line }) => {
    const amount = parseFloat(
      // @ts-ignore in the new API value amount is a possible field
      line.discountAllocations[0].discountedAmount.amount
    );
    return acc + amount;
  }, 0.0);

  const discountApplication = mapDiscountApplication(
    true,
    lines[0].node.discountAllocations[0],
    discountCode,
    cartId
  );
  // WARN: should add more testing including decimal values
  discountApplication.value.amount = amount.toFixed(1);
  return discountApplication;
}

function mapRootDiscountAllocationsToLineItems(cart: Cart) {
  // WARN: reverse is a non-deterministic way to map discount allocations to line items.
  // We need additional testing like removing and adding lineItems when a order-level discount is already applied
  return cart.discountAllocations.reverse().map((discountAllocation, index) => {
    const lineDiscountAllocation = mapDiscountAllocation(
      discountAllocation,
      cart.discountCodes[0],
      cart.id
    );
    const line = cart.lines.edges[index].node;
    return {
      ...line,
      discountAllocations: lineDiscountAllocation
        ? [lineDiscountAllocation]
        : [],
    };
  });
}

// NOTE: map cart root level discouint allocation to lines allocation (order-level discounts)
function mapDiscountAllocation(
  discountAllocation: Cart["discountAllocations"][0],
  discountCode: Cart["discountCodes"][0],
  cartId: Cart["id"]
) {
  const discountApplication = mapDiscountApplication(
    false,
    discountAllocation,
    discountCode,
    cartId
  );

  return {
    discountApplication,
    // TODO: consolidate allocatedAmount mapping onto a single function
    allocatedAmount: {
      amount: discountAllocation.discountedAmount.amount,
      currencyCode: discountAllocation.discountedAmount.currencyCode,
      type: {
        name: "MoneyV2",
        kind: "OBJECT",
        fieldBaseTypes: {
          amount: "Decimal",
          currencyCode: "CurrencyCode",
        },
        implementsNode: false,
      },
    },
    // TODO: consolidate type mapping onto a single function
    type: {
      fieldBaseTypes: {
        allocatedAmount: "MoneyV2",
        discountApplication: "DiscountApplication",
      },
      implementsNode: false,
      kind: "OBJECT",
      name: "DiscountAllocation",
    },
  };
}

function mapDiscountApplication(
  rootLevel = false,
  discountAllocation: Cart["lines"]["edges"][0]["node"]["discountAllocations"][0],
  discountCode: Cart["discountCodes"][0],
  cartId: Cart["id"]
) {
  const targetSelection = discountAllocation.targetSelection;
  const allocationMethod = discountAllocation.allocationMethod;
  const targetType = discountAllocation.targetType;
  const isPercentage =
  // @ts-ignore in the new API value percentage is a possible field
    typeof discountAllocation.value.percentage !== "undefined";
  // @ts-ignore in the new API value amount is a possible field
  const isFixed = typeof discountAllocation.value.amount !== "undefined";

  const value = isFixed
    ? {
        // @ts-ignore in the new API value amount is a possible field
        amount: discountAllocation.value.amount,
        // @ts-ignore in the new API value currencyCode is a possible field
        currencyCode: discountAllocation.value.currencyCode,
        type: {
          name: "PricingValue",
          kind: "UNION",
        },
      }
    : {
        // @ts-ignore in the new API value percentage is a possible field
        percentage: discountAllocation.value.percentage,
        type: {
          name: "PricingValue",
          kind: "UNION",
        },
      };

  let discountApplication = {
    __typename: "DiscountCodeApplication",
    targetSelection,
    allocationMethod,
    targetType,
    value,
    code: discountCode.code,
    applicable: true,
    type: {
      name: "DiscountCodeApplication",
      fieldBaseTypes: {
        applicable: "Boolean",
        code: "String",
      },
      kind: "OBJECT",
      implementsNode: false,
    },
  };

  if (rootLevel) {
    // @ts-ignore in the new API discountApplication variableValues is a possible field
    (discountApplication.variableValues = {
      checkoutId: cartId,
      discountCode: discountCode.code,
    }),
      // @ts-ignore in the new API discountApplication hasNextPage is a possible field
      (discountApplication.hasNextPage = false);
    // @ts-ignore in the new API discountApplication hasPreviousPage is a possible field
    discountApplication.hasPreviousPage = false;
  }

  return discountApplication;
}

function mapLineItemsDiscountAllocation(cart: Cart) {
  const applicableDiscounts = cart.discountCodes.filter(
    (discount) => discount.applicable
  );

  if (!applicableDiscounts.length) return cart.lines.edges;

  function mapDiscountAllocation(line: Cart["lines"]["edges"][0]["node"]) {
    const discountAllocation = line.discountAllocations[0];
    if (!discountAllocation) return null;
    const discountApplication = mapDiscountApplication(
      false,
      discountAllocation,
      cart.discountCodes[0],
      cart.id
    );

    const allocatedAmount = {
      amount: discountAllocation.discountedAmount.amount,
      currencyCode: discountAllocation.discountedAmount.currencyCode,
      type: {
        name: "MoneyV2",
        kind: "OBJECT",
        fieldBaseTypes: {
          amount: "Decimal",
          currencyCode: "CurrencyCode",
        },
        implementsNode: false,
      },
    };

    const type = {
      fieldBaseTypes: {
        allocatedAmount: "MoneyV2",
        discountApplication: "DiscountApplication",
      },
      implementsNode: false,
      kind: "OBJECT",
      name: "DiscountAllocation",
    };

    return { allocatedAmount, discountApplication, type };
  }

  return cart.lines.edges.map(({ node: line }) => {
    const lineDiscountAllocation = mapDiscountAllocation(line);
    return {
      ...line,
      discountAllocations: lineDiscountAllocation
        ? [lineDiscountAllocation]
        : [],
    };
  });
}
