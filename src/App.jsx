import { useState, useEffect } from 'react'
import './App.css'
import {client} from './sdk'
import {sfapi} from './sfapi'

function App() {

  return (
    <div style={{textAlign:'left'}}>
    <h1>Checkout vs Cart creation</h1>
    <CheckoutCreate />
    <CartCreate />
    </div>
  )
}

function CartCreate() {
 const [cart, setCart] = useState(null)
  return (
    <div>
      <h1>Cart</h1>
      <pre>{JSON.stringify(cart, null, 2)}</pre>
      <br />
      <h2>Create a basic cart</h2>
     <button onClick={async () => {
       sfapi.create({
         line: [
           {
             merchandiseId: 'gid://shopify/ProductVariant/48535896522774', 
             quantity: 1
           }
         ]
       }).then(({data: {cartCreate: { cart }}, errors}) => {
         console.log('Cart created:', cart, errors)
         setCart(cart)
         window.location.href = cart.checkoutUrl
       })
     }}>
      Create Cart And Redirect To Checkout Page
    </button>
    <br />
     <button onClick={async () => {
       sfapi.create({
         lines: [
           {
             merchandiseId: 'gid://shopify/ProductVariant/48535896522774', 
             quantity: 1
           }
         ]
       }).then(cart => {
         console.log('Cart created', cart)
          setCart(cart)
       })
     }}>
      Create Cart
    </button>
    <br />

    <h2>Create a cart with buyerIdentity.countryCode</h2>
    <hr />
     <button onClick={async () => {
       sfapi.create({
         buyerIdentity: {
           countryCode: 'ES'
         },
         lines: [
           {
             merchandiseId: 'gid://shopify/ProductVariant/48535896522774', 
             quantity: 1
           }
         ]
       }).then(({data: {cartCreate: { cart } }}) => {
         console.log('Cart created:', cart.checkoutUrl)
         setCart(cart)
         window.location.href = cart.checkoutUrl
       })
     }}>
      Create ES Cart and Redirect To Checkout Page
    </button>
    <br />
   <button onClick={async () => {
       sfapi.create({
         buyerIdentity: {
           countryCode: 'ES'
         },
         lines: [
           {
             merchandiseId: 'gid://shopify/ProductVariant/48535896522774', 
             quantity: 1
           }
         ]
       }).then(({data: {cartCreate: {cart} }}) => {
         console.log('Cart created:', cart)
         setCart(cart)
       })
     }}>
      Create ES Cart
    </button>

    <h2>Create a checkout with attributes</h2>
    <hr />
     <button onClick={async () => {
       sfapi.create({
         attributes: [
            {
              key: 'my-key',
              value: 'my-value'
            }
          ],
         lines: [
           {
             merchandiseId: 'gid://shopify/ProductVariant/48535896522774', 
             quantity: 1
           }
         ]
       }).then(({data: {cartCreate: { cart } }}) => {
         console.log('Cart created:', cart)
         setCart(cart)
          window.location.href = cart.checkoutUrl
       })
     }}>
      With attributes and Redirect To Checkout Page
    </button>
    <br />
     <button onClick={async () => {
       sfapi.create({
         attributes: [
            {
              key: 'my-key',
              value: 'my-value'
            }
         ],
         lines: [
           {
             merchandiseId: 'gid://shopify/ProductVariant/48535896522774', 
             quantity: 1
           }
         ]
       }).then(({data: {cartCreate: { cart } }}) => {
         console.log('Cart created:', cart)
         setCart(cart)
       })
     }}>
      With attributes
    </button>

    <h2>Create a cart with buyerIdentity.email</h2>
    <hr />
     <button onClick={async () => {
       sfapi.create({
         buyerIdentity: {
            email: 'juanpablo.prieto@shopify.com'
         },
         lines: [
           {
             merchandiseId: 'gid://shopify/ProductVariant/48535896522774', 
             quantity: 1
           }
         ]
       }).then(({data: {cartCreate: { cart } }}) => {
         console.log('Cart created:', cart)
         setCart(cart)
          window.location.href = cart.checkoutUrl
       })
     }}>
      With buyerIdentity.email and Redirect To Checkout Page
    </button>
    <br />
    <button onClick={async () => {
       sfapi.create({
         buyerIdentity: {
            email: 'juanpablo.prieto@shopify.com'
         },
         lines: [
           {
             merchandiseId: 'gid://shopify/ProductVariant/48535896522774', 
             quantity: 1
           }
         ]
       }).then(({data: {cartCreate: { cart } }}) => {
         console.log('Cart created:', cart)
         setCart(cart)
       })
     }}>
      With buyerIdentity.email
    </button>

    <h2>Create a checkout with note</h2>
    <hr />
     <button onClick={async () => {
       sfapi.create({
         note: 'Foo bar',
         lines: [
           {
             merchandiseId: 'gid://shopify/ProductVariant/48535896522774', 
             quantity: 1
           }
         ]
       }).then(({data: {cartCreate: { cart } }}) => {
         console.log('Cart created:', cart)
         setCart(cart)
         window.location.href = cart.checkoutUrl
       })
     }}>
      With note and Redirect To Checkout Page
    </button>
    <br />
     <button onClick={async () => {
       sfapi.create({
         note: 'Foo bar',
         lines: [
           {
             merchandiseId: 'gid://shopify/ProductVariant/48535896522774', 
             quantity: 1
           }
         ]
       }).then(({data: {cartCreate: { cart } }}) => {
         console.log('Cart created:', cart)
         setCart(cart)
       })
     }}>
      With note
    </button>

    <h2>Create a cart with `shippingAddress`</h2>
    <hr />
     <button onClick={async () => {
       sfapi.create({
         note: 'Foo bar',
         buyerIdentity: {
           deliveryAddressPreferences: {
             deliveryAddress: {
              address1: 'Calle de la Princesa, 1',
              address2: '2A',
              city: 'Madrid',
              company: 'Shopify',
              country: 'Spain',
              firstName: 'Juan Pablo',
              lastName: 'Prieto',
              phone: '+34600000000',
              province: 'Madrid',
              zip: '28008'
             }
           }
         },
         lines: [
           {
             merchandiseId: 'gid://shopify/ProductVariant/48535896522774', 
             quantity: 1
           }
         ]
       }).then(({data: {cartCreate: { cart } }}) => {
         console.log('Cart created:', cart)
         setCart(cart)
         window.location.href = cart.checkoutUrl
       })
     }}>
      With buyerIdentity.deliveryAddressPreferences.deliveryAddress and Redirect To Checkout Page
    </button>
    <br />
     <button onClick={async () => {
       sfapi.create({
         note: 'Foo bar',
         buyerIdentity: {
           deliveryAddressPreferences: {
             deliveryAddress: {
              address1: 'Calle de la Princesa, 1',
              address2: '2A',
              city: 'Madrid',
              company: 'Shopify',
              country: 'Spain',
              firstName: 'Juan Pablo',
              lastName: 'Prieto',
              phone: '+34600000000',
              province: 'Madrid',
              zip: '28008'
             }
           }
         },
         lines: [
           {
             merchandiseId: 'gid://shopify/ProductVariant/48535896522774', 
             quantity: 1
           }
         ]
       }).then(({data: {cartCreate: { cart } }}) => {
         console.log('Cart created:', cart)
         setCart(cart)
       })
     }}>
      With buyerIdentity.deliveryAddressPreferences.deliveryAddress
    </button>
    </div>
  )
}

function CheckoutCreate() {
  const [checkout, setCheckout] = useState(null)
  return (
    <div>
    <h1>Checkout</h1>
    <pre>{JSON.stringify(checkout, null, 2)}</pre>
    <br />

    <h2>Create a basic checkout</h2>
     <button onClick={async () => {
       client.checkout.create({
         lineItems: [
           {
             variantId: 'gid://shopify/ProductVariant/48535896522774', 
             quantity: 1
           }
         ]
       }).then((checkout) => {
         console.log('Checkout created:', checkout)
         setCheckout(checkout)
         window.location.href = checkout.webUrl
       })
     }}>
      Create Checkout And Redirect To Checkout Page
    </button>
    <br />
     <button onClick={async () => {
       client.checkout.create({
         lineItems: [
           {
             variantId: 'gid://shopify/ProductVariant/48535896522774', 
             quantity: 1
           }
         ]
       }).then((checkout) => {
         console.log('Checkout created:', checkout.webUrl)
         setCheckout(checkout)
       })
     }}>
      Create Checkout
    </button>

    <h2>Create a checkout with buyerIdentity.countryCode</h2>
    <hr />
     <button onClick={async () => {
       client.checkout.create({
         buyerIdentity: {
           countryCode: 'ES'
         },
         lineItems: [
           {
             variantId: 'gid://shopify/ProductVariant/48535896522774', 
             quantity: 1
           }
         ]
       }).then((checkout) => {
         console.log('Checkout created:', checkout)
         setCheckout(checkout)
         window.location.href = checkout.webUrl
       })
     }}>
      Create ES Checkout and Redirect To Checkout Page
    </button>
    <br />
         <button onClick={async () => {
       client.checkout.create({
         buyerIdentity: {
           countryCode: 'ES'
         },
         lineItems: [
           {
             variantId: 'gid://shopify/ProductVariant/48535896522774', 
             quantity: 1
           }
         ]
       }).then((checkout) => {
         console.log('Checkout created:', checkout)
         setCheckout(checkout)
       })
     }}>
      Create ES Checkout
    </button>

    <h2>Create a checkout with presentmentCurrencyCode</h2>
    <hr />
     <button style={{ backgroundColor: 'orange'}} onClick={async () => {
       client.checkout.create({
         presentmentCurrencyCode: 'EUR',
         lineItems: [
           {
             variantId: 'gid://shopify/ProductVariant/48535896522774', 
             quantity: 1
           }
         ]
       }).then((checkout) => {
         console.log('Checkout created:', checkout)
         setCheckout(checkout)
         window.location.href = checkout.webUrl
       })
     }}>
      Create EUR presentMent Checkout and Redirect To Checkout Page 
    </button>
    <br />
     <button style={{ backgroundColor: 'orange'}} onClick={async () => {
       client.checkout.create({
         presentmentCurrencyCode: 'EUR',         lineItems: [
           {
             variantId: 'gid://shopify/ProductVariant/48535896522774', 
             quantity: 1
           }
         ]
       }).then((checkout) => {
         console.log('Checkout created:', checkout)
         setCheckout(checkout)
       })
     }}>
      Create EUR Checkout presentMent
    </button>

    <h2>Create a checkout with customAttributes</h2>
    <hr />
     <button onClick={async () => {
       client.checkout.create({
         customAttributes: [
            {
              key: 'my-key',
              value: 'my-value'
            }
          ],
         lineItems: [
           {
             variantId: 'gid://shopify/ProductVariant/48535896522774', 
             quantity: 1
           }
         ]
       }).then((checkout) => {
         console.log('Checkout created:', checkout)
         setCheckout(checkout)
         window.location.href = checkout.webUrl
       })
     }}>
      With customAttributes and Redirect To Checkout Page
    </button>
    <br />
     <button onClick={async () => {
       client.checkout.create({
         customAttributes: [
            {
              key: 'my-key',
              value: 'my-value'
            }
          ],
         lineItems: [
           {
             variantId: 'gid://shopify/ProductVariant/48535896522774', 
             quantity: 1
           }
         ]
       }).then((checkout) => {
         console.log('Checkout created:', checkout)
         setCheckout(checkout)
       })
     }}>
      With customAttributes
    </button>

    <h2>Create a checkout with email</h2>
    <hr />
     <button onClick={async () => {
       client.checkout.create({
         email: 'juanpablo.prieto@shopify.com',
         lineItems: [
           {
             variantId: 'gid://shopify/ProductVariant/48535896522774', 
             quantity: 1
           }
         ]
       }).then((checkout) => {
         console.log('Checkout created:', checkout)
         setCheckout(checkout)
         window.location.href = checkout.webUrl
       })
     }}>
      With email and Redirect To Checkout Page
    </button>
    <br />
     <button onClick={async () => {
       client.checkout.create({
         email: 'juanpablo.prieto@shopify.com',
         lineItems: [
           {
             variantId: 'gid://shopify/ProductVariant/48535896522774', 
             quantity: 1
           }
         ]
       }).then((checkout) => {
         console.log('Checkout created:', checkout)
         setCheckout(checkout)
       })
     }}>
      With email
    </button>

    <h2>Create a checkout with note</h2>
    <hr />
     <button onClick={async () => {
       client.checkout.create({
         note: 'Foo bar',
         lineItems: [
           {
             variantId: 'gid://shopify/ProductVariant/48535896522774', 
             quantity: 1
           }
         ]
       }).then((checkout) => {
         console.log('Checkout created:', checkout)
         setCheckout(checkout)
         window.location.href = checkout.webUrl
       })
     }}>
      With note and Redirect To Checkout Page
    </button>
    <br />
     <button onClick={async () => {
       client.checkout.create({
         note: 'Foo bar',
         lineItems: [
           {
             variantId: 'gid://shopify/ProductVariant/48535896522774', 
             quantity: 1
           }
         ]
       }).then((checkout) => {
         console.log('Checkout created:', checkout)
         setCheckout(checkout)
       })
     }}>
      With note
    </button>

    <h2>Create a checkout with shippingAddress</h2>
    <hr />
     <button onClick={async () => {
       client.checkout.create({
         shippingAddress: {
           address1: 'Calle de la Princesa, 1',
          address2: '2A',
          city: 'Madrid',
          company: 'Shopify',
          country: 'Spain',
          firstName: 'Juan Pablo',
          lastName: 'Prieto',
          phone: '+34600000000',
          province: 'Madrid',
          zip: '28008'
         },
         lineItems: [
           {
             variantId: 'gid://shopify/ProductVariant/48535896522774', 
             quantity: 1
           }
         ]
       }).then((checkout) => {
         console.log('Checkout created:', checkout)
         setCheckout(checkout)
         window.location.href = checkout.webUrl
       })
     }}>
      With shipping address and Redirect To Checkout Page
    </button>
    <br />
     <button onClick={async () => {
       client.checkout.create({
         shippingAddress: {
          address1: 'Calle de la Princesa, 1',
          address2: '2A',
          city: 'Madrid',
          company: 'Shopify',
          country: 'Spain',
          firstName: 'Juan Pablo',
          lastName: 'Prieto',
          phone: '+34600000000',
          province: 'Madrid',
          zip: '28008'
         },
         lineItems: [
           {
             variantId: 'gid://shopify/ProductVariant/48535896522774', 
             quantity: 1
           }
         ]
       }).then((checkout) => {
         console.log('Checkout created:', checkout)
         setCheckout(checkout)
       })
     }}>
      With shipping address
    </button>

    </div>
  )
}


export default App
