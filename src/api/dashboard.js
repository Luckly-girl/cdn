import {
    get,
    post
} from "@/utils/request"

// 获取域名管理列表
export const getDailyBill = () => get(`/api/bill/getDailyBill?`)