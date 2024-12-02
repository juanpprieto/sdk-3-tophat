import assert from "assert";
import { discountAndLineMapperForTests } from "./payloadDiscount";
import { isEqual } from "lodash";

enum CurrencyCode {
  USD = "USD",
  CAD = "CAD",
}

enum DiscountApplicationAllocationMethod {
  ACROSS = "ACROSS",
  EACH = "EACH",
  ONE = "ONE",
}

enum DiscountApplicationTargetSelection {
  ALL = "ALL",
  ENTITLED = "ENTITLED",
  EXPLICIT = "EXPLICIT",
}

enum DiscountApplicationTargetType {
  LINE_ITEM = "LINE_ITEM",
  SHIPPING_LINE = "SHIPPING_LINE",
}

describe.only("discountAndLineMapperForTests", () => {
  describe("when the cart has no discounts applied", () => {
    describe("and there are no line items", () => {
      it("returns empty arrays", () => {
        const result = discountAndLineMapperForTests({
          cartLineItems: [],
          cartDiscountAllocations: [],
          cartDiscountCodes: [],
        });

        assert.deepEqual(result.checkoutDiscountApplications, []);
        assert.deepEqual(result.checkoutLines, []);
      });
    });
  });

  describe("when the cart has super complicated discounts", () => {
    it.only("maps things correctly", () => {
      debugger;
      const result = discountAndLineMapperForTests({
        cartLineItems: [
          {
            id: "gid://shopify/CartLine/3c67754f-e9ae-4861-a4c0-870cb5adffec?cart=Z2NwLXVzLWNlbnRyYWwxOjAxSkRWMlhYVkhXTlhYODcyNFkzQzJRUDdH",
            quantity: 1,
            discountAllocations: [
              {
                targetType: DiscountApplicationTargetType.LINE_ITEM,
                allocationMethod: DiscountApplicationAllocationMethod.EACH,
                targetSelection: DiscountApplicationTargetSelection.ENTITLED,
                code: "10OFF",
                value: {
                  amount: 10.0,
                  currencyCode: CurrencyCode.USD,
                },
                discountedAmount: {
                  amount: 10.0,
                  currencyCode: CurrencyCode.USD,
                },
              },
            ],
            cost: {
              totalAmount: {
                amount: 60.0,
                currencyCode: CurrencyCode.USD,
              },
            },
          },
          {
            id: "gid://shopify/CartLine/c1827851-ad14-4e25-9a4a-21d50cf6b83c?cart=Z2NwLXVzLWNlbnRyYWwxOjAxSkRWMlhYVkhXTlhYODcyNFkzQzJRUDdH",
            quantity: 3,
            discountAllocations: [
              {
                targetType: DiscountApplicationTargetType.LINE_ITEM,
                allocationMethod: DiscountApplicationAllocationMethod.EACH,
                targetSelection: DiscountApplicationTargetSelection.ENTITLED,
                title: "150offvariant",
                value: {
                  amount: 450.0,
                  currencyCode: CurrencyCode.USD,
                },
                discountedAmount: {
                  amount: 450.0,
                  currencyCode: CurrencyCode.USD,
                },
              },
            ],
            cost: {
              totalAmount: {
                amount: 150.0,
                currencyCode: CurrencyCode.USD,
              },
            },
          },
        ],
        cartDiscountAllocations: [
          {
            targetType: DiscountApplicationTargetType.LINE_ITEM,
            allocationMethod: DiscountApplicationAllocationMethod.ACROSS,
            targetSelection: DiscountApplicationTargetSelection.ALL,
            title: "5 off order",
            value: {
              percentage: 5,
            },
            discountedAmount: {
              amount: 3.0,
              currencyCode: CurrencyCode.USD,
            },
          },
          {
            targetType: DiscountApplicationTargetType.LINE_ITEM,
            allocationMethod: DiscountApplicationAllocationMethod.ACROSS,
            targetSelection: DiscountApplicationTargetSelection.ALL,
            title: "5OFF",
            value: {
              percentage: 5,
            },
            discountedAmount: {
              amount: 3.0,
              currencyCode: CurrencyCode.USD,
            },
          },
          {
            targetType: DiscountApplicationTargetType.LINE_ITEM,
            allocationMethod: DiscountApplicationAllocationMethod.ACROSS,
            targetSelection: DiscountApplicationTargetSelection.ALL,
            title: "5 off order",
            value: {
              percentage: 5,
            },
            discountedAmount: {
              amount: 7.5,
              currencyCode: CurrencyCode.USD,
            },
          },
          {
            targetType: DiscountApplicationTargetType.LINE_ITEM,
            allocationMethod: DiscountApplicationAllocationMethod.ACROSS,
            targetSelection: DiscountApplicationTargetSelection.ALL,
            title: "5OFF",
            value: {
              percentage: 5,
            },
            discountedAmount: {
              amount: 7.5,
              currencyCode: CurrencyCode.USD,
            },
          },
        ],
        cartDiscountCodes: [
          {
            applicable: true,
            code: "10OFF",
          },
        ],
      });

      const expectedCheckoutDiscountApplications = [
        {
          targetSelection: "ENTITLED",
          allocationMethod: "EACH",
          targetType: "LINE_ITEM",
          value: {
            amount: 450.0,
            currencyCode: "USD",
          },
          title: "150offvariant",
        },
        {
          targetSelection: "ALL",
          allocationMethod: "ACROSS",
          targetType: "LINE_ITEM",
          value: {
            percentage: 5,
          },
          title: "5 off order",
        },
        {
          targetSelection: "ALL",
          allocationMethod: "ACROSS",
          targetType: "LINE_ITEM",
          value: {
            percentage: 5,
          },
          title: "5OFF",
        },
        {
          targetSelection: "ENTITLED",
          allocationMethod: "EACH",
          targetType: "LINE_ITEM",
          value: {
            amount: 10.0,
            currencyCode: "USD",
          },
          code: "10OFF",
          applicable: true,
        },
      ];
      const expectedCheckoutLines = [
        {
          id: "gid://shopify/CartLine/c1827851-ad14-4e25-9a4a-21d50cf6b83c?cart=Z2NwLXVzLWNlbnRyYWwxOjAxSkRWMlhYVkhXTlhYODcyNFkzQzJRUDdH",
          quantity: 3,
          discountAllocations: [
            {
              allocatedAmount: {
                amount: 450.0,
                currencyCode: "USD",
              },
              discountApplication: {
                targetSelection: "ENTITLED",
                allocationMethod: "EACH",
                targetType: "LINE_ITEM",
                value: {
                  amount: 450.0,
                  currencyCode: "USD",
                },
                title: "150offvariant",
              },
            },
            {
              allocatedAmount: {
                amount: 7.5,
                currencyCode: "USD",
              },
              discountApplication: {
                targetSelection: "ALL",
                allocationMethod: "ACROSS",
                targetType: "LINE_ITEM",
                value: {
                  percentage: 5,
                },
                title: "5 off order",
              },
            },
            {
              allocatedAmount: {
                amount: 7.5,
                currencyCode: "USD",
              },
              discountApplication: {
                targetSelection: "ALL",
                allocationMethod: "ACROSS",
                targetType: "LINE_ITEM",
                value: {
                  percentage: 5,
                },
                title: "5OFF",
              },
            },
          ],
        },
        {
          id: "gid://shopify/CartLine/3c67754f-e9ae-4861-a4c0-870cb5adffec?cart=Z2NwLXVzLWNlbnRyYWwxOjAxSkRWMlhYVkhXTlhYODcyNFkzQzJRUDdH",
          quantity: 1,
          discountAllocations: [
            {
              allocatedAmount: {
                amount: 3.0,
                currencyCode: "USD",
              },
              discountApplication: {
                targetSelection: "ALL",
                allocationMethod: "ACROSS",
                targetType: "LINE_ITEM",
                value: {
                  percentage: 5,
                },
                title: "5 off order",
              },
            },
            {
              allocatedAmount: {
                amount: 3.0,
                currencyCode: "USD",
              },
              discountApplication: {
                targetSelection: "ALL",
                allocationMethod: "ACROSS",
                targetType: "LINE_ITEM",
                value: {
                  percentage: 5,
                },
                title: "5OFF",
              },
            },
            {
              allocatedAmount: {
                amount: 10.0,
                currencyCode: "USD",
              },
              discountApplication: {
                targetSelection: "ENTITLED",
                allocationMethod: "EACH",
                targetType: "LINE_ITEM",
                value: {
                  amount: 10.0,
                  currencyCode: "USD",
                },
                code: "10OFF",
                applicable: true,
              },
            },
          ],
        },
      ];

      console.log(JSON.stringify(result.checkoutLines, null, 2));
      console.log('--------------------------------');
      console.log(JSON.stringify(expectedCheckoutLines, null, 2));
      assert.ok(
        result.checkoutDiscountApplications.length ===
          expectedCheckoutDiscountApplications.length
      );
      assert.ok(
        result.checkoutDiscountApplications.every((resultDiscount) =>
          expectedCheckoutDiscountApplications.some((expectedDiscount) =>
            isEqual(resultDiscount, expectedDiscount)
          )
        )
      );
      assert.ok(result.checkoutLines.length === expectedCheckoutLines.length);
      assert.ok(
        result.checkoutLines.every((resultLine) =>
          expectedCheckoutLines.some((expectedLine) =>
            isEqual(resultLine, expectedLine)
          )
        )
      );
    });
  });

  describe("when the cart has a discount code applied", () => {});
  describe("when the cart has no line items", () => {
    it("returns empty arrays when there are no discounts applied", () => {
      const result = discountAndLineMapperForTests({
        cartLineItems: [],
        cartDiscountAllocations: [],
        cartDiscountCodes: [],
      });

      assert.deepEqual(result.checkoutDiscountApplications, []);
      assert.deepEqual(result.checkoutLines, []);
    });

    it("returns empty arrays when there is a discount code applied", () => {
      const result = discountAndLineMapperForTests({
        cartLineItems: [],
        cartDiscountAllocations: [],
        cartDiscountCodes: [
          {
            applicable: false,
            code: "ORDER50OFF",
          },
        ],
      });

      assert.deepEqual(result.checkoutDiscountApplications, []);
      assert.deepEqual(result.checkoutLines, []);
    });

    it("returns empty arrays when there are multiple discount codes applied", () => {
      const result = discountAndLineMapperForTests({
        cartLineItems: [],
        cartDiscountAllocations: [],
        cartDiscountCodes: [
          {
            applicable: false,
            code: "PRODUCT10OFF",
          },
          {
            applicable: false,
            code: "ORDER50OFF",
          },
          {
            applicable: false,
            code: "ORDER10OFF",
          },
        ],
      });

      assert.deepEqual(result.checkoutDiscountApplications, []);
      assert.deepEqual(result.checkoutLines, []);
    });
  });

  describe("when the cart has 1 line item", () => {
    describe("and there are no discounts applied", () => {
      it("returns an empty array for discount applications and line items", () => {
        const result = discountAndLineMapperForTests({
          cartLineItems: [
            {
              id: "gid://shopify/ProductVariant/41401421206018",
              cost: {
                totalAmount: {
                  amount: 100.0,
                  currencyCode: CurrencyCode.USD,
                },
              },
              discountAllocations: [],
              quantity: 1,
            },
          ],
          cartDiscountAllocations: [],
          cartDiscountCodes: [],
        });

        assert.deepEqual(result.checkoutDiscountApplications, []);
        assert.deepEqual(result.checkoutLines, []);
      });
    });

    // and there is a discount code applied
    // and there are multiple discount codes applied
    // and there are automatic discounts applied
    // and there are multiple automatic discounts applied
    // and there is a discount code and an automatic discount applied
  });
});
