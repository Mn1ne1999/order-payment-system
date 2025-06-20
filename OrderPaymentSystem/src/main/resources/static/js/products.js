/* ---------------------------------------------
   products.js – вывод карточек на главной
----------------------------------------------*/
/* -------------------  FAVORITES  ------------------- */              // ★ NEW
const FAV_KEY = 'favoriteIds';        // ключ в localStorage

function getFavIds(){
  return JSON.parse(localStorage.getItem(FAV_KEY) || '[]');
}
function setFavIds(arr){
  localStorage.setItem(FAV_KEY, JSON.stringify(arr));
}
function toggleFav(id){
  const favs = getFavIds();
  const idx  = favs.indexOf(id);
  idx === -1 ? favs.push(id) : favs.splice(idx,1);
  setFavIds(favs);
}
function isFav(id){ return getFavIds().includes(id); }

/* ---------- card template ---------- */
function cardHTML(p){
  const src = p.imagePath ? `/uploads/${p.imagePath}` : '/images/placeholder.jpg';
  return `
  <div class="card" data-id="${p.id}">
     <div class="card-img">
        <img src="${src}" alt="">
        <button class="fav-btn ${isFav(p.id) ? 'active' : ''}"
                data-id="${p.id}">❤</button>
     </div>

     <div class="card-body">
        <h3 class="card-title">${p.name}</h3>
        <p  class="card-desc">${p.description ?? ''}</p>
     </div>

     <div class="card-footer">
        <span   class="price">${Number(p.price).toLocaleString()} ₽</span>
        <button class="cart-btn" title="В корзину">🛒</button>
     </div>
  </div>`;
}


/* ---------- render ---------- */
async function renderProducts(categoryId=null){
  const token   = localStorage.getItem('token')||'';
  const headers = token ? {Authorization:'Bearer '+token}: {};
  const url = categoryId
        ? `/api/products?category=${categoryId}`
        : '/api/products';

  const res = await fetch(url,{headers});
  if(!res.ok){console.error('HTTP',res.status); return;}

  const products = await res.json();
  const grid = document.getElementById('productList');
  if(!grid){console.error('#productList not found');return;}

  grid.innerHTML = '';
  products.forEach(p=>grid.insertAdjacentHTML('beforeend',cardHTML(p)));
  markFavorites();
}

/* ----------------------  Избранное  ------------------------ */      // ★ NEW
async function renderFavorites(){
  const ids = getFavIds();
  const grid = document.getElementById('productList');
  if(!grid) return;

  if(!ids.length){
    grid.innerHTML = '<p class="empty">Избранных товаров нет</p>';
    return;
  }

  // берём только нужные товары:
  const res = await fetch(`/api/products?ids=${ids.join(',')}`);
  const list = await res.json();

  grid.innerHTML = '';
  list.forEach(p => grid.insertAdjacentHTML('beforeend', cardHTML(p)));
}

/* ---------- корзина ---------- */
function addToCart(id, btn) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(id);
  localStorage.setItem("cart", JSON.stringify(cart));

  // анимация
  btn.classList.add("clicked");
  setTimeout(() => btn.classList.remove("clicked"), 400);
}

/* ---------- делегирование ---------- */
document.addEventListener('click', e => {
  const cartBtn = e.target.closest('.cart-btn');
  const favBtn  = e.target.closest('.fav-btn');

  if (cartBtn) {
      const id = +cartBtn.closest('.card').dataset.id;
      addToCart(id, cartBtn);
  }

  if (favBtn) {
      const id = +favBtn.dataset.id;     // ← проще
      toggleFav(id);
      favBtn.classList.toggle('active'); // сразу меняем вид
  }
});

function clearFavHighlight(){ favLink.classList.remove('active'); }


/* клик по пункту "Избранное" */
const favLink = document.getElementById('favBtn');          // ★ NEW
favLink?.addEventListener('click', e=>{
  e.preventDefault();
  favLink.classList.add('active');          // визуально выделяем
  renderFavorites();
   clearFavHighlight();
});
