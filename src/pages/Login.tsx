import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import './MemoForm.css';
import './Auth.css';

function Login() {
    const [userData, setUserData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const { email, password } = userData;
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setUserData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const login = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const res = await fetch(`${import.meta.env.VITE_AUTH_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            if (!res.ok) throw new Error(`ログインに失敗しました: ${res.status}`);
            const data = await res.json();
            localStorage.setItem('token', data.token);
            navigate('/');
        } catch (error) {
            console.log('ログインに失敗しました', error);
        };

    };

    return (
        <div className="memo-form-page">
            <h1>ログイン</h1>

            <form className="memo-form" onSubmit={login}>
                <div className="form-group">
                    <label>メールアドレス</label>
                    <input
                        type="text"
                        placeholder="メールアドレスを入力してください"
                        name="email"
                        value={email}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>パスワード</label>
                    <div className="password-wrap">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="パスワードを入力してください"
                            name="password"
                            value={password}
                            onChange={handleChange}
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                        </button>
                    </div>
                </div>

                <button className="submit-button" type="submit">ログイン</button>
            </form>

            <p className="auth-link">アカウントをお持ちでない方は<Link to="/register">新規登録</Link></p>
        </div>
    );
};

export default Login;