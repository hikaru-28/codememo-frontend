import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { languageOptions } from '../constants/languages.js';
import { IMemo } from '../types/memo.js';
import './MemoCard.css';

interface MemoCardProps {
    memo: IMemo;
    onDelete: (id: string) => void;
}

function MemoCard({ memo, onDelete }: MemoCardProps) {
    const { _id: id, title, language, code, memo: note } = memo;
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch (error) {
            console.log('コピーに失敗しました', error);
        }
    };

    return (
        <article className="memo-card">
            <div className="memo-card-top">
                <h3 className="memo-title">{title}</h3>
                <span className="memo-language">{languageOptions.find((lang) => lang.value === language)?.label || language}</span>
            </div>

            <div className="memo-copy-wrap">
                <button className="copy-button" onClick={handleCopy}>
                    {copied ? 'コピー完了！' : 'コピー'}
                </button>
            </div>
            <SyntaxHighlighter
                language={language}
                style={vscDarkPlus}
                customStyle={{
                    borderRadius: '10px',
                    padding: '16px',
                    marginTop: '0px',
                    marginBottom: '0px',
                }}
            >
                {code}
            </SyntaxHighlighter>

            {note && <p className="memo-note">{note}</p>}

            <div className="memo-actions">
                <Link className="edit-link" to={`/edit/${id}`}>編集</Link>
                <button className="delete-button" onClick={() => onDelete(id)}>
                    削除
                </button>
            </div>
        </article>
    );
}

export default MemoCard;