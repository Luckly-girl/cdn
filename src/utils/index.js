export function timeFormate(timeStamp) {
  let year = new Date(timeStamp).getFullYear();
  let month =
    new Date(timeStamp).getMonth() + 1 < 10
      ? "0" + (new Date(timeStamp).getMonth() + 1)
      : new Date(timeStamp).getMonth() + 1;
  let date =
    new Date(timeStamp).getDate() < 10
      ? "0" + new Date(timeStamp).getDate()
      : new Date(timeStamp).getDate();
  let h =
    new Date(timeStamp).getHours() < 10
      ? "0" + new Date(timeStamp).getHours()
      : new Date(timeStamp).getHours();
  let m =
    new Date(timeStamp).getMinutes() < 10
      ? "0" + new Date(timeStamp).getMinutes()
      : new Date(timeStamp).getMinutes();
  let s =
    new Date(timeStamp).getSeconds() < 10
      ? "0" + new Date(timeStamp).getSeconds()
      : new Date(timeStamp).getSeconds();

  return year + "-" + month + "-" + date + " " + h + ":" + m + ":" + s;
}

//深拷贝
export function deepCopy(obj) {
  let arr = Array.isArray(obj) ? [] : {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] == "object" && typeof obj[key] != null) {
        arr[key] = deepCopy(obj[key]);
      } else {
        arr[key] = obj[key];
      }
    }
  }

  return arr;
}
