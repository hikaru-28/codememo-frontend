import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import './MemoForm.css';
import './Auth.css';

function Register() {
    const [userData, setUserData] = useState({
        userName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { userName, email, password, confirmPassword } = userData;
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setUserData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const register = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!password || !email || !userName) {
            if (!password) toast.error('パスワードを入力してください');
            if (!email) toast.error('メールアドレスを入力してください');
            if (!userName) toast.error('ユーザーネームを入力してください');
            return;
        };

        if (password !== confirmPassword) {
            toast.error('パスワードが一致しません');
            console.log('パスワードが一致しません');
            return;
        }

        const toastId = toast.loading('登録中...');

        try {
            const res = await fetch(`${import.meta.env.VITE_AUTH_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            if (!res.ok) throw new Error(`ユーザー登録に失敗しました: ${res.status}`);
            const data = await res.json();
            localStorage.setItem('token', data.token);
            toast.success('登録に成功しました', { id: toastId });
            navigate('/');
        } catch (error) {
            toast.error('登録に失敗しました', { id: toastId });
            console.log('登録に失敗しました', error);
        };
    };

    return (
        <div className="memo-form-page">
            <h1>新規登録</h1>

            <form className="memo-form" onSubmit={register}>
                <div className="form-group">
                    <label>ユーザーネーム</label>
                    <input
                        type="text"
                        placeholder="ユーザーネームを入力してください"
                        name="userName"
                        value={userName}
                        onChange={handleChange}
                    />
                </div>

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
                            type={showPassword ? "text" : "password"}
                            placeholder="半角英数字のみ"
                            name="password"
                            value={password}
                            onChange={handleChange}
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                        </button>
                    </div>
                </div>

                <div className="form-group">
                    <label>パスワード（確認用）</label>
                    <div className="password-wrap">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="半角英数字のみ"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={handleChange}
                        />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                            {showConfirmPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                        </button>
                    </div>
                </div>

                <button className="submit-button" type="submit">登録</button>
            </form>

            <p className="auth-link">アカウントをお持ちの方は<Link to="/login">ログイン</Link></p>
        </div>
    );
}

export default Register;