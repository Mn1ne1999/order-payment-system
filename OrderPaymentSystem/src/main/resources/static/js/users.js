document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    const role = getUserRole();

    if (role !== "ADMIN") {
        alert("❌ У вас нет доступа.");
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch("http://localhost:8080/api/users", {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        const users = await response.json();
        const container = document.getElementById("userList");
        container.innerHTML = "";

        users.forEach(user => {
            const div = document.createElement("div");
            div.classList.add("user");

            const select = document.createElement("select");
            const validRoles = ["ADMIN", "SELLER", "CUSTOMER"];

            validRoles.forEach(r => {
                const option = document.createElement("option");
                option.value = r;
                option.textContent = r;
                if (user.role === r) {
                    option.selected = true;
                }
                select.appendChild(option);
            });

            const saveBtn = document.createElement("button");
            saveBtn.textContent = "💾 Сохранить";
            saveBtn.onclick = () => updateUserRole(user.id, select.value, validRoles);

            div.innerHTML = `
                <p><strong>${user.username}</strong> (${user.email})</p>
            `;
            div.appendChild(select);
            div.appendChild(saveBtn);
            container.appendChild(div);
        });

    } catch (err) {
        console.error("❌ Ошибка при получении пользователей:", err);
    }
});

async function updateUserRole(userId, newRole, validRoles) {
    const token = localStorage.getItem("token");

    // Валидация перед отправкой
    if (!validRoles.includes(newRole)) {
        alert("❌ Недопустимая роль: " + newRole);
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/users/${userId}/role`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({ role: newRole })
        });

        if (response.ok) {
            alert("✅ Роль обновлена");
        } else {
            const errorText = await response.text();
            alert("❌ Ошибка при обновлении роли\n\n" + errorText);
        }
    } catch (err) {
        console.error("Ошибка обновления роли:", err);
        alert("❌ Произошла ошибка на стороне клиента.");
    }
}

function getUserRole() {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.role;
    } catch (e) {
        return null;
    }
}
