function decodeUnicode(str) {
  // Going backward: from byte-stream to percent-encoding, to original string.
  return decodeURIComponent(
    atob(str)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
}

export function decodeToken() {
  const token = localStorage.getItem("token");

  if (token == null) {
    return null;
  }

  var info = token.split(".")[1];

  while (info.length % 4 != 0) {
    info += "=";
  }

  var decoded = JSON.parse(decodeUnicode(info));

  const timestamp = Math.floor(Date.now() / 1000);

  if (timestamp >= decoded.exp) {
    localStorage.removeItem("token");
    return null;
  }

  delete decoded.iat;
  delete decoded.exp;
  delete decoded.iss;

  console.log(decoded);

  return decoded;
}
