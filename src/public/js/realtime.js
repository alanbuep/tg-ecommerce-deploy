console.log("Bienvenido a Tienda Gamer");

const addProductBtn = document.getElementById("addProductBtn");
const deleteProductBtn = document.getElementById("deleteProductBtn");

const user = document.getElementById("user").innerText;
console.log(user);

const productForm = document.getElementById("productForm");
const deleteForm = document.getElementById("deleteForm");

productForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const product = {};

    product.title = document.getElementById("title").value;
    product.description = document.getElementById("description").value;
    product.code = document.getElementById("code").value;
    product.price = document.getElementById("price").value;
    product.status = document.getElementById("status").value;
    product.stock = document.getElementById("stock").value;
    product.category = document.getElementById("category").value;
    product.thumbnail = document.getElementById("thumbnail").value;

    try {
        const response = await fetch("/api/products", {
            method: "POST",
            body: JSON.stringify(product),
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (!response.ok) {
            throw new Error("Error al agregar el producto");
        }

        const data = await response.json();
        Swal.fire({
            icon: 'success',
            title: 'Producto agregado',
            text: 'El producto se ha agregado con éxito'
        }).then(() => {
            productForm.reset();
        });

    } catch (error) {
        console.error(error);
        alert("Hubo un problema al agregar el producto");
    }
});

deleteForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const productId = document.getElementById("productId").value;

    try {
        const response = await fetch(`/api/products/${productId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Error al eliminar el producto');
        }

        const data = await response.json();
        Swal.fire({
            icon: 'success',
            title: 'Producto eliminado',
            text: 'El producto se ha eliminado con éxito'
        }).then(() => {
            document.getElementById("productId").value = '';
        });

    } catch (error) {
        console.error(error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al eliminar el producto'
        });
    }
});

const logoutButton = document.getElementById('logout-button');

logoutButton.addEventListener('click', async () => {
    const response = await fetch('/logout');
    if (response.ok) {
        window.location.href = '/login';
    } else {
        alert('Error al cerrar sesión');
    }
});