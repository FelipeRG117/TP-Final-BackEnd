const ProductModel = require("../models/product.model.js");
//aui hay que tarer nodemaile
const nodemailer = require("nodemailer");
// Tercer Integradora:
const EmailManager = require("../services/email.js");
const emailManager = new EmailManager();

class ProductRepository {
  async agregarProducto({
    title,
    description,
    price,
    img,
    code,
    stock,
    category,
    thumbnails,
    owner,
  }) {
    try {
      if (!title || !description || !price || !code || !stock || !category) {
        console.log("Todos los campos son obligatorios");
        return;
      }

      const existeProducto = await ProductModel.findOne({ code: code });

      if (existeProducto) {
        console.log("El código debe ser único, malditooo!!!");
        return;
      }

      console.log("Owner", owner);

      const newProduct = new ProductModel({
        title,
        description,
        price,
        img,
        code,
        stock,
        category,
        status: true,
        thumbnails: thumbnails || [],
        owner,
      });

      await newProduct.save();
      console.log(newProduct);

      return newProduct;
    } catch (error) {
      throw new Error("Error");
    }
  }

  async obtenerProductos(limit = 10, page = 1, sort, query) {
    try {
      const skip = (page - 1) * limit;

      let queryOptions = {};

      if (query) {
        queryOptions = { category: query };
      }

      const sortOptions = {};
      if (sort) {
        if (sort === "asc" || sort === "desc") {
          sortOptions.price = sort === "asc" ? 1 : -1;
        }
      }

      const productos = await ProductModel.find(queryOptions)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);

      const totalProducts = await ProductModel.countDocuments(queryOptions);

      const totalPages = Math.ceil(totalProducts / limit);

      const hasPrevPage = page > 1;
      const hasNextPage = page < totalPages;

      return {
        docs: productos,
        totalPages,
        prevPage: hasPrevPage ? page - 1 : null,
        nextPage: hasNextPage ? page + 1 : null,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink: hasPrevPage
          ? `/api/products?limit=${limit}&page=${
              page - 1
            }&sort=${sort}&query=${query}`
          : null,
        nextLink: hasNextPage
          ? `/api/products?limit=${limit}&page=${
              page + 1
            }&sort=${sort}&query=${query}`
          : null,
      };
    } catch (error) {
      throw new Error("Error");
    }
  }

  async obtenerProductoPorId(id) {
    try {
      const producto = await ProductModel.findById(id);

      if (!producto) {
        console.log("Producto no encontrado");
        return null;
      }

      console.log("Producto encontrado!! Claro que siiiiii");
      return producto;
    } catch (error) {
      throw new Error("Error");
    }
  }

  async actualizarProducto(id, productoActualizado) {
    try {
      const actualizado = await ProductModel.findByIdAndUpdate(
        id,
        productoActualizado
      );
      if (!actualizado) {
        console.log("No se encuentra che el producto");
        return null;
      }

      console.log("Producto actualizado con exito, como todo en mi vidaa!");
      return actualizado;
    } catch (error) {
      throw new Error("Error");
    }
  }

  async eliminarProducto(id, user) {
    try {
      const productBeforeDelete = await ProductModel.findById(id);
      const userId = user._id;
      const user = await ProductModel.findById(userId);
      console.log(
        "yo soy usurio e n eliminar producto",
        user,
        "tssss este fue usuario"
      );

      if (user.role === "admin") {
        //este bloque solo es para poder tener un control de que recibo, cuando jale lo comentare o eliminare
        const name = user.first_name;
        const apellido = user.last_name;
        const product = productBeforeDelete;
        console.log(
          "estte es nombre: ",
          name,
          "este es apellido ",
          apellido,
          "este es el producto que se eliminara ",
          product
        );
        //aqui termina el bloque que comentare o eliminare
        await emailManager.deleteProductAdmin(
          user.first_name,
          user.last_name,
          productBeforeDelete
        );
        //ahora estos campos los mandamos a la funcoon que esta en email para mandar un mensaje personalizado y acaba de ser creado entonces una vez envia el email vamos a eliminar el producto
        const deleti = await ProductModel.findByIdAndDelete(id);
        return deleti;
      }
      const deleteado = await ProductModel.findByIdAndDelete(id);

      if (!deleteado) {
        console.log("No se encuentraaaa, busca bien!");
        return null;
      }
      console.log("Producto eliminado correctamente!");
      //aqui hacer la validacion de user

      return deleteado;
    } catch (error) {
      throw new Error("Error");
    }
  }
  //obtener producto por rol
}

module.exports = ProductRepository;

//aqui esta ña funcion eliminar producto de admin sin la limpieza agregada con comentarios y todo
/* async eliminarProducto(id, userId) {
    try {
      const productBeforeDelete = await ProductModel.findById(id);

      const user = await ProductModel.findById(userId);
      console.log(
        "yo soy usurio en eliminar producto",
        user,
        "tssss este fue usuario"
      );
      if (user.role === "admin") {
        //checamos de que el rol sea igual a admin
        //una vez decho esto enviamos el correo de que el
        //vamos a ahecr uso de una funcion de repository en el cual enviaremos el producto elimiando osea tomara dos parametros el de user tal vez haga una toma del campo de email para poner pues si de echo y aparte debo tomar el email de user asi que lo debo de poner en la otra funcion entonces voy a tomar su campo de email para que aparte de mandarselo tomar su role y decir admin juanito el producto y mandar producto a sido eliminado asi que mandaremos el user por parametro de lafucnion repository para tomar los campos alla y mandar el email que estara configurado y tomara los campos de use el email.js
        const name = user.first_name;
        const apellido = user.last_name;
        const product = productBeforeDelete;
        console.log(
          "estte es npmbre: ",
          name,
          "este es apellido ",
          apellido,
          "este es el producto que se eliminara ",
          product
        );

        await emailManager.deleteProductAdmin(
          user.first_name,
          user.last_name,
          productBeforeDelete
        );
        //ahora estos campos los mandamos a la funcoon que esta en email para mandar un mensaje personalizado
      }
      const deleteado = await ProductModel.findByIdAndDelete(id);

      if (!deleteado) {
        console.log("No se encuentraaaa, busca bien!");
        return null;
      }
      console.log("Producto eliminado correctamente!");
      //aqui hacer la validacion de user
+
      return deleteado;
    } catch (error) {
      throw new Error("Error");
    }
  } */
