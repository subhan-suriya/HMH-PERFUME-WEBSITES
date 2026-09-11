// ========================================
// HMH PERFUMES - SHOP CART CONNECTION
// ========================================

const CART_KEY = "hmhPerfumesCart";
const PRODUCTS_KEY = "hmhProducts";

function getCart() {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch (error) {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
}

function getProducts() {
    try {
        return JSON.parse(localStorage.getItem(PRODUCTS_KEY)) || [];
    } catch (error) {
        return [];
    }
}

function formatPrice(value) {
    return `PKR ${Number(value || 0).toLocaleString("en-PK")}`;
}

function updateCartCount() {
    const cart = getCart();

    const totalQuantity = cart.reduce(
        (total, item) => total + Number(item.quantity || 1),
        0
    );

    document.querySelectorAll(".cart-count").forEach(element => {
        element.textContent = totalQuantity;
    });
}

function addProductToCart(product) {
    const cart = getCart();

    const existingProduct = cart.find(
        item => String(item.id) === String(product.id)
    );

    if (existingProduct) {
        existingProduct.quantity = Number(existingProduct.quantity || 1) + 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: Number(product.price) || 0,
            image: product.image || "",
            category: product.category || "",
            size: product.size || "",
            quantity: 1
        });
    }

    saveCart(cart);
    showAddedMessage(product.name);
}

function renderProducts() {
    const products = getProducts().filter(product => product.status !== "Hidden");
    const container = document.querySelector("#productsContainer");

    if (!container) return;

    if (!products.length) {
        container.innerHTML = `
            <div class="empty-shop">
                <div class="empty-icon">✦</div>
                <p class="empty-label">THE COLLECTION</p>
                <h3>Fragrances Coming Soon</h3>
                <div class="empty-line"></div>
                <p class="empty-description">
                    Our fragrance collection is being carefully prepared. New products will appear here soon.
                </p>
            </div>
        `;
        return;
    }

    container.innerHTML = products.map(product => `
        <article class="product-card">
            <div class="product-image">
                ${product.status === "Out of Stock" ? '<span class="product-badge">OUT OF STOCK</span>' : ''}
                <img src="${product.image || 'images/placeholder.jpg'}" alt="${product.name}">
            </div>

            <div class="product-info">
                <span class="product-type">${product.category.toUpperCase()} · ${product.size}</span>
                <h4>${product.name}</h4>
                <p>${product.description}</p>

                <div class="product-bottom">
                    <strong>${formatPrice(product.price)}</strong>

                    <button
                        class="add-cart"
                        data-id="${product.id}"
                        data-name="${product.name}"
                        data-price="${product.price}"
                        ${product.status === "Out of Stock" ? 'disabled' : ''}
                    >
                        ${product.status === "Out of Stock" ? 'Unavailable' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </article>
    `).join("");

    container.querySelectorAll(".add-cart").forEach(button => {
        button.addEventListener("click", () => {
            const product = products.find(item => String(item.id) === button.dataset.id);
            if (product && product.status !== "Out of Stock") {
                addProductToCart(product);
            }
        });
    });
}

function showAddedMessage(productName) {
    let notification = document.querySelector(".shop-cart-notification");

    if (!notification) {
        notification = document.createElement("div");
        notification.className = "shop-cart-notification";
        document.body.appendChild(notification);
    }

    notification.textContent = `${productName} added to cart ✓`;
    notification.classList.add("show");

    setTimeout(() => {
        notification.classList.remove("show");
    }, 2500);
}

document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
    renderProducts();
});