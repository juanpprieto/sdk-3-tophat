import assert from "assert";
import { updateLineItemsInputMapper } from "./updateLineItems";

describe("updateLineItemsInputMapper", () => {
  describe("checkoutId", () => {
    it("maps checkoutId to cartId", () => {
      assert.deepStrictEqual(updateLineItemsInputMapper("gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef", []), {
        cartId: "gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef",
        lines: []
      });
    });
  });
  describe("lineItems", () => {
    it("maps empty lineItems to lines", () => {
      assert.deepStrictEqual(updateLineItemsInputMapper("gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef", []), {
        cartId: "gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef",
        lines: []
      });
    });
    it("maps a single lineItem to lines", () => {
      assert.deepStrictEqual(updateLineItemsInputMapper("gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef", [
        {
          id: "gid://shopify/LineItem/1",
          quantity: 1,
        }]), {
        cartId: "gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef",
        lines: [
          {
            id: "gid://shopify/LineItem/1",
            quantity: 1,
          }
        ]
      });
    });
    it("maps multiple lineItems to lines", () => {
      assert.deepStrictEqual(updateLineItemsInputMapper("gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef", [
        {
          id: "gid://shopify/LineItem/1",
          quantity: 2,
          customAttributes: [
            {
              key: "custom",
              value: "value"
            }
          ]
        },
        {
          id: "gid://shopify/LineItem/2",
          quantity: 3,
          customAttributes: [],
          variantId: "gid://shopify/ProductVariant/2"
        }
      ]), {
        cartId: "gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef",
        lines: [
          {
            id: "gid://shopify/LineItem/1",
            quantity: 2,
            attributes: [
              {
                key: "custom",
                value: "value"
              }
            ]
          },
          {
            id: "gid://shopify/LineItem/2",
            quantity: 3,
            attributes: [],
            merchandiseId: "gid://shopify/ProductVariant/2"
          }
        ]
      });
    });
  });
});
