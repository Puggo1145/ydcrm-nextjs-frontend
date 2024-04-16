"use client"

// shadcn ui
import { toast } from "sonner";
// components
import Name from "../../_components/name";
import InformationSection from "../../_components/information-section";
// hooks
import { useEffect } from "react";
import useSpinner from "@/hooks/useSpinner";
import useCurrentObject from "@/stores/databse/currentObject";
// server action
import { getSchoolDetail } from "@/actions/data/school/actions";

interface Params {
  params: {
    id: string;
  }
}

const SchoolDetailPage: React.FC<Params> = ({ params: { id } }) => {
  const { Spinner } = useSpinner({ loadByDefault: true });

  const { currentObject, setCurrentObject } = useCurrentObject();

  useEffect(() => {
    getSchool();

    return () => setCurrentObject(null);
  }, []);

  async function getSchool() {
    const res = await getSchoolDetail(id);

    if (res.ok) {
      const schoolDetail = JSON.parse(res.result);
      setCurrentObject(schoolDetail);
    } else {
      toast.error(res.error);
    }
  }

  if (!currentObject) return  <Spinner size="lg" />;

  return (
    <div className="flex flex-col gap-y-4">
      <Name type="学校">{currentObject.school_name}</Name>
      <InformationSection title="备注">
        <p className="text-foreground">{currentObject.school_remark || "暂无备注"}</p>
      </InformationSection>
    </div>
  );
};

export default SchoolDetailPage;