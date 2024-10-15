import { useState, useEffect } from 'react'
import {client} from './sdk'

export function CheckoutCreate({checkout, setCheckout}) {
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
