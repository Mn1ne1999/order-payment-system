document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch("http://localhost:8080/api/products", {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        const products = await response.json();
        const container = document.getElementById("cartItems");
        container.innerHTML = "";

        if (cart.length === 0) {
            container.innerHTML = "<p>Корзина пуста.</p>";
            return;
        }

        cart.forEach(productId => {
            const product = products.find(p => p.id === productId);
            if (product) {
                const div = document.createElement("div");
                div.classList.add("product");
                div.innerHTML = `
                    <h3>${product.name}</h3>
                    <img src="/uploads/${product.imagePath}" alt="${product.name}" width="80">
                    <p><strong>Цена:</strong> ${product.price}₽</p>
                    <button onclick="removeFromCart(${product.id})">❌ Удалить</button>
                    <hr>
                `;
                container.appendChild(div);
            }
        });
    } catch (error) {
        console.error("Ошибка при загрузке товаров:", error);
        document.getElementById("cartItems").innerHTML = "<p>Ошибка при загрузке корзины.</p>";
    }
});

function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(id => id !== productId);
    localStorage.setItem("cart", JSON.stringify(cart));
    location.reload(); // Перезагружаем страницу
}

async function submitOrder() {
    const token = localStorage.getItem("token");
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        alert("Корзина пуста.");
        return;
    }

    const orderItems = cart.map(productId => ({
        productId: productId,
        quantity: 1
    }));

    try {
        const response = await fetch("http://localhost:8080/api/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({ items: orderItems })
        });

        if (response.ok) {
            alert("✅ Заказ успешно оформлен!");
            localStorage.removeItem("cart");
            window.location.href = "products.html";
        } else {
            alert("❌ Ошибка при оформлении заказа.");
        }
    } catch (error) {
        alert("🚫 Сетевая ошибка при оформлении заказа.");
    }
}
