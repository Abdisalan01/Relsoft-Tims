/**
 * Generic paging response parser
 * Handles multiple response shapes:
 * A) { items: T[], totalCount: number, pageNumber: number, pageSize: number }
 * B) { data: T[], total: number }
 * C) { result: T[], total: number }
 * D) T[] (direct array)
 */
export function parsePagedResponse(response, endpoint = '') {
  // If response is already an array, return it
  if (Array.isArray(response)) {
    return {
      items: response,
      total: response.length,
      pageNumber: 1,
      pageSize: response.length,
    };
  }

  // If response is an object, try to extract items/data/result
  if (typeof response === 'object' && response !== null) {
    // Shape A: { items, totalCount, pageNumber, pageSize }
    if (Array.isArray(response.items)) {
      return {
        items: response.items,
        total: response.totalCount || response.total || response.items.length,
        pageNumber: response.pageNumber || 1,
        pageSize: response.pageSize || response.items.length,
      };
    }

    // Shape B: { data, total }
    if (Array.isArray(response.data)) {
      return {
        items: response.data,
        total: response.total || response.data.length,
        pageNumber: response.pageNumber || 1,
        pageSize: response.pageSize || response.data.length,
      };
    }

    // Shape C: { result, total }
    if (Array.isArray(response.result)) {
      return {
        items: response.result,
        total: response.total || response.result.length,
        pageNumber: response.pageNumber || 1,
        pageSize: response.pageSize || response.result.length,
      };
    }

    // Unknown shape - log and return empty
    console.warn('Unknown response shape for endpoint:', endpoint, response);
    return {
      items: [],
      total: 0,
      pageNumber: 1,
      pageSize: 0,
    };
  }

  // Fallback
  console.warn('Unexpected response type for endpoint:', endpoint, typeof response);
  return {
    items: [],
    total: 0,
    pageNumber: 1,
    pageSize: 0,
  };
}

