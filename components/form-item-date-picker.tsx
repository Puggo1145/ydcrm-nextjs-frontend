import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    FormControl,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
//types
import { ControllerRenderProps } from "react-hook-form"
// chinese
import { zhCN } from "date-fns/locale"

interface Props {    
    // ControllerRenderProps 内部的类型不确定
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    field: ControllerRenderProps<any, any>;
    label: string;
}

function FormItemDatePicker({ field, label }: Props) {
    return (
        <FormItem className="flex flex-col">
            <FormLabel className="font-bold">{label}</FormLabel>
            <Popover>
                <PopoverTrigger asChild>
                    <FormControl>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                            )}
                        >
                            {field.value ? (
                                format(field.value, "yyyy年 MM月 dd日")
                            ) : (
                                <span>请选择日期</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        locale={zhCN}
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                            date < new Date() 
                        }
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
            <FormMessage />
        </FormItem>
    );
}

export default FormItemDatePicker;