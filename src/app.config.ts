export default {
  pages: [
    'pages/home/home',
    'pages/match/match',
    'pages/league/league',
    'pages/user/user',
    'pages/search/search',
    'pages/live/live',
    'pages/series/series',
    'pages/leagueManager/leagueManager',
    'pages/collection/collection',
    'pages/orders/orders',
    'pages/webview/webview',
    'pages/bet/bet',
    'pages/address/address',
    'pages/betOrders/betOrders',
    'pages/deposit/deposit',
    'pages/media/media',
    'pages/feedback/feedback',
    'pages/feedbackDetail/feedbackDetail',
    'pages/feedbackSuccess/feedbackSuccess',
    'pages/memberOrder/memberOrder',
    'pages/registration/registration',
    'pages/registrationTeam/registrationTeam',
    'pages/registrationPlayer/registrationPlayer',
    'pages/registrationList/registrationList',
    'pages/myRegistration/myRegistration',
    'pages/leagueStatistics/leagueStatistics',
    'pages/leagueSeriesStatistics/leagueSeriesStatistics',
    'pages/leagueMatchStatistics/leagueMatchStatistics',
    'pages/matchStatistics/matchStatistics',
    'pages/leagueMemberVerify/leagueMemberVerify',
    'pages/personVerify/personVerify',
    'pages/playerVerify/playerVerify',
    'pages/cashOut/cashOut',
    'pages/cashOutRecord/cashOutRecord',
    'pages/userIdentity/userIdentity',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '1元体育',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: "#666",
    selectedColor: "#3bb36b",
    backgroundColor: "#fafafa",
    borderStyle: 'white',
    list: [{
      pagePath: "pages/home/home",
      iconPath: "./assets/tab-bar/home.png",
      selectedIconPath: "./assets/tab-bar/home-on.png",
      text: "首页"
    }, {
      pagePath: "pages/match/match",
      iconPath: "./assets/tab-bar/play.png",
      selectedIconPath: "./assets/tab-bar/play-on.png",
      text: "比赛"
    }, {
      pagePath: "pages/league/league",
      iconPath: "./assets/tab-bar/oneyuan.png",
      selectedIconPath: "./assets/tab-bar/oneyuan-on.png",
      text: "赛事"
    }, {
      pagePath: "pages/user/user",
      iconPath: "./assets/tab-bar/me.png",
      selectedIconPath: "./assets/tab-bar/me-on.png",
      text: "我的"
    }]
  },
  permission: {
    "scope.userLocation": {
      "desc": "1元体育将获得您的位置信息以获取最佳体验"
    }
  }
}
