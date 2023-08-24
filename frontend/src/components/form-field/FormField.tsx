import { ErrorMessage, Field } from "formik";
import { twMerge } from "tailwind-merge";

interface FormFieldProps {
  name: string;
  type?: string;
  id?: string;
  valueSuffix?: string;
  isError?: boolean;
  onChange: any;
}

function DialogFormFieldInput({
  id,
  name,
  type,
  valueSuffix,
  isError,
  onChange,
}: FormFieldProps) {
  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    e;
    // TODO: determine if we want to avoid e in input
    // if (type === 'number' && e.key === 'e') {
    //   e.preventDefault();
    // }
  }

  return (
    <div
      className={`pr-2 flex-1 bg-bg-white dark:bg-bg-dark-700 py-2 flex font-bold leading-[120%] text-lg border
      ${isError ? "border-red-500" : "border-transparent"}`}
    >
      <Field
        onKeyDown={onKeyDown}
        type={type ?? "text"}
        id={id ?? name}
        name={name}
        className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
          bg-transparent border-none outline-none text-right flex-1"
      />
      {valueSuffix && <span className="pl-1">{valueSuffix}</span>}
    </div>
  );
}

interface DialogFormFieldProps {
  name: string;
  labelText: string;
  isError?: boolean;
  type?: string;
  className?: string;
  valueSuffix?: string;
  onChange?: any;
}

export function DialogFormField({
  name,
  labelText,
  type,
  className,
  valueSuffix,
  isError,
  onChange,
}: DialogFormFieldProps) {
  return (
    <>
      <div
        className={`${twMerge(
          "flex items-center border-b dark:border-text-dark-400 border-text-white-400",
          className
        )}`}
      >
        <label className="flex-1" htmlFor={name}>
          {labelText}
        </label>
        <DialogFormFieldInput
          name={name}
          type={type}
          valueSuffix={valueSuffix}
          isError={isError}
          onChange={onChange}
        />
      </div>
      <ErrorMessage
        name={name}
        component="div"
        className="text-sm dark:text-text-white-1000 pt-1.5"
      />
    </>
  );
}
