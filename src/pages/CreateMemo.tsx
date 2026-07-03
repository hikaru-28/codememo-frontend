import { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { createMemo as createMemoApi } from '../api/memoApi';
import { languageOptions, ILanguages } from '../constants/languages';
import './MemoForm.css';


function CreateMemo() {
    const [formData, setFormData] = useState({
        title: '',
        code: '',
        language: 'javascript',
        memo: ''
    });
    const [isExtracting, setIsExtracting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { title, code, language, memo } = formData;
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsExtracting(true);
        const toastId = toast.loading('画像からコードを抽出中...');

        try {
            // Base64に変換
            const base64Image = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const result = reader.result as string;
                    // data:image/jpeg;base64, の部分を除去
                    resolve(result.split(',')[1]);
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });

            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/images/extract-code`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ base64Image }),
            });

            if (!res.ok) throw new Error('抽出失敗');

            const data = await res.json();

            setFormData((prev) => ({
                ...prev,
                code: data.code,
                language: data.language.toLowerCase() || prev.language,
            }));

            toast.success('コードを抽出しました', { id: toastId });
        } catch (error) {
            toast.error('コードの抽出に失敗しました', { id: toastId });
            console.log(error);
        } finally {
            setIsExtracting(false);
            // inputをリセット（同じファイルを再度選択できるように）
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const createMemo = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!title || !code) {
            toast.error('タイトルとコードを入力してください');
            return;
        }

        const toastId = toast.loading('作成中...');

        try {
            await createMemoApi(formData);
            toast.success('新しいメモを作成しました', { id: toastId });
            navigate('/');
        } catch (error) {
            toast.error('メモの作成に失敗しました', { id: toastId });
            console.log('メモの作成に失敗しました', error);
        };
    };

    return (
        <div className="memo-form-page">
            <h1>メモ作成</h1>

            <form className="memo-form" onSubmit={createMemo}>
                <div className="form-group">
                    <label>タイトル</label>
                    <input
                        type="text"
                        placeholder="タイトルを入力して下さい..."
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
                        {languageOptions.map((lang: ILanguages) => (
                            <option key={lang.value} value={lang.value}>{lang.label}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>コード</label>
                    <div className="image-upload-area">
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            style={{ display: 'none' }}
                        />
                        <button
                            type="button"
                            className="image-upload-button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isExtracting}
                        >
                            {isExtracting ? '抽出中...' : '📷 画像からコードを抽出'}
                        </button>
                    </div>
                    <textarea
                        name="code"
                        placeholder="コードを入力して下さい..."
                        value={code}
                        onChange={handleChange}
                        rows={10}
                    />
                </div>

                <div className="form-group">
                    <label>補足メモ</label>
                    <textarea
                        name="memo"
                        placeholder="補足メモを入力して下さい..."
                        value={memo}
                        onChange={handleChange}
                    />
                </div>

                <button className="submit-button" type="submit">作成</button>
            </form>
        </div>
    )
};

export default CreateMemo;