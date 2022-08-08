# Demo Store by Commerce Layer

Demo Store is a fully static e-commerce solution (with SSR capability) that uses Commerce Layer. Keep reading to tailor your own.

## What is Commerce Layer?

[Commerce Layer](https://commercelayer.io/) is a multi-market commerce API and order management system that lets you add global shopping capabilities to any website, mobile app, chatbot, wearable, voice, or IoT device, with ease. Compose your stack with the best-of-breed tools you already mastered and love. Make any experience shoppable, anywhere, through a blazing-fast, enterprise-grade, and secure API.

## :battery: Batteries included

We decided to build the Demo Store, removing all 3rd party services that are usually used to create a full experience of an e-commerce website (cms, search, pim, etc.).

Everything related to `content` is stored as JSON files and, building you own Demo Store, you will need to create these files, manually or via scripts.

Demo Store comes with:

- [x] built-in search engine with facet search powered by [fuse.js](https://github.com/krisk/Fuse)
- [x] product catalog management with taxonomies and taxons
- [x] product variants
- [x] integration with Commerce Layer (of course) using:
  - [x] [react-component](https://github.com/commercelayer/commercelayer-react-components)
  - [x] [hosted cart](https://github.com/commercelayer/commercelayer-cart)
  - [x] [hosted checkout](https://github.com/commercelayer/commercelayer-react-checkout)

## Getting started

If you haven't had experience before with Commerce Layer, go [here](https://docs.commercelayer.io/developers/) and start the tutorial. Configuring a Demo Store expects that you already have a configured Organization with at least few products and one market.

If you prefer to start from scratch you can create a new Organization and use the following commands to configure a `Commerce Layer's Demo Store` like project.

### Organization

Once the Organization is created, you need to create two [API clients](https://docs.commercelayer.io/developers/api-clients): one `Sales channel` and one `Integration`.

If you haven't done yet, install our [Commerce Layer CLI](https://www.npmjs.com/package/@commercelayer/cli), the [seeder plugin](https://www.npmjs.com/package/@commercelayer/cli-plugin-seeder) and the [imports plugin](https://www.npmjs.com/package/@commercelayer/cli-plugin-imports):

```sh
npm install -g @commercelayer/cli

commercelayer plugins:install seeder
commercelayer plugins:install imports
```

Now you can login to your `Integration` API client from the CLI:

```sh
commercelayer applications:login \
  --clientId Oy5F2TbPYhOZsxy1tQd9ZVZ... \
  --clientSecret 1ZHNJUgn_1lh1mel06gGDqa... \
  --organization my-awesome-organization \
  --alias cli-admin
```

### Demo Store

We have two repositories:

* **[`demo-store-core`](https://github.com/commercelayer/demo-store-core)** contains the source code.

  You just have to fork this repository and create your own starting from here. In this way you can fully customize all the aspects (behaviour, ui, ux), but *you will possibly loose all future updates if you start diverging to much.*

* **[`demo-store`](https://github.com/commercelayer/demo-store) GitHub template**.

    This template is using the `demo-store-core` as a [git submodule](https://git-scm.com/book/en/v2/Git-Tools-Submodules).  
    Using this way you don't have to care about the whole source code, *you can focus on you data*. You'll have free updates without any risk just by running

    ```sh
    git submodule update --remote
    ```

Let's get started!

First of all you'll need to create a new repository starting from the `demo-store` template. Click on `Use this template` from the repository homepage on GitHub and the run:

```sh
git clone <your-repository> my-new-project
cd my-new-project
git submodule update --init
npm install

cp ./demo-store-core/packages/website/.env.sample.submodule .env.local

cp -r ./demo-store-core/packages/website/data/json ./data/json
```

### Environment Variables

Edit `.env.local` and fill all the missing information:

```properties
# this is the 'sales channel' client id
NEXT_PUBLIC_CL_CLIENT_ID=er34TWFcd24RFI8KJ52Ws6q...

# this is the 'base endpoint'
NEXT_PUBLIC_CL_ENDPOINT=https://my-awesome-organization.commercelayer.io
```

### Seed

The following script will populate your organizzation with all resources for a multi-market e-commerce. These are the same we are using for our [Demo Store](https://commercelayer.github.io/demo-store-core).

This step is *optional*. If you already have a well configured organization you can skip it.

```sh
npm run seeder:seed -ws --if-present
```

### countries.json

Edit `json/countries.json` with your preferred editor.

Here you have a list of available countries for your e-commerce.

You have to replace all instances of `"market": xxx` with the related markets of your organization.  
To get the list of your markets you can connect to the Commerce Layer Dashboard or by running this command:

```sh
npm run markets -ws --if-present
```

### Enjoy :rocket:

```sh
npm run dev

# http://localhost:3000/
```

### JSON Data files

Demo Store is built around a set of data that are stored as json files (locally or remotely). This decision is taken to decouple the Demo Store from 3rd party applications.

To build your own Demo Store you'll have to create and manage these json data files.



## Lighthouse CI

```sh
npx -p @lhci/cli lhci autorun
```

## Troubleshooting

1. **Q.** Even if I changed `NEXT_PUBLIC_JSON_DATA_FOLDER` or `NEXT_PUBLIC_LOCALE_DATA_FOLDER`, the website is still refering to previous json files.

    **A.** These two env variables reflect as `alias` for Webpack. Starting from Webpack 5, it introduced caching for faster builds. Changing these two env variables will not invalidate the Webpack cache. You should remove `.next` folder manually.
