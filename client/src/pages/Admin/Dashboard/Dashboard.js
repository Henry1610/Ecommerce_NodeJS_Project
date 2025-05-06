const Dashboard=()=>{
    return(
        <div class="content">
          <h1>Product Management</h1>
        
          <div class="table-responsive">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Product A</td>
                  <td>Category 1</td>
                  <td>$50.00</td>
                  <td>120</td>
                  <td>
                    <button class="btn btn-primary btn-sm">Edit</button>
                    <button class="btn btn-danger btn-sm">Delete</button>
                  </td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Product B</td>
                  <td>Category 2</td>
                  <td>$75.00</td>
                  <td>80</td>
                  <td>
                    <button class="btn btn-primary btn-sm">Edit</button>
                    <button class="btn btn-danger btn-sm">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        )
}
export default Dashboard