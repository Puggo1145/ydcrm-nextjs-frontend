"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner";
// components
import useSpinner from "@/hooks/useSpinner";
// hooks
import { useRouter } from "next-nprogress-bar";
// utils
import PubSub from "pubsub-js";
// server actions

interface Props {
  open: boolean;
  changeOpen: (open: boolean) => void;

  object: string;
  objectId: string;
}

const DeleteCheckDialog: React.FC<Props> = ({ open, changeOpen, object, objectId }) => {
  const router = useRouter();
  const { loading, setLoading, Spinner } = useSpinner();


  async function deleteObject() {
    setLoading(true);

    try {
      const res = await fetch(`/api/data/${object}/?id=${objectId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("删除成功");

        // 删除后要带上school_id和teacher_id来刷新列表
        const data = await res.json();

        PubSub.publish(`refresh-${object}-list`, {
          school_id: data.school_id,
          teacher_id: data.teacher_id ?? null,
        });
        setTimeout(() => {
          router.push("/database");
        }, 1000);
      } else {
        const data = await res.json();
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("网络错误");
    } finally {
      setLoading(false);
      changeOpen(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={changeOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>确定要删除吗?</AlertDialogTitle>
          <AlertDialogDescription>
            该操作无法撤销，该条记录会从数据库中被永久删除
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter onClick={e => e.stopPropagation()}>
          <AlertDialogCancel>
            取消
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 hover:bg-red-700"
            onClick={deleteObject}
            disabled={loading}
          >
            {loading ? <Spinner size="default" className="text-white" /> : "确认"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteCheckDialog;