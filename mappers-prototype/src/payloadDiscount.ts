import { Cart } from './types/2025-01'

export const discountsPayloadMapper = (cart: Cart) => {
  const { lines, discountCodes, discountAllocations, ...cartWithoutCartDiscountFields } = cart

  if (!lines.edges.length) return {
    ...cartWithoutCartDiscountFields,
    discountApplications: [],
    lineItems: []
  }

  const isOrderLevelDiscount = cart.discountAllocations.length > 0 && cart.discountAllocations[0].allocationMethod === 'ACROSS'
  const isMultilineCart = lines.edges.length > 1

  const firstLine = lines.edges[0].node
  const firstLineDiscountAllocation = firstLine.discountAllocations[0]
  const baseDiscountAllocation = cart.discountAllocations[0] || firstLineDiscountAllocation

  // NOTE: root level discount application is the combination of all line items discount allocations
  let rootDiscountApplication;

  if (isMultilineCart) {
    rootDiscountApplication = mapCombinedDiscountApplication(lines.edges, cart.discountCodes[0], cart.id)
  } else {
    rootDiscountApplication = mapDiscountApplication(true, baseDiscountAllocation, cart.discountCodes[0], cart.id)
  }

  const discountApplications = rootDiscountApplication ? [rootDiscountApplication] : []

  let lineItems;
  if (isOrderLevelDiscount) {
    // map root level discount allocations to line item allocations
    lineItems = mapRootDiscountAllocationsToLineItems(cart)
  } else {
    lineItems = mapLineItemsDiscountAllocation(cart)
  }

  return { ...cartWithoutCartDiscountFields, discountApplications, lineItems }
}

function mapCombinedDiscountApplication(lines: Cart['lines']['edges'], discountCode: Cart['discountCodes'][0], cartId: Cart['id']) {
  const amount = lines.reduce((acc, { node: line }) => {
    // @ts-ignore in the new API value amount is a possible field
    const amount = parseFloat(line.discountAllocations[0].discountedAmount.amount)
    return acc + amount
  }, 0.00)

  const discountApplication = mapDiscountApplication(true, lines[0].node.discountAllocations[0], discountCode, cartId)
  // WARN: should add more testing including decimal values
  discountApplication.value.amount = amount.toFixed(1)
  return discountApplication
}

function mapRootDiscountAllocationsToLineItems(cart: Cart) {
  // WARN: reverse is a non-deterministic way to map discount allocations to line items. 
  // We need additional testing like removing and adding lineItems when a order-level discount is already applied
  return cart.discountAllocations.reverse().map((discountAllocation, index) => {
    const lineDiscountAllocation = mapDiscountAllocation(discountAllocation, cart.discountCodes[0], cart.id)
    const line = cart.lines.edges[index].node
    return {
      ...line,
      discountAllocations: lineDiscountAllocation ? [lineDiscountAllocation] : []
    }
  })
}

// NOTE: map cart root level discouint allocation to lines allocation (order-level discounts)
function mapDiscountAllocation(discountAllocation: Cart['discountAllocations'][0], discountCode: Cart['discountCodes'][0], cartId: Cart['id']) {
  const discountApplication = mapDiscountApplication(false, discountAllocation, discountCode, cartId)

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
        implementsNode: false
      }
    },
    // TODO: consolidate type mapping onto a single function
    type: {
      "fieldBaseTypes": {
        allocatedAmount: "MoneyV2",
        discountApplication: "DiscountApplication"
      },
      implementsNode: false,
      kind: "OBJECT",
      name: "DiscountAllocation"
    }
  }
}

function mapDiscountApplication(
  rootLevel = false,
  discountAllocation: Cart['lines']['edges'][0]['node']['discountAllocations'][0],
  discountCode: Cart['discountCodes'][0],
  cartId: Cart['id']
) {
  const targetSelection = discountAllocation.targetSelection
  const allocationMethod = discountAllocation.allocationMethod
  const targetType = discountAllocation.targetType
  // @ts-ignore in the new API value percentage is a possible field
  const isPercentage = typeof discountAllocation.value.percentage !== 'undefined'
  // @ts-ignore in the new API value amount is a possible field
  const isFixed = typeof discountAllocation.value.amount !== 'undefined'

  const value = isFixed ? {
    // @ts-ignore in the new API value amount is a possible field
    amount: discountAllocation.value.amount,
    // @ts-ignore in the new API value currencyCode is a possible field
    currencyCode: discountAllocation.value.currencyCode,
    type: {
      name: "PricingValue",
      kind: "UNION"
    }
  } : {
    // @ts-ignore in the new API value percentage is a possible field
    percentage: discountAllocation.value.percentage,
    type: {
      name: "PricingValue",
      kind: "UNION"
    }
  }

  let discountApplication = {
    __typename: 'DiscountCodeApplication',
    targetSelection,
    allocationMethod,
    targetType,
    value,
    code: discountCode.code,
    applicable: true,
    type: {
      name: 'DiscountCodeApplication',
      fieldBaseTypes: {
        applicable: "Boolean",
        code: "String"
      },
      kind: "OBJECT",
      implementsNode: false
    }
  }

  if (rootLevel) {
    // @ts-ignore in the new API discountApplication variableValues is a possible field
    discountApplication.variableValues = {
      checkoutId: cartId,
      discountCode: discountCode.code
    },
      // @ts-ignore in the new API discountApplication hasNextPage is a possible field
      discountApplication.hasNextPage = false
    // @ts-ignore in the new API discountApplication hasPreviousPage is a possible field
    discountApplication.hasPreviousPage = false

  }

  return discountApplication
}

function mapLineItemsDiscountAllocation(cart: Cart) {
  const applicableDiscounts = cart.discountCodes.filter(discount => discount.applicable)

  if (!applicableDiscounts.length) return cart.lines.edges

  function mapDiscountAllocation(line: Cart['lines']['edges'][0]['node']) {
    const discountAllocation = line.discountAllocations[0]
    if (!discountAllocation) return null
    const discountApplication = mapDiscountApplication(false, discountAllocation, cart.discountCodes[0], cart.id)

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
        implementsNode: false
      }
    }

    const type = {
      "fieldBaseTypes": {
        allocatedAmount: "MoneyV2",
        discountApplication: "DiscountApplication"
      },
      implementsNode: false,
      kind: "OBJECT",
      name: "DiscountAllocation"
    }

    return { allocatedAmount, discountApplication, type }
  }

  return cart.lines.edges.map(({ node: line }) => {
    const lineDiscountAllocation = mapDiscountAllocation(line)
    return {
      ...line,
      discountAllocations: lineDiscountAllocation ? [lineDiscountAllocation] : []
    }
  })
}
