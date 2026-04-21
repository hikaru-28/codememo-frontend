import { Link, Outlet, useNavigate } from 'react-router-dom';
import './Layout.css';

function Layout() {
    const navigate = useNavigate();
    const logout = () => {
        localStorage.removeItem('token');
        navigate("/login");
    };

    return (
        <div className="layout">
            <header className="header">
                <div className="header-inner">
                    <h1 className="logo">Code Memo App</h1>
                    
                    {/* エラーメッセージ表示予定 */}
                    {/* <div className="api-status">
                        <p>{status}</p>
                    </div> */}

                    <nav className="nav">
                        <Link to="/">ホーム</Link> | <Link to="/new">新規作成</Link> | <button onClick={logout}>ログアウト</button>
                    </nav>
                </div>
            </header>

            <main className="main">
                <Outlet />
            </main>
        </div>
    )
};

export default Layout;