"use client"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
// components
import CreateAccountForm from "./create-account-form";
// hooks
import { useState } from "react";

const CreateAccount: React.FC = () => {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button>
          <Plus />
          创建账号
        </Button>
      </SheetTrigger>

      <SheetContent>
        <SheetHeader>
          <SheetTitle>创建一个账号</SheetTitle>
          <SheetDescription>
            请慎重选择该账号的权限，管理员及以上的账号拥有对数据库的控制权<br />
            账号自创建起将不允许修改权限
          </SheetDescription>
        </SheetHeader>
        <div>
          <CreateAccountForm setSheetOpen={setSheetOpen} />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CreateAccount;