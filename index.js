import fp from "fastify-plugin";
import mongoose from "mongoose";
import CartSchema from "./models/Cart.js";
import ProductSchema from "./models/Product.js";
import * as cartServices from "./services.js";
import {
    getOrCreateUserCart,
    addProductToCart,
    updateProductQuantity,
    updateProductIngredients,
} from "./controllers/cartController.js";
import cartRoutes from "./routes/cartRoutes.js";

export default fp(async (fastify) => {
    const Cart = mongoose.model("Cart", CartSchema);
    const Product = mongoose.model("Product", ProductSchema);

    fastify.decorate("models", { Cart, Product });
    fastify.decorate("services", { cartServices });
    fastify.decorate("controllers", {
        cart: {
        getOrCreateUserCart,
        addProductToCart,
        updateProductQuantity,
        updateProductIngredients,
        },
    });

    fastify.register(cartRoutes);

    fastify.log.info("Módulo inicializado correctamente");
});
