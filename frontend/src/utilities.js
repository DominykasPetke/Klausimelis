const baseAPIURL = import.meta.env.VITE_API_BASE_URL;

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

async function refreshToken() {
  const token = localStorage.getItem("token");

  return fetch(baseAPIURL + "/login", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + (token == null ? "" : token),
    },
  })
    .then((res) => {
      // a non-200 response code
      if (!res.ok) {
        // create error instance with HTTP status text
        const error = new Error(res.statusText);
        error.json = res.json();
        throw error;
      }

      const ret = res.json();
      return ret;
    })
    .then((json) => {
      localStorage.setItem("token", json.token);
    });
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

  if (timestamp >= decoded.exp - 30 * 60) {
    refreshToken();
  }

  delete decoded.iat;
  delete decoded.exp;
  delete decoded.iss;

  return decoded;
}

export function isAdmin() {
  const token = decodeToken();

  return token != null && token.role >= 2;
}

export function isCorrectTeacher(id) {
  const token = decodeToken();

  return (
    token != null && (token.role >= 2 || (token.role >= 1 && token.id == id))
  );
}
