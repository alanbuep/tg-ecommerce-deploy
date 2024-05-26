export const generateAddProductErrorInfo = (data) => {
    return `Error al agregar el producto, uno o mas campos estan incompletos o son de un tipo distinto:
      * title: String ${data.title}
      * description: String ${data.description}
      * code: String obligatorio ${data.code}
      * price: String obligatorio ${data.price}
      * status: Boolean obligatorio ${data.status}
      * stock: Number obligatorio ${data.stock}
      * category: String obligatorio ${data.category}
      * thumbnail: String no obligatorio ${data.thumbnail}`;
};

export const generateFindProductErrorInfo = (pid) => {
    return `No se pudo encontrar el producto
    El id del producto es: ${pid}`;
};

export const generateAddUserErrorInfo = (data) => {
    return `Error al agregar el usuario, uno o más campos están incompletos o son de un tipo distinto:
      * first_name: String ${data.first_name}
      * last_name: String ${data.last_name}
      * email: String obligatorio ${data.email}
      * password: String obligatorio ${data.password}
      * birth: Date obligatorio ${data.birth}
      * role: String obligatorio ${data.role}
      * cart: ObjectId ${data.cart || 'no obligatorio'}
      * documents: Array ${data.documents || 'no obligatorio'}
      * last_connection: Date ${data.last_connection || 'no obligatorio'}`;
};

export const generateFindUserErrorInfo = (uid) => {
    return `No se pudo encontrar el usuario
    El id del usuario es: ${uid}`;
};