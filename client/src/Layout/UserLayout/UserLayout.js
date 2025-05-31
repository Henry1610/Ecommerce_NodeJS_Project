import Footer from "../components/User/Footer";
import Header from "../components/User/Header";

function UserLayout({ children }) {

    return (
        <>
            <div className="body-wrapper container">
                <Header />
                {children}
            </div>
            <Footer />
        </>


    )
}
export default UserLayout;