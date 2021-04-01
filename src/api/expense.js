import {
    get,
    post
} from "@/utils/request"

// 获取费用账单
export const getExpenseBill = (timeType = 0, month) => get(`/api/bill/getExpenseBill?timeType=${timeType}&month=${month}`)

// 获取验证码
export const getVerifyCode = () => get('/api/verifyCode/getVerifyCode')

// 费用账单导出接口
export const downLoadExpenseBillExport = (startTime, endTime, verifyCode) => get(`/api/export/downLoadExpenseBillExport?startTime=${startTime}&endTime=${endTime}&verifyCode=${verifyCode}`)

// 查询导出记录列表接口
export const getExportList = (page, limit, fileType) => get(`/api/export/getExportList?page=${page}&limit=${limit}&fileType=${fileType}`)

//导出记录下载时间
export const updateDownloadTime = (id) => post(`/api/export/updateDownloadTime`, {
    id
})

//费用中心余额信息
export const queryMyAmount = () => get(`/api/apiAmountUser/queryMyAmount`)

//充值余额
export const queryAmount = () => get(`/api/apiAmountUser/queryAmount`)

//月度账单
export const queryMyMonthBillList = () => get(`/api/bill/queryMyMonthBillList?`)

//待支付列表
export const getOrderList = (page, limit, orderStatus) => get(`/api/order/getOrderList?page=${page}&limit=${limit}&orderStatus=${orderStatus}`)

//预警设置
export const modifyAlertStatus = (alarmEnabled, thresholdAmount) => post(`/api/apiAmountUser/modifyAlertStatus`, {
    alarmEnabled,
    thresholdAmount
})

//充值
export const recharge = (amount, type) => post(`/api/payment/recharge`, {
    amount,
    type
})

//提现
export const getWithdrawalAmount = () => get(`/api/apiAmountUser/getWithdrawalAmount`)

//提现列表
export const getWithdrawalRecordList = (page, limit, startTime, endTime, withdrawalNumber) => get(`/api/withdrawalRecord/getWithdrawalRecordList?page=${page}&limit=${limit}&startTime=${startTime}&endTime=${endTime}&withdrawalNumber=${withdrawalNumber}`)

//申请提现
export const saveWithdrawalRecord = (withdrawal, receivingBank, withdrawalAccountNumber, withdrawalPhone, chargeAmount, userId, md5Code) => post(`/api/withdrawalRecord/saveWithdrawalRecord`, {
    withdrawal,
    receivingBank,
    withdrawalAccountNumber,
    withdrawalPhone,
    chargeAmount,
    userId,
    md5Code
})

// 获取收支列表
export const getRevenueAndExpenseList = (page, limit, billNumber, none = false, startTime, endTime, transactionType, tradingChannels = '', amountType, timeType) => get(`/api/bill/getRevenueAndExpenseList?page=${page}&limit=${limit}&billNumber=${billNumber}&none=${none}&startTime=${startTime}&endTime=${endTime}&transactionType=${transactionType}&tradingChannels=${tradingChannels}&amountType=${amountType}&timeType=${timeType}`)

// 汇总入账金额,出账金额
export const getTotalAmount = (billNumber, none = false, startTime, endTime, transactionType, tradingChannels = '', amountType, timeType) => get(`/api/bill/getTotalAmount?billNumber=${billNumber}&none=${none}&startTime=${startTime}&endTime=${endTime}&transactionType=${transactionType}&tradingChannels=${tradingChannels}&amountType=${amountType}&timeType=${timeType}`)

// 收支明细导出接口
export const downLoadRevenueExpenseExport = (billNumber, none = false, startTime, endTime, transactionType, tradingChannels = '', amountType, timeType) => get(`/api/export/downLoadRevenueExpenseExport?billNumber=${billNumber}&none=${none}&startTime=${startTime}&endTime=${endTime}&transactionType=${transactionType}&tradingChannels=${tradingChannels}&amountType=${amountType}&timeType=${timeType}`)

//证书明细导出接口
export const downCertDetails = (value) => get(`/api/export/downCertDetails?value=${value}`)