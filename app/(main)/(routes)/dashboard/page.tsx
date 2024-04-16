"use client"

// shadcn
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
// hooks
import { useState } from "react";
// components
// import DatePicker from "./_components/date-picker";
import GeneralInfo from "./_components/general-info";
import RecentSales from "./_components/recent-sales";
import Statistics from "./_components/statistics";
import RecentTasks from "./_components/recent-tasks";

const Dashboard: React.FC = () => {
  const [object, setObject] = useState<'student' | 'teacher'>('student');

  return (
    <div className="flex flex-col gap-y-4 h-full p-4 md:p-8">
      <section className="flex justify-between items-center gap-x-8">
        <h1 className="hidden text-xl md:text-3xl sm:block font-bold whitespace-nowrap">
          {object === 'student' ? '学生' : '班主任'}
          数据总览
        </h1>
        <Select value={object} onValueChange={val => setObject(val as 'student' | 'teacher')} >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="student">学生</SelectItem>
            <SelectItem value="teacher">班主任</SelectItem>
          </SelectContent>
        </Select>
        {/* <DatePicker className="w-full md:w-[300px]" /> */}
      </section>
      <section>
        <GeneralInfo object={object} />
      </section>
      <section className="w-full grid grid-cols-4 gap-4 blur-md">
        <div className="col-span-4 md:col-span-2 xl:col-span-3">
          <Statistics />
        </div>
        <div className="col-span-4 md:col-span-2 xl:col-span-1">
          <RecentSales />
        </div>
      </section>
      <section>
        <RecentTasks />
      </section>
    </div>
  );
};

export default Dashboard;