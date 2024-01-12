import React, {useEffect, useState} from "react";
import "./AddProduct.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {toast} from "react-toastify";
import CustomInput from "../../../components/CustomInput/CustomInput";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useDispatch, useSelector} from "react-redux";
import {getBrands} from "../../../features/brand/brandSlice";
import {getCategories} from "../../../features/pcategory/pcategorySlice";
import {getColors} from "../../../features/color/colorSlice";
import {uploadImg} from "../../../features/upload/uploadSlice";
import {FcUpload} from "react-icons/fc";
import {Select} from "antd";
import Dropzone from "react-dropzone";
import {createProducts} from "../../../features/product/productSlice";
import {getSizes} from "../../../features/size/sizeSlice";
import {useNavigate} from "react-router-dom";

let schema = Yup.object().shape({
    title: Yup.string().required("Title is Required"),
    description: Yup.string().required("Description is Required"),
    price: Yup.number().required("Price is Required"),
    brand: Yup.string().required("Brand is Required"),
    category: Yup.string().required("Category is Required"),
    tags: Yup.string().required("Tag is Required"),
    color: Yup
        .array()
        .min(1, "Pick at least one color")
        .required("Color is Required"),
    quantity: Yup.number().required("Quantity is Required"),
});

const AddProduct = () => {
    const [color, setColor] = useState([]);
    const [size, setSize] = useState([]);
    const [submitting, setSubmitting] = useState('');
    const [uploadedimages, setUploadedImages] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const brandState = useSelector((state) => state?.brand?.brands);
    const catState = useSelector((state) => state?.pCategory?.pCategories);
    const colorState = useSelector((state) => state?.color?.colors);
    const sizeState = useSelector((state) => state?.size?.sizes);
    const newProduct = useSelector((state) => state?.product);
    const {isSuccess, isError, isLoading, createdProduct} = newProduct;
    useEffect(() => {
        dispatch(getBrands());
        dispatch(getCategories());
        dispatch(getColors());
        dispatch(getSizes())
    }, [dispatch]);
    useEffect(() => {
        if (isSuccess && createdProduct) {
            toast.success("Product Added Successfullly!");
            navigate('/');
        }
        if (isError) {
            toast.error("Something Went Wrong!");
        }
    }, [isSuccess, isError, isLoading, navigate, createdProduct]);
    const formik = useFormik({
        initialValues: {
            title: "",
            description: "",
            price: "",
            brand: "",
            category: "",
            tags: "",
            color: "",
            quantity: "",
            images: "",
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
                        url: img.url
                    }));
                    formik.values.images = formattedImages;
                }
                dispatch(createProducts(values));
                formik.resetForm();
                setColor([]);
                setSize([]);
                toast.success("Product Added Successfully!");
                setTimeout(() => {
                    /*dispatch(resetState());*/
                    navigate("/admin/product-list");
                }, 1000);
            } catch (error) {
                toast.error("Error uploading images!");
                console.error("Error uploading images:", error);
            }
        },
    });

    useEffect(() => {
        formik.values.color = color;
    }, [color, formik.values]);

    const sizeopt = [];
    sizeState.forEach((i) => {
        sizeopt.push({
            label: i.title,
            value: i._id,
        });
    });

    const coloropt = [];
    colorState.forEach((i) => {
        coloropt.push({
            label: i.title,
            value: i._id,
        });
    });

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
            <h3 className="adp-h3">
                Add Product
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
                        defaultValue={size}
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
                        <option value="" disabled>Tags</option>
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
                        defaultValue={color}
                        onChange={(i) => handleColors(i)}
                        options={colorState.map((color) => ({
                            label: (
                                <div>
                        <span
                            style={{
                                display: 'inline-block',
                                width: '20px',
                                height: '20px',
                                backgroundColor: color.title,
                                marginRight: '8px',
                            }}
                        >
                        </span>
                                    {color.title}
                                </div>
                            ),
                            value: color._id,
                        }))}
                    />
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
                            {({getRootProps, getInputProps}) => (
                                <section>
                                    <div {...getRootProps()}>
                                        <input {...getInputProps()} />
                                        <FcUpload/>
                                        <p>
                                            Drag 'n' drop some files here, or click to select files
                                        </p>
                                    </div>
                                </section>
                            )}
                        </Dropzone>
                    </div>
                    <div className="showimages">
                        {uploadedimages.map((file, index) => (
                            <div className="addProd-div-2" key={index}>
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt={`Preview ${index}`}
                                    width={100}
                                    height={100}
                                />
                                <button
                                    type="button"
                                    onClick={() => setUploadedImages(uploadedimages.filter((img, i) => i !== index))}
                                    className="close-button"
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>
                    <button className="adp-btn" type="Submit" disabled={submitting}>
                        Add Product
                    </button>
                </form>
            </div>
        </div>
    );
};
export default AddProduct;
