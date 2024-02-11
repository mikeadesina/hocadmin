import React, { useEffect, useState } from "react";
import "./CheckOut.css";
import Meta from "../../components/Meta/Meta";
import BreadCrumb from "../../components/BreadCrumb/BreadCrumb";
import {Link, useNavigate} from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as yup from "yup";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import axios from "axios";
import { createAnOrder } from "../../features/user/userSlice";
import { base_url } from "../../utils/baseUrl";
import Payment from "../Payment/Payment";
import { config } from "../../utils/axiosconfig";
import { deleteUserCart } from "../../features/user/userSlice";
import { usePaystackPayment } from "react-paystack";
import {allCountries, allStates} from "../../utils/function";
const shippingSchema = yup.object({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  email: yup.string().email().required("Email is required"),
  address: yup.string().required("Address Details are required"),
  other: yup.string().required(" Details are required"),
  state: yup.string().required("State is required"),
  city: yup.string().required("City is required"),
  country: yup.string().required("Country is required"),
  pincode: yup.string().required("Pincode is required"),
});

const CheckOut = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartState = useSelector((state) => state?.auth?.cartProducts);
  const [totalAmount, setTotalAmount] = useState(null);
  const [cartProductState, setCartProductState] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const orderState = useSelector((state) => state?.auth?.orderCreated?.order);
  const user = useSelector((state) => state?.auth?.user);


  useEffect(() => {
    let items = [];
    for (let index = 0; index < cartState?.length; index++) {
      items.push({
        product: cartState[index].productId._id,
        quantity: cartState[index].quantity,
        color: cartState[index].color._id,
        price: cartState[index].price,
      });
    }
    if (items) {
      setCartProductState(items);
    }
  }, [cartState]);

  useEffect(() => {
    let sum = 0;
    for (let index = 0; index < cartState?.length; index++) {
      sum = sum + Number(cartState[index].quantity) * cartState[index].price;
      if (sum > 0) {
        setTotalAmount(sum);
      }
    }
  }, [cartState]);

  const option = {
    public_key: process.env.REACT_APP_FLUTTERWAVE_PUBLIC_KEY,
    tx_ref: Date.now(),
    amount: totalAmount + 50,
    currency: "NGN",
    payment_options: "card,mobilemoney,ussd",
    customer: {
      email: user.email,
      phone_number: user.mobile,
      name: user.firstname + " " + user.lastname,
    },
    customizations: {
      title: "Hoc Payment",
      description: "Payment for items in cart",
      logo: "https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg",
    },
  };
  const handleFlutterPayment = useFlutterwave(option);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      address: "",
      other: "",
      state: "",
      city: "",
      country: "",
      pincode: "",
      email:""
    },
    validationSchema: shippingSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });
  /* PAyStack Integration */
  const publicKey = process.env.REACT_APP_PAYSTACK_PUBLIC_KEY;
  const amountInKobo = totalAmount * 100;
  const payConfig = {
    publicKey:publicKey,
    reference: (new Date()).getTime().toString(),
    email: user?.email,
    metadata: {
      name : user?.firstName + " " + user?.lastName,
      phone : user?.mobile,
    },
    amount: amountInKobo,
    currency: "NGN",
  };

  const handlePaystackPayment = usePaystackPayment(payConfig);

  const onSuccessPayment = (reference) => {
    console.log("Payment successful. Reference: ", reference);
    // Call your function to create an order with payment information
    createOrderWithPaymentInfo({
      method: "Paystack",
      payment_reference: reference,
    });
  };
  const onClosePaystack = () => {
    setIsModalOpen(false);
  };
  const handlePaymentOption = (option1) => {
    setPaymentMethod(option1);
    if (option1 === "flutterwave") {
      // Call the Flutterwave payment function here
      handleFlutterPayment({
        callback: async (response) => {
          if (response.status === "successful") {
            // Call the function to create the order with payment info for "flutterwave"
            createOrderWithPaymentInfo({method:"FlutterWave",response});
          }
          closePaymentModal();
        },
        onClose: () => {
          setIsModalOpen(false);
        },
      });
    } else if (option1 === "paystack") {
      handlePaystackPayment(onClosePaystack,onSuccessPayment);
    } else if (option1 === "cod") {
      createOrderWithPaymentInfo({
        method: "Cash On Delivery",
      });
    }
    setIsModalOpen(false);
  };
  // Removed handleFlutterPayment function
  const createOrderWithPaymentInfo = async (paymentInfo) => {
    try {
      // Create the order data object with payment information
      const orderData = {
        shippingInfo: formik.values,
        orderItems: cartProductState,
        totalPrice: totalAmount,
        totalPriceAfterDiscount: totalAmount,
        paymentInfo: paymentInfo,
      };
     await dispatch(createAnOrder(orderData));
      setTimeout(() => {
        navigate("/my-orders");
      }, 300);
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  return (
    <>
      <Meta title={"CheckOut"} />
      <BreadCrumb title="CheckOut" />
      <div className="checkout-wrapper home-wrapper-02">
        <div className="checkout-container-01">
          <div className="checkout-row-01">
            <div className="checkout-coloum-01">
              <div className="checkout-left-data">
                <h3 className="website-name">H O C</h3>
                <nav aria-label="breadcrumb-1">
                  <ol className="breadcrumb-1 total-price ">
                    <li className="breadcrumb-item total-price ">
                      <Link className="checkout-link-2" to="/cart">
                        Cart
                      </Link>
                    </li>
                    <li
                        className="breadcrumb-item total-price  active"
                        aria-current="page"
                    >
                      Information
                    </li>
                    <li className="breadcrumb-item  total-price active">
                      <Link className="checkout-link-2" to="/cart">
                        Shipping
                      </Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Payment
                    </li>
                  </ol>
                </nav>

                <h4 style={{ marginBottom: "1rem", marginTop: "20px" }}>
                  Shipping Address
                </h4>

                <form
                  action=""
                  onSubmit={formik.handleSubmit}
                  className="checkout-form"
                >
                  <div className="checkout-div-03">
                    <input
                      type="text"
                      placeholder="First Name"
                      className="checkout-form-control"
                      name="firstName"
                      id=""
                      onChange={formik.handleChange("firstName")}
                      onBlur={formik.handleChange("firstName")}
                      value={formik.values.firstName}
                    />
                    <div className="error">
                      {formik.touched.firstName && formik.errors.firstName}
                    </div>
                  </div>
                  <div className="checkout-div-03">
                    <input
                      type="text"
                      placeholder="Last Name"
                      className="checkout-form-control"
                      name="lastName"
                      id=""
                      onChange={formik.handleChange("lastName")}
                      onBlur={formik.handleChange("lastName")}
                      value={formik.values.lastName}
                    />
                    <div className="error">
                      {formik.touched.lastName && formik.errors.lastName}
                    </div>
                  </div>
                  <div className="checkout-div-03">
                    <input
                        type="text"
                        placeholder="email"
                        className="checkout-form-control"
                        name="email"
                        id=""
                        onChange={formik.handleChange("email")}
                        onBlur={formik.handleChange("email")}
                        value={formik.values.email}
                    />
                    <div className="error">
                      {formik.touched.email && formik.errors.email}
                    </div>
                  </div>
                  <div className="checkout-div-03">
                    <select
                        className="checkout-form-control select-control"
                        name="country"
                        id=""
                        onChange={(e) => formik.handleChange("country")(e)}
                        onBlur={formik.handleBlur("country")}
                        value={formik.values.country}
                    >
                      <option value="" disabled>
                        Select Country
                      </option>
                      {allCountries.map((country) => (
                          <option key={country.code} value={country.name}>
                            {country.name}
                          </option>
                      ))}
                    </select>
                    <div className="error">
                      {formik.touched.country && formik.errors.country}
                    </div>
                  </div>
                  <div className="checkout-div-03">
                    <select
                        className="checkout-form-control"
                        name="state"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.state}
                    >
                      <option value="" disabled>
                        Select State
                      </option>
                      {allStates.map((item) => (
                          <option key={item.code} value={item.name}>{item.name}</option>
                      ))}
                    </select>
                    <div className="error">
                      {formik.touched.state && formik.errors.state}
                    </div>
                  </div>
                  <div className="checkout-div-03">
                    <input
                        type="text"
                        placeholder="city"
                        className="checkout-form-control"
                        name="city"
                        id=""
                        onChange={formik.handleChange("city")}
                        onBlur={formik.handleChange("city")}
                        value={formik.values.city}
                    />
                    <div className="error">
                      {formik.touched.city && formik.errors.city}
                    </div>
                  </div>
                  <div className="checkout-div-03">
                    <input
                        type="text"
                        placeholder="Pincode"
                        className="checkout-form-control"
                        name="pin"
                        id=""
                        onChange={formik.handleChange("pincode")}
                        onBlur={formik.handleChange("pincode")}
                        value={formik.values.pincode}
                    />
                    <div className="error">
                      {formik.touched.pincode && formik.errors.pincode}
                    </div>
                  </div>
                  <div className="checkout-div-02">
                    <input
                      type="text"
                      placeholder="Address"
                      className="checkout-form-control"
                      name="address"
                      id=""
                      onChange={formik.handleChange("address")}
                      onBlur={formik.handleChange("address")}
                      value={formik.values.address}
                    />
                    <div className="error">
                      {formik.touched.address && formik.errors.address}
                    </div>
                  </div>
                  <div className="checkout-div-02">
                    <input
                      type="text"
                      placeholder="Appartment,suite . etc"
                      className="checkout-form-control"
                      name="other"
                      id=""
                      onChange={formik.handleChange("other")}
                      onBlur={formik.handleChange("other")}
                      value={formik.values.other}
                    />
                    <div className="error">
                      {formik.touched.other && formik.errors.other}
                    </div>
                  </div>
                  <div className="checkout-div-01">
                    <div className="checkout-div-04">
                      <Link className="checkout-link-1" to="/cart">
                        <BiArrowBack />
                        Return to Cart
                      </Link>
                      <Link to="/cart" className="button" id="rem-shi">
                        Continue to Shipping
                      </Link>
                      <button
                        className="button"
                        type="submit"
                        onClick={() => setIsModalOpen(true)}
                      >
                        Pay Now
                      </button>
                    </div>
                  </div>
                  {isModalOpen && (
                    <Payment
                      closeModal={() => setIsModalOpen(false)}
                      handlePaymentOption={handlePaymentOption}
                    />
                  )}
                </form>
              </div>
            </div>
            <div className="checkout-coloum-02">
              <div className="border-bottom checkout-div-07">
                {cartState &&
                  cartState?.map((item, index) => {
                    return (
                      <div key={index} className="checkout-div-08">
                        <div className="checkout-div-09">
                          <div style={{ width: "25%", position: "relative" }}>
                            <span className="checkout-badge">
                              {item?.quantity}
                            </span>
                            <img
                              width={100}
                              height={100}
                              src={item?.productId?.images[0]?.url}
                              alt="product"
                            />
                          </div>
                          <div>
                            <h5 className="total-price checkout-title">
                              {item?.productId?.title}
                            </h5>
                            <ul className="colors">
                              <li
                                  style={{ backgroundColor: item?.color?.title }}
                              ></li>
                            </ul>
                          </div>
                        </div>
                        <div className="checkout-div-10">
                          <h5 className="total">
                            NGN {(item?.price * item?.quantity).toLocaleString()}
                          </h5>
                        </div>
                      </div>
                    );
                  })}
              </div>
              <div className="border-bottom checkout-div-07">
                <div className="checkout-div-05">
                  <p className="total">SubTotal</p>
                  <p className="total-price">
                    NGN {totalAmount ? totalAmount.toLocaleString() : "0"}
                  </p>
                </div>
                <div className="checkout-div-05">
                  <p className="total">Shipping</p>
                  <p className="total-price">NGN 5</p>
                </div>
              </div>
              <div className="checkout-div-05">
                <h4 className="total">Total</h4>
                <h5 className="total-price">
                  NGN {(totalAmount ? totalAmount + 5 : 0).toLocaleString()}
                </h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckOut;
