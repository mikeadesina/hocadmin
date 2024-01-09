import React, { useEffect, useState } from "react";
import "./AddProduct.css";
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
import { Select, Tag } from "antd";
import Dropzone from "react-dropzone";

import {
  updateAProduct,
  getSingleProduct,
  resetState
} from "../../../features/product/productSlice";
import { getSizes } from "../../../features/size/sizeSlice";
import { useNavigate, useLocation } from "react-router-dom";

let schema = Yup.object().shape({
  title: Yup.string().required("Title is Required"),
  description: Yup.string().required("Description is Required"),
  price: Yup.number().required("Price is Required"),
  brand: Yup.string().required("Brand is Required"),
  category: Yup.string().required("Category is Required"),
  tags: Yup.string().required("Tag is Required"),
  color: Yup.array()
      .min(1, "Pick at least one color")
      .required("Color is Required"),
  quantity: Yup.number().required("Quantity is Required"),
});

const EditProduct = () => {
  const [submitting, setSubmitting] = useState("");
  const [uploadedimages, setUploadedImages] = useState([]);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const getproductId = location.pathname.split("/")[3];
  const sizeState = useSelector((state) => state?.size?.sizes);
  const colorState = useSelector((state) => state?.color?.colors);
  const brandState = useSelector((state) => state?.brand?.brands);
  const catState = useSelector((state) => state?.pCategory?.pCategories);
  const singleProductState = useSelector((state) => state?.product?.getsProd);
  const newProduct = useSelector((state) => state?.product);
  const { isSuccess, isError, isLoading,updatedProduct} = newProduct;
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: "",
      description: "",
      price: "",
      brand: "",
      category: "",
      size: [],
      tags: "",
      color: [],
      quantity: "",
      images: "",
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      try {
        setSubmitting(true);
        const allImages = [...uploadedimages, ...formik.values.images];
        const imagesToUpload = allImages.map((img) => {
          if (img.url) {
            return {
              public_id: img.public_id,
              url: img.url
            };
          } else {
            return img;
          }
        });
        const newImagesToUpload = imagesToUpload.filter((img) => !img.url);
        if (newImagesToUpload.length > 0) {
          const action = await dispatch(uploadImg(newImagesToUpload));
          if (action.type === "upload/images/fulfilled") {
            const imagesUploaded = action.payload;
            const formattedImages = imagesUploaded.map((img) => ({
              public_id: img.public_id,
              url: img.url
            }));
            formik.values.images = [...formattedImages, ...imagesToUpload.filter((img) => img.url)];
          }
        }
        dispatch(updateAProduct({ id:getproductId, product: values }));
        formik.resetForm();
        setUploadedImages([]);
        setTimeout(() => {
          dispatch(resetState());
        }, 1000);
      } catch (error) {
        console.error("Error updating product:", error);
      }
    },
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (getproductId !== undefined) {
          await dispatch(getSingleProduct(getproductId));
        }
        dispatch(getSizes());
        dispatch(getColors());
        dispatch(getBrands());
        dispatch(getCategories());
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    fetchData();
  }, [dispatch, getproductId]);

  useEffect(() => {
    if (singleProductState) {
      const selectedSizes = singleProductState.size.map((item) => item._id) || [];
      const selectedColors = singleProductState.color.map((item) => item._id) || [];
      const existingImages = singleProductState.images || [];
      formik.setValues((prevValues) => ({
        ...prevValues,
        title: singleProductState.title || "",
        description: singleProductState.description || "",
        price: singleProductState.price || "",
        brand: singleProductState.brand || "",
        category: singleProductState.category || "",
        size: selectedSizes,
        tags: singleProductState.tags || "",
        color: selectedColors,
        quantity: singleProductState.quantity || "",
        images: existingImages,
      }));
    }
  }, [singleProductState, formik.setValues]);

  useEffect(() => {
    if (isSuccess && updatedProduct) {
      toast.success("Product Updated Successfully!");
      navigate("/");
    }
    if (isError) {
      toast.error("Something Went Wrong!");
    }
  }, [isSuccess, isError, isLoading, navigate, updatedProduct]);

  const sizeopt = sizeState.map((i) => ({
    label: i.title,
    value: i._id,
  }));
  const coloropt = colorState.map((i) => ({
    label: i.title,
    value: i._id,
  }));

  const handleSizes = (e) => {
    formik.setFieldValue("size", e);
  };
  const handleColors = (e) => {
    formik.setFieldValue("color", e);
  };
  const ColorTag = ({ colorId }) => {
    const selectedColor = colorState.find((color) => color._id === colorId);
    return (
        <Tag
            key={selectedColor?._id}
            color={selectedColor?.title}
            style={{ marginRight: 4 }}
        >
          {selectedColor?.title}
        </Tag>
    );
  };
  const handleImageDrop = (acceptedFiles) => {
    setUploadedImages([...uploadedimages, ...acceptedFiles]);
  };
  const handleRemoveImage = (imageId) => {
    const updatedImages = formik.values.images.filter(
        (img) => img.public_id !== imageId
    );
    formik.setFieldValue("images", updatedImages);
  };
  return (
      <div>
        <h3 className="adp-h3">
          {getproductId !== undefined ? "Edit" : "Add"} Product
        </h3>
        <div>
          <form
              action=""
              onSubmit={formik.handleSubmit}
              className="form-addproduct"
          >
            <CustomInput
                i_class="long-6"
                type="text"
                label="Enter Product Title"
                name="title"
                onChng={formik.handleChange("title")}
                onBlr={formik.handleChange("title")}
                val={formik.values.title}
            />
            <div className="error">
              {formik.touched.title && formik.errors.title}
            </div>
            <div>
              <ReactQuill
                  className="quill-1"
                  theme="snow"
                  name="description"
                  onChange={formik.handleChange("description")}
                  value={formik.values.description}
              />
            </div>
            <div className="error">
              {formik.touched.description && formik.errors.description}
            </div>

            <Select
                mode="multiple"
                name="size"
                allowClear
                className="add-select"
                placeholder="Select Size"
                value={formik.values.size}
                onChange={handleSizes}
                options={sizeopt}
            />
            <CustomInput
                i_class="long-7"
                type="number"
                label="Enter Product Price"
                name="price"
                onChng={formik.handleChange("price")}
                onBlr={formik.handleChange("price")}
                val={formik.values.price}
            />
            <div className="error">
              {formik.touched.price && formik.errors.price}
            </div>
            <select
                className="select-1"
                name="brand"
                onChange={formik.handleChange("brand")}
                onBlur={formik.handleChange("brand")}
                value={formik.values.brand}
                id=""
            >
              <option>Select Brand</option>
              {brandState.map((i, j) => {
                return (
                    <option key={j} value={i.title}>
                      {i.title}
                    </option>
                );
              })}
            </select>
            <div className="error">
              {formik.touched.brand && formik.errors.brand}
            </div>

            <select
                name="category"
                onChange={formik.handleChange("category")}
                onBlur={formik.handleChange("category")}
                value={formik.values.category}
                className="select-1"
                id=""
            >
              <option value="">Select Category</option>
              {catState.map((i, j) => {
                return (
                    <option key={j} value={i.title}>
                      {i.title}
                    </option>
                );
              })}
            </select>
            <div className="error">
              {formik.touched.category && formik.errors.category}
            </div>
            <select
                name="tags"
                onChange={formik.handleChange("tags")}
                onBlur={formik.handleChange("tags")}
                value={formik.values.tags}
                className="select-1"
                id=""
            >
              <option value="" disabled>
                Tags
              </option>
              <option value="featured">Featured</option>
              <option value="popular">Popular</option>
              <option value="special">Special</option>
            </select>
            <div className="error">
              {formik.touched.tags && formik.errors.tags}
            </div>
            <Select
                mode="multiple"
                allowClear
                className="add-select"
                placeholder="Select colors"
                value={formik.values.color}
                onChange={handleColors}
            >
              {coloropt.map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    <ColorTag colorId={option.value} />
                  </Select.Option>
              ))}
            </Select>
            <div className="error">
              {formik.touched.color && formik.errors.color}
            </div>
            <CustomInput
                i_class="long-7"
                type="number"
                label="Enter Product Quantity"
                name="quantity"
                onChng={formik.handleChange("quantity")}
                onBlr={formik.handleChange("quantity")}
                val={formik.values.quantity}
            />
            <div className="error">
              {formik.touched.quantity && formik.errors.quantity}
            </div>

            <div className="addProduct-div-01">
              <Dropzone onDrop={handleImageDrop}>
                {({ getRootProps, getInputProps }) => (
                    <section>
                      <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        <FcUpload />
                        <p>
                          Drag 'n' drop some files here, or click to select files
                        </p>
                      </div>
                    </section>
                )}
              </Dropzone>
            </div>

            <div className="showimages">
              {Array.isArray(formik.values.images) &&
                  formik.values.images.map((image) => (
                      <div className="addProd-div-2" key={image.public_id}>
                        <img
                            src={image.url}
                            alt={`Preview ${image.public_id}`}
                            width={100}
                            height={100}
                        />
                        <button
                            type="button"
                            onClick={() => handleRemoveImage(image.public_id)}
                            className="close-button"
                        >
                          &times;
                        </button>
                      </div>
                  ))}

              {uploadedimages.map((file, index) => (
                  <div className="addProd-div-2" key={`newImage-${index}`}>
                    <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index}`}
                        width={100}
                        height={100}
                    />
                    <button
                        type="button"
                        onClick={() =>
                            setUploadedImages(
                                uploadedimages.filter((img, i) => i !== index)
                            )
                        }
                        className="close-button"
                    >
                      &times;
                    </button>
                  </div>
              ))}
            </div>

            <button className="adp-btn" type="submit" disabled={submitting}>
              Edit Product
            </button>
          </form>
        </div>
      </div>
  );
};

export default EditProduct;
