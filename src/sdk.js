import Client from 'shopify-buy'

export const client = Client.buildClient({
  domain: 'juanprieto.myshopify.com',
  storefrontAccessToken: 'c23ad8269962738dd66dfd85d9b45a2d',
  // TODO: can pass locale here
  // language: 'ja-JP'
  // language: 'fr-CA'
});
