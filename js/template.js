function loadJson() {
    var table = document.getElementById("table");
    var tbody = document.createElement("tbody");
    var tbodyTd = {};

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            var res = JSON.parse(xhr.responseText);
            console.log(res);
            for (let i = 0; i < res.length; i++) {
                console.log(res[i].GPIO + " " + res[i].Input + " " + res[i].ID);
                var tbodyTr = document.createElement("tr");

                for (let j = 0; j < 1; j++) {
                    tbodyTd[j] = document.createElement("td");
                    if (res[i].GPIO === 9 || res[i].GPIO === 10) {
                        tbodyTd[j].setAttribute("style", "color: #d43535;");
                    }
                    tbodyTd[j].innerHTML = `<b class="gpio" id="gpio${res[i]["GPIO"]}">GPIO ${res[i]["GPIO"]}</b>`;
                    tbodyTr.appendChild(tbodyTd[j]);
                }
                for (let j = 0; j < 1; j++) {
                    tbodyTd[j] = document.createElement("td");
                    tbodyTd[j].innerHTML = `<select class="gpioType" name="typeGPIO${res[i]["GPIO"]}" id="typeGPIO${res[i]["GPIO"]}">
                    <option value="None" selected>None</option>
                    <option value="Led">Led</option>
                    <option value="DS18b20">DS18b20</option>
                    <option value="Button">Button</option>
                    <option value="Switch">Switch</option>
                    </select>`;
                    tbodyTr.appendChild(tbodyTd[j]);
                }
                for (let j = 0; j < 1; j++) {
                    tbodyTd[j] = document.createElement("td");
                    tbodyTd[j].innerHTML = `<select class="gpioNbr" name="nbrGPIO${res[i]["GPIO"]}" id="nbrGPIO${res[i]["GPIO"]}">
                    <option value="1" selected>1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    </select>`;



                    tbodyTr.appendChild(tbodyTd[j]);
                    tbodyTd[j].value = res[i].ID;
                }
                tbody.appendChild(tbodyTr);

            }
            table.appendChild(tbody);

            let elementsArray = document.querySelectorAll(".gpioType");
            let elementsArray1 = document.querySelectorAll(".gpioNbr");
            elementsArray.forEach(function (elem, index) {
                // console.log(elem.value + " " + index);
                // console.log(res[index].Input);
                elem.value = res[index].Input;
                if (elem.value === "None") {
                    document.getElementById(((elem.id).replace("type", "nbr"))).style.visibility = "hidden";
                } else {
                    document.getElementById(((elem.id).replace("type", "nbr"))).style.visibility = "visible";
                }
                elem.addEventListener('change', function () {
                    // console.log(elem.id);
                    if (elem.value === "None") {
                        document.getElementById(((elem.id).replace("type", "nbr"))).style.visibility = "hidden";
                    } else {
                        document.getElementById(((elem.id).replace("type", "nbr"))).style.visibility = "visible";
                    }
                })
            })
            elementsArray1.forEach(function (elem, index) {
                // console.log(res[index].ID);
                if (res[index].ID != null) {
                    elem.value = res[index].ID;
                } else {
                    elem.value = "1";
                }

                elem.addEventListener('change', function () {
                    console.log(elem.id + " " + elem.value);
                    if (elem.value === "None") {
                        document.getElementById(((elem.id).replace("type", "nbr"))).style.visibility = "hidden";
                    } else {
                        document.getElementById(((elem.id).replace("type", "nbr"))).style.visibility = "visible";
                    }
                })

            })
        };
    };
    xhr.open('GET', './config/esp8266.json', true);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.send(null);
}

function loadDeviceInfo() {
    var deviceType = document.getElementById("deviceType");
    var deviceName = document.getElementById("deviceName");
    var deviceNetstat = document.getElementById("deviceNetstat");
    var templateName = document.getElementById("templateName");

    fetch(`./config/config.json`)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            let info = data;
            console.log(info);
            [info].map(function (item) {
                // #region 
                if ((typeof (deviceType) != 'undefined' && deviceType != null) &&
                    (typeof (deviceName) != 'undefined' && deviceName != null) &&
                    (typeof (deviceNetstat) != 'undefined' && deviceNetstat != null) &&
                    (typeof (templateName) != 'undefined' && templateName != null)) {
                    deviceType.innerHTML = `${item.device.type}`;
                    deviceName.innerHTML = `${item.device.name}`;
                    deviceNetstat.innerHTML = `${item.wifi.hostname}` + " (" + `${item.wifi.ipaddress}` + ")";
                    templateName.innerHTML = `${item.device.type}`;
                }
                // #endregion
            })
        })
}

function saveTemplate() {
    var table = document.getElementById("table");
    var gpio = table.getElementsByClassName('gpio');
    var gpioType = table.getElementsByClassName('gpioType');
    var gpioNbr = table.getElementsByClassName('gpioNbr');
    let output = [];
    let tmp;
    for (var i = 0; i < gpio.length; i++) {
        // console.log((gpio[i].innerHTML).replace('GPIO ', '') + " " + gpioType[i].value + " " + gpioNbr[i].value);
        tmp = {
            "GPIO": (gpio[i].innerHTML).replace('GPIO ', ''),
            "Input": gpioType[i].value,
            "ID": gpioNbr[i].value
        };
        output.push(tmp);
    }
    // console.log(output);
    var data = JSON.stringify(output);
    console.log(data);

    let xhr = new XMLHttpRequest();
    // xhr.open("POST", "/post-message");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            console.log(xhr.status);
            console.log(xhr.responseText);
            restartESP(false);
            setTimeout(function () {
                window.location.href = '/';
            }, 12000);
        }
    };

    xhr.send(data);

}

// NOTE: loading a function on pageload event
function addLoadEvent(func) {
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
        window.onload = func;
    } else {
        window.onload = function () {
            if (oldonload) {
                oldonload();
            }
            func();
        }
    }
}

// NOTE: restart ESP
function restartESP(enableConfirm) {
    var text = "Möchtest du wirklich neustarten?";
    if (enableConfirm == true) {
        if (confirm(text) == true) {
            console.log("Neustart");
            prompt("Neustart.")
            // fetch(`/restartESP`)
        } else {
            console.log("kein Neustart");
        }
    } else {
        console.log("Neustart");
        // fetch(`/restartESP`)
    }

}

addLoadEvent(loadJson);
addLoadEvent(loadDeviceInfo);