const express = require("express");
const {
  createUser,
  loginUserController,
  getallUser,
  getaUser,
  deleteaUser,
  updatedUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  loginAdmin,
  getWishlist,
  saveAddress,
   userCart,
   getUserCart,
   createOrder,
  removeProductFromCart,
  updateProductQuantityFromCart,
  getMyOrders,
  getMonthWiseOrderIncome,
  getYearlyTotalOrders,
  getAllOrders,
  getSingleOrder,
  updateOrder,
  emptyCart,
  updateWholeOrder,
} = require("../controller/userController");
const { authMiddleware, isAdmin } = require("../middlerwares/authmiddleware");
const { checkout, paymentVerification } = require("../controller/paymentController");
const router = express.Router();
router.post("/register", createUser);
router.post("/forgot-password-token", forgotPasswordToken);
router.put("/reset-password/:token", resetPassword);
// router.put("/order/update-order/:id", authMiddleware,isAdmin,updateOrderStatus);


router.put("/password",authMiddleware,updatePassword); 
router.post("/login", loginUserController);
router.post("/admin-login", loginAdmin); 
router.post("/cart",authMiddleware, userCart); 

router.post("/order/checkout",authMiddleware,checkout)
router.post("/order/paymentVerification",authMiddleware,paymentVerification)



router.post("/cart/create-order",authMiddleware,createOrder);
router.post("/cart/update-order",authMiddleware, updateWholeOrder);


router.get("/all-users", getallUser);
router.get("/getmyorders",authMiddleware, getMyOrders);
router.get("/getallorders",authMiddleware,isAdmin, getAllOrders);
router.get("/getaOrder/:id",authMiddleware,isAdmin, getSingleOrder);
router.put("/updateOrder/:id",authMiddleware,isAdmin, updateOrder);




router.get("/refresh", handleRefreshToken);
router.get("/logout", logout);
router.get("/wishlist", authMiddleware, getWishlist);
router.get("/cart", authMiddleware, getUserCart);
router.get("/getMonthWiseOrderIncome",authMiddleware, getMonthWiseOrderIncome); 
router.get("/getyearlyorders",authMiddleware, getYearlyTotalOrders); 
router.get("/:id", authMiddleware, isAdmin, getaUser);


// router.delete("/empty-cart", authMiddleware, emptyCart);
router.delete("/delete-product-cart/:cartItemId", authMiddleware, removeProductFromCart);
router.delete("/update-product-cart/:cartItemId/:newQuantity", authMiddleware, updateProductQuantityFromCart);
router.delete("/empty-cart", authMiddleware,emptyCart);
router.delete("/:id", deleteaUser);
router.put("/edit-user", authMiddleware, updatedUser);
router.put("/save-address", authMiddleware, saveAddress);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);

module.exports = router;
