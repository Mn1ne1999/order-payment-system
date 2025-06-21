export const API_BASE = '/api';

export async function getJSON(url, options = {}) {
    const res = await fetch(API_BASE + url, { headers: { 'Content-Type': 'application/json' }, ...options });
    if (!res.ok) throw new Error(`API error ${res.status}`);
    return res.json();
}

export const ProductsAPI = {
    all: () => getJSON('/products'),
    byCategory: (id) => getJSON(`/products/category/${id}`),
    favorites: (ids) => getJSON('/products?ids=' + ids.join(',')),
};
