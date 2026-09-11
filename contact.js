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

    const form = document.querySelector("#contactForm");
    const successMessage = document.querySelector("#formSuccess");

    if (form) {
        form.addEventListener("submit", event => {
            event.preventDefault();

            const fields = [
                { name: "fullName", label: "Full Name" },
                { name: "email", label: "Email" },
                { name: "phone", label: "Phone / WhatsApp Number" },
                { name: "subject", label: "Subject" },
                { name: "message", label: "Message" }
            ];

            let valid = true;
            let firstInvalidField = null;

            fields.forEach(field => {
                const input = form.querySelector(`[name="${field.name}"]`);
                const errorText = form.querySelector(`[data-error-for="${field.name}"]`);
                const group = input.closest(".field-group");

                const value = (input.value || "").trim();

                if (!value) {
                    valid = false;
                    group.classList.add("invalid");
                    errorText.textContent = `${field.label} is required.`;

                    if (!firstInvalidField) {
                        firstInvalidField = input;
                    }
                } else {
                    group.classList.remove("invalid");
                    errorText.textContent = "";
                }
            });

            if (!valid) {
                successMessage.classList.remove("visible");
                successMessage.textContent = "Please complete the required fields before sending your message.";
                successMessage.classList.add("visible");

                if (firstInvalidField) {
                    firstInvalidField.focus();
                }

                return;
            }

            const formData = new FormData(form);
            const name = formData.get("fullName").toString().trim();
            const email = formData.get("email").toString().trim();
            const phone = formData.get("phone").toString().trim();
            const subject = formData.get("subject").toString().trim();
            const message = formData.get("message").toString().trim();

            const whatsappMessage =
                `Hello HMH Perfumes!%0A%0A` +
                `Customer Name: ${encodeURIComponent(name)}%0A` +
                `Email: ${encodeURIComponent(email)}%0A` +
                `Phone: ${encodeURIComponent(phone)}%0A` +
                `Subject: ${encodeURIComponent(subject)}%0A%0A` +
                `Message:%0A${encodeURIComponent(message)}`;

            const whatsappURL = `https://wa.me/923242763303?text=${whatsappMessage}`;

            successMessage.textContent = "Your WhatsApp message is ready. Opening chat now...";
            successMessage.classList.add("visible");

            window.open(whatsappURL, "_blank");
            form.reset();
        });
    }

    updateCartCount();
});
