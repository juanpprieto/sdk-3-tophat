import { MutationcheckoutDiscountCodeApplyV2Args } from './types/2024-04'
import { MutationcartDiscountCodesUpdateArgs } from './types/2025-01'
import { Cart } from './types/2025-01'

type AddDiscountInputMapper = {
  cartId: MutationcartDiscountCodesUpdateArgs['cartId'],
  discountCodes: MutationcartDiscountCodesUpdateArgs['discountCodes']
}

export const addDiscountInputMapper = (
  checkoutId: MutationcheckoutDiscountCodeApplyV2Args['checkoutId'],
  discountCode: MutationcheckoutDiscountCodeApplyV2Args['discountCode']
): AddDiscountInputMapper => {
  return {
    cartId: checkoutId,
    // NOTE: checkout support only one discount code
    discountCodes: discountCode ? [discountCode] : []
  }
}

export const addDiscountOutputMapper = (cart: Cart) => {
  const lines = cart.lines.edges
  if (!lines.length) return {
    ...cart,
    discountApplications: [],
    lineItems: []
  }
  return {
    ...cart,
    discountApplications: mapDiscountApplication(lines[0].node.discountAllocations[0], cart.discountCodes[0], cart.id),
    lineItems: lineItemsDiscountAllocation(cart)
  }
}

function mapDiscountApplication(discountAllocation: Cart['lines']['edges'][0]['node']['discountAllocations'][0], discountCode: Cart['discountCodes'][0], cartId: Cart['id']) {
  const targetSelection = discountAllocation.targetSelection
  const allocationMethod = discountAllocation.allocationMethod
  const targetType = discountAllocation.targetType
  // @ts-ignore in the new API value percentage is a possible field
  const isPercentage = typeof firstLine.discountAllocations[0].value.percentage !== 'undefined'
  // @ts-ignore in the new API value amount is a possible field
  const isFixed = typeof firstLine.discountAllocations[0].value.amount !== 'undefined'

  const value = isFixed ? {
    // @ts-ignore in the new API value amount is a possible field
    amount: firstLine.discountAllocations[0].value.amount,
    // @ts-ignore in the new API value currencyCode is a possible field
    currencyCode: firstLine.discountAllocations[0].value.currencyCode,
    type: {
      name: "PricingValue",
      kind: "UNION"
    }
  } : {
    // @ts-ignore in the new API value percentage is a possible field
    percentage: firstLine.discountAllocations[0].value.percentage,
    type: {
      name: "PricingValue",
      kind: "UNION"
    }
  }

  return ({
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
        kind: "OBJECT",
        applicable: "Boolean",
        code: "String"
      },
      implementsNode: false
    },
    hasNextPage: false,
    hasPreviousPage: false,
    // input variables
    variableValues: {
      checkoutId: cartId,
      discountCode: discountCode.code
    }
  }
  )
}

function lineItemsDiscountAllocation(cart: Cart) {
  const applicableDiscounts = cart.discountCodes.filter(discount => discount.applicable)

  if (!applicableDiscounts.length) return cart.lines

  function mapDiscountAllocation(line: Cart['lines']['edges'][0]['node']) {
    const discountAllocation = line.discountAllocations[0]
    const discountApplication = mapDiscountApplication(discountAllocation, cart.discountCodes[0], cart.id)
    return {
      ...line,
      discountAllocations: [
        {
          allocatedAmount: {
            amount: line.discountAllocations[0].discountedAmount.amount,
            currencyCode: line.discountAllocations[0].discountedAmount.currencyCode,
            type: {
              name: "MoneyV2",
              kind: "OBJECT",
              fieldBaseTypes: {
                amount: "Decimal",
                currencyCode: "CurrencyCode"
              },
              implementsNode: false
            }
          },
          discountApplication,
        }
      ]
    }
  }

  return cart.lines.edges.map(({node: line}) => ({
    ...line,
    discountAllocations: mapDiscountAllocation(line)
  }))
}
