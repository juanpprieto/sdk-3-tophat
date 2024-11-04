import assert from "assert";
import { addLineItemsInputMapper } from "./addLineItems";

describe.only("addLineItemsInputMapper", () => {
  describe("checkoutId", () => {
    it("maps checkoutId to cartId", () => {
      assert.deepStrictEqual(addLineItemsInputMapper("gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef45f?key=63066c9d54f3bc638445c276fab0401d", []), {
        cartId: "gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef45f?key=63066c9d54f3bc638445c276fab0401d",
        lines: []
      });
    });
  });
  describe("linesItems", () => {
    it("maps lineItems to lines", () => {
      assert.deepStrictEqual(addLineItemsInputMapper("gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef45f?key=63066c9d54f3bc638445c276fab0401d", [
        {
          quantity: 1,
          variantId: "gid://shopify/ProductVariant/1",
          customAttributes: []
        }
      ]), {
        cartId: "gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef45f?key=63066c9d54f3bc638445c276fab0401d",
        lines: [
          {
            quantity: 1,
            merchandiseId: "gid://shopify/ProductVariant/1",
            attributes: []
          }
        ]
      });
    });
    it("maps multiple lineItems to lines", () => {
      assert.deepStrictEqual(addLineItemsInputMapper("gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef45f?key=63066c9d54f3bc638445c276fab0401d", [
        {
          quantity: 1,
          variantId: "gid://shopify/ProductVariant/1",
          customAttributes: []
        },
        {
          quantity: 2,
          variantId: "gid://shopify/ProductVariant/2",
          customAttributes: []
        }
      ]), {
        cartId: "gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef45f?key=63066c9d54f3bc638445c276fab0401d",
        lines: [
          {
            quantity: 1,
            merchandiseId: "gid://shopify/ProductVariant/1",
            attributes: []
          },
          {
            quantity: 2,
            merchandiseId: "gid://shopify/ProductVariant/2",
            attributes: []
          }
        ]
      });
    })
    it("maps customAttributes to attributes", () => {
      assert.deepStrictEqual(addLineItemsInputMapper("gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef45f?key=63066c9d54f3bc638445c276fab0401d", [
        {
          quantity: 1,
          variantId: "gid://shopify/ProductVariant/1",
          customAttributes: [
            {
              key: "size",
              value: "small"
            }
          ]
        }
      ]), {
        cartId: "gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef45f?key=63066c9d54f3bc638445c276fab0401d",
        lines: [
          {
            quantity: 1,
            merchandiseId: "gid://shopify/ProductVariant/1",
            attributes: [
              {
                key: "size",
                value: "small"
              }
            ]
          }
        ]
      });
    })
    it("maps multiple customAttributes to attributes", () => {
      assert.deepStrictEqual(addLineItemsInputMapper("gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef45f?key=63066c9d54f3bc638445c276fab0401d", [
        {
          quantity: 1,
          variantId: "gid://shopify/ProductVariant/1",
          customAttributes: [
            {
              key: "size",
              value: "small"
            },
            {
              key: "color",
              value: "blue"
            }
          ]
        }
      ]), {
        cartId: "gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef45f?key=63066c9d54f3bc638445c276fab0401d",
        lines: [
          {
            quantity: 1,
            merchandiseId: "gid://shopify/ProductVariant/1",
            attributes: [
              {
                key: "size",
                value: "small"
              },
              {
                key: "color",
                value: "blue"
              }
            ]
          }
        ]
      });
    })
    it("maps quantity, variantId, and customAttributes to quantity, merchandiseId, and attributes", () => {
      assert.deepStrictEqual(addLineItemsInputMapper("gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef45f?key=63066c9d54f3bc638445c276fab0401d", [
        {
          quantity: 3,
          variantId: "gid://shopify/ProductVariant/1",
          customAttributes: [
            {
              key: "size",
              value: "small"
            },
            {
              key: "color",
              value: "blue"
            }
          ]
        }
      ]), {
        cartId: "gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef45f?key=63066c9d54f3bc638445c276fab0401d",
        lines: [
          {
            quantity: 3,
            merchandiseId: "gid://shopify/ProductVariant/1",
            attributes: [
              {
                key: "size",
                value: "small"
              },
              {
                key: "color",
                value: "blue"
              }
            ]
          }
        ]
      });
    })
  });
});
