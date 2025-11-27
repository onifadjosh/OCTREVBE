const ProductModel = require("../models/product.model.js");
const UserModel = require("../models/user.model.js");
const { verify } = require("./user.controller.js");

const addProduct = async (req, res) => {
  const { productName, productPrice, productImage } = req.body;
  try {
    let id = req.userId;
    console.log(id);
    const user = await UserModel.findById({ _id: id });
    if (!user.isAdmin) {
      res.json({
        status: false,
        message: "product not saved, user is not an admin",
      });
      return;
    }
    const product = await ProductModel.create(req.body);
    res.json({
      status: true,
      message: "product saved successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: false,
      message: "product not saved",
    });
  }
};

module.exports = {
  addProduct,
};
