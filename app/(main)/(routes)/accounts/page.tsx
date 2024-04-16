"use client"

import { AccountTable } from "./_components/account-table";
import { columns } from './_components/columns';
// utils
import { toast } from "sonner";
import useSpinner from "@/hooks/useSpinner";
import PubSub from "pubsub-js";
// hooks
import { useState, useEffect } from "react";
// server action
import { getAllUsers } from "@/actions/account/actions";
// types
import type { User } from "@/types/modelType/user";

const Page: React.FC = () => {
    const { loading, setLoading, Spinner } = useSpinner();

    const [accounts, setAccounts] = useState<User[]>([]);

    async function getAccounts() {
        setLoading(true);

        try {
            const res = await getAllUsers();

            if (res.ok) {
                const users = JSON.parse(res.users) as User[];
                setAccounts(users);
            } else {
                toast.error("加载失败：" + res.error);
            }
        } catch (err) {
            toast.error("获取账号列表失败");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getAccounts();

        const token = PubSub.subscribe("refresh-account-list", () => getAccounts());

        return () => {
            PubSub.unsubscribe(token)
        };
    }, []);

    return (
        <div className="h-full p-4">
            {
                loading ?
                <div className="w-full h-full flex items-center justify-center">
                    {<Spinner size="lg"/>}
                </div> 
                :
                <AccountTable columns={columns} data={accounts} />
            }
        </div>
    );
};

export default Page;