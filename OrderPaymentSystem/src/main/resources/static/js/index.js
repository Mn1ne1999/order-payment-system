// Перенаправление после входа
const token = localStorage.getItem("token");
if (document.referrer.includes("login.html") && token) {
    const role = JSON.parse(atob(token.split('.')[1]))?.role;
    if (role === "ADMIN") window.location.href = "admin.html";
    else if (role === "SELLER") window.location.href = "seller.html";
    else window.location.href = "products.html";
}

/*// Прилипание шапки
window.addEventListener("scroll", () => {
    const header = document.getElementById("mainHeader");

    if (window.scrollY > 20) {
        header.classList.remove("floating-center");
        header.classList.add("sticky-top");
    } else {
        header.classList.remove("sticky-top");
        header.classList.add("floating-center");
    }
});*/

// Открытие модального окна
const overlay = document.getElementById('loginModal');

document.querySelector('a[href="login.html"]').addEventListener('click', e=>{
    e.preventDefault();
    overlay.style.display = 'flex';
    document.documentElement.classList.add('modal-open');  // <html>
    document.body.classList.add('modal-open');             // <body>
});


// Закрытие модального окна
function closeModal(){
    overlay.style.display = 'none';
    document.documentElement.classList.remove('modal-open');
    document.body.classList.remove('modal-open');
}

/* крестик */
document.querySelector('.close-btn').onclick = closeModal;

/* клик вне окна */
overlay.addEventListener('click', e=>{
    if (e.target === overlay) closeModal();
});


// Обработка входа
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const res = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })  // ← ВОТ ЭТА СТРОКА
    });

        const result = await res.json();

        if (res.ok) {
            localStorage.setItem("token", result.token);
            const payload = JSON.parse(atob(result.token.split('.')[1]));
            if (payload.role === "ADMIN") window.location.href = "admin.html";
            else if (payload.role === "SELLER") window.location.href = "seller.html";
            else window.location.href = "products.html";
        } else {
            document.getElementById("loginMessage").textContent = "❌ " + (result.message || "Неверные данные");
        }
    } catch (err) {
        console.error(err);
        document.getElementById("loginMessage").textContent = "Ошибка входа. Попробуйте позже.";
    }
});

// Категории в каталоге
/* ------------------------------------------
   Перерисовка карточек (с фильтром по кат.)
-------------------------------------------*/
async function renderProducts(categoryId = null) {
  const token   = localStorage.getItem('token') || '';
  const headers = token ? { Authorization: 'Bearer ' + token } : {};

  // если передали id категории – добавляем query-параметр ?category=ID
 const url = categoryId
       ? `http://localhost:8080/api/products?category=${categoryId}`
       : 'http://localhost:8080/api/products';

  try {
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error('HTTP ' + res.status);

    const products = await res.json();
    const grid = document.getElementById('productList');          // <div id="productList">
    if (!grid) { console.error('#productList not found'); return; }

    grid.innerHTML = '';
    products.forEach(p => grid.insertAdjacentHTML('beforeend', cardHTML(p)));

  } catch (err) {
    console.error('Ошибка загрузки товаров:', err);
  }
}

/* ------------------------------------------
   «Каталог» – поп-ап категорий
-------------------------------------------*/
const catalogBtn   = document.getElementById('catalogBtn');
const catalogPopup = document.getElementById('catalogPopup');
const categoryList = document.getElementById('categoryList');   // <ul id="categoryList">

catalogBtn?.addEventListener('click', async e => {
  e.preventDefault();
  catalogPopup.style.display = catalogPopup.style.display === 'block' ? 'none' : 'block';
  if (catalogPopup.dataset.filled) return;   // ← уже загружали однажды

  try {
    const res = await fetch('http://localhost:8080/api/categories');
    const cats = await res.json();

    cats.forEach(cat => {
      const li   = document.createElement('li');
      li.textContent = cat.name;
      li.dataset.id  = cat.id;

      li.addEventListener('click', () => {
        catalogPopup.style.display = 'none';          // скрываем список
        renderProducts(cat.id);                       // перерисовываем карточки
      });

      categoryList.appendChild(li);
    });

    catalogPopup.dataset.filled = '1';
  } catch (err) {
    console.error('Ошибка загрузки категорий:', err);
  }
});

/* --------------------
   Закрыть поп-ап кликом мимо
---------------------*/
document.addEventListener('click', e => {
  if (!e.target.closest('.catalog-wrapper')) catalogPopup.style.display = 'none';
});

/* --------------------
   Инициализация
---------------------*/
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();                 // показываем все товары при загрузке
});


// Переключение вкладок
function switchToRegister() {
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("registerForm").style.display = "block";
}


function switchToLogin() {
  document.getElementById("registerForm").style.display = "none";
  document.getElementById("loginForm").style.display = "block";
}


// Отправка регистрации
document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("regUsername").value;
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;

  try {
    const res = await fetch("http://localhost:8080/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password })
    });

    const result = await res.json();

    if (res.ok) {
      document.getElementById("registerMessage").textContent = "✅ Успешная регистрация! Выполните вход.";
      document.getElementById("registerForm").reset();
    } else {
      document.getElementById("registerMessage").textContent = "❌ " + (result.message || "Ошибка регистрации");
    }
  } catch (err) {
    console.error(err);
    document.getElementById("registerMessage").textContent = "Ошибка подключения к серверу";
  }
});



document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const username = payload?.sub || "Пользователь";
      const role = payload?.role;

      // Показываем имя пользователя
      const usernameLink = document.getElementById("usernameLink");
      const usernameDisplay = document.getElementById("usernameDisplay");
      if (usernameLink && usernameDisplay) {
        usernameDisplay.textContent = username;
        usernameLink.style.display = "inline-block";

        // Назначаем переход в зависимости от роли
        usernameLink.addEventListener("click", (e) => {
          e.preventDefault();
          if (role === "ADMIN") {
            window.location.href = "admin.html";
          } else if (role === "SELLER") {
            window.location.href = "seller.html";
          } else {
            window.location.href = "products.html";
          }
        });
      }
    } catch (err) {
      console.error("Ошибка при разборе токена:", err);
    }
  }
});

/* ---------- загрузка всех товаров для отдельной страницы products.html ---------- */
async function loadAllProducts() {
  try {
    const res = await fetch("http://localhost:8080/api/products");
    if (!res.ok) throw new Error("HTTP " + res.status);
    const products = await res.json();

    // id контейнера ­– поставьте тот, который реально есть в HTML
    const grid = document.getElementById("productGrid");   // например, <div id="productGrid">
    if (!grid) { console.error("#productGrid not found"); return; }

    grid.innerHTML = "";

    products.forEach(p => {
      const card = document.createElement("div");
      card.classList.add("product-card");

      /* 1) вычисляем URL картинки */
      const imgSrc = p.imagePath
            ? `/uploads/${p.imagePath}`
            : '/images/placeholder.jpg';     // fallback-заглушка

      /* 2) формируем HTML карточки */
      card.innerHTML = `
        <img src="${imgSrc}" alt="${p.name}"
             onerror="this.src='/images/placeholder.jpg'">
        <h3>${p.name}</h3>
        <p>${p.description ?? ""}</p>
        <p><strong>${p.price} ₽</strong></p>
        <button onclick="addToCart(${p.id})">🛒 В корзину</button>
      `;

      grid.appendChild(card);
    });

  } catch (err) {
    console.error("Ошибка загрузки товаров:", err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
});

/* ───────── липкая шапка ───────── */
document.addEventListener("DOMContentLoaded", () => {
  const header    = document.getElementById("mainHeader");
  const floatGap  = 20;                    // когда «отрывать» от верха

  const onScroll = () => {
      if (window.scrollY > floatGap){
          header.classList.add("sticky");
      } else {
          header.classList.remove("sticky");
      }
  };

  onScroll();                              // проверка при загрузке
  window.addEventListener("scroll", onScroll, { passive:true });
});





