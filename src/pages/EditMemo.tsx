import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { getSingleMemo as getSingleMemoApi, updateMemo as updateMemoApi } from '../api/memoApi';
import { languageOptions } from '../constants/languages.ts';
import "./MemoForm.css";

function EditMemo() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        code: '',
        language: '',
        memo: '',
    });

    const { title, code, language, memo } = formData;
    const [loading, setLoading] = useState(true);

    if (!id) return <p>IDが見つかりません</p>;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const fetchSingleMemo = async () => {
        setLoading(true);
        try {
            const { title, code, language, memo } = await getSingleMemoApi(id);
            setFormData({
                title: title || '',
                code: code || '',
                language: language || 'javascript',
                memo: memo || ''
            });
        } catch (error) {
            console.log('メモの取得に失敗しました', error);
        } finally {
            setLoading(false);
        }
    };

    const updateMemo = async (e: React.FormEvent<HTMLFormElement>) => {
        //デフォルトである、フォーム送信の自動リロードを止める
        e.preventDefault();

        if (!title || !code) {
            toast.error('タイトルとコードを入力してください');
            return;
        };

        const toastId = toast.loading('更新中...');

        try {
            await updateMemoApi(id, formData);
            toast.success('メモを更新しました', { id: toastId });
            navigate('/');
        } catch (error) {
            toast.error('メモの更新に失敗しました', { id: toastId });
            console.log('メモの更新に失敗しました', error);
        }
    };

    useEffect(() => {
        fetchSingleMemo();
    }, []);

    if (loading) {
        return <p>読み込み中...</p>;
    }

    return (
        <div className="memo-form-page">
            <h1>メモ編集</h1>

            <form className="memo-form" onSubmit={updateMemo}>
                <div className="form-group">
                    <label>タイトル</label>
                    <input
                        type="text"
                        name="title"
                        value={title}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>言語</label>
                    <select
                        name="language"
                        value={language}
                        onChange={handleChange}
                    >
                        {languageOptions.map((lang) => (
                            <option key={lang.value} value={lang.value}>{lang.label}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>コード</label>
                    <textarea
                        name="code"
                        value={code}
                        onChange={handleChange}
                        rows={10}
                    />
                </div>

                <div className="form-group">
                    <label>補足メモ</label>
                    <textarea
                        name="memo"
                        value={memo}
                        onChange={handleChange}
                    />
                </div>

                <button className="submit-button" type="submit">更新</button>
            </form>
        </div>
    )
};

export default EditMemo;