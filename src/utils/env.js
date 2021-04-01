/**
 *  基础路径
 */
let baseUrl, baseHost, baseWs

if (process.env.NODE_ENV === "development") {
    // baseUrl = "http://192.168.0.75:9093/userCenter"; // qw
    baseUrl = "http://customer.bxyun.cn";
    // baseUrl = "http://192.168.0.196:9093/userCenter" //lb
    // baseHost = "http://cscustomer.bxyun.cn/userCenter"
    // baseHost = "http://customer.bxyun.cn"
} else if (process.env.NODE_ENV === "production") {
    // baseUrl = "http://customer.bxyun.cn";
    // baseHost = "http://customer.bxyun.cn"
    baseUrl = "http://customer.bxyun.cn";
    // baseHost = "http://cscustomer.bxyun.cn/userCenter"
}
export {
    baseUrl,
    baseHost,
    baseWs
}