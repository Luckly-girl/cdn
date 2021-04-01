import {
    get,
    post
} from "@/utils/request"

//续费状态
export const getRenewCounts = (expirationDate) => get(`/api/renew/getRenewCounts?expirationDate=${expirationDate}`)

//续费列表
export const getRenewList = (page, limit, expirationDate, renewalType) => get(`/api/renew/getRenewList?page=${page}&limit=${limit}&expirationDate=${expirationDate}&renewalType=${renewalType}`)