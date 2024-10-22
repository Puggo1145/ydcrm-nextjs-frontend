import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { DateRange } from "react-day-picker"
import { zhCN } from 'date-fns/locale';

interface Props {
  className?: string
  align?: "start" | "center" | "end"
  date: DateRange
  setDate: (date: DateRange) => void
}

const DatePicker: React.FC<Props> = ({ 
  className, 
  align="start",
  date,
  setDate
}) => {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "y年/L月/dd日", { locale: zhCN })} -{" "}
                  {format(date.to, "y年/L月/dd日", { locale: zhCN })}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align={align}>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(date: DateRange | undefined) => setDate(date!)}
            numberOfMonths={2}
            locale={zhCN}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePicker;