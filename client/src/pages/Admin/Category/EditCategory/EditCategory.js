
import React, { useState } from 'react';
import './EditCategory.css';

const EditCategory = () => {
    const [formData, setFormData] = useState({
        categoryName: 'Computers',
        categoryCode: 'CT001',
        description: 'Computers Description',
    });
    const [images, setImages] = useState([
        { id: 'img1', name: 'macbookpro.jpg', size: '581kb', src: 'assets/img/icons/macbook.svg' },
    ]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const newImage = {
                id: `img${images.length + 1}`,
                name: file.name,
                size: `${Math.round(file.size / 1024)}kb`,
                src: URL.createObjectURL(file),
            };
            setImages([...images, newImage]);
        }
    };

    const handleRemoveImage = (id) => {
        setImages(images.filter(img => img.id !== id));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', { ...formData, images });
        // Add logic to send form data (e.g., API call) here
    };

    return (
        <div className="container-fluid py-4">
            <div className="row">
                <div className="col-12">
                    <div className="mb-4">
                        <h4 className="fw-bold">Product Category Edit</h4>
                        <h6 className="text-muted">Edit a product Category</h6>
                    </div>

                    <div className="card shadow-sm">
                        <div className="card-body">
                            <div className="row g-3">
                                <div className="col-lg-6 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label className="form-label">Category Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="categoryName"
                                            value={formData.categoryName}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-6 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label className="form-label">Category Code</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="categoryCode"
                                            value={formData.categoryCode}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div className="form-group">
                                        <label className="form-label">Description</label>
                                        <textarea
                                            className="form-control"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div className="form-group">
                                        <label className="form-label">Product Image</label>
                                        <div className="image-upload">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                            />
                                            <div className="image-uploads">
                                                <img src="assets/img/icons/upload.svg" alt="upload" />
                                                <h4>Drag and drop a file to upload</h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="product-list">
                                        <ul className="row g-3">
                                            {images.map(image => (
                                                <li key={image.id} className="col-auto ps-0">
                                                    <div className="productviews d-flex align-items-center">
                                                        <div className="productviewsimg">
                                                            <img src={image.src} alt="category" />
                                                        </div>
                                                        <div className="productviewscontent">
                                                            <div className="productviewsname">
                                                                <h2>{image.name}</h2>
                                                                <h3>{image.size}</h3>
                                                            </div>
                                                            <a
                                                                href="#"
                                                                className="hideset"
                                                                onClick={() => handleRemoveImage(image.id)}
                                                            >
                                                                <i className="fas fa-times"></i>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div className="col-lg-12 d-flex gap-2">
                                    <button
                                        className="btn btn-submit"
                                        onClick={handleSubmit}
                                    >
                                        Submit
                                    </button>
                                    <a href="categorylist.html" className="btn btn-cancel">
                                        Cancel
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditCategory;