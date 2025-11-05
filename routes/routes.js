import {
  getOrCreateUserCart,
  updateProductQuantity,
  updateProductIngredients,
  addProductToCart
} from "../controllers/cartController.js"; // ajusta la ruta según tu estructura

export default async function cartRoutes(fastify) {
  // Obtener o crear el carrito del usuario
  fastify.get("/cart", getOrCreateUserCart);

  // Agregar un nuevo producto al carrito
  fastify.post("/cart/add", addProductToCart);

  // Modificar la cantidad de un producto (incrementar o decrementar)
  fastify.patch("/cart/:productId/quantity", updateProductQuantity);

  // Actualizar los ingredientes de un producto
  fastify.put("/cart/:productId/ingredients", updateProductIngredients);
}
