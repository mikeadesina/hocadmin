import React, {useEffect, useState} from "react";
import "./Home.css";
import {useNavigate} from "react-router-dom";
import SpecialProduct from "../../components/SpecialProduct/SpecialProduct";
import service1 from "../../images/service.png";
import service2 from "../../images/service-02.png";
import service3 from "../../images/service-03.png";
import service4 from "../../images/service-04.png";
import service5 from "../../images/service-05.png";
import {useDispatch, useSelector} from "react-redux";
import {getAllBlogs} from "../../features/blogs/blogSlice";
import {getAllProducts} from "../../features/product/productSlice";
import {addToWishlist} from "../../features/product/productSlice";
import {getBanner} from "../../features/Banners/bannerSlice";
import wish from "../../images/wish.svg";
import ReactStars from "react-rating-stars-component";
import prodcompare from "../../images/prodcompare.svg";
import addcart from "../../images/add-cart.svg";
import view from "../../images/view.svg";
import Meta from "../../components/Meta/Meta";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Home = () => {
    const productState = useSelector((state) => state?.product?.product);
    const banState = useSelector((state) => state?.banner?.banners);
    const featuredProducts = Array.isArray(productState)
        ? productState?.filter(item => item?.tags === "featured")
        : [];
    const specialProducts = Array.isArray(productState)
        ? productState?.filter(item => item?.tags === "special")
        : [];
    const popularProducts = Array.isArray(productState)
        ? productState?.filter(item => item?.tags === "popular")
        : [];
    const bannerImages = banState.map(item => item.images.map(img => img.url)).flat();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const addToWish = (prodId) => {
        dispatch(addToWishlist(prodId));
    };

    useEffect(() => {
        dispatch(getBanner());
    }, []);

    useEffect(() => {
        getblogs();
        getProducts();
    }, []);
    const getblogs = () => {
        dispatch(getAllBlogs());
    };

    const getProducts = () => {
        dispatch(getAllProducts());
    };
    const [sliderSettings, setSliderSettings] = useState({
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    });
    return (
        <>
            <Meta title={"HOC"}/>
            <section
                className="home-wrapper-1"
                style={{paddingTop: 48, paddingBottom: 48}}
            >
                <div className="home-container">
                    <div className="home-row">
                        <div className="home-coloum-1">
                            <Slider {...sliderSettings} className="main-slider">
                                {bannerImages.map((image, index) => (
                                    <img key={index} src={image} className="main-img" alt={`image-${index}`}/>
                                ))}
                            </Slider>
                        </div>
                    </div>
                </div>
            </section>
            <section
                className="home-wrapper-02"
                style={{paddingTop: 48, paddingBottom: 48}}
            >
                <div className="home-container-2">
                    <div className="home-row-2">
                        <div className="home-coloum-3">
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                }}
                                className="services"
                            >
                                <div style={{display: "flex", alignItems: "center", gap: 15}}>
                                    <img src={service1} alt="services"/>
                                    <div>
                                        <h6>Free Shipping</h6>
                                        <p>From All order over $5</p>
                                    </div>
                                </div>
                                <div style={{display: "flex", alignItems: "center", gap: 15}}>
                                    <img src={service2} alt="services"/>
                                    <div>
                                        <h6>Daily Surprise Offers </h6>
                                        <p>save upto 25% off</p>
                                    </div>
                                </div>
                                <div style={{display: "flex", alignItems: "center", gap: 15}}>
                                    <img src={service3} alt="services"/>
                                    <div>
                                        <h6>Support 24/7</h6>
                                        <p>Shop with an expert</p>
                                    </div>
                                </div>
                                <div style={{display: "flex", alignItems: "center", gap: 15}}>
                                    <img src={service4} alt="services"/>
                                    <div>
                                        <h6>Affordable Prices</h6>
                                        <p>Get Factory default price</p>
                                    </div>
                                </div>
                                <div style={{display: "flex", alignItems: "center", gap: 15}}>
                                    <img src={service5} alt="services"/>
                                    <div>
                                        <h6>Secure Payments</h6>
                                        <p>100% Protected</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {featuredProducts.length > 0 && (
                <section
                    className="featured-wrapper home-wrapper-02"
                    style={{paddingTop: 48, paddingBottom: 48}}
                >
                    <div className="home-container-05">
                        <div className="home-row-05">
                            <div className="home-coloum-05" style={{ margin: '0 auto', textAlign: 'center' }}>
                                <h3 className="section-heading" style={{ fontSize: '2em', fontWeight: 'bold', color: '#333' }}>
                                    Featured Products
                                </h3>
                            </div>

                            <div className="row-two-09">
                                {featuredProducts &&
                                    featuredProducts?.map((item, index) => {
                                        return (
                                            <div key={index} className="product-card-coloum-3">
                                                <div
                                                    style={{position: "relative"}}
                                                    className="product-card"
                                                >
                                                    <div className="wishlist-icon">
                                                        <button
                                                            className="wishlist-button"
                                                            onClick={() => {
                                                                addToWish(item?._id);
                                                            }}
                                                        >
                                                            <img src={wish} alt="wishlist"/>
                                                        </button>
                                                    </div>
                                                    <div className="product-image">
                                                        <img
                                                            className="img-01"
                                                            src={item?.images[0]?.url}
                                                            alt="product"
                                                        />
                                                    </div>
                                                    <div className="product-details">
                                                        <h6 className="brand">{item?.brand}</h6>
                                                        <h5 className="product-title">{item.title}</h5>
                                                        <ReactStars
                                                            count={5}
                                                            size={24}
                                                            value={Number(item.totalrating)}
                                                            edit={false}
                                                            activeColor="#ffd700"
                                                        />
                                                        <p
                                                            className="description"
                                                            dangerouslySetInnerHTML={{
                                                                __html: item?.description,
                                                            }}
                                                        ></p>
                                                        <p className="price">NGN {item?.price.toLocaleString()}</p>
                                                    </div>
                                                    <div
                                                        style={{position: "absolute"}}
                                                        className="action-bar"
                                                    >
                                                        <div className="product-card-div">
                                                            <button className="images-icons">
                                                                <img src={prodcompare} alt="compare"/>
                                                            </button>
                                                            <button className="images-icons">
                                                                <img
                                                                    onClick={() =>
                                                                        navigate("/product/" + item._id)
                                                                    }
                                                                    src={view}
                                                                    alt="addcart"
                                                                />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    </div>
                </section>
            )}
            {specialProducts.length > 0 && (
                <section
                    className="special-wrapper home-wrapper-02"
                    style={{paddingTop: 24, paddingBottom: 24}}
                >
                    <div className="home-container-06">
                        <div className="home-coloum-06" style={{ margin: '0 auto', textAlign: 'center' }}>
                            <h3 className="section-heading" style={{ fontSize: '2em', fontWeight: 'bold', color: '#333' }}>
                                Special Products
                            </h3>
                        </div>

                        <div className="home-row-07">
                            {specialProducts &&
                                specialProducts.map((item, index) => {
                                    if (item.tags === "special") {
                                        return (
                                            <SpecialProduct
                                                key={index}
                                                id={item?._id}
                                                brand={item?.brand}
                                                title={item?.title}
                                                price={item?.price}
                                                totalrating={item?.totalrating.toString()}
                                                sold={item?.sold}
                                                quantity={item?.quantity}
                                                images={item?.images[0]?.url}
                                            />
                                        );
                                    }
                                })}
                        </div>
                    </div>
                </section>
            )}
            {popularProducts.length > 0 && (
                <section
                    className="popular-wrapper home-wrapper-02"
                    style={{paddingTop: 48, paddingBottom: 48}}
                >
                    <div className="home-container-08">
                        <div className="home-coloum-08" style={{ margin: '0 auto', textAlign: 'center' }}>
                            <h3 className="section-heading" style={{ fontSize: '2em', fontWeight: 'bold', color: '#333' }}>
                                Popular Products
                            </h3>
                        </div>

                        <div className="row-two-08">
                            {popularProducts &&
                                popularProducts.map((item, index) => {
                                    return (
                                        <div key={index} className="product-card-coloum-3">
                                            <div
                                                style={{position: "relative"}}
                                                className="product-card "
                                            >
                                                <div className="wishlist-icon">
                                                    <button
                                                        className="wishlist-button"
                                                        onClick={() => {
                                                            addToWish(item?._id);
                                                        }}
                                                    >
                                                        <img src={wish} alt="wishlist"/>
                                                    </button>
                                                </div>
                                                <div className="product-image">
                                                    <img
                                                        className="img-01"
                                                        src={item?.images[0].url}
                                                        alt="product"
                                                    />
                                                </div>
                                                <div className="product-details">
                                                    <h6 className="brand">{item?.brand}</h6>
                                                    <h5 className="product-title">{item.title}</h5>
                                                    <ReactStars
                                                        count={5}
                                                        size={24}
                                                        value={Number(item.totalrating)}
                                                        edit={false}
                                                        activeColor="#ffd700"
                                                    />
                                                    <p
                                                        className="description"
                                                        dangerouslySetInnerHTML={{
                                                            __html: item?.description,
                                                        }}
                                                    ></p>
                                                    <p className="price">$ {item?.price.toLocaleString()}</p>
                                                </div>
                                                <div
                                                    style={{position: "absolute"}}
                                                    className="action-bar"
                                                >
                                                    <div className="product-card-div">
                                                        <button className="images-icons">
                                                            <img
                                                                onClick={() => navigate("/product/" + item._id)}
                                                                src={view}
                                                                alt="addcart"
                                                            />
                                                        </button>
                                                        <button className="images-icons">
                                                            <img src={addcart} alt="addcart"/>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                </section>
            )}
        </>
    );
};

export default Home;
