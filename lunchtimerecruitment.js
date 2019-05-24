//slackの登録
var SLACK_CHANNEL_SASHI_LUNCH = 'sashi-lunch';
var SLACK_POST_SASHI_LUNCH_URL = 'https://hooks.slack.com/services/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';
var USER_NAME = 'LunchTimeRecruitment!';
var ICON = ':lunch_time:';

var recruitment_info = [];
var slack_name = "";

function timeFormatter(date){
  return Utilities.formatDate(date,'JST','MM/dd (E) HH:mm');
}

function getSheet(user_calendar_id) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getActiveSheet();
  var lastRow = sheet.getLastRow();

  for(var i = 2; i <= lastRow; i++) {
    if (user_calendar_id == sheet.getRange(i, 1).getValue()) {
      slack_name = sheet.getRange(i, 2).getValue();
    }
  }
  return slack_name;
}

function getCal(user_calendar_id) {
  // カレンダーIDを指定して、カレンダーを取得
  var calendar = CalendarApp.getCalendarById(user_calendar_id);
  var slack_name = getSheet(user_calendar_id);

  // 対象の日付を範囲指定
  var today = new Date();
  var end = new Date(today);

  end.setMonth(end.getMonth()+1);

  var events = calendar.getEvents(today, end);
  var recruitmentName = calendar.getName();

  for (var i = 0; i < events.length; i++) {
    var title = events[i].getTitle();
    var getDescription = events[i].getDescription();
    var startTime = timeFormatter(events[i].getStartTime());
    var endTime = timeFormatter(events[i].getEndTime());
    if (title.match(/募集/)) {
      recruitment_info += '募集者: <@' + slack_name + '> \n';
      recruitment_info += title + '\n' + getDescription;
      recruitment_info += '\n-------------------------\n';
      recruitment_info += startTime + '〜' + endTime;
    }
  }
  return recruitment_info;
}

function postRecruitmentLunch(e) {
  if (e !== undefined) {
    getCal(e.calendarId);
  } else {
    return;
  }
  if (recruitment_info.length > 0) {
    var jsonData = {
      "username": USER_NAME,
      "icon_emoji": ICON,
      "text": '=========================\n' + "<!here>\n　さしランチの募集がありました。\n" + recruitment_info + '\n=========================\n'
    };
    var payload = JSON.stringify(jsonData);

    var options = {
      "method": "post",
      "contentType": "application/json",
      "payload" : payload
    };
    UrlFetchApp.fetch(SLACK_POST_SASHI_LUNCH_URL, options);
  } else {
    return;
  }
}

