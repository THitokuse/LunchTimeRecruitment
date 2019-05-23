//slackの登録
var SLACK_CHANNEL_SASHI_LUNCH = '';
var SLACK_POST_SASHI_LUNCH_URL = 'https://hooks.slack.com/services/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';
var USER_NAME = 'LunchTimeRecruitment!';
var ICON = ':lunch_time:';

var recruitment_info = []

function timeFormatter(date){
  return Utilities.formatDate(date,'JST','HH:mm');
}

function getCal() {
  // カレンダーIDを指定して、カレンダーを取得
  var calendar = CalendarApp.getCalendarById('hasegawa.taichiro@gmail.com');

  // 対象の日付を範囲指定
  var today = new Date();
  var end = new Date(today);

  end.setMonth(end.getMonth()+1);

  var events = calendar.getEvents(today, end);
  var recruitmentName = calendar.getName();

  for (var i = 0; i < events.length; i++) {
    var title = events[i].getTitle();
    var startTime = timeFormatter(events[i].getStartTime());
    var endTime = timeFormatter(events[i].getEndTime());
    if (title.match(/募集/)) {
      recruitment_info += '募集者：　' + recruitmentName + '\n';
      recruitment_info += title + '\n-------------------------\n';
      recruitment_info += startTime + '〜' +endTime;
      recruitment_info += '\n=========================\n';
    }
  }
  return recruitment_info;
}

function postRecruitmentLunch() {
  getCal();
  var jsonData = {
    "username": USER_NAME,
    "icon_emoji": ICON,
    "text": "さしランチの募集がありました。\n" + recruitment_info
  };
  var payload = JSON.stringify(jsonData);

  var options = {
    "method": "post",
    "contentType": "application/json",
    "payload" : payload
  };
  UrlFetchApp.fetch(SLACK_POST_SASHI_LUNCH_URL, options);
}

