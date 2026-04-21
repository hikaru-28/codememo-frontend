export interface ILanguages {
    value: string,
    label: string,
}

export const languageOptions: ILanguages[] = [
    { value: "javascript", label: "JavaScript" },
    { value: "react", label: "React" }, // valueをjavascriptに変更する。
    { value: "python", label: "Python" },
    { value: "sql", label: "SQL" },
    { value: "html", label: "HTML" },
    { value: "css", label: "CSS" },
    { value: "typescript", label: "TypeScript" }
];
