import { toast } from "sonner";

async function request(url: string, options = {}) {
    const timeout = 8000;

    const controller = new AbortController();
    const id = setTimeout(() => {
        controller.abort();
        toast.error('请求超时，请检查网络连接');
    }, timeout);

    const response = await fetch(url, {
        ...options,
        signal: controller.signal
    });
    clearTimeout(id);
    return response;
}

export default request;