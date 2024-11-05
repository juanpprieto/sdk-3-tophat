import assert from "assert";
import { replaceLineItemsInputMapper } from "./replaceLineItems";

describe("replaceLineItemsInputMapper", () => {
  describe("checkoutId", () => {
    it("maps checkoutId to cartId", () => {
      assert.deepStrictEqual(replaceLineItemsInputMapper("gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef", []), {
        cartId: "gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef",
        lines: []
      });
    });
  });
  describe("lineItemIds", () => {
    it("maps empty lineItemIds to lineIds", () => {
      assert.deepStrictEqual(replaceLineItemsInputMapper("gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef", []), {
        cartId: "gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef",
        lines: []
      });
    });
    it("maps a single lineItemIds to lineIds", () => {
      assert.deepStrictEqual(replaceLineItemsInputMapper("gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef", [
        {
          variantId: "gid://shopify/ProductVariant/1",
          quantity: 1,
          customAttributes: []
        }]), {
        cartId: "gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef",
        lines: [
          {
            merchandiseId: "gid://shopify/ProductVariant/1",
            quantity: 1,
            attributes: []
          }
        ]
      });
    });

    it("maps multiple lineItemIds to lineIds", () => {
      assert.deepStrictEqual(replaceLineItemsInputMapper("gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef", [
        {
          variantId: "gid://shopify/ProductVariant/1",
          quantity: 2,
          customAttributes: [
            {
              key: "custom",
              value: "value"
            }
          ]
        },
        {
          variantId: "gid://shopify/ProductVariant/2",
          quantity: 1,
          customAttributes: []
        }
      ]), {
        cartId: "gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef",
        lines: [
          {
            merchandiseId: "gid://shopify/ProductVariant/1",
            quantity: 2,
            attributes: [
              {
                key: "custom",
                value: "value"
              }
            ]
          },
          {
            merchandiseId: "gid://shopify/ProductVariant/2",
            quantity: 1,
            attributes: []
          }
        ]
      });
    });
  });
});
