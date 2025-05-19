import React, { useState } from 'react';

import './AddProduct.css';

const AddProduct = () => {
    const [formData, setFormData] = useState({
        productName: '',
        category: '',
        subCategory: '',
        brand: '',
        unit: '',
        sku: '',
        minQty: '',
        quantity: '',
        description: '',
        tax: '',
        discountType: 'Percentage',
        price: '',
        status: 'Closed',
        productImage: null,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, productImage: e.target.files[0] });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        // Add logic to send form data (e.g., API call) here
    };

    return (
        <div className="container-fluid py-4">
            <div className="row">
                <div className="col-12">
                    <div className="mb-4">
                        <h4 className="fw-bold">Product Add</h4>
                        <h6 className="text-muted">Create new product</h6>
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
                                            <option>Choose Category</option>
                                            <option>Computers</option>
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
                                            <option>Choose Sub Category</option>
                                            <option>Fruits</option>
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
                                            <option>Choose Brand</option>
                                            <option>Brand</option>
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
                                            <option>Choose Unit</option>
                                            <option>Unit</option>
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
                                            name="minQty"
                                            value={formData.minQty}
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
                                            <option>Closed</option>
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
                                <div className="col-lg-12 d-flex gap-2">
                                    <button
                                        className="btn btn-primary"
                                        onClick={handleSubmit}
                                    >
                                        Submit
                                    </button>
                                    <a href="productlist.html" className="btn btn-warning">
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

export default AddProduct;