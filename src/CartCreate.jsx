import { useState} from 'react'
import {sfapi} from './sfapi'

export function CartCreate({cart, setCart, verbose = false}) {
  return (
    <div>
      <h1>Cart</h1>
      <pre>{JSON.stringify(cart, null, 2)}</pre>
      <br />
      <h2>Create a basic cart</h2>
      <button onClick={async () => {
         sfapi.create({}).then((res) => {
           console.log('Response:', res)
           const {data: {cartCreate: { cart } }} = res
           console.log('Cart created', cart)
            setCart(cart)
         })
       }}>
        Create Empty Cart
      </button>
      <button onClick={async () => {
         sfapi.create({
           lines: [
             {
               merchandiseId: 'gid://shopify/ProductVariant/48535896522774', 
               quantity: 1
             }
           ]
         }).then((res) => {
           console.log('Response:', res)
           const {data: {cartCreate: { cart } }} = res
           console.log('Cart created', cart)
            setCart(cart)
         })
       }}>
        Create Cart (1 item)
      </button>
      <button onClick={async () => {
         sfapi.create({
           lines: [
             {
               merchandiseId: 'gid://shopify/ProductVariant/48535896522774', 
               quantity: 1
             },
            { 
              merchandiseId:'gid://shopify/ProductVariant/48535896555542',
              quantity: 1
            }
           ]
         }).then((res) => {
           console.log('Response:', res)
           const {data: {cartCreate: { cart } }} = res
           console.log('Cart created', cart)
            setCart(cart)
         })
       }}>
        Create Cart (2 items)
      </button>
      <button onClick={async () => {
         sfapi.create({
           buyerIdentity: {
              deliveryAddressPreferences: [ 
              { 
                deliveryAddress: {
                  address1: '24 Westwind Street',
                  address2: 'Apt C',
                  city: 'Marina Del Rey',
                  company: 'Fake Company',
                  country: 'United States',
                  firstName: 'Juan',
                  lastName: 'Prieto',
                  phone: '+1-424-537-8776',
                  province: 'California',
                  zip: '90292'
                }
              }
            ]
          },
          lines: [
             {
               merchandiseId: 'gid://shopify/ProductVariant/48535896522774', 
               quantity: 1
             }
           ]
         }).then((res) => {
           console.log('Response:', res)
           const {data: {cartCreate: { cart } }} = res
           console.log('Cart created', cart)
            setCart(cart)
         })
       }}>
        Create Cart with Shipping Address
      </button>
      <br />
      <br />
     {verbose && (
     <div>
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
     )}
    </div>
  )
}

