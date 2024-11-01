import assert from "assert";
import type { CheckoutAttributesUpdateV2Input } from "./types/2024-04";
import { updateAttributesInputMapper } from "./updateAttributes";

describe("updateAttributesInputMapper", () => {
  describe("checkoutId", () => {
    it("returns an empty cartId when the checkoutId is empty", () => {
      assert.deepStrictEqual(updateAttributesInputMapper("", {}), {
        cartAttributesUpdateInput: { attributes: [], cartId: "" },
        cartNoteUpdateInput: { cartId: "", note: "" }
      });
    });

    it("maps checkoutId to cartId", () => {
      assert.deepStrictEqual(updateAttributesInputMapper("gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef45f?key=63066c9d54f3bc638445c276fab0401d", {}), {
        cartAttributesUpdateInput: { attributes: [], cartId: "gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef45f?key=63066c9d54f3bc638445c276fab0401d" },
        cartNoteUpdateInput: { cartId: "gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef45f?key=63066c9d54f3bc638445c276fab0401d", note: "" }
      });
    });
  });

  describe("customAttributes", () => {
    it('maps a single customAttribute to attribute', () => {
      const input: CheckoutAttributesUpdateV2Input = {
        customAttributes: [
          { key: 'foo', value: 'bar' },
        ]
      }
      assert.deepStrictEqual(updateAttributesInputMapper("gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef", input), {
        cartAttributesUpdateInput: { attributes: [{ key: "foo", value: "bar" }], cartId: "gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef" },
        cartNoteUpdateInput: { cartId: "gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef", note: "" }
      });
    });

    it('maps multiple customAttributes to attributes', () => {
      const input: CheckoutAttributesUpdateV2Input = {
        customAttributes: [
          { key: 'foo', value: 'bar' },
          { key: 'baz', value: 'qux' },
        ]
      }
      assert.deepStrictEqual(updateAttributesInputMapper("gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef", input), {
        cartAttributesUpdateInput: { attributes: [{ key: "foo", value: "bar" }, { key: "baz", value: "qux" }], cartId: "gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef" },
        cartNoteUpdateInput: { cartId: "gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef", note: "" }
      });
    });
  });

  describe("note", () => {
    it('maps a note to note', () => {
      const input: CheckoutAttributesUpdateV2Input = {
        note: "This is a note"
      }
      assert.deepStrictEqual(updateAttributesInputMapper("gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef", input), {
        cartAttributesUpdateInput: { attributes: [], cartId: "gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef" },
        cartNoteUpdateInput: { cartId: "gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef", note: "This is a note" }
      });
    });
  });

  describe("all inputs", () => {
    it('maps all inputs correctly', () => {
      const input: CheckoutAttributesUpdateV2Input = {
        customAttributes: [
          { key: 'foo', value: 'bar' },
          { key: 'baz', value: 'qux' },
        ],
        note: "This is a note"
      }
      assert.deepStrictEqual(updateAttributesInputMapper("gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef", input), {
        cartAttributesUpdateInput: { attributes: [{ key: "foo", value: "bar" }, { key: "baz", value: "qux" }], cartId: "gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef" },
        cartNoteUpdateInput: { cartId: "gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef", note: "This is a note" }
      });
    });
  });

  describe("ignored fields", () => {
    it('ignores allowPartialAddresses', () => {
      const input: CheckoutAttributesUpdateV2Input = {
        allowPartialAddresses: true
      }
      assert.deepStrictEqual(updateAttributesInputMapper("gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef", input), {
        cartAttributesUpdateInput: { attributes: [], cartId: "gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef" },
        cartNoteUpdateInput: { cartId: "gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef", note: "" }
      });
    });
  });
});
