# Experimentation

These examples demonstrate the original use-case at ASOS for the Toggle project, designed to
take headers coming inbound from an Akamai Edgeworker and vary the server-generated response
sent back to the client, based on decisions held within.

To interact with these experiments, a facsimile / test double fake for the edgeworker is required.

[mod header](https://modheader.com/), or some other tool for modifying request headers should
be used, setting a header called `experiments` with a value of the following type:

```typescript
export type Decision = { [bucket: string]: string };
export type Experiments = {
  decisions: {
    [feature: string]: Decision;
  };
  audience: any;
};
```

The fixtures are using a contrived point cut plugin, replicating an Optimizely activation handler:

```js
{
  onCodeSelected: ({ matchedFeatures }) => {
    if (matchedFeatures?.length) {
      const [[feature]] = matchedFeatures;
      console.log(
        `activated ${feature} with audience ${getFeatures().audience}`
      );
    }
  }
}
```

...which logs the activation event normally destined for the toggle router (Optimizely) to the console.

A contrived server function called `getExperiments` exists to parse inbound headers containing experiments, 
used to drive the toggling.

## Usage

(from the `examples/next` folder of the monorepo)

1. install [mod header](https://modheader.com/), or some other tool for modifying request headers sent in a browser
2. `npm install`
3. `npm run build`
4. `npm run start`
5. open `localhost:3000/fixtures/experiments` in a browser

N.B. To confirm the `experiments` header you've set with `mod header`, you can add `?showExperiments=true` 
to the URL to render the value to the top of the page.
If you're not seeing the experiments header show up, try refreshing the page.  NextJs is perhaps pre-caching 
the pages.

## Examples

1. [Varying a Module](./1-varied-component/)
2. [Varying a Module And It's Dependency](./2-variant-with-name-matched-dependency/)
3. [Extending / Composing a Module in Variation](./3-varied-component-extending-control/)
4. [Varying a Variation](./4-varied-variant/)
5. [Opting Out of Join Points using a local Toggle Config](./5-toggle-config-opt-out/)
6. [Filtering Join Points using a Toggle Config](./6-toggle-config-variant-filter-same-directory/)
7. [Using Varied Code without Toggling its Directory](./7-toggle-config-variant-filter-alternate-directory/)
