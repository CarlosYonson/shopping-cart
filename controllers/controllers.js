import { 
    getUserCart,
    createUserCart,
    saveCart,
    incrementItemQuantity,
    decrementItemQuantity,
    removeItemFromCart,
    updateItemIngredients,
    addItemToCart,
} from './services.js';

export async function getOrCreateUserCart(req, reply) {
    try {
        const userId = req.user._id;
        let cart = await getUserCart(userId);

        if (!cart) {
        cart = await createUserCart(userId);
        }

        return reply.code(200).send(cart);
    } catch (error) {
        console.error("Error al obtener o crear el carrito:", error);
        return reply.code(500).send({ message: "Error interno al obtener o crear el carrito" });
    }
}

export async function updateProductQuantity(req, reply) {
    try {
        const userId = req.user._id;
        const { productId } = req.params;
        const { action } = req.body; // "increment" | "decrement"

        if (!productId) {
        return reply.code(400).send({ message: "Falta el ID del producto" });
        }

        if (!["increment", "decrement"].includes(action)) {
        return reply.code(400).send({ message: "Acción inválida. Usa 'increment' o 'decrement'." });
        }

        // Obtener o crear el carrito
        let cart = await getUserCart(userId);

        // Buscar el producto dentro del carrito
        const existingItem = cart.items.find(
        (i) => i.product.toString() === productId
        );
        if (!existingItem) {
        return reply.code(404).send({ message: "El producto no existe en el carrito" });
        }

        // Modificar cantidad
        if (action === "increment") {
        incrementItemQuantity(cart, productId);
        } else {
        decrementItemQuantity(cart, productId);
        if (existingItem.quantity <= 0) {
            removeItemFromCart(cart, productId);
        }
        }
        const updatedCart = await saveCart(cart);
        return reply.code(200).send(updatedCart);

    } catch (error) {
        console.error("Error al modificar la cantidad:", error);
        return reply.code(500).send({ message: "Error interno al modificar la cantidad del producto" });
    }
}

export async function updateProductIngredients(req, reply) {
    try {
        const userId = req.user._id;
        const { productId } = req.params;
        const { selectedIngredients } = req.body;

        if (!productId) {
        return reply.code(400).send({ message: "Falta el ID del producto" });
        }

        let cart = await getUserCart(userId);

        updateItemIngredients(cart, productId, selectedIngredients);
        const updatedCart = await saveCart(cart);
        return reply.code(200).send(updatedCart);
    } catch (error) {
        console.error("Error al actualizar ingredientes:", error);
        return reply.code(500).send({ message: "Error interno al actualizar los ingredientes del producto" });
    }
}

export async function addProductToCart(req, reply) {
    try {
        const userId = req.user._id;
        const {
        productId,
        quantity,
        selectedIngredients,
        unitPrice
        } = req.body;

        if (!product) {
        return reply.code(404).send({ message: "El producto no existe" });
        }

        // Obtener o crear el carrito
        let cart = await getUserCart(userId);
        addItemToCart(cart, productId, quantity, selectedIngredients, unitPrice);
        const updatedCart = await saveCart(cart);
        return reply.code(200).send(updatedCart);
    } catch (error) {
        console.error("Error al agregar producto al carrito:", error);
        return reply.code(500).send({ message: "Error interno al agregar el producto al carrito" });
    }
}
