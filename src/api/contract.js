import {
    get,
    post
} from "@/utils/request"

// 获取合同管理列表
export const getContractList = (page, limit, contractStatus) => get(`/api/contract/getContractList?page=${page}&limit=${limit}&contractStatus=${contractStatus}`)

// 修改合同状态操作
export const setContractStatus = (contractStatus, id, cancellationReason = '') => post('/api/contract/setContractStatus', {
    contractStatus,
    id,
    cancellationReason
})

// 修改合同备注信息
export const updateContractRemark = (id, remark = '') => post('/api/contract/updateContractRemark', {
    id,
    remark
})

// 获取可申请合同列表信息
export const getTobeContractList = (page, limit, orderNumber, startTime, endTime) => get(`/api/contract/getTobeContractList?page=${page}&limit=${limit}&orderNumber=${orderNumber}&startTime=${startTime}&endTime=${endTime}`)

// 申请合同下一步
export const getTobeContract = (managements = '') => get(`/api/contract/getTobeContract?managements=${managements}`)

// 申请合同操作
export const applyContract = (data) => post('/api/contract/applyContract', data)