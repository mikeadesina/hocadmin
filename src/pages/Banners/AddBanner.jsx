import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {createBanners, deleteABanner, getBanner} from '../../features/Banners/bannerSlice';
import './AddBanner.css'; // Import your custom CSS
import { FcUpload } from 'react-icons/fc';
import { uploadImg } from '../../features/upload/uploadSlice';
import Dropzone from 'react-dropzone';
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import { Modal } from "antd";
const AddBanner = () => {
  const dispatch = useDispatch();
  const bannerState = useSelector((state) => state?.banner?.banners);
  const [uploadedimages, setUploadedImages] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const allImages = [...uploadedimages];
      const imagesToUpload = allImages.map((img) => {
        if (img && img.url && img.public_id) {
          return {
            public_id: img.public_id,
            url: img.url,
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
            url: img.url,
          }));
          const updatedImages = [...formattedImages, ...imagesToUpload.filter((img) => img.url)];
          const updatedImagesData = updatedImages.map((img) => ({
            public_id: img.public_id,
            url: img.url,
          }));
          if (updatedImages.length > 0) {
            dispatch(createBanners({ images: updatedImagesData }));
            toast.success("Banner Succesfully Successfully!");
            setTimeout(() => {
              navigate("/admin/banner");
            }, 1000);

          }
        }
      }
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };
  const handleImageDrop = (acceptedFiles) => {
    setUploadedImages([...uploadedimages, ...acceptedFiles]);
  };
  const removeExistingImage = (index) => {
    setUploadedImages(
        uploadedimages.filter((img, i) => i !== index)
    )
  };
  const openModal = (image) => {
    setSelectedImage(image);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedImage(null);
  };
  useEffect(() => {
    dispatch(getBanner());
  }, []);
  return (
      <div className="add-banner-container">
        <h2 className="add-banner-title">Add Banner</h2>
        <form  className="add-banner-form">
          <div className="banner">
            <Dropzone onDrop={handleImageDrop}>
              {({ getRootProps, getInputProps }) => (
                  <section>
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <FcUpload  className='iconss-fc'/>
                      <p>
                        Drag 'n' drop some files here
                      </p>
                    </div>
                  </section>
              )}
            </Dropzone>
          </div>
          <div className="selected-images">
            {uploadedimages.map((file, index) => (
                <div className="selected-image" key={index}>
                  <img
                      src={file instanceof File ? URL.createObjectURL(file) : file.url}
                      alt={`Selected ${index + 1}`}
                      width={100}
                      height={100}
                  />
                  <button
                      type="button"
                      className="close-button"
                      onClick={() => removeExistingImage(index)}
                  >
                    &times;
                  </button>
                </div>
            ))}
          </div>
          <div className="existing-banners">
            {bannerState.map((banner) => (
                <div key={banner._id}>
                  {banner.images.map((image) => (
                      <div className="banner" key={image._id} onClick={() => openModal(image)}>
                        <img
                            src={image.url}
                            alt={`Banner ${banner._id} - ${image._id}`}
                            width={100}
                            height={100}
                        />
                      </div>
                  ))}
                </div>
            ))}
          </div>
          <Modal
              visible={modalIsOpen}
              onCancel={closeModal}
              title="Banner"
              className="image-modal"
              footer={null}
          >
            <div style={{ position: 'relative' }}>
              <img
                  src={selectedImage?.url}
                  alt="Selected Image"
                  style={{ maxWidth: '100%', maxHeight: '100%' }}
              />
              <button className="close-modal-button" onClick={closeModal}>
                &times;
              </button>
            </div>
          </Modal>
          <button type="submit" onClick={handleFormSubmit} className="add-banner-button">
            Add Banner
          </button>
        </form>
      </div>
  );
};
export default AddBanner;
