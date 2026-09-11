document.addEventListener("DOMContentLoaded", () => {
    const CART_KEY = "hmhPerfumesCart";

    function getCart() {
        try {
            return JSON.parse(localStorage.getItem(CART_KEY)) || [];
        } catch (error) {
            return [];
        }
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

    updateCartCount();
});
