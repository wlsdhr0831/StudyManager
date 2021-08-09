$(function() {
   loginUser = $("#username").val();

   $("#prevDate").click(function() {
      sideDate(-1);
   });
   $("#nextDate").click(function() {
      sideDate(1);
   });

   loadData($("#current_date").text());
   connect();
});

function sideDate(dir) {
   const currentDate = $("#current_date");
   const ymd = currentDate.text().split("-");

   let newDate = new Date(ymd[0], ymd[1] - 1, ymd[2]);
   newDate.setDate(newDate.getDate() + dir);

   const sideDate = moment(newDate).format("yyyy-MM-DD");
   currentDate.text(sideDate);
   $("#nextDate").attr("disabled", $("#today").val() === currentDate.text());

   $("#user_card").empty();
   $("#others_cards").empty();
   loadData(sideDate);
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

      if(account.username === myName) {
         heading.find("h4").text("나");

         if(isToday) {
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

      }else {
         if(isToday) {
            if(hasStarted){
               additional.append(onBadge());
            }else {
               additional.append(offBadge());
            }
         }
         $("#others_cards").append(card);
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
   if(fire.end == null) {
      $("#additional_" + username).prepend(startedBadge(username, fire.fireTime));

      return;
   }

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

function connect() {
   const socket = new SockJS("/connect");
   stompClient = Stomp.over(socket);
   stompClient.connect({sender: loginUser}, onConnected, onError);
   stompClient.debug = null;
}

function onConnected() {
   stompClient.subscribe("/topic/fire/sync", onMessageReceived);
   stompClient.send("/ws/fire/sync.register", {}, JSON.stringify({sender: loginUser}));
}

function onError(error) {
   console.log(error);
}

function onMessageReceived(payload) {
   payload = JSON.parse(payload.body);

   const additional = $("#additional_" + payload.sender);

   if(payload.sender !== loginUser) {
      if (payload.fire.end == null) {
         additional.html(onBadge());
      } else {
         additional.html(offBadge());
      }
   }
   if(payload.fire.end != null) {
      loadTemplate("timeline-template.html", (fireTemplate) => {
         appendFire(fireTemplate, payload.fire, payload.sender);
         $("#started_" + payload.sender).remove();
      });
   }else {
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

