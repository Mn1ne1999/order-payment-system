import { ProductsAPI } from './api.js';
import { renderProductCard } from './productCard.js';
import { $ } from './dom.js';

document.addEventListener('DOMContentLoaded', async () => {
    const grid = $('#productGrid');
    const products = await ProductsAPI.all();
    products.forEach(p => grid.append(renderProductCard(p, {
        onAddToCart: p => console.log('Add', p),
        onToggleFav: p => console.log('Fav', p)
    })));
});
