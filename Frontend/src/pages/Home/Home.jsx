import React, { useEffect } from "react";
import "./Home.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Marquee from "react-fast-marquee";
import BlogCard from "../../components/BlogCard/BlogCard";
import ProductCard from "../../components/ProductCard/ProductCard";
import SpecialProduct from "../../components/SpecialProduct/SpecialProduct";
import mainBanner from "../../images/main-banner-1.jpg";
import catBanner1 from "../../images/catbanner-01.jpg";
import catBanner2 from "../../images/catbanner-02.jpg";
import catBanner3 from "../../images/catbanner-03.jpg";
import catBanner4 from "../../images/catbanner-04.jpg";
import service1 from "../../images/service.png";
import service2 from "../../images/service-02.png";
import service3 from "../../images/service-03.png";
import service4 from "../../images/service-04.png";
import service5 from "../../images/service-05.png";
import camera from "../../images/camera.jpg";
import tv from "../../images/tv.jpg";
import headphone from "../../images/headphone.jpg";
import famous1 from "../../images/famous-1.webp";
import famous2 from "../../images/famous-2.webp";
import famous3 from "../../images/famous-3.webp";
import famous4 from "../../images/famous-4.webp";
import brand1 from "../../images/brand-01.png";
import brand2 from "../../images/brand-02.png";
import brand3 from "../../images/brand-03.png";
import brand4 from "../../images/brand-04.png";
import brand5 from "../../images/brand-05.png";
import brand6 from "../../images/brand-06.png";
import brand7 from "../../images/brand-07.png";
import brand8 from "../../images/brand-08.png";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { getAllBlogs } from "../../features/blogs/blogSlice";
import { getAllProducts } from "../../features/product/productSlice";
import { addToWishlist } from "../../features/product/productSlice";
import { getBanner } from "../../features/Banners/bannerSlice";
import wish from "../../images/wish.svg";
import ReactStars from "react-rating-stars-component";
import prodcompare from "../../images/prodcompare.svg";
import addcart from "../../images/add-cart.svg";
import view from "../../images/view.svg";
import Meta from "../../components/Meta/Meta";

const Home = () => {
  const blogState = useSelector((state) => state?.blog?.blog);
  const productState = useSelector((state) => state?.product?.product);
  const banState = useSelector((state) => state?.banner?.banners[0]?.images[0]?.url);
  const smallBan1 = useSelector((state) => state?.banner?.banners[1]?.images[0]?.url);
  const smallBan2 = useSelector((state) => state?.banner?.banners[2]?.images[0]?.url);
  const smallBan3 = useSelector((state) => state?.banner?.banners[3]?.images[0]?.url);
  const smallBan4 = useSelector((state) => state?.banner?.banners[4]?.images[0]?.url);


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
  return (
    <>
      <Meta title={"HOC"} />
      <section
        className="home-wrapper-1"
        style={{ paddingTop: 48, paddingBottom: 48 }}
      >
        <div className="home-container">
          <div className="home-row">
            <div className="home-coloum-1">
              <div
                style={{ padding: 16, position: "relative" }}
                className="main-banner"
              >
                <img src={banState} className="main-img" alt="main-banner" />
                <div
                  style={{ position: "absolute" }}
                  className="main-banner-content"
                >
                  <Link style={{ marginTop: 300 }} className="button">
                    BUY NOW
                  </Link>
                </div>
              </div>
            </div>
            <div className="home-coloum-2">
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 10,
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{ padding: 16, position: "relative" }}
                  className="small-banner"
                >
                  <img
                    src={smallBan1}
                    className="main-img"
                    alt="small-banner"
                  />
                </div>
                <div
                  style={{ padding: 16, position: "relative" }}
                  className="small-banner"
                >
                  <img
                    src={smallBan2}
                    className="main-img"
                    alt="small-banner"
                  />
                </div>
                <div
                  style={{ padding: 16, position: "relative" }}
                  className="small-banner"
                >
                  <img
                    src={smallBan3}
                    className="main-img"
                    alt="small-banner"
                  />
                </div>
                <div
                  style={{ padding: 16, position: "relative" }}
                  className="small-banner"
                >
                  <img
                    src={smallBan4}
                    className="main-img"
                    alt="small-banner"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        className="home-wrapper-02"
        style={{ paddingTop: 48, paddingBottom: 48 }}
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
                <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
                  <img src={service1} alt="services" />
                  <div>
                    <h6>Free Shipping</h6>
                    <p>From All order over $5</p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
                  <img src={service2} alt="services" />
                  <div>
                    <h6>Daily Suprise Offers </h6>
                    <p>save upto 25% off</p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
                  <img src={service3} alt="services" />
                  <div>
                    <h6>Support 24/7</h6>
                    <p>Shop with an expert</p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
                  <img src={service4} alt="services" />
                  <div>
                    <h6>Affordable Prices</h6>
                    <p>Get Factory default price</p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
                  <img src={service5} alt="services" />
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
      <section
        className="home-wrapper-3 home-wrapper-02"
        style={{ paddingTop: 24, paddingBottom: 24 }}
      >
        <div className="home-container-03">
          <div className="home-row-03">
            <div className="home-coloum-03">
              <div className="categories">
                <div className="home-cat">
                  <div>
                    <h6>Cameras</h6>
                    <p>10 items</p>
                  </div>
                  <img src={camera} alt="camera" />
                </div>
                <div className="home-cat">
                  <div>
                    <h6>Music & Gaming</h6>
                    <p>10 items</p>
                  </div>
                  <img src={camera} alt="camera" />
                </div>
                <div className="home-cat">
                  <div>
                    <h6>Smart Tv</h6>
                    <p>10 items</p>
                  </div>
                  <img src={tv} alt="camera" />
                </div>
                <div className="home-cat">
                  <div>
                    <h6>Smart Watches</h6>
                    <p>10 items</p>
                  </div>
                  <img src={headphone} alt="camera" />
                </div>
                <div className="home-cat">
                  <div>
                    <h6>Cameras</h6>
                    <p>10 items</p>
                  </div>
                  <img src={camera} alt="camera" />
                </div>
                <div className="home-cat">
                  <div>
                    <h6>Music & Gaming</h6>
                    <p>10 items</p>
                  </div>
                  <img src={camera} alt="camera" />
                </div>
                <div className="home-cat">
                  <div>
                    <h6>Smart Tv</h6>
                    <p>10 items</p>
                  </div>
                  <img src={tv} alt="camera" />
                </div>
                <div className="home-cat">
                  <div>
                    <h6>Smart Watches</h6>
                    <p>10 items</p>
                  </div>
                  <img src={headphone} alt="camera" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        className="featured-wrapper home-wrapper-02"
        style={{ paddingTop: 48, paddingBottom: 48 }}
      >
        <div className="home-container-05">
          <div className="home-row-05">
            <div className="home-coloum-05">
              <h3 className="section-heading">featured Products</h3>
            </div>
            <div className="row-two-09">
              {productState &&
                productState?.map((item, index) => {
                  if (item?.tags === "featured") {
                    return (
                      <div key={index} className="product-card-coloum-3">
                        <div
                          style={{ position: "relative" }}
                          className="product-card"
                        >
                          <div className="wishlist-icon">
                            <button
                              className="wishlist-button"
                              onClick={() => {
                                addToWish(item?._id);
                              }}
                            >
                              <img src={wish} alt="wishlist" />
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
                              value={item.totalrating.toString()}
                              edit={false}
                              activeColor="#ffd700"
                            />
                            <p
                              className="description"
                              dangerouslySetInnerHTML={{
                                __html: item?.description,
                              }}
                            ></p>
                            <p className="price">$ {item?.price}</p>
                          </div>
                          <div
                            style={{ position: "absolute" }}
                            className="action-bar"
                          >
                            <div className="product-card-div">
                              <button className="images-icons">
                                <img src={prodcompare} alt="compare" />
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
                  }
                })}
            </div>
          </div>
        </div>
      </section>
      <section
        className="famous-wrapper home-wrapper-02"
        style={{ paddingTop: 48, paddingBottom: 48 }}
      >
        <div className="home-container-09">
          <div className="home-row-09">
            <div className="home-coloum-09">
              <div style={{ position: "relative" }} className="famous-card">
                <img src={famous1} alt="famous" />
                <div
                  style={{ position: "absolute" }}
                  className="famous-content"
                >
                  <h5 className="home-h5-01">Big Screen</h5>
                  <h6 className="home-h6-01">Smart Watch Series 7</h6>
                  <p className="home-p-01">
                    From $399 or #16.62/mo. for 24 mo.*
                  </p>
                </div>
              </div>
            </div>
            <div className="home-coloum-09">
              <div style={{ position: "relative" }} className="famous-card">
                <img src={famous2} alt="famous" />
                <div
                  style={{ position: "absolute" }}
                  className="famous-content"
                >
                  <h5 className="home-h5-02">Studio Display</h5>
                  <h6 className="home-h6-02">600 nits of brightness</h6>
                  <p className="home-p-02">27-inch 5k Reina display</p>
                </div>
              </div>
            </div>
            <div className="home-coloum-09">
              <div style={{ position: "relative" }} className="famous-card">
                <img src={famous3} alt="famous" />
                <div
                  style={{ position: "absolute" }}
                  className="famous-content"
                >
                  <h5 className="home-h5-02">SmartPhone</h5>
                  <h6 className="home-h6-02">SmartPhone 13 Pro.</h6>
                  <p className="home-p-02">
                    Now in Green. From $999.00 or <br /> 41.62/mo. for 24 mo
                    Footnote*
                  </p>
                </div>
              </div>
            </div>
            <div className="home-coloum-09">
              <div style={{ position: "relative" }} className="famous-card">
                <img src={famous4} alt="famous" />
                <div
                  style={{ position: "absolute" }}
                  className="famous-content"
                >
                  <h5 className="home-h5-02">home speakers</h5>
                  <h6 className="home-h6-02">Room filling sound.</h6>
                  <p className="home-p-02">
                    From $699 or $116.58/mo. for 12 mo.*
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        className="special-wrapper home-wrapper-02"
        style={{ paddingTop: 24, paddingBottom: 24 }}
      >
        <div className="home-container-06">
          <div className="home-row-06">
            <div className="home-coloum-06">
              <h3 className="section-heading">Special Products</h3>
            </div>
          </div>
          <div className="home-row-07">
            {productState &&
              productState.map((item, index) => {
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
      <section
        className="popular-wrapper home-wrapper-02"
        style={{ paddingTop: 48, paddingBottom: 48 }}
      >
        <div className="home-container-08">
          <div className="home-row-08">
            <div className="home-coloum-08">
              <h3 className="section-heading">Our Popular Products</h3>
            </div>
          </div>
          <div className="row-two-08">
            {productState &&
              productState.map((item, index) => {
                if (item.tags === "popular") {
                  return (
                    <div key={index} className="product-card-coloum-3">
                      <div
                        style={{ position: "relative" }}
                        className="product-card "
                      >
                        <div className="wishlist-icon">
                          <button
                            className="wishlist-button"
                            onClick={() => {
                              addToWish(item?._id);
                            }}
                          >
                            <img src={wish} alt="wishlist" />
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
                            value={item.totalrating.toString()}
                            edit={false}
                            activeColor="#ffd700"
                          />
                          <p
                            className="description"
                            dangerouslySetInnerHTML={{
                              __html: item?.description,
                            }}
                          ></p>
                          <p className="price">$ {item?.price}</p>
                        </div>
                        <div
                          style={{ position: "absolute" }}
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
                              <img src={addcart} alt="addcart" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
              })}
          </div>
        </div>
      </section>
      <section
        className="marque-wrapper home-wrapper-02"
        style={{ paddingTop: 24, paddingBottom: 24 }}
      >
        <div className="home-container-04">
          <div className="home-row-04">
            <div className="home-coloum-04">
              <div className="marque-inner-wrapper card-wrapper">
                <Marquee style={{ display: "flex" }}>
                  <div className="marque-brand-img">
                    <img src={brand1} alt="brand" />
                  </div>
                  <div className="marque-brand-img">
                    <img src={brand2} alt="brand" />
                  </div>
                  <div className="marque-brand-img">
                    <img src={brand3} alt="brand" />
                  </div>
                  <div className="marque-brand-img">
                    <img src={brand4} alt="brand" />
                  </div>
                  <div className="marque-brand-img">
                    <img src={brand5} alt="brand" />
                  </div>
                  <div className="marque-brand-img">
                    <img src={brand6} alt="brand" />
                  </div>
                  <div className="marque-brand-img">
                    <img src={brand7} alt="brand" />
                  </div>
                  <div className="marque-brand-img">
                    <img src={brand8} alt="brand" />
                  </div>
                </Marquee>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        className="blog-wrapper home-wrapper-02"
        style={{ paddingTop: 48, paddingBottom: 48 }}
      >
        <div className="home-container-05">
          <div className="home-row-05">
            <div className="home-coloum-05">
              <h3 className="section-heading">Our Latest Blog</h3>
            </div>
            <div className="home-row-10">
              {blogState &&
                blogState?.map((item, index) => {
                  if (index < 3) {
                    return (
                      <div className="bloggg-coloum-4" key={index}>
                        <BlogCard
                          id={item?._id}
                          title={item?.title}
                          description={item?.description}
                          image={item?.images[0]?.url}
                          date={moment(item?.created_At).format(
                            "MMMM Do YYYY, h:mm a"
                          )}
                        />
                      </div>
                    );
                  }
                })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
