import type { UseFormReturn, Path } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Tipo genérico para as props do componente
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type FormInputProps<TFormValues extends Record<string, any>> = {
  form: UseFormReturn<TFormValues>;
  label: string;
  name: Path<TFormValues>;
  placeholder?: string;
  type?: "text" | "email" | "password";
};

// Componente genérico que pode ser usado com qualquer formulário
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const FormInput = <TFormValues extends Record<string, any>>({
  form,
  label,
  name,
  placeholder,
  type = "text",
}: FormInputProps<TFormValues>) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="dark:text-[#f1f7feb5] text-sm">
            {label}
          </FormLabel>
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              autoComplete="off"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormInput;
