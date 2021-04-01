import {
    get,
    post
} from "@/utils/request"

// 获取订单列表
export const getOrderList = (page, limit, orderNumber, orderStatus, orderType, startTime, endTime) => get(`/api/order/getOrderList?page=${page}&limit=${limit}&orderNumber=${orderNumber}&orderStatus=${orderStatus}&orderType=${orderType}&startTime=${startTime}&endTime=${endTime}`)

// 获取订单详情
export const getOrderDetails = (orderNumber) => get(`/api/order/getOrderDetails?orderNumber=${orderNumber}`)

// 获取二维码
export const getQrCode = (orderNumber) => get(`/api/order/getQrCode?orderNumber=${orderNumber}`)

//导出订单明细
export const downLoadOrderExport = (orderNumber, orderStatus, orderType, startTime, endTime) => get(`/api/export/downLoadOrderExport?orderNumber=${orderNumber}&orderStatus=${orderStatus}&orderType=${orderType}&startTime=${startTime}&endTime=${endTime}`)