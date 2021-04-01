export const cacheConfData = function() {
  return {
    code: 200,
    message: "OK",
    flag: true,
    data: {
      total: 0,
      rows: [
        {
          cacheTypes: "php;.jsp;.asp;.aspx",
          cacheTime: "2020-2-22 19:00:00",
          siteId: "1000225",
          lastTime: "2020-2-22 20:00:00",
          cacheTimeType: "1",
          id: 1,
        },
        {
            cacheTypes: "php;.jsp;.asp;.aspx",
            cacheTime: "2020-2-22 19:00:00",
            siteId: "1000225",
            lastTime: "2020-2-22 20:00:00",
            cacheTimeType: "1",
            id: 2,
        },
      ],
    },
  };
};
