import { forwardRef } from "react";

type InputProps = {
  className?: string;
  placeHolder?: string;
  type?: "text" | "number" | "password" | "email" | "file";
  icon?: React.ReactNode;
  autoFocus?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;

// const Input = forwardRef<HTMLInputElement, InputProps>() => {
//     return ()
// }
