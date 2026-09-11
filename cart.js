// ========================================
// HMH PERFUMES - CART SYSTEM
// ========================================

const CART_KEY = "hmhPerfumesCart";


// ========================================
// GET CART
// ========================================

function getCart() {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch (error) {
        return [];
    }
}


// ========================================
// SAVE CART
// ========================================

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    renderCart();
}


// ========================================
// FORMAT PRICE
// ========================================

function formatPrice(price) {
    return new Intl.NumberFormat("en-PK").format(price);
}


// ========================================
// RENDER CART
// ========================================

function renderCart() {

    const cart = getCart();

    const cartContainer = document.querySelector("#cartItems");
    const emptyCart = document.querySelector("#emptyCart");
    const cartContent = document.querySelector("#cartContent");

    const subtotalElement = document.querySelector("#cartSubtotal");
    const totalElement = document.querySelector("#cartTotal");
    const cartCountElements = document.querySelectorAll(".cart-count");

    if (!cartContainer) return;


    // -------------------------------
    // CART COUNT
    // -------------------------------

    const totalQuantity = cart.reduce(
        (total, item) => total + Number(item.quantity || 1),
        0
    );

    cartCountElements.forEach(element => {
        element.textContent = totalQuantity;
    });


    // -------------------------------
    // EMPTY CART
    // -------------------------------

    if (cart.length === 0) {

        cartContainer.innerHTML = "";

        if (emptyCart) {
            emptyCart.style.display = "flex";
        }

        if (cartContent) {
            cartContent.style.display = "none";
        }

        if (subtotalElement) {
            subtotalElement.textContent = "PKR 0";
        }

        if (totalElement) {
            totalElement.textContent = "PKR 0";
        }

        return;
    }


    // -------------------------------
    // SHOW CART
    // -------------------------------

    if (emptyCart) {
        emptyCart.style.display = "none";
    }

    if (cartContent) {
        cartContent.style.display = "block";
    }


    let subtotal = 0;


    cartContainer.innerHTML = cart.map((item, index) => {

        const price = Number(item.price) || 0;
        const quantity = Number(item.quantity) || 1;

        const itemTotal = price * quantity;

        subtotal += itemTotal;


        return `
            <div class="cart-item" data-index="${index}">

                <div class="cart-item-image">
                    <img
                        src="${item.image}"
                        alt="${item.name}"
                        onerror="this.src='images/placeholder.jpg'"
                    >
                </div>


                <div class="cart-item-details">

                    <h3>${item.name}</h3>

                    ${item.size ? `
                        <p class="cart-size">
                            ${item.size}
                        </p>
                    ` : ""}

                    ${item.category ? `
                        <p class="cart-category">
                            ${item.category}
                        </p>
                    ` : ""}

                    <div class="cart-item-price">
                        PKR ${formatPrice(price)}
                    </div>

                </div>


                <div class="cart-quantity">

                    <button
                        class="quantity-btn decrease-btn"
                        onclick="changeQuantity(${index}, -1)"
                        aria-label="Decrease quantity"
                    >
                        −
                    </button>


                    <span class="quantity-value">
                        ${quantity}
                    </span>


                    <button
                        class="quantity-btn increase-btn"
                        onclick="changeQuantity(${index}, 1)"
                        aria-label="Increase quantity"
                    >
                        +
                    </button>

                </div>


                <div class="cart-item-total">

                    PKR ${formatPrice(itemTotal)}

                </div>


                <button
                    class="remove-cart-item"
                    onclick="removeFromCart(${index})"
                    aria-label="Remove product"
                >
                    ×
                </button>

            </div>
        `;

    }).join("");


    // -------------------------------
    // TOTALS
    // -------------------------------

    if (subtotalElement) {
        subtotalElement.textContent =
            `PKR ${formatPrice(subtotal)}`;
    }

    if (totalElement) {
        totalElement.textContent =
            `PKR ${formatPrice(subtotal)}`;
    }
}


// ========================================
// CHANGE QUANTITY
// ========================================

function changeQuantity(index, change) {

    const cart = getCart();

    if (!cart[index]) return;


    cart[index].quantity =
        Number(cart[index].quantity || 1) + change;


    // Don't allow quantity below 1

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }


    saveCart(cart);
}


// ========================================
// REMOVE FROM CART
// ========================================

function removeFromCart(index) {

    const cart = getCart();

    if (!cart[index]) return;


    cart.splice(index, 1);

    saveCart(cart);
}


// ========================================
// CLEAR CART
// ========================================

function clearCart() {

    localStorage.removeItem(CART_KEY);

    renderCart();
}


// ========================================
// WHATSAPP CHECKOUT
// ========================================

function checkoutWhatsApp() {

    const cart = getCart();

    if (cart.length === 0) {

        alert("Your cart is empty.");

        return;
    }


    let message =
        "✨ *HMH PERFUMES - ORDER REQUEST* ✨\n\n";


    message += "Hello HMH Perfumes! I would like to place an order:\n\n";


    let total = 0;


    cart.forEach((item, index) => {

        const price = Number(item.price) || 0;
        const quantity = Number(item.quantity) || 1;

        const itemTotal = price * quantity;

        total += itemTotal;


        message +=
            `${index + 1}. *${item.name}*\n`;

        if (item.size) {
            message += `Size: ${item.size}\n`;
        }

        if (item.category) {
            message += `Category: ${item.category}\n`;
        }

        message +=
            `Quantity: ${quantity}\n`;

        message +=
            `Price: PKR ${formatPrice(price)} each\n`;

        message +=
            `Subtotal: PKR ${formatPrice(itemTotal)}\n\n`;

    });


    message +=
        "━━━━━━━━━━━━━━━━━━\n";

    message +=
        `*TOTAL: PKR ${formatPrice(total)}*\n`;

    message +=
        "━━━━━━━━━━━━━━━━━━\n\n";

    message +=
        "Please confirm my order and delivery details. Thank you!";


    // HMH WhatsApp number

    const phoneNumber = "923242763303";


    const whatsappURL =
        `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;


    window.open(whatsappURL, "_blank");
}


// ========================================
// ADD TO CART - GLOBAL FUNCTION
// ========================================

function addToCart(product) {

    const cart = getCart();


    const existingProduct = cart.find(
        item => String(item.id) === String(product.id)
    );


    if (existingProduct) {

        existingProduct.quantity =
            Number(existingProduct.quantity || 1) + 1;

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


    // Small confirmation

    showCartMessage(`${product.name} added to cart`);
}


// ========================================
// CART MESSAGE
// ========================================

function showCartMessage(message) {

    let notification =
        document.querySelector(".cart-notification");


    if (!notification) {

        notification =
            document.createElement("div");

        notification.className =
            "cart-notification";

        document.body.appendChild(notification);
    }


    notification.textContent = message;

    notification.classList.add("show");


    setTimeout(() => {

        notification.classList.remove("show");

    }, 2500);
}


// ========================================
// INITIALIZE
// ========================================

document.addEventListener("DOMContentLoaded", () => {

    renderCart();

});