import {
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { InputHTMLAttributes } from "react";

interface Props<T> extends InputHTMLAttributes<HTMLInputElement> {
    field: T;
    label: string;
    desc?: string;
}

function FormItemInput<T>({ type, label, placeholder, field, desc }: Props<T>) {
  return (
    <FormItem>
        <FormLabel className="font-bold">{label}</FormLabel>
        <FormDescription>{desc}</FormDescription>
        <FormControl>
            <Input 
              type={type || "text"}
              placeholder={placeholder || `请输入${label}`} 
              {...field} 
            />
        </FormControl>
        <FormMessage />
    </FormItem>
  );
}

export default FormItemInput;