import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
    return (
<div class="bg-light p-3">
  <ul class="nav flex-column">
    <li class="nav-item">
      <a class="nav-link active" href="#">
        <i class="fas fa-tachometer-alt"></i>
        Dashboard
      </a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="#">
        <i class="fas fa-box"></i>
        Products
      </a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="#">
        <i class="fas fa-users"></i>
        Customers
      </a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="#">
        <i class="fas fa-cogs"></i>
        Settings
      </a>
    </li>
  </ul>
</div>

    );
}

export default Sidebar;