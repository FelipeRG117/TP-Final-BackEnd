const ProductRepository = require("../repositories/product.repository.js");
const productRepository = new ProductRepository();

class ProductController {
  async addProduct(req, res) {
    const nuevoProducto = req.body;
    console.log(req.body);
    console.log(nuevoProducto);
    try {
      await productRepository.agregarProducto(nuevoProducto);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error");
    }
  }

  async getProducts(req, res) {
    try {
      let { limit = 10, page = 1, sort, query } = req.query;

      const productos = await productRepository.obtenerProductos(
        limit,
        page,
        sort,
        query
      );
      console.log(productos);
      res.json(productos);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error");
    }
  }

  async getProductById(req, res) {
    const id = req.params.pid;
    try {
      const buscado = await productRepository.obtenerProductoPorId(id);
      if (!buscado) {
        return res.json({
          error: "Producto no encontrado",
        });
      }
      res.json(buscado);
    } catch (error) {
      res.status(500).send("Error");
    }
  }

  async updateProduct(req, res) {
    try {
      const id = req.params.pid;
      const productoActualizado = req.body;

      const resultado = await productRepository.actualizarProducto(
        id,
        productoActualizado
      );
      res.json(resultado);
    } catch (error) {
      res.status(500).send("Error al actualizar el producto");
    }
  }

  async deleteProduct(req, res) {
    const id = req.params.pid;
    const usuario = req.user;
    //aqui tengo que hacer la busqueda por el rol de usuario y  aparte enviar un mensaje por postman
    console.log(
      "este es el id de usuario  ",
      id,
      "  esto es el suaurio",
      usuario
    );

    try {
      let respuesta = await productRepository.eliminarProducto(id, usuario);

      res.json(respuesta);
    } catch (error) {
      res.status(500).send("Error al eliminar el producto");
    }
  }
}

module.exports = ProductController;
