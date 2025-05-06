import Sidebar from "../components/Admin/Sidebar";
import Header from "../components/Admin/Header";

function AdminLayout({ children }) {
    return (
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-3 col-lg-2">
                    <Sidebar />
                </div>

                <div class="col-md-9 ms-sm-auto col-lg-10">
                    <Header />
                    {children}
                </div>
            </div>
        </div>
    )
}
export default AdminLayout;