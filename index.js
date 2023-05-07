var res;
var ajaxRequest = null;
if (window.XMLHttpRequest) {
  ajaxRequest = new XMLHttpRequest();
} else {
  ajaxRequest = new ActiveXObject("Microsoft.XMLHTTP");
}

// NOTE: initialization
function loadInfo() {
  var deviceType = document.getElementById("deviceType");
  var deviceName = document.getElementById("deviceName");
  var deviceNetstat = document.getElementById("deviceNetstat");
  var deviceTypeInput = document.getElementById("deviceTypeInput");
  var deviceNameInput = document.getElementById("deviceNameInput");
  var version = document.getElementById("version");
  var build = document.getElementById("build");
  var bootCount = document.getElementById("bootCount");
  var restartReason = document.getElementById("restartReason");
  var friendlyName = document.getElementById("friendlyName");

  var ssid = document.getElementById("ssid");
  var password = document.getElementById("wifipassword");
  var dhcp = document.getElementById("dhcp");
  var ipaddress = document.getElementById("ipaddress");
  var subnetmask = document.getElementById("subnetmask");
  var hostname = document.getElementById("hostname");
  var gateway = document.getElementById("gateway");
  var dns = document.getElementById("dns");
  var macaddress = document.getElementById("macaddress");

  var mqttServer = document.getElementById("mqttServer");
  var mqttPort = document.getElementById("mqttPort");
  var mqttId = document.getElementById("mqttId");
  var mqttUsername = document.getElementById("mqttUsername");
  var mqttPassword = document.getElementById("mqttPassword");
  var mqttTopic = document.getElementById("mqttTopic");

  var espChip = document.getElementById("espChip");
  var flashSize = document.getElementById("flashSize");
  var programFlashSize = document.getElementById("programFlashSize");
  var programSize = document.getElementById("programSize");
  var freeProgramSpace = document.getElementById("freeProgramSpace");
  var freeMemory = document.getElementById("freeMemory");

  fetch(`config.json`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let info = data;
      console.log(info);
      [info].map(function (item) {
        // NOTE: header on every page
        // #region
        if (
          (typeof deviceType != "undefined" &&
            deviceType != null &&
            typeof deviceName != "undefined" &&
            deviceName != null) ||
          (typeof deviceNetstat != "undefined" && deviceNetstat != null) ||
          (typeof ipaddress != "undefined" &&
            ipaddress != null &&
            typeof hostname != "undefined" &&
            hostname != null)
        ) {
          deviceType.innerHTML = `${item.device.type}`;
          deviceName.innerHTML = `${item.device.name}`;
          deviceNetstat.innerHTML =
            `${item.wifi.hostname}` + " (" + `${item.wifi.ipaddress}` + ")";
        }
        // #endregion

        // NOTE: sets content in 'device.html'
        // #region
        if (
          typeof deviceTypeInput != "undefined" &&
          deviceTypeInput != null &&
          typeof deviceNameInput != "undefined" &&
          deviceNameInput != null
        ) {
          deviceTypeInput.value = `${item.device.type}`;
          deviceNameInput.value = `${item.device.name}`;
        }
        // #endregion

        if (window.location.pathname === "/information.html") {
          version.innerHTML = `${item.device.version}`;
          build.innerHTML = `${item.device.build}`;
          // uptime.innerHTML = `${item.device.uptime}`;
          bootCount.innerHTML = `${item.device.bootCount}`;
          restartReason.innerHTML = `${item.device.restartReason}`;
          friendlyName.innerHTML = `${item.device.name}`;

          ssid.innerHTML =
            `${item.wifi.ssid}` +
            " (" +
            `${item.wifi.signal}` +
            "%, " +
            `${item.wifi.rssi}` +
            " dBm)";
          hostname.innerHTML = `${item.wifi.hostname}`;
          macaddress.innerHTML = `${item.wifi.macaddress}`;
          ipaddress.innerHTML = `${item.wifi.ipaddress}`;
          gateway.innerHTML = `${item.wifi.gateway}`;
          subnetmask.innerHTML = `${item.wifi.subnetmask}`;
          dns.innerHTML = `${item.wifi.dns}`;

          mqttServer.innerHTML = `${item.mqtt.mqttServer}`;
          mqttPort.innerHTML = `${item.mqtt.mqttPort}`;
          mqttId.innerHTML = `${item.mqtt.mqttId}`;
          mqttUsername.innerHTML = `${item.mqtt.mqttUsername}`;
          mqttTopic.innerHTML = `${item.mqtt.mqttTopic}`;

          espChip.innerHTML = `${item.device.type}`;
          flashSize.innerHTML =
            Math.trunc(`${item.filesystem.flashSize}` / 1000) + " KB";
          programFlashSize.innerHTML =
            Math.trunc(`${item.filesystem.programFlashSize}` / 1000) + " KB";
          programSize.innerHTML =
            Math.trunc(`${item.filesystem.programSize}` / 1000) + " KB";
          freeProgramSpace.innerHTML =
            Math.trunc(`${item.filesystem.freeProgramSpace}` / 1000) + " KB";
          freeMemory.innerHTML =
            (`${item.filesystem.freeMemory}` / 1000).toFixed(1) + " KB";
        }

        // NOTE: sets WiFi information (if in 'index.html -> element.innerHTML, else everywhere -> element.value)
        // #region
        if (
          (typeof ipaddress != "undefined" &&
            ipaddress != null &&
            typeof subnetmask != "undefined" &&
            subnetmask != null &&
            typeof hostname != "undefined" &&
            hostname != null &&
            typeof gateway != "undefined" &&
            gateway != null &&
            typeof dns != "undefined" &&
            dns != null &&
            typeof macaddress != "undefined" &&
            macaddress != null &&
            typeof ssid != "undefined" &&
            ssid != null) ||
          (typeof password != "undefined" && password != null)
        ) {
          //if (window.location.pathname === "/information.html") {
          //    ipaddress.innerHTML = `${item.wifi.ipaddress}`;
          //    subnetmask.innerHTML = `${item.wifi.subnetmask}`;
          //    hostname.innerHTML = `${item.wifi.hostname}`;
          //    gateway.innerHTML = `${item.wifi.gateway}`;
          //    macaddress.innerHTML = `${item.wifi.macaddress}`;
          //    ssid.innerHTML = `${item.wifi.ssid}`;
          //    dns.innerHTML = `${item.wifi.dns}`;
          //} else {
          if (window.location.pathname === "/wifi.html") {
            ssid.value = `${item.wifi.ssid}`;
            password.value = `${item.wifi.password}`;
            ipaddress.value = `${item.wifi.ipaddress}`;
            subnetmask.value = `${item.wifi.subnetmask}`;
            hostname.value = `${item.wifi.hostname}`;
            gateway.value = `${item.wifi.gateway}`;
            dns.value = `${item.wifi.dns}`;

            if (`${item.wifi.dhcp}` === "true") {
              dhcp.checked = true;
            } else {
              dhcp.checked = false;
            }

            // dhcp.checked = `${item.wifi.dhcp}`;
            console.log(`${item.wifi.dhcp}`);
            toggleDHCP();
          }
        }
        console.log(`${item.wifi.dhcp}`);

        // #endregion

        // NOTE: sets MQTT information
        // #region
        if (
          typeof mqttServer != "undefined" &&
          mqttServer != null &&
          typeof mqttPort != "undefined" &&
          mqttPort != null &&
          typeof mqttId != "undefined" &&
          mqttId != null &&
          typeof mqttUsername != "undefined" &&
          mqttUsername != null &&
          typeof mqttPassword != "undefined" &&
          mqttPassword != null &&
          typeof mqttTopic != "undefined" &&
          mqttTopic != null
        ) {
          mqttServer.value = `${item.mqtt.mqttServer}`;
          mqttPort.value = `${item.mqtt.mqttPort}`;
          mqttId.value = `${item.mqtt.mqttId}`;
          mqttUsername.value = `${item.mqtt.mqttUsername}`;
          mqttPassword.value = `${item.mqtt.mqttPassword}`;
          mqttTopic.value = `${item.mqtt.mqttTopic}`;
        }
        // #endregion
      });
    })
    .catch(function (error) {
      console.log(error);
    });
}

// NOTE: change password visibility
function togglePwVisibility(elementId) {
  var x = document.getElementById(elementId);
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
}

// NOTE: save device information
function saveDeviceInfo() {
  if (
    typeof deviceTypeInput != "undefined" &&
    deviceTypeInput != null &&
    deviceTypeInput.value != "" &&
    typeof deviceNameInput != "undefined" &&
    deviceNameInput != null &&
    deviceNameInput.value != ""
  ) {
    alert(
      '"' +
        deviceTypeInput.value +
        '"' +
        ', "' +
        deviceNameInput.value +
        '" safed.'
    );
    setTimeout(function () {
      location.reload();
    }, 12000);
    // }
    // })
  } else {
    alert("Eingabe überprüfen");
  }
}

// NOTE: save wifi information
function saveWifi() {
  // NOTE: change SSID and password, or hostname
  // #region
  if (
    ((typeof ssid != "undefined" && ssid != null && ssid != "") ||
      (typeof password != "undefined" && password != null && password != "") ||
      (typeof hostname != "undefined" && hostname != null && hostname != "")) &&
    dhcp.checked
  ) {
    alert("Wifi Settings safed.");
    setTimeout(function () {
      location.reload();
    }, 12000);
  }
  // #endregion

  // NOTE: change DHCP, IP address, default gateway, subnetmask and DNS server
  // #region
  else if (
    !dhcp.checked &&
    typeof dhcp != "undefined" &&
    dhcp != null &&
    typeof ipaddress != "undefined" &&
    ipaddress != null &&
    ipaddress != "" &&
    typeof gateway != "undefined" &&
    gateway != null &&
    gateway != "" &&
    typeof subnetmask != "undefined" &&
    subnetmask != null &&
    subnetmask != ""
  ) {
    alert("Wifi Settings safed.");
    setTimeout(function () {
      location.reload();
    }, 12000);
  }
  // #endregion
  else {
    alert("Eingabe überprüfen");
  }
}

// NOTE: set readonly attribute if DHCP checkbox is checked
function toggleDHCP() {
  if (typeof dhcp != "undefined" && dhcp != null) {
    if (dhcp.checked) {
      ipaddress.setAttribute("readonly", true);
      subnetmask.setAttribute("readonly", true);
      gateway.setAttribute("readonly", true);
      dns.setAttribute("readonly", true);
      console.log("readonly");
    } else if (!dhcp.checked) {
      ipaddress.removeAttribute("readonly");
      subnetmask.removeAttribute("readonly");
      gateway.removeAttribute("readonly");
      dns.removeAttribute("readonly");
      console.log("editable");
    }
  }
}

// NOTE: save mqtt information
function saveMqtt() {
  // NOTE: change SSID and password, or hostname
  // #region
  if (
    typeof mqttServer != "undefined" &&
    mqttServer != null &&
    mqttServer != "" &&
    typeof mqttPort != "undefined" &&
    mqttPort != null &&
    mqttPort != "" &&
    typeof mqttId != "undefined" &&
    mqttId != null &&
    mqttId != "" &&
    typeof mqttUsername != "undefined" &&
    mqttUsername != null &&
    mqttUsername != "" &&
    typeof mqttPassword != "undefined" &&
    mqttPassword != null &&
    mqttPassword != "" &&
    typeof mqttTopic != "undefined" &&
    mqttTopic != null &&
    mqttTopic != ""
  ) {
    console.log(mqttTopic.value);
    var topic = mqttTopic.value;
    var topicNew = topic.replace("#", "%23");
    console.log(topicNew);
    alert("MQTT Settings safed.");
    setTimeout(function () {
      location.reload();
    }, 12000);
  }
  // #endregion
  else {
    alert("Eingabe überprüfen");
  }
}

// NOTE: loading a function on pageload event
function addLoadEvent(func) {
  var oldonload = window.onload;
  if (typeof window.onload != "function") {
    window.onload = func;
  } else {
    window.onload = function () {
      if (oldonload) {
        oldonload();
      }
      func();
    };
  }
}

// NOTE: update Time every second
function updateTime() {
  const time = document.getElementById("P_time");
  var d = new Date();
  var t = "";
  t = d.toLocaleTimeString();
  if (typeof time != "undefined" && time != null) {
    time.innerHTML = t;
  }
  loadState();
}

// NOTE: update temperature -> call ajaxLoad function
function updateTemp() {
  ajaxLoad("temp.csv");
}

// NOTE: set temp values
function ajaxLoad(ajaxURL) {
  var obergeschoss = document.getElementById("obergeschoss");
  var erdgeschoss = document.getElementById("erdgeschoss");
  var keller = document.getElementById("keller");
  if (
    typeof obergeschoss != "undefined" &&
    obergeschoss != null &&
    typeof erdgeschoss != "undefined" &&
    erdgeschoss != null &&
    typeof keller != "undefined" &&
    keller != null
  ) {
    if (!ajaxRequest) {
      alert("AJAX is not supported.");
      return;
    }

    ajaxRequest.open("GET", ajaxURL, true);
    ajaxRequest.onreadystatechange = function () {
      if (ajaxRequest.readyState == 4 && ajaxRequest.status == 200) {
        var ajaxResult = ajaxRequest.responseText;
        var tmpArray = ajaxResult.split("|");
        obergeschoss.innerHTML = tmpArray[0];
        erdgeschoss.innerHTML = tmpArray[1];
        keller.innerHTML = tmpArray[2];
      }
    };
    ajaxRequest.send();
  }
}

function loadJson() {
  var table = document.getElementById("table");
  var tbody = document.createElement("tbody");
  var tbodyTd = {};

  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      res = JSON.parse(xhr.responseText);
      console.log(res);
      var tbodyTr = document.createElement("tr");
      for (const [key, value] of Object.entries(res)) {
        console.log(`${key}: ${value}`);
        tbodyTd[1] = document.createElement("td");
        tbodyTd[1].innerHTML = `<h1 id="state${key}" class="state">OFF</h1><p class="p center">
                    <label for="${key}" class="checkboxbutton">Toggle ${key.replace(
          "Switch",
          ""
        )}</label>
                    <input type="checkbox" id="${key}" class="visually-hidden">
                </p>`;
        tbodyTr.appendChild(tbodyTd[1]);
        tbody.appendChild(tbodyTr);
      }
      table.appendChild(tbody);

      loadState();
      toggleSwitch();
    }
  };
  xhr.open("GET", "state.json", true);
  xhr.setRequestHeader("Accept", "application/json");
  xhr.send(null);
}

const loadState = () => {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      res = JSON.parse(xhr.responseText);
      // console.log(res);

      let stateElements = document.querySelectorAll(".state");
      stateElements.forEach(function (elem) {
        let stateElement = document.getElementById(elem.id);
        let state = res[elem.id.replace("state", "")];
        // console.log(state);
        if (state != state.innerHTML) {
          stateElement.innerHTML = state;
          if (state === "ON") {
            document.getElementById(
              elem.id.replace("state", "")
            ).checked = true;
          } else {
            document.getElementById(
              elem.id.replace("state", "")
            ).checked = false;
          }
          // console.log(document.getElementById(elem.id.replace('state', '')).checked)
        }
      });
    }
  };
  xhr.open("GET", "state.json", true);
  xhr.setRequestHeader("Accept", "application/json");
  xhr.send(null);
};

// window.onload = function load() {
//     window.setInterval(loadState, 1000);
// }

const toggleSwitch = () => {
  let buttonElements = document.querySelectorAll(".visually-hidden");
  buttonElements.forEach(function (elem) {
    let element = document.getElementById(elem.id);
    let stateElement = document.getElementById("state" + elem.id);
    let state;
    elem.addEventListener("click", function () {
      console.log(elem.id);
      console.log(stateElement.id);
      console.log(element.checked);
      if (element.checked) {
        stateElement.innerHTML = "ON";
        state = "ON";
      } else {
        stateElement.innerHTML = "OFF";
        state = "OFF";
      }
      fetch(`/toggle?led=${elem.id}&status=${state}`).then((response) => {
        console.log(response);
      });
    });
  });
};

// NOTE: change GPIO LED state
function toggleButton(switchId, ledId) {
  var switchButton = document.getElementById(switchId);
  var toggleValue = "";

  if (switchButton.checked) {
    console.log("On!");
    toggleValue = "on";
  } else {
    console.log("Off!");
    toggleValue = "off";
  }

  fetch(`/toggle?led=${ledId}&status=${toggleValue}`).then((response) => {
    console.log(response);
  });
}

// NOTE: restart ESP
function restartESP(enableConfirm) {
  var text = "Möchtest du wirklich neustarten?";
  if (enableConfirm == true) {
    if (confirm(text) == true) {
      alert("Gerät wird neugestartet.");
    } else {
      console.log("kein Neustart");
    }
  }
}

var myVar1 = setInterval(updateTemp, 5000);
var myVar2 = setInterval(updateTime, 1000);
addLoadEvent(loadJson);
addLoadEvent(loadInfo);
