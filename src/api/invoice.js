import {
    get,
    post
} from "@/utils/request"

// 获取发票列表信息
export const getInvoiceManagementList = (page, limit, billingState) => get(`/api/invoiceManagement/getInvoiceManagementList?page=${page}&limit=${limit}&billingState=${billingState}`)
// 获取发票详情操作
export const getInvoiceDetails = (invoiceId) => get(`/api/invoiceManagement/getInvoiceDetails?invoiceId=${invoiceId}`)
// 获取可申请发票列表信息
export const getTobeInvoiceManagementList = (page, limit, orderNumber, startTime, endTime) => get(`/api/invoiceManagement/getTobeInvoiceManagementList?page=${page}&limit=${limit}&orderNumber=${orderNumber}&startTime=${startTime}&endTime=${endTime}`)
// 获取可申请发票列表信息
export const applyInvoiceInformation = (data) => post('/api/invoiceManagement/applyInvoiceInformation', data)




// 申请发票下一步
export const getBillingInformationAndMailingAddress = (invoiceIds = '') => get(`/api/invoiceManagement/getBillingInformationAndMailingAddress?invoiceIds=${invoiceIds}`)

// 获取发票信息
export const getBillingInformation = () => get(`/api/invoiceManagement/getBillingInformation`)

// 获取邮寄地址
export const getMailingAddress = () => get(`/api/invoiceManagement/getMailingAddress`)


// 新增/编辑开票信息
export const setBillingInformation = (data) => post('/api/billingInformation/setBillingInformation', data)



// 获取寄送地址列表
export const getMailingAddressList = () => get('/api/mailingAddress/getMailingAddressList')
// 新增/编辑寄送地址
export const setMailingAddress = (data) => post('/api/mailingAddress/setMailingAddress', data)
// 设置默认寄送地址
export const setDefaultMailingAddress = (id) => post('/api/mailingAddress/setDefaultMailingAddress', {
    id
})
// 删除寄送地址
export const delMailingAddress = (id) => post('/api/mailingAddress/delMailingAddress', {
    id
})