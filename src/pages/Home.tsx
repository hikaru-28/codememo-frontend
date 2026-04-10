import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import MemoCard from '../components/MemoCard';
import { getAllMemos as getAllMemosApi, deleteMemo as deleteMemoApi } from '../api/memoApi.ts';
import { IMemo } from '../types/memo';
import './Home.css';
import { languageOptions } from '../constants/languages.ts';

function Home() {
    const [memos, setMemos] = useState<IMemo[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [loading, setLoading] = useState(true);
    const [searchInput, setSearchInput] = useState("");
    const [searchKeyword, setSearchKeyword] = useState("");
    const [language, setLanguage] = useState("");

    //fetchの非同期処理はこの書き方もある。

    // const fetchMemos = async () => {
    //     const result = await fetch('http://localhost:5000/api/v1/memos', {
    //         method: 'GET',
    //     });
    //     if (!result.ok) {
    //         throw new Error(`メモ一覧の取得に失敗しました: ${result.status}`);
    //     };
    //     const data = await result.json();
    //     console.log(data);
    //     setMemos(data);
    // };

    // const fetchMemos = async () => {
    //     setLoading(true);
    //     try {
    //         const res = await fetch('http://localhost:5000/api/v1/memos');

    //         //APIエラー、HTTPステータスコードを確認
    //         if (!res.ok) throw new Error(`メモの取得に失敗しました: ${res.status}`);

    //         const data = await res.json();
    //         setMemos(data);
    //     } catch (error) {
    //         //通信エラーを確認
    //         console.error('メモの取得に失敗しました', error);
    //     } finally {
    //         setLoading(false);
    //     };
    // };

    const fetchMemos = async (page: number = currentPage) => {
        setLoading(true);
        try {
            const { memos, totalPages } = await getAllMemosApi(page, language, searchKeyword);
            setMemos(memos);
            setTotalPages(totalPages);
            if (totalPages === 0) setCurrentPage(1);
        } catch (error) {
            console.error('メモの取得に失敗しました', error);
        } finally {
            setLoading(false);
        };
    };

    useEffect(() => {
        fetchMemos();
    }, [currentPage]);

    useEffect(() => {
        setCurrentPage(1);
        fetchMemos(1);
    }, [language, searchKeyword])

    // const deleteMemo = async (id) => {
    //     if (window.confirm('このメモを削除しますか？')) {
    //         try {
    //             const res = await fetch(`http://localhost:5000/api/v1/memos/${id}`, {
    //                 method: 'DELETE',
    //             });

    //             if (!res.ok) throw new Error(`メモの削除に失敗しました: ${res.status}`);

    //             //削除後、再度一覧取得
    //             await fetchMemos();
    //         } catch (error) {
    //             console.log('メモの削除に失敗しました', error);
    //         }
    //     }
    // }

    const deleteMemo = async (id: string) => {
        if (window.confirm('このメモを削除しますか?')) {

            const toastId = toast.loading('削除中...');

            try {
                await deleteMemoApi(id);
                await fetchMemos();
                toast.success('削除に成功しました', { id: toastId });
            } catch (error) {
                toast.error('削除に失敗しました', { id: toastId });
            }
        }
    };

    const handleSearch = () => {
        setSearchKeyword(searchInput);
    };

    const handleResetSearch = () => {
        setSearchInput("");
        setSearchKeyword("");
    };





    return (
        <div className="home-page">
            <div className="page-header">
                <h1>メモ一覧</h1>
                <p>保存したコードメモを確認できます</p>
            </div>

            <div className="search-box">
                <form
                    className="search-box"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSearch();
                    }}
                >
                    <input
                        className="search-input"
                        type="text"
                        placeholder="タイトル・言語・コードで検索..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                    <button className="search-button" type="submit">
                        検索
                    </button>
                    <button
                        className="reset-button"
                        type="button"
                        onClick={handleResetSearch}
                    >
                        リセット
                    </button>
                </form>
            </div>

            <div className="language-filter">
                <select
                    className="language-select"
                    value={language}
                    onChange={(e) => { setLanguage(e.target.value) }}
                >
                    <option value="">すべての言語</option>
                    {languageOptions.map((lang) => (
                        <option key={lang.value} value={lang.value}>{lang.label}</option>
                    ))}
                </select>
            </div>

            {loading ? (
                <p className="status-text">読み込み中...</p>
            ) : memos.length === 0 ? (
                <p className="status-text">
                    {searchKeyword ? ` 「${searchKeyword}」に一致するメモはありません` : 'まだメモはありません'}
                </p>
            ) : (
                <div className="memo-grid">
                    {memos.map((memo) => (
                        <MemoCard
                            key={memo._id}
                            memo={memo}
                            onDelete={deleteMemo}
                        />
                    ))}
                </div>
            )}
            <div className="pagination">
                <button
                    className="pagination-button"
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    disabled={currentPage === 1}
                >前</button>

                <p className="pagination-info">{currentPage}/{totalPages}</p>

                <button
                    className="pagination-button"
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={currentPage >= totalPages || totalPages === 0}
                >次</button>
            </div>
        </div>
    );
};

export default Home;