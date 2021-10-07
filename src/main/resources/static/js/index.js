let vanillaCalendar = null;

$(function () {
    loginUser = $("#username").val();

    vanillaCalendar = getCalendarInstance();
    vanillaCalendar.init({});

    $("#prevDate").click(function () {
        moveTo(sideDate(-1));
    });
    $("#nextDate").click(function () {
        moveTo(sideDate(1));
    });

    loadData($("#current_date").text());
    connect();

    setInterval(function() {
        $(".toast.fade.hide").remove();
    }, 5000);
});

function sideDate(dir) {
    const currentDate = $("#current_date");
    const ymd = currentDate.text().split("-");

    let newDate = new Date(ymd[0], ymd[1] - 1, ymd[2]);
    newDate.setDate(newDate.getDate() + dir);

    return moment(newDate).format("yyyy-MM-DD");
}

function moveTo(nextDate) {
    const currentDate = $("#current_date b")
    currentDate.text(nextDate);

    $("#nextDate").attr("disabled", $("#today").val() === currentDate.text());
    $("#user_card").empty();
    $("#others_cards").empty();

    loadData(nextDate);
}

function loadData(date) {
    loadingAjax({
        url: "/fires",
        method: "GET",
        data: {
            date: date,
        },
        success(data) {
            loadTemplate("fire-card-template.html", (cardTemplate) => {
                appendCards(cardTemplate, data.accounts);
                loadTemplate("timeline-template.html", (fireTemplate) => {
                    appendFires(fireTemplate, data.fires);
                });
            });
        },
    })
}

function loadTemplate(template, callback) {
    loadingAjax({
        url: "/" + template,
        method: "GET",
        success(data) {
            callback(data);
        },
    })
}

function appendCards(template, accounts) {
    const myName = $("#username").val();
    const isToday = $("#current_date").text() === $("#today").val();

    accounts.forEach((account) => {
        const card = $(template.replaceAll("${username}", account.username));
        const heading = card.find("#heading_" + account.username);
        const additional = heading.find("#additional_" + account.username);
        const hasStarted = account.fireState === "START";

        if (account.username === myName) {
            heading.find("h4").text("나");

            if (isToday) {
                additional.append(switchButton(myName));
                additional.find(".switch").click(function (event) {
                    event.stopPropagation();
                });

                const toggleBtn = additional.find("#toggle_" + myName);
                toggleBtn.change(function () {
                    doFire();
                });
                toggleBtn.prop("checked", hasStarted);
            }
            $("#user_card").html(card);

        } else {
            if (isToday) {
                if (hasStarted) {
                    additional.append(onBadge());
                } else {
                    additional.append(offBadge());
                }
            }
            $("#others_cards").append(card);
        }

        if (isToday) {
            loadingAjax({
                url: "/fires/last",
                method: "GET",
                data: {
                    username: account.username,
                },
                success(data) {
                    if (data.fireType === "START") {
                        additional.prepend(startedBadge(account.username, data.fireTime));
                    }
                },
            })
        }
    });
}

function appendFires(template, fires) {
    Object.keys(fires).forEach(key => {
        fires[key].forEach(fire => {
            appendFire(template, fire, key);
        })
    });
}

function appendFire(template, fire, username) {
    const startTime = new Date(fire.fireTime);
    const endTime = new Date(fire.end.fireTime);
    const timeDiff = endTime - startTime;

    const html = template
        .replaceAll("${startTime}", moment(startTime).format("HH:mm:ss"))
        .replaceAll("${endTime}", moment(endTime).format("HH:mm:ss"))
        .replaceAll("${timeDiff}", moment.utc(timeDiff).format("HH시간 mm분 ss초"))
    $("#card_body_" + username).append(html);

    const totalTimestampNode = $("#total_timestamp_" + username);
    const totalTimestamp = parseInt(totalTimestampNode.val()) + timeDiff;

    $("#total_time_" + username).text(moment.utc(totalTimestamp).format("HH시간 mm분 ss초"));
    totalTimestampNode.val(totalTimestamp);
}

function doFire() {
    const fireState = $("#fire_state").val();
    loadingAjax({
        url: "/fires",
        method: "POST",
        success(data) {
            send(data);
        },
        error() {
            $("#toggle_" + loginUser).prop("checked", fireState === "START");
        }
    });
}

let stompClient = null;
let loginUser = null;
let loading = null;

function connect() {
    loading = $(loadingTemplate());
    $("#loadings").append(loading);
    const socket = new SockJS("/connect");
    stompClient = Stomp.over(socket);
    stompClient.debug = null;
    stompClient.connect({sender: loginUser}, onConnected, onError);
}

function onConnected(event) {
    console.log(event.command);

    stompClient.subscribe("/topic/fire/sync", onMessageReceived);
    stompClient.send("/ws/fire/sync.register", {}, JSON.stringify({sender: loginUser}));
    loading.remove();
}

function onError(error) {
    console.log(error);

    loading.remove();
    setTimeout(connect, 5000);
}

function onMessageReceived(payload) {
    payload = JSON.parse(payload.body);

    const additional = $("#additional_" + payload.sender);

    if (payload.sender !== loginUser) {
        if (payload.fire.end == null) {
            additional.html(onBadge());
        } else {
            additional.html(offBadge());
        }
    }
    if (payload.fire.end != null) {
        loadTemplate("timeline-template.html", (fireTemplate) => {
            appendFire(fireTemplate, payload.fire, payload.sender);
            $("#started_" + payload.sender).remove();
        });
    } else {
        additional.prepend(startedBadge(payload.sender, payload.fire.fireTime));
    }
}

function send(data) {
    stompClient.send("/ws/fire/sync.send", {}, JSON.stringify({fire: data.fire, sender: data.owner}));
}

// templates -------------------------------------------------------------------------------------------------------

function switchButton(username) {
    return `
      <label class="switch right">
         <input id="toggle_${username}" type="checkbox"/>
         <span class="slider round"></span>
      </label>
   `;
}

function onBadge() {
    return `
    <span class="badge badge-success">On</span>   
   `;
}

function offBadge() {
    return `
    <span class="badge badge-secondary">Off</span>
   `;
}

function startedBadge(username, time) {
    const formatTime = moment(new Date(time)).format("HH:mm:ss");
    return `
   <span id="started_${username}" class="badge badge-info" style="margin-right: 15px">` + formatTime + ` ~ </span>
   `;
}

function toastTemplate(title, content, time) {
    return `
    <div class="toast fade">
        <div class="toast-header">
            <strong class="me-auto"><i class="bi-gift-fill"></i> &nbsp;${title}</strong>
            <small>${time}</small>
            <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
        </div>
        <div class="toast-body">
            ${content}
        </div>
    </div>
    `;
}

function getCalendarInstance() {
    return {
        month: document.querySelectorAll('[data-calendar-area="month"]')[0],
        next: document.querySelectorAll('[data-calendar-toggle="next"]')[0],
        previous: document.querySelectorAll('[data-calendar-toggle="previous"]')[0],
        label: document.querySelectorAll('[data-calendar-label="month"]')[0],
        activeDates: null,
        date: new Date,
        todaysDate: new Date,
        init: function (t) {
            this.options = t, this.date.setDate(1), this.createMonth(), this.createListeners()
        },
        createListeners: function () {
            var t = this;
            this.next.addEventListener("click", function () {
                t.clearCalendar();
                var e = t.date.getMonth() + 1;
                t.date.setMonth(e), t.createMonth()
            }), this.previous.addEventListener("click", function () {
                t.clearCalendar();
                var e = t.date.getMonth() - 1;
                t.date.setMonth(e), t.createMonth()
            })
        },
        createDay: function (t, e, a) {
            var n = document.createElement("div"), s = document.createElement("span");
            s.innerHTML = t, n.className = "vcal-date", n.setAttribute("data-calendar-date", this.date), 1 === t && (n.style.marginLeft = 0 === e ? 6 * 14.28 + "%" : 14.28 * (e - 1) + "%"), this.options.disablePastDays && this.date.getTime() <= this.todaysDate.getTime() - 1 ? n.classList.add("vcal-date--disabled") : (n.classList.add("vcal-date--active"), n.setAttribute("data-calendar-status", "active")), this.date.toString() === this.todaysDate.toString() && n.classList.add("vcal-date--today"), n.appendChild(s), this.month.appendChild(n)
        },
        dateClicked: function () {
            var t = this;
            this.activeDates = document.querySelectorAll('[data-calendar-status="active"]');
            for (var e = 0; e < this.activeDates.length; e++) this.activeDates[e].addEventListener("click", function (e) {
                if(new Date(this.dataset.calendarDate) > new Date()) {
                    const toast = $(toastTemplate("Alert", "아직 아니야", "just now"));
                    $(".toast-container").append(toast);
                    toast.toast({
                        delay: 3000
                    });
                    toast.toast("show");

                    return;
                }
                $("[data-toggle='modal']").click();
                document.querySelectorAll('[data-calendar-label="picked"]')[0].innerHTML = this.dataset.calendarDate;
                // t.removeActiveClass();
                // this.classList.add("vcal-date--selected");

                const nextDate = moment(this.dataset.calendarDate).format("yyyy-MM-DD");
                moveTo(nextDate);
            })
        },
        createMonth: function () {
            for (var t = this.date.getMonth(); this.date.getMonth() === t;) this.createDay(this.date.getDate(), this.date.getDay(), this.date.getFullYear()), this.date.setDate(this.date.getDate() + 1);
            this.date.setDate(1), this.date.setMonth(this.date.getMonth() - 1), this.label.innerHTML = this.monthsAsString(this.date.getMonth()) + " " + this.date.getFullYear(), this.dateClicked()
        },
        monthsAsString: function (t) {
            return ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][t]
        },
        clearCalendar: function () {
            vanillaCalendar.month.innerHTML = ""
        },
        removeActiveClass: function () {
            for (var t = 0; t < this.activeDates.length; t++) this.activeDates[t].classList.remove("vcal-date--selected")
        }
    };
}