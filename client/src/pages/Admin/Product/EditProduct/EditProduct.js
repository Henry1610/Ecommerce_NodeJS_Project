import React, { useState } from 'react';
import './EditProduct.css';

const EditProduct = () => {
    const [formData, setFormData] = useState({
        productName: 'Macbook pro',
        category: 'Computers',
        subCategory: 'None',
        brand: 'None',
        unit: 'Piece',
        sku: 'PT0002',
        minimumQty: '5',
        quantity: '50',
        description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s,Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s,Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s,',
        tax: 'Choose Tax',
        discountType: 'Percentage',
        price: '1500.00',
        status: 'Active',
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
                        <h4 className="fw-bold">Product Edit</h4>
                        <h6 className="text-muted">Update your product</h6>
                    </div>

                    <div className="card shadow-sm">
                        <div className="card-body">
                            <div className="row g-3">
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label className="form-label">Product Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="productName"
                                            value={formData.productName}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label className="form-label">Category</label>
                                        <select
                                            className="form-select"
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                        >
                                            <option>Computers</option>
                                            <option>Mac</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label className="form-label">Sub Category</label>
                                        <select
                                            className="form-select"
                                            name="subCategory"
                                            value={formData.subCategory}
                                            onChange={handleInputChange}
                                        >
                                            <option>None</option>
                                            <option>option1</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label className="form-label">Brand</label>
                                        <select
                                            className="form-select"
                                            name="brand"
                                            value={formData.brand}
                                            onChange={handleInputChange}
                                        >
                                            <option>None</option>
                                            <option>option1</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label className="form-label">Unit</label>
                                        <select
                                            className="form-select"
                                            name="unit"
                                            value={formData.unit}
                                            onChange={handleInputChange}
                                        >
                                            <option>Piece</option>
                                            <option>Kg</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label className="form-label">SKU</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="sku"
                                            value={formData.sku}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label className="form-label">Minimum Qty</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="minimumQty"
                                            value={formData.minimumQty}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label className="form-label">Quantity</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="quantity"
                                            value={formData.quantity}
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
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label className="form-label">Tax</label>
                                        <select
                                            className="form-select"
                                            name="tax"
                                            value={formData.tax}
                                            onChange={handleInputChange}
                                        >
                                            <option>Choose Tax</option>
                                            <option>2%</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label className="form-label">Discount Type</label>
                                        <select
                                            className="form-select"
                                            name="discountType"
                                            value={formData.discountType}
                                            onChange={handleInputChange}
                                        >
                                            <option>Percentage</option>
                                            <option>10%</option>
                                            <option>20%</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label className="form-label">Price</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label className="form-label">Status</label>
                                        <select
                                            className="form-select"
                                            name="status"
                                            value={formData.status}
                                            onChange={handleInputChange}
                                        >
                                            <option>Active</option>
                                            <option>Open</option>
                                        </select>
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
                                                <li key={image.id} className="col-auto">
                                                    <div className="productviews d-flex align-items-center">
                                                        <div className="productviewsimg">
                                                            <img src={image.src} alt="product" />
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
                                        Update
                                    </button>
                                    <a href="productlist.html" className="btn btn-cancel">
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

export default EditProduct;