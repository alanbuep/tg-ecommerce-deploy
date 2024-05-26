document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', async event => {
        const productId = event.target.dataset.productId;

        try {
            console.log(productId)
            const response = await fetch(`/api/carts/products/${productId}`, {
                method: 'POST',
            });

            if (response.status === 401) {
                Swal.fire({
                    icon: 'warning',
                    title: 'No autenticado',
                    text: 'Debe iniciar sesión para agregar productos al carrito',
                });
                return;
            }

            if (!response.ok) {
                throw new Error('Error al agregar el producto al carrito');
            }

            const data = await response.json();
            console.log(data);

            Swal.fire({
                icon: 'success',
                title: 'Producto agregado',
                text: 'El producto se ha agregado al carrito con éxito',
                showConfirmButton: false,
                timer: 1500
            });
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al agregar el producto al carrito',
            });
        }
    });
});


const loginButton = document.getElementById('login');
if (loginButton) {
    loginButton.addEventListener('click', function () {
        window.location.href = '/login';
    });
}

const signupButton = document.getElementById('signup');
if (signupButton) {
    signupButton.addEventListener('click', function () {
        window.location.href = '/signup';
    });
}

const logoutButton = document.getElementById('logout-button');

logoutButton.addEventListener('click', async () => {
    const response = await fetch('/logout');
    if (response.ok) {
        window.location.href = '/login';
    } else {
        alert('Error al cerrar sesión');
    }
});

const restorePasswordButton = document.getElementById('restore-password-button');
restorePasswordButton.addEventListener('click', async () => {
    try {
        const response = await fetch('/restorepasswordemail', {
            method: 'GET',
        });
        if (!response.ok) {
            throw new Error('Error al solicitar restablecimiento de contraseña');
        }
        if (response.ok) {
            alert('Correo enviado correctamente');
        };
    } catch (error) {
        console.error(error);
    }
});

const viewCartButton = document.getElementById('view-cart-button');
if (viewCartButton) {
    viewCartButton.addEventListener('click', async () => {
        try {
            const response = await fetch('/api/users/check-cart', {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error('Error al verificar el carrito del usuario');
            }

            const data = await response.json();

            if (data.hasCart) {
                Swal.fire({
                    icon: 'success',
                    title: 'Redireccionando al carrito',
                    text: `Su carrito es: ${data.cartId}`,
                    showConfirmButton: false,
                    timer: 1500
                });
                window.location.href = `carts/${data.cartId}`;
            } else {
                Swal.fire({
                    icon: 'info',
                    title: 'Carrito vacío',
                    text: 'El usuario no tiene un carrito asignado',
                });
            }
        } catch (error) {
            console.error(error);

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al verificar el carrito del usuario',
            });
        }
    });
}