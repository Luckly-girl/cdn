import store from "@/store";

/**
 * 将时间戳 转换成 固定格式时间 2019-12-19 10:01:20
 * @param {*} time 时间戳
 */
const dateFilter = (time) => {
    if (!time) return '- -'
    let date = new Date(time); //时间戳为10位需*1000，时间戳为13位的话不需乘1000

    // console.log(date)

    let year = date.getFullYear();
    let month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    let h = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    let m = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    let s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

    return year + "-" + month + "-" + day + " " + h + ":" + m + ":" + s;

}

const msgContentFilter = (Content) => {
    let arr = Content.split('，')
    return arr.join('<br>')
}

const recordLineFilter = (status) => { // 线路类型
    if (status == undefined) return '--'
    else return store.state.recordLineList[status]
}

const parseTypeFilter = (status) => { // 解析操作类型
    if (status == undefined) return '--'
    else return store.state.parseTypeList[status]
}

const workTypeFilter = (type) => { // 工单类型
    if (type == undefined) return '--'
    else return store.state.workTypeList[type]
}

const workStatusFilter = (status) => { // 工单类型
    if (status == undefined) return '--'
    else return store.state.workStatusList[status]
}

const productTypeFilter = (status) => { // 节点类型
    if (status == undefined) return '--'
    else {
        let _type = store.state.productType.filter(item => {
            return item.code === status
        })
        return _type[0].type
    }
}

const billingTypeFilter = (type) => { // 开票类型
    if (type == undefined) return '--'
    else return store.state.billingTypeList[type]
}

const invoiceTypeFilter = (type) => { // 发票类型
    if (type == undefined) return '--'
    else return store.state.invoiceTypeList[type]
}

const billingStateFilter = (status) => { // 发票类型
    if (status == undefined) return '--'
    else return store.state.billingStateList[status]
}

const contractStatusFilter = (status) => { // 发票类型
    if (status == undefined) return '--'
    else return store.state.contractStatusList[status]
}

const fileTypeFilter = (type) => { // 导出状态
    if (type == undefined) return '--'
    else return store.state.fileTypeList[type]
}

const fileStatusFilter = (status) => { // 导出类型
    if (status == undefined) return '--'
    else return store.state.fileStatusList[status]
}

const transactionTypeFilter = (type) => { // 交易类型
    if (type == undefined) return '--'
    else return store.state.transactionTypeList[type]
}

const tradingChannelsFilter = (type) => { // 交易渠道
    if (type == undefined) return '--'
    else return store.state.tradingChannelsList[type].text
}

const orderStatusFilter = (status) => { // 订单状态
    if (status == undefined) return '--'
    else return store.state.orderStatusList[status].text
}

const orderTypeFilter = (type) => { // 订单类型
    if (type == undefined) return '--'
    else return store.state.orderTypeList[type].text
}

const purchaseMethodFilter = (type) => { // 购买方式
    if (type == undefined) return '--'
    else return store.state.purchaseMethodList[type]
}

const applyStatusFilter = (type) => { // 证书状态
    if (type == undefined) return '--'
    else return store.state.applyStatusList[type]
}

const withdrawalStateFilter = (type) => { // 提现状态
    if (type == undefined) return '--'
    else return store.state.withdrawalStateList[type]
}
const flowPacketStateFilter = (type) => { // 流量包状态
    if (type == undefined) return '--'
    else return store.state.flowPacketStateList[type].text
}

const nginxStateFilter = (status) => { // 域名管理状态
    if (status == undefined) return '--'
    else return store.state.nginxStateList[status].text
}

const businessTypeFilter = (type) => { // 业务类型
    if (type == undefined) return '--'
    else return store.state.businessTypeList[type].text
}

const httpsSetListFilter = (type) => { // HTTPS配置
    if (type == undefined) return '--'
    else return store.state.httpsSetList[type].text
}

const sourceListFilter = (type) => { // 回源协议
    if (type == undefined) return '--'
    else return store.state.sourceList[type].text
}

const serveLocalListFilter = (type) => { // 服务地域
    if (type == undefined) return '--'
    else return store.state.serveLocalList[type].text
}

const purchListFilter = (type) => { // 申请合同购买
    if (type == undefined) return '--'
    else return store.state.purchList[type].text
}
export {
    dateFilter,
    msgContentFilter,
    parseTypeFilter,
    recordLineFilter,
    workTypeFilter,
    workStatusFilter,
    productTypeFilter,
    billingTypeFilter,
    invoiceTypeFilter,
    billingStateFilter,
    contractStatusFilter,
    fileTypeFilter,
    fileStatusFilter,
    transactionTypeFilter,
    tradingChannelsFilter,
    orderStatusFilter,
    orderTypeFilter,
    purchaseMethodFilter,
    nginxStateFilter,
    businessTypeFilter,
    httpsSetListFilter,
    sourceListFilter,
    purchListFilter,
    serveLocalListFilter,
    applyStatusFilter,
    withdrawalStateFilter,
    flowPacketStateFilter
}