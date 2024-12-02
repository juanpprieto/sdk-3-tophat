import assert from "assert";
import { discountsPayloadMapper } from "./payloadDiscount";
import { Cart } from "./types/2025-01";

describe("discountPayloadMapper", () => {
  describe("empty checkout", () => {
    it("maps an empty checkout with a fixed discount code", () => {
      const cart = {
        discountAllocations: [],
        discountCodes: [
          {
            applicable: false,
            code: "10PERCENTOFF"
          }
        ],
        lines: { edges: [] },
      } as unknown as Cart;
      const checkout = discountsPayloadMapper(cart);
      // @ts-ignore testing for a field known to be undefined after mapping
      assert.ok(typeof checkout.discountAllocations === 'undefined');
      // @ts-ignore
      assert.ok(typeof checkout.discountCodes === 'undefined');
      assert.equal(checkout.discountApplications.length, 0);
      assert.equal(checkout.lineItems.length, 0);
    });

    it("maps an empty checkout with a percentage discount code", () => {
      const cart = {
        discountAllocations: [],
        discountCodes: [
          {
            applicable: false,
            code: "10PERCENTOFF"
          }
        ],
        lines: { edges: [] },
      } as unknown as Cart;
      const checkout = discountsPayloadMapper(cart);
      // @ts-ignore
      assert.ok(typeof checkout.discountAllocations === 'undefined');
      // @ts-ignore
      assert.ok(typeof checkout.discountCodes === 'undefined');
      assert.equal(checkout.discountApplications.length, 0);
      assert.equal(checkout.lineItems.length, 0);
    });
  });

  describe("one line checkout", () => {
    it("maps a one line checkout with a fixed discount code", () => {
      const cart = {
        "id": "gid://shopify/Cart/3af96c90098b2bfe22ccbd882daef",
        "discountAllocations": [],
        "discountCodes": [
          {
            "applicable": true,
            "code": "10OFF"
          }
        ],
        lines: {
          edges: [
            {
              "node": {
                "discountAllocations": [
                  {
                    "targetType": "LINE_ITEM",
                    "allocationMethod": "EACH",
                    "targetSelection": "ENTITLED",
                    "code": "10OFF",
                    "value": {
                      "amount": "10.0",
                      "currencyCode": "USD"
                    },
                    "discountedAmount": {
                      "amount": "10.0",
                      "currencyCode": "USD"
                    },
                    "__typename": "CartCodeDiscountAllocation"
                  }
                ]
              }
            }
          ]
        }
      }

      const mappedCart = discountsPayloadMapper(cart as unknown as Cart);

      const checkout = {
        "discountApplications": [
          {
            "__typename": "DiscountCodeApplication",
            "targetSelection": "ENTITLED",
            "allocationMethod": "EACH",
            "targetType": "LINE_ITEM",
            "value": {
              "amount": "10.0",
              "currencyCode": "USD",
              "type": {
                "name": "PricingValue",
                "kind": "UNION"
              }
            },
            "code": "10OFF",
            "applicable": true,
            "type": {
              "name": "DiscountCodeApplication",
              "kind": "OBJECT",
              "fieldBaseTypes": {
                "applicable": "Boolean",
                "code": "String"
              },
              "implementsNode": false
            },
            "hasNextPage": false,
            "hasPreviousPage": false,
            "variableValues": {
              "checkoutId": cart.id,
              "discountCode": "10OFF"
            }
          }
        ],
        lineItems: [
          {
            "discountAllocations": [
              {
                "allocatedAmount": {
                  "amount": "10.0",
                  "currencyCode": "USD",
                  "type": {
                    "name": "MoneyV2",
                    "kind": "OBJECT",
                    "fieldBaseTypes": {
                      "amount": "Decimal",
                      "currencyCode": "CurrencyCode"
                    },
                    "implementsNode": false
                  }
                },
                "discountApplication": {
                  "__typename": "DiscountCodeApplication",
                  "targetSelection": "ENTITLED",
                  "allocationMethod": "EACH",
                  "targetType": "LINE_ITEM",
                  "value": {
                    "amount": "10.0",
                    "currencyCode": "USD",
                    "type": {
                      "name": "PricingValue",
                      "kind": "UNION"
                    }
                  },
                  "code": "10OFF",
                  "applicable": true,
                  "type": {
                    "name": "DiscountCodeApplication",
                    "kind": "OBJECT",
                    "fieldBaseTypes": {
                      "applicable": "Boolean",
                      "code": "String"
                    },
                    "implementsNode": false
                  }
                },
                "type": {
                  "name": "DiscountAllocation",
                  "kind": "OBJECT",
                  "fieldBaseTypes": {
                    "allocatedAmount": "MoneyV2",
                    "discountApplication": "DiscountApplication"
                  },
                  "implementsNode": false
                }
              }
            ]
          }
        ]
      }
      assert.deepStrictEqual(mappedCart.discountApplications, checkout.discountApplications);
      assert.deepStrictEqual(mappedCart.lineItems, checkout.lineItems);
    })

    it("maps a one line checkout with a percentage discount code", () => {
      const cart = {
        "id": "gid://shopify/Cart/3af96c90098b2bfe22ccbd882daef",
        "discountAllocations": [],
        "discountCodes": [
          {
            "applicable": true,
            "code": "10PERCENTOFF"
          }
        ],
        lines: {
          edges: [
            {
              node: {
                discountAllocations: [
                  {
                    "targetType": "LINE_ITEM",
                    "allocationMethod": "EACH",
                    "targetSelection": "ENTITLED",
                    "code": "10PERCENTOFF",
                    "value": {
                      "percentage": 10
                    },
                    "discountedAmount": {
                      "amount": "20.0",
                      "currencyCode": "USD"
                    },
                    "__typename": "CartCodeDiscountAllocation"
                  }
                ]
              }
            }
          ]
        }
      }

      const mappedCart = discountsPayloadMapper(cart as unknown as Cart);

      const checkout = {
        "discountApplications": [
          {
            "__typename": "DiscountCodeApplication",
            "targetSelection": "ENTITLED",
            "allocationMethod": "EACH",
            "targetType": "LINE_ITEM",
            "value": {
              "percentage": 10,
              "type": {
                "name": "PricingValue",
                "kind": "UNION"
              }
            },
            "code": "10PERCENTOFF",
            "applicable": true,
            "type": {
              "name": "DiscountCodeApplication",
              "kind": "OBJECT",
              "fieldBaseTypes": {
                "applicable": "Boolean",
                "code": "String"
              },
              "implementsNode": false
            },
            "hasNextPage": false,
            "hasPreviousPage": false,
            "variableValues": {
              "checkoutId": cart.id,
              "discountCode": "10PERCENTOFF"
            }
          }
        ],
        lineItems: [
          {
            "discountAllocations": [
              {
                "allocatedAmount": {
                  "amount": "20.0",
                  "currencyCode": "USD",
                  "type": {
                    "name": "MoneyV2",
                    "kind": "OBJECT",
                    "fieldBaseTypes": {
                      "amount": "Decimal",
                      "currencyCode": "CurrencyCode"
                    },
                    "implementsNode": false
                  }
                },
                "discountApplication": {
                  "__typename": "DiscountCodeApplication",
                  "targetSelection": "ENTITLED",
                  "allocationMethod": "EACH",
                  "targetType": "LINE_ITEM",
                  "value": {
                    "percentage": 10,
                    "type": {
                      "name": "PricingValue",
                      "kind": "UNION"
                    }
                  },
                  "code": "10PERCENTOFF",
                  "applicable": true,
                  "type": {
                    "name": "DiscountCodeApplication",
                    "kind": "OBJECT",
                    "fieldBaseTypes": {
                      "applicable": "Boolean",
                      "code": "String"
                    },
                    "implementsNode": false
                  }
                },
                "type": {
                  "name": "DiscountAllocation",
                  "kind": "OBJECT",
                  "fieldBaseTypes": {
                    "allocatedAmount": "MoneyV2",
                    "discountApplication": "DiscountApplication"
                  },
                  "implementsNode": false
                }
              }
            ],
          }
        ]
      }

      assert.deepStrictEqual(mappedCart.discountApplications, checkout.discountApplications);
      assert.deepStrictEqual(mappedCart.lineItems, checkout.lineItems);
    })

    it('maps a one line checkout with a order-level fixed discount code', () => {
      const cart = {
        "id": "gid://shopify/Cart/3af96c90098b2bfe22ccbd882daef",
        "discountAllocations": [
          {
            "targetType": "LINE_ITEM",
            "allocationMethod": "ACROSS",
            "targetSelection": "ALL",
            "code": "ORDERFIXED50OFF",
            "value": {
              "amount": "50.0",
              "currencyCode": "USD"
            },
            "discountedAmount": {
              "amount": "50.0",
              "currencyCode": "USD"
            },
            "__typename": "CartCodeDiscountAllocation"
          }
        ],
        "discountCodes": [
          {
            "applicable": true,
            "code": "ORDERFIXED50OFF"
          }
        ],
        lines: { edges: [{ node: { "discountAllocations": [] } }] }
      }

      const mappedCart = discountsPayloadMapper(cart as unknown as Cart);

      const checkout = {
        "discountApplications": [
          {
            "__typename": "DiscountCodeApplication",
            "targetSelection": "ALL",
            "allocationMethod": "ACROSS",
            "targetType": "LINE_ITEM",
            "value": {
              "amount": "50.0",
              "currencyCode": "USD",
              "type": {
                "name": "PricingValue",
                "kind": "UNION"
              }
            },
            "code": "ORDERFIXED50OFF",
            "applicable": true,
            "type": {
              "name": "DiscountCodeApplication",
              "kind": "OBJECT",
              "fieldBaseTypes": {
                "applicable": "Boolean",
                "code": "String"
              },
              "implementsNode": false
            },
            "hasNextPage": false,
            "hasPreviousPage": false,
            "variableValues": {
              "checkoutId": cart.id,
              "discountCode": "ORDERFIXED50OFF"
            }
          }
        ],
        lineItems: [
          {
            "discountAllocations": [
              {
                "allocatedAmount": {
                  "amount": "50.0",
                  "currencyCode": "USD",
                  "type": {
                    "name": "MoneyV2",
                    "kind": "OBJECT",
                    "fieldBaseTypes": {
                      "amount": "Decimal",
                      "currencyCode": "CurrencyCode"
                    },
                    "implementsNode": false
                  }
                },
                "discountApplication": {
                  "__typename": "DiscountCodeApplication",
                  "targetSelection": "ALL",
                  "allocationMethod": "ACROSS",
                  "targetType": "LINE_ITEM",
                  "value": {
                    "amount": "50.0",
                    "currencyCode": "USD",
                    "type": {
                      "name": "PricingValue",
                      "kind": "UNION"
                    }
                  },
                  "code": "ORDERFIXED50OFF",
                  "applicable": true,
                  "type": {
                    "name": "DiscountCodeApplication",
                    "kind": "OBJECT",
                    "fieldBaseTypes": {
                      "applicable": "Boolean",
                      "code": "String"
                    },
                    "implementsNode": false
                  }
                },
                "type": {
                  "name": "DiscountAllocation",
                  "kind": "OBJECT",
                  "fieldBaseTypes": {
                    "allocatedAmount": "MoneyV2",
                    "discountApplication": "DiscountApplication"
                  },
                  "implementsNode": false
                }
              }
            ]
          }]
      }

      assert.deepStrictEqual(mappedCart.discountApplications, checkout.discountApplications);
      assert.deepStrictEqual(mappedCart.lineItems, checkout.lineItems);
    });


    it('maps a one line checkout with a order-level percentage discount code', () => {
      const cart = {
        "id": "gid://shopify/Cart/3af96c90098b2bfe22ccbd882daef",
        "discountAllocations": [
          {
            "targetType": "LINE_ITEM",
            "allocationMethod": "ACROSS",
            "targetSelection": "ALL",
            "code": "ORDER50PERCENTOFF",
            "value": {
              "percentage": 50
            },
            "discountedAmount": {
              "amount": "100.0",
              "currencyCode": "USD"
            },
            "__typename": "CartCodeDiscountAllocation"
          }
        ],
        "discountCodes": [
          {
            "applicable": true,
            "code": "ORDER50PERCENTOFF"
          }
        ],
        lines: { edges: [{ node: { "discountAllocations": [] } }] }
      }

      const mappedCart = discountsPayloadMapper(cart as unknown as Cart);

      const checkout = {
        "discountApplications": [
          {
            "__typename": "DiscountCodeApplication",
            "targetSelection": "ALL",
            "allocationMethod": "ACROSS",
            "targetType": "LINE_ITEM",
            "value": {
              "percentage": 50,
              "type": {
                "name": "PricingValue",
                "kind": "UNION"
              }
            },
            "code": "ORDER50PERCENTOFF",
            "applicable": true,
            "type": {
              "name": "DiscountCodeApplication",
              "kind": "OBJECT",
              "fieldBaseTypes": {
                "applicable": "Boolean",
                "code": "String"
              },
              "implementsNode": false
            },
            "hasNextPage": false,
            "hasPreviousPage": false,
            "variableValues": {
              "checkoutId": cart.id,
              "discountCode": "ORDER50PERCENTOFF"
            }
          }
        ],
        lineItems: [
          {
            "discountAllocations": [
              {
                "allocatedAmount": {
                  "amount": "100.0",
                  "currencyCode": "USD",
                  "type": {
                    "name": "MoneyV2",
                    "kind": "OBJECT",
                    "fieldBaseTypes": {
                      "amount": "Decimal",
                      "currencyCode": "CurrencyCode"
                    },
                    "implementsNode": false
                  }
                },
                "discountApplication": {
                  "__typename": "DiscountCodeApplication",
                  "targetSelection": "ALL",
                  "allocationMethod": "ACROSS",
                  "targetType": "LINE_ITEM",
                  "value": {
                    "percentage": 50,
                    "type": {
                      "name": "PricingValue",
                      "kind": "UNION"
                    }
                  },
                  "code": "ORDER50PERCENTOFF",
                  "applicable": true,
                  "type": {
                    "name": "DiscountCodeApplication",
                    "kind": "OBJECT",
                    "fieldBaseTypes": {
                      "applicable": "Boolean",
                      "code": "String"
                    },
                    "implementsNode": false
                  }
                },
                "type": {
                  "name": "DiscountAllocation",
                  "kind": "OBJECT",
                  "fieldBaseTypes": {
                    "allocatedAmount": "MoneyV2",
                    "discountApplication": "DiscountApplication"
                  },
                  "implementsNode": false
                }
              }
            ],
          }
        ]
      }

      assert.deepStrictEqual(mappedCart.discountApplications, checkout.discountApplications);
      assert.deepStrictEqual(mappedCart.lineItems, checkout.lineItems);
    });

  });

  describe("multi-line checkout", () => {
    it('TODO: maps a multi-line checkout with fixed discount code', () => {
      const cart = {
        "id": "gid://shopify/Cart/3af96c90098b2bfe22ccbd882daef",
        "discountAllocations": [],
        "discountCodes": [
          {
            "applicable": true,
            "code": "10OFF"
          }
        ],
        lines: {
          edges: [
            {
              node: {
                "discountAllocations": [
                  {
                    "targetType": "LINE_ITEM",
                    "allocationMethod": "EACH",
                    "targetSelection": "ENTITLED",
                    "code": "10OFF",
                    "value": {
                      "amount": "10.0",
                      "currencyCode": "USD"
                    },
                    "discountedAmount": {
                      "amount": "10.0",
                      "currencyCode": "USD"
                    },
                    "__typename": "CartCodeDiscountAllocation"
                  }
                ],
              }
            },
            {
              node: {
                "discountAllocations": [
                  {
                    "targetType": "LINE_ITEM",
                    "allocationMethod": "EACH",
                    "targetSelection": "ENTITLED",
                    "code": "10OFF",
                    "value": {
                      "amount": "10.0",
                      "currencyCode": "USD"
                    },
                    "discountedAmount": {
                      "amount": "10.0",
                      "currencyCode": "USD"
                    },
                    "__typename": "CartCodeDiscountAllocation"
                  }
                ],
              }
            }
          ]
        }
      }

      const mappedCart = discountsPayloadMapper(cart as unknown as Cart);

      const checkout = {
        "discountApplications": [
          {
            "__typename": "DiscountCodeApplication",
            "targetSelection": "ENTITLED",
            "allocationMethod": "EACH",
            "targetType": "LINE_ITEM",
            "value": {
              "amount": "20.0",
              "currencyCode": "USD",
              "type": {
                "name": "PricingValue",
                "kind": "UNION"
              }
            },
            "code": "10OFF",
            "applicable": true,
            "type": {
              "name": "DiscountCodeApplication",
              "kind": "OBJECT",
              "fieldBaseTypes": {
                "applicable": "Boolean",
                "code": "String"
              },
              "implementsNode": false
            },
            "hasNextPage": false,
            "hasPreviousPage": false,
            "variableValues": {
              "checkoutId": cart.id,
              "discountCode": "10OFF"
            }
          }
        ],
        lineItems: [
          {
            "discountAllocations": [
              {
                "allocatedAmount": {
                  "amount": "10.0",
                  "currencyCode": "USD",
                  "type": {
                    "name": "MoneyV2",
                    "kind": "OBJECT",
                    "fieldBaseTypes": {
                      "amount": "Decimal",
                      "currencyCode": "CurrencyCode"
                    },
                    "implementsNode": false
                  }
                },
                "discountApplication": {
                  "__typename": "DiscountCodeApplication",
                  "targetSelection": "ENTITLED",
                  "allocationMethod": "EACH",
                  "targetType": "LINE_ITEM",
                  "value": {
                    "amount": "20.0",
                    "currencyCode": "USD",
                    "type": {
                      "name": "PricingValue",
                      "kind": "UNION"
                    }
                  },
                  "code": "10OFF",
                  "applicable": true,
                  "type": {
                    "name": "DiscountCodeApplication",
                    "kind": "OBJECT",
                    "fieldBaseTypes": {
                      "applicable": "Boolean",
                      "code": "String"
                    },
                    "implementsNode": false
                  }
                },
                "type": {
                  "name": "DiscountAllocation",
                  "kind": "OBJECT",
                  "fieldBaseTypes": {
                    "allocatedAmount": "MoneyV2",
                    "discountApplication": "DiscountApplication"
                  },
                  "implementsNode": false
                }
              },
              {
                "discountAllocations": [
                  {
                    "allocatedAmount": {
                      "amount": "10.0",
                      "currencyCode": "USD",
                      "type": {
                        "name": "MoneyV2",
                        "kind": "OBJECT",
                        "fieldBaseTypes": {
                          "amount": "Decimal",
                          "currencyCode": "CurrencyCode"
                        },
                        "implementsNode": false
                      }
                    },
                    "discountApplication": {
                      "__typename": "DiscountCodeApplication",
                      "targetSelection": "ENTITLED",
                      "allocationMethod": "EACH",
                      "targetType": "LINE_ITEM",
                      "value": {
                        "amount": "20.0",
                        "currencyCode": "USD",
                        "type": {
                          "name": "PricingValue",
                          "kind": "UNION"
                        }
                      },
                      "code": "10OFF",
                      "applicable": true,
                      "type": {
                        "name": "DiscountCodeApplication",
                        "kind": "OBJECT",
                        "fieldBaseTypes": {
                          "applicable": "Boolean",
                          "code": "String"
                        },
                        "implementsNode": false
                      }
                    },
                    "type": {
                      "name": "DiscountAllocation",
                      "kind": "OBJECT",
                      "fieldBaseTypes": {
                        "allocatedAmount": "MoneyV2",
                        "discountApplication": "DiscountApplication"
                      },
                      "implementsNode": false
                    }
                  }
                ]
              }
            ]
          }
        ]
      }

      assert.deepStrictEqual(mappedCart.discountApplications, checkout.discountApplications);
      // assert.deepStrictEqual(mappedCart.lineItems, checkout.lineItems);
    })

    it('TODO: maps a multi-line checkout with a percentage discount code', () => { })

    it('TODO: maps a multi-line checkout with a order-level fixed discount code', () => { });

    it('TODO: maps a multi-line checkout with a order-level percentage discount code', () => { });
  });

  describe("Automatic discounts", () => {
    it('TODO: maps a checkout with an automatic fixed discount', () => { });

    it('TODO: maps a checkout with an automatic percentage discount', () => { });

    it('TODO: maps a checkout with an automatic order-level fixed discount', () => { });

    it('TODO: maps a checkout with an automatic order-level percentage discount', () => { });
  })
});

describe('discountPayloadMapper / unsupported', () => {
  describe('empty checkout', () => {
    it('maps a default value for an empty checkout with an order-level fixed discount', () => {
      const cart = {
        "discountAllocations": [],
        "discountCodes": [
          {
            "applicable": false,
            "code": "ORDERFIXED50OFF"
          }
        ],
        lines: { edges: [] },
      }

      const mappedCart = discountsPayloadMapper(cart as unknown as Cart);

      const checkout = {
        "discountApplications": [
          {
            "__typename": "DiscountCodeApplication",
            "targetSelection": "ALL",
            "allocationMethod": "ACROSS",
            "targetType": "LINE_ITEM",
            "value": {
              "amount": "0.0",
              "currencyCode": "USD",
              "type": {
                "name": "PricingValue",
                "kind": "UNION"
              }
            },
            "code": "ORDERFIXED50OFF",
            "applicable": true,
            "type": {
              "name": "DiscountCodeApplication",
              "kind": "OBJECT",
              "fieldBaseTypes": {
                "applicable": "Boolean",
                "code": "String"
              },
              "implementsNode": false
            },
            "hasNextPage": false,
            "hasPreviousPage": false,
            "variableValues": {
              "checkoutId": "gid://shopify/Checkout/49e323a9cc0e4526e0b0b203345cd4cf?key=923ca46957138fcc1ca4d9f5aab9a8d3",
              "discountCode": "ORDERFIXED50OFF"
            }
          }
        ]
      }
      assert.notEqual(mappedCart.discountApplications[0], checkout.discountApplications[0]);
      // TODO: assert an empty array
      assert.ok(mappedCart.discountApplications.length === 0);
    })

    it('maps a default value for an empty checkout with an order-level percentage discount', () => {
      const cart = {
        "discountAllocations": [],
        "discountCodes": [
          {
            "applicable": false,
            "code": "ORDERPERCENTAGE50OFF"
          }
        ],
        lines: { edges: [] },
      }

      const mappedCart = discountsPayloadMapper(cart as unknown as Cart);

      const checkout = {
        "discountApplications": [
          {
            "__typename": "DiscountCodeApplication",
            "targetSelection": "ALL",
            "allocationMethod": "ACROSS",
            "targetType": "LINE_ITEM",
            "value": {
              "percentage": 50,
              "type": {
                "name": "PricingValue",
                "kind": "UNION"
              }
            },
            "code": "ORDER50PERCENTOFF",
            "applicable": true,
            "type": {
              "name": "DiscountCodeApplication",
              "kind": "OBJECT",
              "fieldBaseTypes": {
                "applicable": "Boolean",
                "code": "String"
              },
              "implementsNode": false
            },
            "hasNextPage": false,
            "hasPreviousPage": false,
            "variableValues": {
              "checkoutId": "gid://shopify/Checkout/39f7c51f3c539fa78adb7594a8764dea?key=4fd6fb1937f938df7ce728f1b788719b",
              "discountCode": "ORDER50PERCENTOFF"
            }
          }
        ]
      }

      assert.notEqual(mappedCart.discountApplications[0], checkout.discountApplications[0]);
      // TODO: 
      assert.ok(mappedCart.discountApplications.length === 0);
    })
  })
})
