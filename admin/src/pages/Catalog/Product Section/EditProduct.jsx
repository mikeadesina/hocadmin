import React, { useEffect, useState } from "react";
import "./AddProduct.css"; // You may create a separate CSS file for styling
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import CustomInput from "../../../components/CustomInput/CustomInput";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { getBrands } from "../../../features/brand/brandSlice";
import { getCategories } from "../../../features/pcategory/pcategorySlice";
import { getColors } from "../../../features/color/colorSlice";
import { uploadImg } from "../../../features/upload/uploadSlice";
import { FcUpload } from "react-icons/fc";
import { Select } from "antd";
import Dropzone from "react-dropzone";
import { updateAProduct, getSingleProduct, resetState } from "../../../features/product/productSlice";
import { getSizes } from "../../../features/size/sizeSlice";
import { useNavigate, useLocation } from "react-router-dom";

let schema = Yup.object().shape({
  title: Yup.string().required("Title is Required"),
  description: Yup.string().required("Description is Required"),
  price: Yup.number().required("Price is Required"),
  brand: Yup.string().required("Brand is Required"),
  category: Yup.string().required("Category is Required"),
  tags: Yup.string().required("Tag is Required"),
  color: Yup.array().min(1, "Pick at least one color").required("Color is Required"),
  quantity: Yup.number().required("Quantity is Required"),
});

const EditProduct = () => {
  const [color, setColor] = useState([]);
  const [size, setSize] = useState([]);
  const [submitting, setSubmitting] = useState("");
  const [uploadedimages, setUploadedImages] = useState([]);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const getproductId = location.pathname.split("/")[3];
  const brandState = useSelector((state) => state?.brand?.brands);
  const catState = useSelector((state) => state?.pCategory?.pCategories);
  const colorState = useSelector((state) => state?.color?.colors);
  const sizeState = useSelector((state) => state?.size?.sizes);
  const singleProductState = useSelector((state) => state?.product?.singleProduct);

  const newProduct = useSelector((state) => state?.product);
  const { isSuccess, isError, isLoading, createdProduct } = newProduct;

  useEffect(() => {
    dispatch(getBrands());
    dispatch(getCategories());
    dispatch(getColors());
    dispatch(getSizes());
  }, [dispatch]);

  useEffect(() => {
    if (getproductId !== undefined) {
      dispatch(getSingleProduct(getproductId));
    } else {
      dispatch(resetState());
    }
  }, [dispatch, getproductId]);

  useEffect(() => {
    if (isSuccess && createdProduct) {
      toast.success("Product Updated Successfully!");
      navigate("/");
    }
    if (isError) {
      toast.error("Something Went Wrong!");
    }
  }, [isSuccess, isError, isLoading, navigate, createdProduct]);

  const formik = useFormik({
    initialValues: {
      title: singleProductState.title || "",
      description: singleProductState.description || "",
      price: singleProductState.price || "",
      brand: singleProductState.brand || "",
      category: singleProductState.category || "",
      tags: singleProductState.tags || "",
      color: singleProductState.color || [],
      quantity: singleProductState.quantity || "",
      images: singleProductState.images || [],
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      try {
        setSubmitting(true);
        const action = await dispatch(uploadImg(uploadedimages));
        if (action.type === "upload/images/fulfilled") {
          const imagesUploaded = action.payload;
          const formattedImages = imagesUploaded.map((img) => ({
            public_id: img.public_id,
            url: img.url,
            _id: img._id,
          }));
          formik.values.images = formattedImages;
        }
        dispatch(updateAProduct({ productId: getproductId, data: values }));
        formik.resetForm();
        setColor([]);
        setSize([]);
        setTimeout(() => {
          dispatch(resetState());
        }, 1000);
      } catch (error) {
        console.error("Error updating product:", error);
      }
    },
  });

  useEffect(() => {
    formik.values.color = color;
  }, [color, formik.values]);

  const sizeopt = sizeState.map((i) => ({
    label: i.title,
    value: i._id,
  }));

  const coloropt = colorState.map((i) => ({
    label: i.title,
    value: i._id,
  }));

  useEffect(() => {
    formik.values.color = color ? color : " ";
    formik.values.size = size ? size : " ";
  }, [color, size, formik.values]);

  const handleSizes = (e) => {
    setSize(e);
  };

  const handleColors = (e) => {
    setColor(e);
  };

  const handleImageDrop = (acceptedFiles) => {
    setUploadedImages([...uploadedimages, ...acceptedFiles]);
  };

  return (
      <div>
        <h3 className="adp-h3">{getproductId !== undefined ? "Edit" : "Add"} Product</h3>
        <div>
          <form
              action=""
              onSubmit={formik.handleSubmit}
              className="form-addproduct"
          >
            {/* Rest of your form fields */}
            <CustomInput
                i_class="long-6"
                type="text"
                label="Enter Product Title"
                name="title"
                onChng={formik.handleChange("title")}
                onBlr={formik.handleChange("title")}
                val={formik.values.title}
            />
            {/* Add other fields in a similar manner */}

            <button className="adp-btn" type="Submit" disabled={submitting}>
              {getproductId !== undefined ? "Edit" : "Add"} Product
            </button>
          </form>
        </div>
      </div>
  );
};

export default EditProduct;
