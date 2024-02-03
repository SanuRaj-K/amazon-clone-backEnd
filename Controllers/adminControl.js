const userModel = require("../Schema/userSchema");
const productModel = require("../Schema/productSchema");
const orderModel = require("../Schema/orderSchema");
const cloudinary = require("../Middlewares/cloudinary");

const allUsers = async (req, res) => {
  const users = await userModel.find();
  res.send(users);
};

const allProducts = async (req, res) => {
  const products = await productModel.find();
  res.send(products);
};
const productById = async (req, res) => {
  const id = req.params.id;
  const product = await productModel.findById(id);
  if (product) {
    res.send(product);
  } else {
    res.send("not found");
  }
};

const productCategory = async (req, res) => {
  const category = req.params.id;
  const products = await productModel.find({ Category: category });
  res.send(products);
};

const userById = async (req, res) => {
  const email = req.params.id;

  const user = await userModel.findOne({ email: email });
  res.send(user);
};
const deleteUser = async (req, res) => {
  const id = req.params.id;
  const user = await userModel.findOneAndDelete({ email: id });
  if (!user) {
    res.send("ok");
  } else {
    res.send("failed");
  }
};

const addProduct = async (req, res) => {
  const { Title, Description, Price, Category, Image } = req.body;

  const exsitingProd = await productModel.findOne({ Title: Title });
  if (!exsitingProd) {
    const adding = await cloudinary.uploader.upload(Image);
    const added = await productModel.create({
      Title: Title,
      Description: Description,
      Price: Price,
      Category: Category,
      Image: adding.url,
    });
    res.send(added);
  } else {
    res.status(409).send("product already added");
  }
};

const AdminproductById = async (req, res) => {
  const id = req.params.id;
  const product = await productModel.findById(id);

  if (product) {
    res.send(product);
  } else {
    res.send("not found");
  }
};

const updateProduct = async (req, res) => {
  const { quantity, _id, Title, Category, Image, Price } = req.body;

  try {
    const adding = await cloudinary.uploader.upload(Image);
    const prod = await productModel.findByIdAndUpdate(_id, {
      $set: {
        quantity: quantity,
        Title: Title,
        Category: Category,
        Price: Price,
        Image: adding.url,
      },
    });

    res.status(200).send(prod);
  } catch (error) {
    console.log(error);
  }
};

const deleteProduct = async (req, res) => {
  const id = req.params.id;
  const prod = await productModel.findByIdAndDelete(id);
  res.send("ok");
};

const stats = async (req, res) => {
  const products = await productModel.find();
  const prodLength = products.length;
  const users = await userModel.find();
  const userlength = users.length;
  const orders = await orderModel.find();
  const deliverdOrder = orders.filter((status) => status.status === "deliverd");
  const total = deliverdOrder.map((price) => price.totalPrice);
  const subTotal = total.reduce((total, price) => total + price, 0);
  const totalRev = subTotal.toFixed(2);
  const categories = await productModel.distinct("Category");
  const categoriesLength = categories.length;

  res.send({ prodLength, userlength, totalRev, categoriesLength });
};

const orderDetails = async (req, res) => {
  const orders = await orderModel.find().populate("userId");
  res.send(orders);
};
const getOrderDetailsbyId = async (req, res) => {
  const id = req.params.id;
  const orders = await orderModel.findOne({ orderId: id }).populate("userId");
  res.send(orders);
};

const orderStatus = async (req, res) => {
  const orderId = req.params.id;
  const status = req.params.status;

  const order = await orderModel.findOneAndUpdate(
    { orderId: orderId },
    {
      $set: { status: status },
    }
  );
  res.send(order);
};

const chart = async (req, res) => {
  const totalPriceByMonth = await orderModel.aggregate([
    {
      $match: {
        status: "deliverd",
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m", date: "$orderDate" },
        },
        totalPrice: { $sum: "$totalPrice" },
      },
    },
  ]);
  const months = [
    "jan",
    "feb",
    "mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const salesMonth = [];
  const sales = [];
  totalPriceByMonth.forEach((monthlySale) => {
    const [year, month] = monthlySale._id.split("-");
    const monthName = months[parseInt(month, 10) - 1];
    salesMonth.push(monthName);
    sales.push(monthlySale.totalPrice);
  });
  res.send({ month: salesMonth, sales: sales });
};

module.exports = {
  allUsers,
  allProducts,
  productById,
  productCategory,
  userById,
  deleteUser,
  addProduct,
  AdminproductById,
  updateProduct,
  deleteProduct,
  stats,
  orderDetails,
  getOrderDetailsbyId,
  orderStatus,
  chart,
};
