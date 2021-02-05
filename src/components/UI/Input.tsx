import React, { FC, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

//!Since we will be using file input we can update Input component to allow users to select and upload multiple files.

const Input: FC<InputProps> = ({
  type = "text",
  placeholder,
  value,
  name,
  onChange,
  label,
  multiple,
}) => {
  return (
    <div className="field">
      <div className="control">
        <label htmlFor={name}>{label}</label>
        <input
          className="input"
          type={type}
          placeholder={placeholder}
          value={value}
          name={name}
          id={name}
          onChange={onChange}
          required
          autoComplete="off"
          multiple={multiple}
        />
      </div>
    </div>
  );
};

export default Input;
