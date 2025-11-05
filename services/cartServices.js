import Cart from "./models/Cart.js";

// --- Servicios para el manejo de logica ---

//Obtener el carrito de un usuario por su ID
export async function getUserCart(userId) {
        const cart = await Cart.findOne({ user: userId }).populate("items.product");
}
 //Crear un carrito vacío para un usuario sin carrito
export async function createUserCart(userId) {
        const cart = await Cart.create({
        user: userId,
        items: [],
        });
        return cart;
}
//Guardar el estado del carrito de compras
export async function saveCart(cart) {
    await cart.save();
    return await cart.populate("items.product");
}
//Obtener un producto especifico en un carrito
export function findCartItem(cart, productId) {
    const item = cart.items.find((i) => i.product.toString() === productId)
    if(!item) return null;
    return item;
}

// --- Servicios para el manejo de productos

 //Incrementar la cantidad de un producto
export function incrementItemQuantity(cart, productId) {
    const item = findCartItem(cart, productId);
    if (!item) return null;
    item.quantity++;
    return cart;
}
//Decrementar la cantidad de un producto
export function decrementItemQuantity(cart, productId) {
    const item = findCartItem(cart, productId);
    item.quantity--;
    return cart;
}
//Eliminar el producto del carrito
export function removeItemFromCart(cart, productId) {
    const index = cart.items.findIndex(i => i.product.toString() === productId);
    if (index === -1) {
        const error = new Error("El producto no existe en el carrito");
        error.statusCode = 404;
        error.name = "NotFoundError";
        throw error;
    }
    cart.items.splice(index, 1);
    return cart;
}
//Modificar los ingredientes de un producto
export function updateItemIngredients(cart, productId, selectedIngredients) {
    const item = findCartItem(cart, productId);
    item.selectedIngredients = selectedIngredients;
    return cart;
}
export async function addItemToCart(cart, productId, quantity, selectedIngredients, unitPrice) {
    const existingItem = cart.items.find(i => i.product.toString() === productId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.items.push({
            product: productId,
            quantity,
            selectedIngredients,
            unitPrice,
        });
    }
    return cart;
}

