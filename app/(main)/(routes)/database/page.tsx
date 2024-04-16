"use client"

// shadcn components
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import {
  Card,
} from "@/components/ui/card";
// components
import DatabaseHeader from "./_components/database-header";
import SchoolList from "./_components/school-list";
import TeacherList from "./_components/teacher-list";
import StudentList from "./_components/student-list";
// hooks
import { useEffect, useRef } from "react";
import { useMediaQuery } from "usehooks-ts";
// stores
import useSelectedSchool from "@/stores/databse/selectedSchool";
import useSelectedTeacher from "@/stores/databse/selectedTeacher";
// types
import type { ImperativePanelHandle } from "react-resizable-panels";


const DatabasePage: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const { selectedSchool } = useSelectedSchool();
  const { selectedTeacher } = useSelectedTeacher();

  const schoolListRef = useRef<ImperativePanelHandle>(null);
  const teacherListRef = useRef<ImperativePanelHandle>(null);
  const studentListRef = useRef<ImperativePanelHandle>(null);


  // 监听学校的选中对象，处理 resizeble 的宽度
  useEffect(() => {
    const schoolList = schoolListRef.current;
    const teacherList = teacherListRef.current;

    if (selectedSchool && !selectedTeacher) {
      schoolList?.resize(50);
      teacherList?.resize(50);
    } else if (selectedSchool && selectedTeacher) {
      schoolList?.resize(33);
      teacherList?.resize(33);
    } else {
      schoolList?.resize(100);
      teacherList?.resize(0);
    }
  }, [selectedSchool, selectedTeacher]);

  return (
    <div className="h-full flex flex-col">
      <section className="px-2 pb-4">
        <DatabaseHeader />
      </section>
      <Card className="h-full">
        <ResizablePanelGroup direction={isMobile ? "vertical" : "horizontal"}>
          {/* school list panel */}
          <ResizablePanel
            minSize={10}
            className="relative h-full flex flex-col transition-all duration-500"
            ref={schoolListRef}
          >
            <div className="p-4 border-b flex items-center justify-between">
              <h1 className="text-lg font-bold">学校</h1>
            </div>
            <SchoolList />
          </ResizablePanel>

          <ResizableHandle className="w-1 md:w-4" />

          {/* teacher list panel */}
          <ResizablePanel
            className="relative flex flex-col transition-all duration-500"
            ref={teacherListRef}
          >
            <div className="p-4 border-b flex items-center justify-between">
              <h1 className="text-lg font-bold">班主任</h1>
            </div>
            <TeacherList />
          </ResizablePanel>

          <ResizableHandle className="w-1 md:w-4" />

          {/* student list panel */}
          <ResizablePanel
            className="relative flex flex-col transition-all duration-500"
            ref={studentListRef}
          >
            <div className="p-4 border-b flex items-center justify-between">
              <h1 className="text-lg font-bold">学生</h1>
            </div>
            <StudentList />
          </ResizablePanel>

        </ResizablePanelGroup>
      </Card>
    </div>
  );
};

export default DatabasePage;