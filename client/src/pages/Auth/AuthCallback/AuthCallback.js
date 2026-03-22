import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getSessionAuth } from "../../../redux/auth/authSlice";
import { useNavigate } from "react-router-dom";

 const AuthCallback = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                await dispatch(getSessionAuth()).unwrap();
                navigate("/", { replace: true });
            } catch (e) {
                navigate("/login", { replace: true });
            }
        })();
    }, [dispatch, navigate]);
    return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <div className="text-center">
                <div className="spinner-border text-primary mb-3" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="text-muted">Đang xử lý đăng nhập...</p>
            </div>
        </div>
    );
}
export default AuthCallback;