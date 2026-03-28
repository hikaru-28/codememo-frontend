const url = import.meta.env.VITE_API_URL + '/memos/';

interface INewMemo {
    title: string,
    code: string,
    language: string,
    memo?: string
};

// headers取得関数
const getAuthHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('token')}`
})

const getAllMemos = async (page: number, language?: string, keyword?: string) => {
    try {
        const queryParams = new URLSearchParams({ page: String(page), limit: '9' });
        if (language) queryParams.append('language', language);
        if (keyword) queryParams.append('keyword', keyword);
        const res = await fetch(`${url}?${queryParams}`, {
            headers: getAuthHeaders(),
        });
        if (!res.ok) throw new Error(`メモの取得に失敗ました: ${res.status}`);
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('メモの取得に失敗しました', error);
    };
};

const getSingleMemo = async (id: string) => {
    try {
        const res = await fetch(`${url}${id}`, {
            headers: getAuthHeaders(),
        });
        if (!res.ok) throw new Error(`メモの取得に失敗しました: ${res.status}`);
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('メモの取得に失敗しました', error);
    };
};

const createMemo = async (newMemo: INewMemo) => {
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newMemo),
        });
        if (!res.ok) throw new Error(`メモの作成に失敗しました: ${res.status}`);
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('メモの作成に失敗しました', error);
    };
};

const updateMemo = async (id: string, updatedMemo: INewMemo) => {
    try {
        const res = await fetch(`${url}${id}`, {
            method: 'PATCH',
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedMemo),
        });
        if (!res.ok) throw new Error(`メモの更新に失敗しました: ${res.status}`);
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('メモの更新に失敗しました', error);
    };
};

const deleteMemo = async (id: string) => {
    try {
        const res = await fetch(`${url}${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        if (!res.ok) throw new Error(`メモの削除に失敗しました: ${res.status}`);
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('メモの削除に失敗しました', error);
    };
};


export {
    getAllMemos,
    getSingleMemo,
    createMemo,
    updateMemo,
    deleteMemo,
};