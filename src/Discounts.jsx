import { useState } from 'react'
import { client } from './sdk'
import { sfapi } from './sfapi'

export default function Discounts() {
  const [checkout, setCheckout] = useState(null)
  const [cart, setCart] = useState(null)
  const [comparison, setComparison] = useState(null)

  function createCheckout({ lineItems } = { lineItems: [] }) {
    return new Promise((resolve) => client.checkout.create({ lineItems }).then((checkout) => {
      console.log('Checkout created:', checkout)
      let { id, discountApplications, lineItems } = checkout
      lineItems = lineItems.map((node) => ({ discountAllocations: node.discountAllocations, variantId: node.variant.id }))
      resolve({ id, discountApplications, lineItems })
    }))
  }

  function createCart({ lines } = { lines: [] }) {
    return new Promise((resolve) => sfapi.create({ lines }).then((res) => {
      console.log('Response:', res)
      const { data: { cartCreate: { cart } } } = res
      console.log('Cart created', cart)
      let { id, discountAllocations, discountCodes, lines } = cart
      lines = lines.edges.map(({ node }) => ({ discountAllocations: node.discountAllocations, variantId: node.merchandise.id }))
      resolve({ id, discountCodes, discountAllocations, lines })
    }))
  }

  function checkoutAddDiscount(checkoutId, discountCode) {
    return client.checkout.addDiscount(checkoutId, discountCode).then((checkout) => {
      console.log('Discount added:', checkout.discountApplications)
      let { id, discountApplications, lineItems } = checkout
      lineItems = lineItems.map((node) => ({ discountAllocations: node.discountAllocations, variantId: node.variant.id }))
      return ({ id, discountApplications, lineItems })
    })
  }

  function cartAddDiscount(cartId, discountCode) {
    return sfapi.addDiscount(cartId, discountCode).then((res) => {
      console.log('Discount added:', res)
      const { data: { cartDiscountCodesUpdate: { cart } } } = res
      let { id, discountAllocations, discountCodes, lines } = cart
      lines = lines.edges.map(({ node }) => ({ discountAllocations: node.discountAllocations, variantId: node.merchandise.id }))
      return ({ id, discountCodes, discountAllocations, lines })
    })
  }

  return (
    <div>
      <h1>Discounts Comparison</h1>
      <div>
        <div>
          <h3>Fixed amount discount</h3>
          <button onClick={() => {
            setComparison('Fixed amount discount / empty')
            createCheckout().then((checkout) => {
              checkoutAddDiscount(checkout.id, '10OFF').then((checkout) => {
                setCheckout(checkout)
              })
            })

            createCart().then((cart) => {
              cartAddDiscount(cart.id, '10OFF').then((cart) => {
                setCart(cart)
              })
            });
          }}>
            fixed discount / empty
          </button>

          <button onClick={() => {
            setComparison('Fixed amount discount / one line')
            createCheckout({
              lineItems: [
                {
                  variantId: 'gid://shopify/ProductVariant/48535896522774',
                  quantity: 1
                },
              ]
            }).then((checkout) => {
              checkoutAddDiscount(checkout.id, '10OFF').then((checkout) => {
                setCheckout(checkout)
              })
            });

            createCart({
              lines: [
                {
                  quantity: 1,
                  merchandiseId: 'gid://shopify/ProductVariant/48535896522774',
                }
              ]
            }).then((cart) => {
              cartAddDiscount(cart.id, '10OFF').then((cart) => {
                setCart(cart)
              })
            });
          }}>
            fixed discount / one line
          </button>

          <button onClick={() => {
            setComparison('Fixed amount discount / two lines')
            createCheckout({
              lineItems: [
                {
                  variantId: 'gid://shopify/ProductVariant/48535896522774',
                  quantity: 1
                },
                {
                  variantId: 'gid://shopify/ProductVariant/48535896555542',
                  quantity: 1
                }
              ]
            }).then((checkout) => {
              checkoutAddDiscount(checkout.id, '10OFF').then((checkout) => {
                setCheckout(checkout)
              })
            });

            createCart({
              lines: [
                {
                  quantity: 1,
                  merchandiseId: 'gid://shopify/ProductVariant/48535896522774'
                },
                {
                  quantity: 1,
                  merchandiseId: 'gid://shopify/ProductVariant/48535896555542',
                }
              ]
            }).then((cart) => {
              cartAddDiscount(cart.id, '10OFF').then((cart) => {
                setCart(cart)
              })
            });
          }}>
            fixed discount / two lines
          </button>
        </div>

        <div>
          <h3>Percentage discount</h3>
          <button onClick={() => {
            setComparison('Percentage discount / empty')
            createCheckout().then((checkout) => {
              checkoutAddDiscount(checkout.id, '10PERCENTOFF').then((checkout) => {
                setCheckout(checkout)
              })
            });

            createCart().then((cart) => {
              cartAddDiscount(cart.id, '10PERCENTOFF').then((cart) => {
                setCart(cart)
              })
            });
          }}>
            % discount / empty
          </button>

          <button onClick={() => {
            setComparison('Percentage discount / one line')
            createCheckout({
              lineItems: [
                {
                  variantId: 'gid://shopify/ProductVariant/48535896522774',
                  quantity: 1
                },
              ]
            }).then((checkout) => {
              checkoutAddDiscount(checkout.id, '10PERCENTOFF').then((checkout) => {
                setCheckout(checkout)
              })
            });

            createCart({
              lines: [
                {
                  quantity: 1,
                  merchandiseId: 'gid://shopify/ProductVariant/48535896522774',
                }
              ]
            }).then((cart) => {
              cartAddDiscount(cart.id, '10PERCENTOFF').then((cart) => {
                setCart(cart)
              })
            });
          }}>
            % discount / one line
          </button>

          <button onClick={() => {
            setComparison('Percentage discount / two lines')
            createCheckout({
              lineItems: [
                {
                  variantId: 'gid://shopify/ProductVariant/48535896522774',
                  quantity: 1
                },
                {
                  variantId: 'gid://shopify/ProductVariant/48535896555542',
                  quantity: 1
                }
              ]
            }).then((checkout) => {
              checkoutAddDiscount(checkout.id, '10PERCENTOFF').then((checkout) => {
                setCheckout(checkout)
              })
            });

            createCart({
              lines: [
                {
                  quantity: 1,
                  merchandiseId: 'gid://shopify/ProductVariant/48535896522774'
                },
                {
                  quantity: 1,
                  merchandiseId: 'gid://shopify/ProductVariant/48535896555542',
                }
              ]
            }).then((cart) => {
              cartAddDiscount(cart.id, '10PERCENTOFF').then((cart) => {
                setCart(cart)
              })
            });
          }}>
            % discount / two lines
          </button>
        </div>


        <div>
          <h3>order fixed discounts</h3>
          <button onClick={() => {
            setComparison('Order fixed discount / empty')
            createCheckout().then((checkout) => {
              checkoutAddDiscount(checkout.id, 'ORDERFIXED50OFF').then((checkout) => {
                setCheckout(checkout)
              })
            });

            createCart().then((cart) => {
              cartAddDiscount(cart.id, 'ORDERFIXED50OFF').then((cart) => {
                setCart(cart)
              })
            });
          }}>
            order-fixed discount / empty
          </button>

          <button onClick={() => {
            setComparison('Order fixed discount / one line')
            createCheckout({
              lineItems: [
                {
                  variantId: 'gid://shopify/ProductVariant/48535896522774',
                  quantity: 1
                },
              ]
            }).then((checkout) => {
              checkoutAddDiscount(checkout.id, 'ORDERFIXED50OFF').then((checkout) => {
                setCheckout(checkout)
              })
            });

            createCart({
              lines: [
                {
                  quantity: 1,
                  merchandiseId: 'gid://shopify/ProductVariant/48535896522774',
                }
              ]
            }).then((cart) => {
              cartAddDiscount(cart.id, 'ORDERFIXED50OFF').then((cart) => {
                setCart(cart)
              })
            });
          }}>
            order-fixed discount / one line
          </button>

          <button onClick={() => {
            setComparison('Order fixed discount / two lines')
            createCheckout({
              lineItems: [
                {
                  variantId: 'gid://shopify/ProductVariant/48535896522774',
                  quantity: 1
                },
                {
                  variantId: 'gid://shopify/ProductVariant/48535896555542',
                  quantity: 1
                }
              ]
            }).then((checkout) => {
              checkoutAddDiscount(checkout.id, 'ORDERFIXED50OFF').then((checkout) => {
                setCheckout(checkout)
              })
            });

            createCart({
              lines: [
                {
                  quantity: 1,
                  merchandiseId: 'gid://shopify/ProductVariant/48535896522774'
                },
                {
                  quantity: 1,
                  merchandiseId: 'gid://shopify/ProductVariant/48535896555542',
                }
              ]
            }).then((cart) => {
              cartAddDiscount(cart.id, 'ORDERFIXED50OFF').then((cart) => {
                setCart(cart)
              })
            });
          }}>
            order-fixed discount / two lines
          </button>
        </div>


        <div>
          <h3>order % discounts</h3>
          <button onClick={() => {
            setComparison('Order % discount / empty')
            createCheckout().then((checkout) => {
              checkoutAddDiscount(checkout.id, 'ORDER50PERCENTOFF').then((checkout) => {
                setCheckout(checkout)
              })
            });

            createCart().then((cart) => {
              cartAddDiscount(cart.id, 'ORDER50PERCENTOFF').then((cart) => {
                setCart(cart)
              })
            });
          }}>
            order % discount / empty
          </button>

          <button onClick={() => {
            setComparison('Order % discount / one line')
            createCheckout({
              lineItems: [
                {
                  variantId: 'gid://shopify/ProductVariant/48535896522774',
                  quantity: 1
                },
              ]
            }).then((checkout) => {
              checkoutAddDiscount(checkout.id, 'ORDER50PERCENTOFF').then((checkout) => {
                setCheckout(checkout)
              })
            });

            createCart({
              lines: [
                {
                  quantity: 1,
                  merchandiseId: 'gid://shopify/ProductVariant/48535896522774',
                }
              ]
            }).then((cart) => {
              cartAddDiscount(cart.id, 'ORDER50PERCENTOFF').then((cart) => {
                setCart(cart)
              })
            });
          }}>
            order % discount / one line
          </button>

          <button onClick={() => {
            setComparison('Order % discount / two lines')
            createCheckout({
              lineItems: [
                {
                  variantId: 'gid://shopify/ProductVariant/48535896522774',
                  quantity: 1
                },
                {
                  variantId: 'gid://shopify/ProductVariant/48535896555542',
                  quantity: 1
                }
              ]
            }).then((checkout) => {
              checkoutAddDiscount(checkout.id, 'ORDER50PERCENTOFF').then((checkout) => {
                setCheckout(checkout)
              })
            });

            createCart({
              lines: [
                {
                  quantity: 1,
                  merchandiseId: 'gid://shopify/ProductVariant/48535896522774'
                },
                {
                  quantity: 1,
                  merchandiseId: 'gid://shopify/ProductVariant/48535896555542',
                }
              ]
            }).then((cart) => {
              cartAddDiscount(cart.id, 'ORDER50PERCENTOFF').then((cart) => {
                setCart(cart)
              })
            });
          }}>
            order % discount / two lines
          </button>
        </div>

        {cart && checkout && (
          <>
           <h1>Comparison</h1>
            <p>{comparison}</p>
            <div style={{ display: 'flex', flexDirection: 'row', flex: 1, gap: '1rem' }}>
              <div style={{minWidth: '50%', maxWidth: '50%'}}>
                <h2>Checkout</h2>
              </div>
              <div><h2>Cart</h2>
              </div>
            </div>
            <h3>root</h3>
            <div style={{ display: 'flex', flexDirection: 'row', flex: 1, gap: '1rem' }}>
                <pre style={{ fontSize: '10px', minWidth: '50%', maxWidth: '50%', flex: 'wrap' }}>{JSON.stringify({ discountApplications: checkout.discountApplications }, null, 2)}</pre>
                <pre style={{ fontSize: '10px', width: '50%' }}>{JSON.stringify({ discountAllocations: cart.discountAllocations, discountCodes: cart.discountCodes }, null, 2)}</pre>
            </div>
            <hr />
            <h3>lineItems / lines</h3>
            <div style={{ display: 'flex', flexDirection: 'row', flex: 1, gap: '1rem' }}>
              <pre style={{ fontSize: '10px', width: '50%' }}>{JSON.stringify(checkout?.lineItems ?? null, null, 2)}</pre>
              <pre style={{ fontSize: '10px', width: '50%' }}>{JSON.stringify(cart?.lines ?? null, null, 2)}</pre>
            </div>
          </>
        )}
      </div>

    </div>
  )
}
