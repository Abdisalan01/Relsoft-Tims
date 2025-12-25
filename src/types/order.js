/**
 * Order types based on OpenAPI schema
 */

/**
 * @typedef {Object} Order
 * @property {number} [id]
 * @property {number} customerId
 * @property {string|null} [orderNumber]
 * @property {string} orderDate - ISO date-time string
 * @property {string|null} [status]
 * @property {number} totalAmount
 * @property {string|null} [notes]
 */

/**
 * @typedef {Object} OrderCreateRequest
 * @property {number} customerId
 * @property {string|null} [orderNumber]
 * @property {string} orderDate - ISO date-time string
 * @property {string|null} [status]
 * @property {number} totalAmount
 * @property {string|null} [notes]
 */

/**
 * @typedef {Object} OrderUpdateRequest
 * @property {number} customerId
 * @property {string|null} [orderNumber]
 * @property {string} orderDate - ISO date-time string
 * @property {string|null} [status]
 * @property {number} totalAmount
 * @property {string|null} [notes]
 */

