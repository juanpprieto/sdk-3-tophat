# JS Buy SDK 3.0 Tophat

This is an example repository to easily test all of the methods of the SDK `.checkout` interface which are now using the Cart API under the hood.

## Instructions

### 1. Prepare the SDK repository

Clone the SDK repository

```git clone https://github.com/Shopify/js-buy-sdk.git```

Switch to the 3.0 SDK branch

```git checkout checkout-cart-migration```

Install dependencies

```yarn install```

Build the SDK

```yarn build```

Create a yarn link for the module

```yarn link```

### 2. Clone this playground repository

```git clone https://github.com/juanpprieto/sdk-3-tophat.git```

Install dependencies

```yarn install```

and link the 3.0 SDK

```yarn link "shopify-buy```

Run the playground

```yarn dev```

Visit `http://localhost:5000/`

Interact with the playground `checkout` interface methods and operations. These operations were previously made with the Checkout API.



