import React, { useState } from 'react';
import './CategoryList.css';

const CategoryList = () => {
    const [selectAll, setSelectAll] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);

    const categories = [
        { id: 'CT001', name: 'Computers', img: 'assets/img/product/noimage.png', code: 'CT001', description: 'Computers Description', createdBy: 'Admin' },
        { id: 'CT002', name: 'Fruits', img: 'assets/img/product/noimage.png', code: 'CT002', description: 'Fruits Description', createdBy: 'Admin' },
        { id: 'CT003', name: 'Fruits', img: 'assets/img/product/noimage.png', code: 'CT003', description: 'Fruits Description', createdBy: 'Admin' },
        { id: 'CT004', name: 'Fruits', img: 'assets/img/product/noimage.png', code: 'CT004', description: 'Fruits Description', createdBy: 'Admin' },
        { id: 'CT005', name: 'Accessories', img: 'assets/img/product/noimage.png', code: 'CT005', description: 'Accessories Description', createdBy: 'Admin' },
        { id: 'CT006', name: 'Accessories', img: 'assets/img/product/noimage.png', code: 'CT006', description: 'Accessories Description', createdBy: 'Admin' },
        { id: 'CT007', name: 'Accessories', img: 'assets/img/product/noimage.png', code: 'CT007', description: 'Accessories Description', createdBy: 'Admin' },
        { id: 'CT008', name: 'Accessories', img: 'assets/img/product/noimage.png', code: 'CT008', description: 'Accessories Description', createdBy: 'Admin' },
        { id: 'CT009', name: 'Accessories', img: 'assets/img/product/noimage.png', code: 'CT009', description: 'Accessories Description', createdBy: 'Admin' },
        { id: 'CT0010', name: 'Accessories', img: 'assets/img/product/noimage.png', code: 'CT0010', description: 'Accessories Description', createdBy: 'Admin' },
    ];

    const handleSelectAll = () => {
        setSelectAll(!selectAll);
        setSelectedCategories(!selectAll ? categories.map(c => c.id) : []);
    };

    const handleSelectCategory = (id) => {
        setSelectedCategories(prev =>
            prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
        );
    };

    return (
        <div className="container-fluid py-4">
            <div className="row">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h4 className="fw-bold">Product Category List</h4>
                            <h6 className="text-muted">View/Search product Category</h6>
                        </div>
                        <a href="addcategory.html" className="btn btn-primary d-flex align-items-center">
                            <i className="fas fa-plus me-2"></i>Add Category
                        </a>
                    </div>

                    <div className="card shadow-sm">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div className="d-flex align-items-center">
                                    <button
                                        className="btn btn-filter btn-outline-primary me-2"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#filter_inputs"
                                    >
                                        <i className="fas fa-filter"></i>
                                    </button>
                                    <div className="input-group" style={{ maxWidth: '300px' }}>
                                        <input type="text" className="form-control" placeholder="Search..." />
                                        <button className="btn btn-searchset btn-primary" type="button">
                                            <i className="fas fa-search"></i>
                                        </button>
                                    </div>
                                </div>
                                <ul className="list-inline mb-0">
                                    <li className="list-inline-item">
                                        <a href="#" data-bs-toggle="tooltip" title="PDF">
                                            <i className="fas fa-file-pdf"></i>
                                        </a>
                                    </li>
                                    <li className="list-inline-item">
                                        <a href="#" data-bs-toggle="tooltip" title="Excel">
                                            <i className="fas fa-file-excel"></i>
                                        </a>
                                    </li>
                                    <li className="list-inline-item">
                                        <a href="#" data-bs-toggle="tooltip" title="Print">
                                            <i className="fas fa-print"></i>
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div className="collapse" id="filter_inputs">
                                <div className="card mb-3">
                                    <div className="card-body">
                                        <div className="row g-3">
                                            <div className="col-lg-2 col-sm-6 col-12">
                                                <select className="form-select">
                                                    <option>Choose Category</option>
                                                    <option>Computers</option>
                                                </select>
                                            </div>
                                            <div className="col-lg-2 col-sm-6 col-12">
                                                <select className="form-select">
                                                    <option>Choose Sub Category</option>
                                                    <option>Fruits</option>
                                                </select>
                                            </div>
                                            <div className="col-lg-2 col-sm-6 col-12">
                                                <select className="form-select">
                                                    <option>Choose Sub Brand</option>
                                                    <option>Iphone</option>
                                                </select>
                                            </div>
                                            <div className="col-lg-1 col-sm-6 col-12 ms-auto">
                                                <button className="btn btn-filters btn-primary ms-auto">
                                                    <i className="fas fa-search"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="table-responsive">
                                <table className="table table-striped table-hover">
                                    <thead>
                                        <tr>
                                            <th>
                                                <label className="checkboxs">
                                                    <input
                                                        type="checkbox"
                                                        id="select-all"
                                                        checked={selectAll}
                                                        onChange={handleSelectAll}
                                                    />
                                                    <span className="checkmarks"></span>
                                                </label>
                                            </th>
                                            <th>Category Name</th>
                                            <th>Category Code</th>
                                            <th>Description</th>
                                            <th>Created By</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {categories.map(category => (
                                            <tr key={category.id}>
                                                <td>
                                                    <label className="checkboxs">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedCategories.includes(category.id)}
                                                            onChange={() => handleSelectCategory(category.id)}
                                                        />
                                                        <span className="checkmarks"></span>
                                                    </label>
                                                </td>
                                                <td className="d-flex align-items-center">
                                                    <a href="#" className="product-img">
                                                        <img src={category.img} alt="product" className="category-img" />
                                                    </a>
                                                    <a href="#">{category.name}</a>
                                                </td>
                                                <td>{category.code}</td>
                                                <td>{category.description}</td>
                                                <td>{category.createdBy}</td>
                                                <td className="action-icons">
                                                    <a href="editcategory.html" className="me-2" title="Edit">
                                                        <i className="fas fa-edit"></i>
                                                    </a>
                                                    <a href="#" className="confirm-text" title="Delete">
                                                        <i className="fas fa-trash"></i>
                                                    </a>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryList;