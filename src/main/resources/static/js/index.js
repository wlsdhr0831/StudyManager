let vanillaCalendar = null;
let userInfo = {};

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

    connect();

    setInterval(function() {
        $(".toast.fade.hide").remove();
    }, 5000);
});

function setEntireFires(username) {
    let hasStudied = false;
    loadingAjax({
        url: `/fires/${username}`,
        method: "GET",
        async: false,
        data: {
            date: $("#current_date").text(),
        },
        success(data) {
            hasStudied = data.length !== 0;
            const modalBody = $("#modal_fires .modal-body").empty();

            if(hasStudied) {
                modalBody.append(fireListTemplate(data));
            }
        }
    })
    return hasStudied;
}

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

    loadData(nextDate);
}

function loadData(date) {
    const userCardNode = $("#user_card");
    const othersCardNode = $("#others_cards");

    Object.keys(userInfo).forEach(key => {
        clearInterval(userInfo[key].progressThreads);
    });
    userCardNode.empty();
    othersCardNode.empty();

    const isToday = date === $("#today").val();

    loadingAjax({
        url: "/fires",
        method: "GET",
        data: {
            date: date,
        },
        success(data) {
            data.accounts.forEach(account => {
                userInfo[account.username] = {};

                let runningTime = 0;
                let fireState = "END";
                data.fires[account.username]?.forEach(fire => {
                    if(fire.end === null) {
                        userInfo[account.username].startedAt = fire.fireTime;
                        fireState = "START";
                    }else {
                        const startTime = new Date(fire.fireTime);
                        const endTime = new Date(fire.end.fireTime);
                        runningTime += endTime - startTime;
                    }
                });
                userInfo[account.username].runningTime = runningTime;

                const card = $(userCardTemplate(account.username, fireState));
                if(account.username === $("#username").val()) {
                    userCardNode.append(card);
                }else {
                    othersCardNode.append(card);
                }
                const usernameButton = card.find("[data-target='#modal_fires']");
                usernameButton.click((e) => {
                    if(!setEntireFires(account.username)) {
                        alertToast("Alert", "공부하면 보여줌", "just now");
                        e.stopPropagation();
                        e.preventDefault();
                    }
                });

                updateProgress(account.username, runningTime);
                if(isToday) {
                    if (fireState === "START") {
                        updateProgress(account.username, runningTime + (new Date() - new Date(userInfo[account.username].startedAt)));
                        userInfo[account.username].progressThreads = setProgressInterval(account.username);
                    }
                }else {
                    const isSucceeded = calculateProgressPercentage(runningTime) === 100;
                    const resultIcon = isSucceeded ? `<i class="bi bi-check-lg"></i>` : `<i class="bi bi-x-lg"></i>`;
                    const resultColor = isSucceeded ? "success" : "secondary";
                    $(`#card_${account.username} .right-round`).empty().prop("class", "btn btn-" + resultColor + " right-round").html(resultIcon);
                    if(isSucceeded) {
                        $(`#card_${account.username} .progress-bar`).addClass("bg-success");
                    }
                }
            });
            if(isToday) $("#card_" + $("#username").val() + " .right-round").click(doFire);
        },
    })
}

function doFire() {
    loadingAjax({
        url: "/fires",
        method: "POST",
        success(data) {
            send(data);
            if(data.dayOver) {
                location.reload();
            }
        },
        statusCode: {
            401: function() {
                location.replace("/users/login");
            }
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

    loadData($("#current_date").text());
}

function onError(error) {
    console.log(error);

    loading.remove();
    setTimeout(connect, 5000);
}

function onMessageReceived(payload) {
    payload = JSON.parse(payload.body);

    const username = payload.sender;
    const fireType = payload.fire.end == null ? "START" : "END";
    $("#card_" + username).data("state", fireType);

    if(fireType === "START") {
        userInfo[username].startedAt = payload.fire.fireTime;
        updateProgress(username, userInfo[username].runningTime);
        userInfo[username].progressThreads = setProgressInterval(username);
    }else {
        userInfo[username].runningTime += new Date() - new Date(userInfo[username].startedAt);
        userInfo[username].startedAt = NaN;

        clearInterval(userInfo[username].progressThreads);
        updateProgress(username, userInfo[username].runningTime);
    }
}

function send(data) {
    stompClient.send("/ws/fire/sync.send", {}, JSON.stringify({fire: data.fire, sender: data.owner}));
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

function userCardTemplate(username, fireState) {
    return `
    <div id="card_${username}" data-state="${fireState}" class="btn-group btn-group-lg" style="width: 100%;">
        <button class="btn btn-light left-round" style="width: 40%" data-toggle="modal" data-target="#modal_fires">${username}</button>
        <button id="progress_time_${username}" data-order="1" class="btn btn-light" style="width: 50%"></button>
        <button id="start_time_${username}" data-order="2" class="btn btn-light" style="width: 50%; display: none"></button>
        <button id="total_time_${username}" data-order="3" class="btn btn-light" style="width: 50%; display: none"></button>
        ` +
        (
            username === $("#username").val() ?
            `<button class="btn btn-primary right-round" style="width: 10%; font-size: 10pt"><i class="bi bi-play-fill"></i></button>` :
            `<button class="btn btn-secondary right-round" style="width: 10%; font-size: 10pt"><b>Off</b></button>`
        ) +
        `
        <div class="progress left-round cut-progress">
            <div class="progress-bar progress-bar-striped bg-secondary" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0"></div>
        </div>
    </div>`;
}

function fireListTemplate(data) {
    let fireListNode = $(`<ul class="list-group list-group-flush"></ul>`);

    data.forEach(fire => {
        const start = moment(fire.fireTime);
        const end = fire.end ? moment(fire.end.fireTime) : null;
        fireListNode.append(`
            <li class="list-group-item d-flex justify-content-between">
                <span>${start.format("HH:mm:ss ")} ~ ${end ? end.format("HH:mm:ss ") : `
                    <div class="spinner-border spinner-border-sm ml-4" role="status">
                        <span class="sr-only">Loading...</span>
                    </div>`
                }</span>` + (end ? `<i class="bi bi-arrow-right"></i>` + moment(end-start).subtract('hours', 9).format(" HH시간 mm분 ss초") : "") + `</li>`);
    })
    return fireListNode;
}

function updateButton(username) {
    const state = $(`#card_${username}`).data("state");

    if(username === $("#username").val()) {
        if(state === "START") {
            toStopButton();
        }else {
            toPlayButton();
        }
    }else {
        if(state === "START") {
            toOnButton(username);
        }else {
            toOffButton(username);
        }
    }
}

function toPlayButton() {
    const buttonNode = $("#card_" + $("#username").val() + " .btn.right-round");
    buttonNode.removeClass("btn-danger");
    buttonNode.addClass("btn-primary");

    const buttonNodeIcon = buttonNode.find("i");
    buttonNodeIcon.removeClass("bi-stop-fill");
    buttonNodeIcon.addClass("bi-play-fill");
}

function toStopButton() {
    const buttonNode = $("#card_" + $("#username").val() + " .btn.right-round");
    buttonNode.removeClass("btn-primary");
    buttonNode.addClass("btn-danger");

    const buttonNodeIcon = buttonNode.find("i");
    buttonNodeIcon.removeClass("bi-play-fill");
    buttonNodeIcon.addClass("bi-stop-fill");
}

function toOffButton(username) {
    const buttonNode = $(`#card_${username} .btn.right-round`);
    buttonNode.removeClass("btn-success");
    buttonNode.addClass("btn-secondary");

    const buttonNodeIcon = buttonNode.find("b");
    buttonNodeIcon.text("Off");
}

function toOnButton(username) {
    const buttonNode = $(`#card_${username} .btn.right-round`);
    buttonNode.removeClass("btn-secondary");
    buttonNode.addClass("btn-success");

    const buttonNodeIcon = buttonNode.find("b");
    buttonNodeIcon.text("On");
}

function setProgressInterval(username) {
    return setInterval(() => {
        updateProgress(username, userInfo[username].runningTime + (new Date() - new Date(userInfo[username].startedAt)));
    }, 1000);
}

function updateProgress(username, runningTime) {
    setProgressTime(username, runningTime);
    updateButton(username);

    const percentage = setProgressPercentage(username, runningTime);
    const state = $(`#card_${username}`).data("state");

    if(state === "START") {
        if (percentage === 100) {
            toExceedProgress(username);
        } else {
            toRunningProgress(username);
        }
    }else {
        toStopProgress(username);
    }
}

function setProgressTime(username, runningTime) {
    $(`#progress_time_${username}`).text(moment.utc(runningTime).format("HH:mm:ss"));
}

function setProgressPercentage(username, runningTime) {
    const percentage = calculateProgressPercentage(runningTime);
    const progressNode = $(`#card_${username} .progress-bar`);

    progressNode.prop("aria-valuenow", percentage);
    progressNode.css("width", percentage + "%");

    return percentage;
}

function getProgressPercentage(username) {
    return $(`#card_${username} .progress-bar`).css("width");
}

function toRunningProgress(username) {
    const progressNode = $(`#card_${username} .progress-bar`);
    progressNode.removeClass("bg-success");
    progressNode.removeClass("bg-secondary");
    progressNode.addClass("bg-primary");
    progressNode.addClass("progress-bar-animated");
}

function toExceedProgress(username) {
    const progressNode = $(`#card_${username} .progress-bar`);
    progressNode.removeClass("bg-secondary");
    progressNode.removeClass("bg-primary");
    progressNode.addClass("bg-success");
    progressNode.addClass("progress-bar-animated");
}

function toStopProgress(username) {
    const progressNode = $(`#card_${username} .progress-bar`);
    progressNode.removeClass("bg-success");
    progressNode.removeClass("bg-primary");
    progressNode.addClass("bg-secondary");
    progressNode.removeClass("progress-bar-animated");
}

function calculateProgressPercentage(runningSecond) {
    const result = 100 * runningSecond / (3600 * 1000 * 2);

    return result > 100 ? 100 : result;
}

function alertToast(title, message, time) {
    const toast = $(toastTemplate(title, message, time));
    $(".toast-container").append(toast);
    toast.toast({
        delay: 3000
    });
    toast.toast("show");
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
                    alertToast("Alert", "아직 아니야", "just now");

                    return;
                }
                $("[data-target='#modal_calendar']").click();
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