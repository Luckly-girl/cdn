import {
    get,
    post
} from "@/utils/request"

//购买服务
export const saveOrCalcWafMoney = (data) => post(`/api/waf/saveOrCalcWafMoney?`,
    data
)


//获取waf列表
export const queryRealmStatus = () => get(`/api/waf/queryRealmStatus`)

//获取剩余域名次数
export const queryRealmNum = (realmName) => get(`/api/waf/queryRealmNum?realmName=${realmName}`)

//修改域名状态
export const updateRealmStatus = (realmName, index, status) => get(`/api/waf/updateRealmStatus?realmName=${realmName}&index=${index}&status=${status}`)

//安全策略---查询waf开启列表
export const queryErrWafconf = (page, limit, id, type) => get(`/api/waf/queryErrWafconf?page=${page}&limit=${limit}&id=${id}&type=${type}`)

//修改waf阻挡结果
export const updateWafOnOff = (siteId, type, onOff) => get(`/api/waf/updateWafOnOff?siteId=${siteId}&type=${type}&onOff=${onOff}`)

//修改waf表格数据状态
export const updateWafconf = (id, onOff) => get(`/api/waf/updateWafconf?id=${id}&onOff=${onOff}`)