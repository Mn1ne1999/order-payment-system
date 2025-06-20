/************************************************************
 *  admin.js  —  панель администратора M_n1ne
 *  загрузка-сохранение товаров с изображением (FormData)
 ************************************************************/

/* ---------- настройки & утилиты ---------- */
const API   = "http://localhost:8080";
const token = localStorage.getItem("token") || "";

function parseJwt(t){
  try{ return JSON.parse(atob(t.split('.')[1])); }
  catch{ return null; }
}
const role = parseJwt(token)?.role || null;
const user = parseJwt(token)?.sub  || null;

/* ---------- DOM ссылки ---------- */
const form       = document.getElementById("productForm");
const idFld      = document.getElementById("productId");
const nameFld    = document.getElementById("name");
const descFld    = document.getElementById("description");
const priceFld   = document.getElementById("price");
const stockFld   = document.getElementById("stock");
const catSel     = document.getElementById("categoryId");
const availChk   = document.getElementById("available");
const imgInput   = document.getElementById("productImage");
const imgPreview = document.getElementById("imagePreview");
const submitBtn  = document.getElementById("submitBtn");

/* ---------- проверка доступа & приветствие ---------- */
document.addEventListener("DOMContentLoaded", ()=>{
  if (role !== "ADMIN"){
    alert("❌ У вас нет доступа"); location = "login.html"; return;
  }
  document.getElementById("userInfo").textContent = `👤 ${user}`;
  document.getElementById("addCategoryBtn").onclick = addCategory;
  showTab("users");            // открываем первую вкладку
});

/* ---------- превью изображения ---------- */
imgInput?.addEventListener("change", e=>{
  const f = e.target.files[0];
  if(!f){ imgPreview.style.display="none"; return; }
  imgPreview.src   = URL.createObjectURL(f);
  imgPreview.style.display = "block";
});

/* ---------- submit: добавить / сохранить товар ---------- */
form?.addEventListener("submit", async e=>{
  e.preventDefault();

  /* 1. цена → число */
  const raw   = priceFld.value.replace(/[^\d.,]/g,"").replace(",",".");
  const price = parseFloat(raw);
  if (isNaN(price)){ alert("Цена некорректна"); return; }

  /* 2. JSON-часть */
  const dto = {
    name:        nameFld.value.trim(),
    description: descFld.value.trim(),
    price,
    stock:       +stockFld.value,
    categoryId:  +catSel.value,
    available:   availChk.checked
  };

  /* 3. FormData (json + файл) */
  const fd = new FormData();
  fd.append("data", new Blob([JSON.stringify(dto)], {type:"application/json"}));

  const img = imgInput.files[0];
  if (img){
    if (img.size > 8*1024*1024){ alert("📸 Файл > 8 МБ"); return; }
    fd.append("file", img);
  }

  /* 4. URL + метод */
  const id   = +idFld.value;
  const url  = id ? `${API}/api/products/${id}` : `${API}/api/products`;
  const meth = id ? "PUT" : "POST";

  const res = await fetch(url, {
      method: meth,
      headers:{ Authorization:`Bearer ${token}` },
      body:   fd
  });

  if (res.ok){
    alert(id ? "💾 Сохранено" : "✅ Товар добавлен");
    form.reset(); imgPreview.style.display="none";
    idFld.value = 0; submitBtn.textContent = "➕ Добавить товар";
    loadProducts();
  } else {
    const msg = await res.text();
    alert("❌ Ошибка: " + msg);
  }
});

/*======================================================================
=                               ТОВАРЫ                               =
=====================================================================*/
async function loadProducts(){
  const res = await fetch(`${API}/api/products`,
                          {headers:{Authorization:`Bearer ${token}`}} );
  if(!res.ok){ alert("❌ Не удалось получить список"); return; }
  const list = await res.json();

  const tbody = document.getElementById("productTableBody");
  tbody.innerHTML = "";
  list.forEach(p=>{
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.id}</td>
      <td>${p.name}</td>
      <td>${p.category?.name||"—"}</td>
      <td>${p.price} ₽</td>
      <td>${p.seller?.username||"—"}</td>
      <td>
        <button onclick="fillForm(${p.id})">✏️</button>
        <button onclick="deleteProduct(${p.id})">🗑️</button>
      </td>`;
    tbody.appendChild(tr);
  });
}

async function fillForm(id){
  const res = await fetch(`${API}/api/products/${id}`,
                          {headers:{Authorization:`Bearer ${token}`}} );
  if(!res.ok){ alert("❌ Не удалось получить товар"); return; }
  const p = await res.json();

  idFld.value      = p.id;
  nameFld.value    = p.name;
  descFld.value    = p.description || "";
  priceFld.value   = p.price;
  stockFld.value   = p.stock;
  catSel.value     = p.category?.id || "";
  availChk.checked = p.available;

  if (p.imagePath){
    imgPreview.src = `/uploads/${p.imagePath}`;
    imgPreview.style.display = "block";
  } else imgPreview.style.display = "none";

  submitBtn.textContent = "💾 Сохранить изменения";
  showTab("products");
}

async function deleteProduct(id){
  if(!confirm("Удалить товар?")) return;
  const res = await fetch(`${API}/api/products/${id}`,
                          {method:"DELETE", headers:{Authorization:`Bearer ${token}`}});
  res.ok ? loadProducts() : alert("❌ Ошибка удаления");
}

/*======================================================================
=                              КАТЕГОРИИ                              =
=====================================================================*/
async function loadCategories(){
  const res = await fetch(`${API}/api/categories`,
                          {headers:{Authorization:`Bearer ${token}`}} );
  const cats = await res.json();

  const body = document.getElementById("categoryTableBody");
  body.innerHTML = "";
  cats.forEach(c=>{
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${c.id}</td><td>${c.name}</td><td>${c.description||"—"}</td>
      <td><button onclick="deleteCategory(${c.id})">Удалить</button></td>`;
    body.appendChild(tr);
  });
}

async function loadCategoriesForSelect(){
  const res = await fetch(`${API}/api/categories`,
                          {headers:{Authorization:`Bearer ${token}`}} );
  const cats = await res.json();

  catSel.innerHTML = "";
  cats.forEach(c=>{
    const o = document.createElement("option");
    o.value = c.id; o.textContent = c.name;
    catSel.appendChild(o);
  });
}

async function addCategory(){
  const name = prompt("Название категории:"); if(!name) return;
  const description = prompt("Описание (необязательно):") || "";
  const res = await fetch(`${API}/api/categories`, {
    method:"POST",
    headers:{ "Content-Type":"application/json",
              Authorization:`Bearer ${token}` },
    body:JSON.stringify({name,description})
  });
  res.ok ? loadCategories() : alert("❌ Ошибка при добавлении");
}

async function deleteCategory(id){
  if(!confirm("Удалить категорию?")) return;
  const res = await fetch(`${API}/api/categories/${id}`,
                          {method:"DELETE", headers:{Authorization:`Bearer ${token}`}});
  res.ok ? loadCategories() : alert("❌ Не удалось удалить");
}

/*======================================================================
=                               USERS                                 =
=====================================================================*/
async function loadUsers(){
  const res  = await fetch(`${API}/api/users`,
                           {headers:{Authorization:`Bearer ${token}`}} );
  const users = await res.json();

  const body = document.getElementById("userTableBody");
  body.innerHTML="";
  users.forEach(u=>{
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${u.id}</td><td>${u.username}</td><td>${u.email}</td><td>${u.role}</td>
      <td>
        <button onclick="updateUserRole(${u.id})">Роль</button>
        <button onclick="deleteUser(${u.id})">Удалить</button>
      </td>`;
    body.appendChild(tr);
  });
}

async function updateUserRole(id){
  const newRole = prompt("Новая роль (CUSTOMER, SELLER, ADMIN):"); if(!newRole) return;
  const res = await fetch(`${API}/api/users/${id}/role`,{
    method:"PUT",
    headers:{ "Content-Type":"application/json", Authorization:`Bearer ${token}` },
    body:JSON.stringify({role:newRole})
  });
  res.ok ? loadUsers() : alert("❌ Ошибка обновления");
}

async function deleteUser(id){
  if(!confirm("Удалить пользователя?")) return;
  const res = await fetch(`${API}/api/users/${id}`,
                          {method:"DELETE", headers:{Authorization:`Bearer ${token}`}});
  res.ok ? loadUsers() : alert("❌ Не удалось удалить");
}

/*======================================================================
=                               ORDERS                                =
=====================================================================*/
async function loadOrders(){
  const res = await fetch(`${API}/api/orders`,
                          {headers:{Authorization:`Bearer ${token}`}} );
  const orders = await res.json();

  const body = document.getElementById("orderTableBody");
  body.innerHTML="";
  orders.forEach(o=>{
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${o.id}</td>
      <td>${o.customer?.username||"—"}</td>
      <td>${o.total} ₽</td>
      <td>${o.status}</td>`;
    body.appendChild(tr);
  });
}

/*======================================================================
=                               UI / вкладки                          =
=====================================================================*/
function showTab(tab){
  document.querySelectorAll(".tab-content")
          .forEach(el=>el.classList.add("hidden"));
  document.getElementById(`tab-${tab}`).classList.remove("hidden");

  if (tab==="users")       loadUsers();
  if (tab==="categories"){ loadCategories(); loadCategoriesForSelect(); }
  if (tab==="products"){   loadProducts();   loadCategoriesForSelect(); }
  if (tab==="orders")      loadOrders();
}

/* ---------- выход ---------- */
function logout(){
  localStorage.removeItem("token");
  location = "index.html";
}
