// import request from "@/utils/request";

import {
  get,
  post
} from "@/utils/request";

export default {
  // 查询 下拉框 当前用户所管理的系统用户信息
  getUsers() {
    return get(`/api/user/getUsers`);
  },

  // 获取产品下拉框列表
  getProductList(type) {
    return get(`/api/nginx/getProductList?type=${type}`);
  },

  // 获取转移记录列表
  getTransferList(page, limit) {
    return get(`/api/transfer/getTransferList?page=${page}&limit=${limit}`);
  },

  // 获取日志封禁记录列表
  getLogBanList(page, limit, banType, banStatus, nginxName) {
    return get(
      `/api/logBan/getLogBanList?page=${page}&limit=${limit}&banType=${banType}&banStatus=${banStatus}&nginxName=${nginxName}`
    );
  }
};

export const showCdnBuyPrice = (place, billingMethod) =>
  get(
    `/api/opencdn/showCdnBuyPrice?place=${place}&billingMethod=${billingMethod}`
  );

export const calcAfterFeeOrBuy = data =>
  get(
    `/api/opencdn/calcAfterFeeOrBuy?place=${data.place}&billingMethod=${data.billingMethod}&flow=${data.flow}&flowUnit=${data.flowUnit}&dateNum=${data.dateNum}&dateUnit=${data.dateUnit}`
  );

export const calcFlowPackageOrBuy = data =>
  get(
    `/api/opencdn/calcFlowPackageOrBuy?ccsId=${data.ccsId}&num=${data.num}&isBuy=${data.isBuy}&calcTime=${data.calcTime}&maxFlow=${data.maxFlow}`
  );

export const showCdnFlowPackageBuyPrice = () =>
  get(`/api/opencdn/showCdnFlowPackageBuyPrice`);

export const addOpenCdn = () => get(`/api/opencdn/addOpenCdn`);

export const recharge = data => post(`/api/payment/recharge`, data);

export const getOrderStateByOrderNumber = (data) => get(`/api/order/getOrderStateByOrderNumber?orderNumber=${data.orderNumber}`);

//充值余额
export const queryAmount = () => get(`/api/apiAmountUser/queryAmount`)

//点击cdn
export const queryOpenCdn = () => get(`/api/nginx/queryOpenCdn`);