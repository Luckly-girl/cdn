import {
    get,
    post
} from "@/utils/request"

// 获取域名管理列表
export const querySiteByCondition = (page, limit, realmName, sslStatus, nginxState, businessType, groupName, quickenArea, type) => get(`/api/site/querySiteByCondition?page=${page}&limit=${limit}&realmName=${realmName}&sslStatus=${sslStatus}&nginxState=${nginxState}&businessType=${businessType}&groupName=${groupName}&quickenArea=${quickenArea}&type=${type}`)

//查询域名分组
export const queryGroupName = () => get(`/api/SiteGroupName/queryGroupName?`)

//启用状态
export const updateDnsSiteParse = (siteId, parseOnoff) => get(`/api/site/updateDnsSiteParse?siteId=${siteId}&parseOnoff=${parseOnoff}`)

//删除域名信息
export const deleteNginxInfo = (id) => post(`/api/nginx/deleteNginxInfo?`,{id})

//新建分组
export const addGroupName = (groupName) => get(`/api/SiteGroupName/addGroupName?groupName=${groupName}`)

//导出域名信息
export const exportSiteInfo = (realmName, sslStatus, nginxState, businessType, groupName, quickenArea, type) => get(`/api/export/exportSiteInfo?realmName=${realmName}&sslStatus=${sslStatus}&nginxState=${nginxState}&businessType=${businessType}&groupName=${groupName}&quickenArea=${quickenArea}&type=${type}`)

//添加域名
export const addNginxInfo = (data) => post(`/api/site/addNginxInfo`, data)

//未部署
export const deployNginxFile = (nginxId) => post(`/api/nginx/deployNginxFile`, {nginxId})

//部署失败
export const updateNginxDeployStatus = (nginxId) => post(`/api/site/updateNginxDeployStatus`, {nginxId})

//复制配置
export const addNginxInfoNew = (data) => post(`/api/site/addNginxInfoNew`, data)
