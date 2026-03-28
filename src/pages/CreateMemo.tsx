import { useState } from 'react';
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

    const { title, code, language, memo } = formData;
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const createMemo = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await createMemoApi(formData);
            navigate('/');
        } catch (error) {
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