import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
}

export const Input: React.FC<InputProps> = ({ label, hint, className = '', ...props }) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</label>}
    <input
      {...props}
      className={`w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-800
        placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
        transition-all duration-150 ${className}`}
    />
    {hint && <p className="text-xs text-slate-400">{hint}</p>}
  </div>
);

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, className = '', ...props }) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</label>}
    <textarea
      {...props}
      className={`w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-800
        placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
        transition-all duration-150 resize-none ${className}`}
    />
  </div>
);

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, options, className = '', ...props }) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</label>}
    <select
      {...props}
      className={`w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-800
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
        transition-all duration-150 cursor-pointer ${className}`}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  </div>
);

interface TagInputProps {
  label?: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export const TagInput: React.FC<TagInputProps> = ({ label, tags, onChange, placeholder = 'Add & press Enter' }) => {
  const [input, setInput] = React.useState('');

  const addTag = (val: string) => {
    const trimmed = val.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInput('');
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(input);
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</label>}
      <div className="min-h-[42px] w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg
        focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent
        flex flex-wrap gap-1 items-center transition-all duration-150">
        {tags.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-700 
            rounded-md text-xs font-medium border border-indigo-100">
            {tag}
            <button
              type="button"
              onClick={() => onChange(tags.filter((t) => t !== tag))}
              className="hover:text-red-500 transition-colors leading-none"
            >×</button>
          </span>
        ))}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          onBlur={() => { if (input.trim()) addTag(input); }}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[120px] text-sm text-slate-800 placeholder:text-slate-300 
            bg-transparent outline-none py-0.5 px-1"
        />
      </div>
    </div>
  );
};
