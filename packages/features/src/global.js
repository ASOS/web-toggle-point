import "./external";

/**
 * Application code for holding feature toggle state
 * @module web-toggle-point-features
 */
/**
 * Factories for feature toggle stores
 *
 * @callback FeaturesStoreFactory
 * @memberof module:web-toggle-point-features
 * @param {object} params parameters
 * @param {string} params.toggleType The type of toggle in the store
 * @returns {module:web-toggle-point-features.FeaturesStore} A store for features
 */
/**
 * Interface for feature toggle stores
 *
 * @interface FeaturesStore
 * @memberof module:web-toggle-point-features
 */
/**
 * Method to return the value of the feature toggle store.
 * For {@link https://reactjs.org/docs/context.html|React context}-backed feature stores, this should be called following {@link https://react.dev/warnings/invalid-hook-call-warning|the rules of hooks}
 *
 * @function
 * @memberof module:web-toggle-point-features
 * @name FeaturesStore#getFeatures
 */

/**
 * Interface for singleton value-based feature toggle stores
 *
 * @interface SingletonFeaturesStore
 * @memberof module:web-toggle-point-features
 */
/**
 * Method to set a value to the feature toggle store.
 *
 * @function
 * @memberof module:web-toggle-point-features
 * @name SingletonFeaturesStore#setValue
 * @param {object} params parameters
 * @param {object} params.value A value to store, used to drive feature toggles.
 */

/**
 * Interface for {@link https://reactjs.org/docs/context.html|React context}-based feature toggle stores
 *
 * @interface ContextFeaturesStore
 * @memberof module:web-toggle-point-features
 */
/**
 * Method to create a React context provider, linked to the features store.
 *
 * @function
 * @memberof module:web-toggle-point-features
 * @name ContextFeaturesStore#providerFactory
 * @returns {external:React.Component} A react context provider that accepts a `value` prop, representing the feature toggle state.
 */
