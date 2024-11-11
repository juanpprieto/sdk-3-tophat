import assert from "assert";
import { checkoutCreateInputMapper } from "./checkoutCreate";

// After a bunch of 'Exception during run: Error: Cannot find module './types/2025-01', I'm doing this for now
enum CountryCode {
  CA = 'CA',
  US = 'US'
}

enum CurrencyCode {
  USD = 'USD',
  CAD = 'CAD'
}

describe("checkoutCreateInputMapper", () => {
  it("returns empty object when the checkout input is empty", () => {
    assert.deepStrictEqual(checkoutCreateInputMapper({}), {});
  });

  describe("lineItems", () => {
    it('maps lineItems to lines with merchandiseId - empty case', () => {
      const input = { lineItems: [] };
      assert.deepStrictEqual(checkoutCreateInputMapper(input), { lines: [] });
    });
  
    it('maps lineItems to lines with merchandiseId - single item', () => {
      const input = {
        lineItems: [{
          variantId: 'gid://shopify/ProductVariant/123',
          quantity: 1,
          customAttributes: [{ key: 'color', value: 'blue' }]
        }]
      };
  
      assert.deepStrictEqual(checkoutCreateInputMapper(input), {
        lines: [{
          merchandiseId: 'gid://shopify/ProductVariant/123',
          quantity: 1,
          customAttributes: [{ key: 'color', value: 'blue' }]
        }]
      });
    });
  
    it('maps lineItems to lines with merchandiseId - multiple items', () => {
      const input = {
        lineItems: [
          {
            variantId: 'gid://shopify/ProductVariant/123',
            quantity: 1,
            customAttributes: [{ key: 'color', value: 'blue' }]
          },
          {
            variantId: 'gid://shopify/ProductVariant/456',
            quantity: 2,
            customAttributes: [{ key: 'size', value: 'large' }]
          }
        ]
      };
  
      assert.deepStrictEqual(checkoutCreateInputMapper(input), {
        lines: [
          {
            merchandiseId: 'gid://shopify/ProductVariant/123',
            quantity: 1,
            customAttributes: [{ key: 'color', value: 'blue' }]
          },
          {
            merchandiseId: 'gid://shopify/ProductVariant/456',
            quantity: 2,
            customAttributes: [{ key: 'size', value: 'large' }]
          }
        ]
      });
    });
  });

  it("maps note correctly", () => {
    const input = {
      note: "Test order",
    };
    
    assert.deepStrictEqual(checkoutCreateInputMapper(input), {
      note: "Test order",
    });
  });

  it("maps email to buyerIdentity.email", () => {
    const input = {
      email: "test@example.com",
    };

    assert.deepStrictEqual(checkoutCreateInputMapper(input), {
      buyerIdentity: {
        email: "test@example.com",
      },
    });
  });

  it("maps shippingAddress to deliveryAddressPreferences", () => {
    const address = {
      address1: "123 Main St",
      address2: "Apt 4",
      city: "Toronto",
      company: "Shopify",
      country: "Canada",
      firstName: "John",
      lastName: "Doe",
      phone: "555-555-5555",
      province: "ON",
      zip: "M5V 2B7",
    };

    const input = {
      shippingAddress: address,
    };

    assert.deepStrictEqual(checkoutCreateInputMapper(input), {
      buyerIdentity: {
        deliveryAddressPreferences: [
          {
            deliveryAddress: address,
          },
        ],
      },
    });
  });

  describe("custom attributes", () => {
    it('maps customAttributes correctly - empty case', () => {
      const input = { customAttributes: [] };
      assert.deepStrictEqual(checkoutCreateInputMapper(input), { attributes: [] });
    });
  
    it('maps customAttributes correctly - single attribute', () => {
      const input = {
        customAttributes: [{ key: 'gift', value: 'true' }]
      };
  
      assert.deepStrictEqual(checkoutCreateInputMapper(input), {
        attributes: [{ key: 'gift', value: 'true' }]
      });
    });
  
    it('maps customAttributes correctly - multiple attributes', () => {
      const input = {
        customAttributes: [
          { key: 'gift', value: 'true' },
          { key: 'note', value: 'Happy Birthday' },
          { key: 'wrap', value: 'premium' }
        ]
      };
  
      assert.deepStrictEqual(checkoutCreateInputMapper(input), {
        attributes: [
          { key: 'gift', value: 'true' },
          { key: 'note', value: 'Happy Birthday' },
          { key: 'wrap', value: 'premium' }
        ]
      });
    });
  });

  it("maps buyerIdentity countryCode correctly", () => {
    const input = {
      buyerIdentity: {
        countryCode: CountryCode.CA,
      },
    };

    assert.deepStrictEqual(checkoutCreateInputMapper(input), {
      buyerIdentity: {
        countryCode: CountryCode.CA,
      },
    });
  });

  describe("ignored fields", () => {
    it("ignores presentmentCurrencyCode", () => {
      const input = {
        presentmentCurrencyCode: CurrencyCode.USD,
        note: "Test",
      };

      assert.deepStrictEqual(checkoutCreateInputMapper(input), {
        note: "Test",
      });
    });

    it("ignores allowPartialAddresses", () => {
      const input = {
        allowPartialAddresses: true,
        note: "Test",
      };

      assert.deepStrictEqual(checkoutCreateInputMapper(input), {
        note: "Test",
      });
    });
  });

  it("handles multiple fields together with multiple items", () => {
    const input = {
      email: "test@example.com",
      note: "Test order",
      lineItems: [
        {
          variantId: "gid://shopify/ProductVariant/123",
          quantity: 1,
        },
        {
          variantId: "gid://shopify/ProductVariant/456",
          quantity: 2,
        },
      ],
      customAttributes: [
        { key: "gift", value: "true" },
        { key: "wrap", value: "premium" },
      ],
      buyerIdentity: {
        countryCode: CountryCode.CA,
      },
      presentmentCurrencyCode: CurrencyCode.USD,
      allowPartialAddresses: true,
    };

    assert.deepStrictEqual(checkoutCreateInputMapper(input), {
      buyerIdentity: {
        email: "test@example.com",
        countryCode: CountryCode.CA,
      },
      note: "Test order",
      lines: [
        {
          merchandiseId: "gid://shopify/ProductVariant/123",
          quantity: 1,
        },
        {
          merchandiseId: "gid://shopify/ProductVariant/456",
          quantity: 2,
        },
      ],
      attributes: [
        { key: "gift", value: "true" },
        { key: "wrap", value: "premium" },
      ],
    });
  });
});
