import {
    get,
    post
} from "@/utils/request"

// 获取证书列表
export const getCertInfoByUserId = (page, limit, value) => get(`/api/site/getCertInfoByUserId?page=${page}&limit=${limit}&value=${value}`)

//上传证书
export const saveCertContent = (data) => post(`/api/site/saveCertContent`,data)