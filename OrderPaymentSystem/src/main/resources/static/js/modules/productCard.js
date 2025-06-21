import { create } from './dom.js';

export function renderProductCard(product, { onAddToCart, onToggleFav }) {
    const card = create('div', { class: 'card' });
    card.innerHTML = `
        <img src="${product.image || 'images/noimg.png'}" alt="">
        <h3>${product.name}</h3>
        <p class="price">${product.price.toFixed(2)} ₸</p>
        <div class="actions">
            <button class="btn-cart">🛒</button>
            <button class="btn-fav">${product.favorite ? '❤️' : '🤍'}</button>
        </div>`;
    card.querySelector('.btn-cart').onclick = () => onAddToCart(product);
    card.querySelector('.btn-fav').onclick = () => onToggleFav(product);
    return card;
}
