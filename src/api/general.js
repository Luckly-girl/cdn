import {
    get,
    post
} from "@/utils/request"

// 获取流量包管理列表
export const getFlowPacketList = (page, limit) => get(`/api/flowPacket/getFlowPacketList?page=${page}&limit=${limit}`)

//概览
export const getOverView = (timeType, groupId, realmNames, type) => get(`/api/overview/getOverView?timeType=${timeType}&groupId=${groupId}&realmNames=${realmNames}&type=${type}`)

//数据中心柱状图
export const getOverViewCountryVo = (timeType, groupId, realmNames, type) => get(`/api/overview/getOverViewCountryVo?timeType=${timeType}&groupId=${groupId}&realmNames=${realmNames}&type=${type}`)

//筛选分组
export const queryGroupName = () => get(`/api/SiteGroupName/queryGroupName?`)

//筛选域名
export const getDomainNameByGroup = (group) => get(`/api/nginx/getDomainNameByGroup?group=${group}`)