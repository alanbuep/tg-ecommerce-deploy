const mp = new MercadoPago('APP_USR-5817cd2e-cab2-4cef-9cf5-0944f426e9a4', {
    locale: 'es-AR'
});

const cartId = window.location.pathname.split("/")[2];

document.getElementById("checkout-button").addEventListener("click", async function () {

    try {
        let total = 0;

        const response = await fetch(`/api/carts/${cartId}/purchase`, {
            method: "GET",
        });
        const result = await response.json();
        if (response.ok) {
            total = result.total;
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: result.message,
            });
            return;
        }

        const orderData = {
            title: "Tienda-Gamer",
            quantity: 1,
            price: total,
            cartId: cartId,
        };

        const responseMP = await fetch(`/api/carts/create-preference`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(orderData),
        });

        const preference = await responseMP.json();

        createCheckoutButton(preference.id);
    } catch (error) {
        console.log(error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al procesar el pago',
        });
    }

});

const createCheckoutButton = (preferenceId) => {
    const bricksBuilder = mp.bricks();

    const renderComponent = async () => {
        if (window.checkoutButton) window.checkoutButton.unmount();

        await bricksBuilder.create("wallet", "wallet_container", {
            initialization: {
                preferenceId: preferenceId,
            },
        });
    }

    renderComponent();
}

document.getElementById("checkout-button-2").addEventListener("click", function () {
    window.location.href = `/finalizePurchase/${cartId}`;
});

document.querySelectorAll('.remove-from-cart').forEach(button => {
    button.addEventListener('click', async event => {
        const productId = event.target.dataset.productId;
        console.log(cartId)
        console.log(productId)
        try {
            const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Error al eliminar el producto del carrito');
            }

            const data = await response.json();

            Swal.fire({
                icon: 'success',
                title: 'Producto eliminado',
                text: 'El producto se ha eliminado del carrito con éxito',
                showConfirmButton: false,
                timer: 1500
            });

            window.location.reload();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al eliminar el producto del carrito',
            });
        }
    });
});