export const getNginxInfo = function() {
  return {
    code: 200,
    message: "查询成功",
    flag: true,
    data: {
      id: "10717225855999192",
      productId: "10618154808999002",
      localNames: [],
      realmName: ["demo333.sheyy.co", "demo444.sheyy.co"],
      type: 1,
      ipTypes: [
        { ip: "119.97.150.15:9100", type: "web", ipType: 1, ableStatus: 1 },
      ],
      remark: "证书测试",
      portNum: "",
      originPrivkey: "",
      originFullchain: "",
      multiplexId: "",
      recordLine: null,
      redirect: 0,
      redirectType: 1,
      redirectUrl: "",
      prohibit: false,
    },
  };
};
