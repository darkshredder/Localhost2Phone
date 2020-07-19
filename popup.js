var qrcode = new QRCode(document.getElementById("qrcode"), {
  width: 100,
  height: 100,
});

const findLocalIp = (logInfo = true) =>
  new Promise((resolve, reject) => {
    window.RTCPeerConnection =
      window.RTCPeerConnection ||
      window.mozRTCPeerConnection ||
      window.webkitRTCPeerConnection;

    if (typeof window.RTCPeerConnection == "undefined")
      return reject("WebRTC not supported by browser");

    let pc = new RTCPeerConnection();
    let ips = [];

    pc.createDataChannel("");
    pc.createOffer()
      .then((offer) => pc.setLocalDescription(offer))
      .catch((err) => reject(err));
    pc.onicecandidate = (event) => {
      if (!event || !event.candidate) {
        // All ICE candidates have been sent.
        if (ips.length == 0)
          return reject("WebRTC disabled or restricted by browser");

        return resolve(ips);
      }

      let parts = event.candidate.candidate.split(" ");
      let [
        base,
        componentId,
        protocol,
        priority,
        ip,
        port,
        ,
        type,
        ...attr
      ] = parts;
      let component = ["rtp", "rtpc"];

      if (!ips.some((e) => e == ip)) ips.push(ip);

      if (!logInfo) return;

      if (attr.length) {
        for (let i = 0; i < attr.length; i += 2) {}
      }
    };
  });

function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true,
  };

  chrome.tabs.query(queryInfo, function (tabs) {
    var tab = tabs[0];
    var url = tab.url;
    callback(url);
  });
}

async function renderURL(url) {
  console.log(String(url));
  http_https = String(url).split("/")[0];
  port = String(url).split("/")[2].split(":")[1];
  const ip_addresses = await findLocalIp();
  var ip_address =
    "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!";
  for (let i = 0; i < ip_addresses.length; i += 1) {
    if (ip_address.length > ip_addresses[i].length) {
      var ip_address = ip_addresses[i];
    }
  }
  console.log(ip_address);
  final_url =
    String(http_https) + "//" + String(ip_address) + ":" + String(port);
  console.log(final_url);
  document.getElementById("text").value = final_url;
  makeCode();
}

document.addEventListener("DOMContentLoaded", function () {
  getCurrentTabUrl(function (url) {
    renderURL(url);
  });
});

function makeCode() {
  var elText = document.getElementById("text");
  if (!elText.value) {
    alert("Input a text");
    elText.focus();
    return;
  }

  qrcode.makeCode(elText.value);
}
$("#text")
  .on("blur", function () {
    makeCode();
  })
  .on("keydown", function (e) {
    if (e.keyCode == 13) {
      makeCode();
    }
  });

// makeCode();
