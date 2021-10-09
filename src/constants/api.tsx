export const protocol_http = "https://";
export const protocol_ws = "wss://";
export const gateway_client_service = "oneyuan.qiezizhibo.com";
export const auth_service = `${protocol_http}${gateway_client_service}/service-oneyuan-auth`
export const user_service = `${protocol_http}${gateway_client_service}/service-oneyuan-user`
export const system_service = `${protocol_http}${gateway_client_service}/service-oneyuan-system`
export const oneyuan_service = `${protocol_http}${gateway_client_service}/service-oneyuan`
export const media_service = `${protocol_http}${gateway_client_service}/service-oneyuan-media`
export const chat_service = `${protocol_http}${gateway_client_service}/service-oneyuan-chat`
export const live_service = `${protocol_http}${gateway_client_service}/service-oneyuan-live`
export const pay_service = `${protocol_http}${gateway_client_service}/service-oneyuan-pay`
export const websocket_service = `${protocol_ws}${gateway_client_service}/service-oneyuan-websocket`
// export const websocket_service = `ws://172.20.10.5:8080`
// export const host = "http://192.168.3.102:8080";

//websocket
export const websocket = (id) => `${websocket_service}/websocket/${id}`;

//config
export const API_CONFIG_BANNER = `${system_service}/sys/banner`;
export const API_CONFIG_BULLETIN = `${system_service}/sys/bulletin`;
export const API_CONFIG_BULLETIN_MATCH = `${system_service}/sys/bulletin/match`;
export const API_SYSTEM_SECURITY_CHECK = `${system_service}/wx/ma/securityCheck`;
export const API_VISIT = `${user_service}/user/visit`;
export const API_GET_SHARE_MOMENT_PICTURE = `${system_service}/wx/ma/picture/moment`;
export const API_GET_SHARE_SENTENCE = `${system_service}/sys/share/sentence`;
export const API_GET_SHARE_PICTURE = `${system_service}/wx/ma/picture/share`;
export const API_GET_HEAT_COMPETITION_SHARE = `${system_service}/wx/ma/picture/heat`;
export const API_GET_REGISTRATION_LEAGUE_SHARE = `${system_service}/wx/ma/picture/registration/league`;
export const API_GET_REGISTRATION_TEAM_SHARE = `${system_service}/wx/ma/picture/registration/team`;
export const API_SYS_PAYMENT_CONFIG = `${system_service}/sys/config/payment`;
export const API_SYS_FEEDBACK = `${system_service}/sys/feedback`;
export const API_SYS_EXP = `${system_service}/sys/exp`;
export const API_SYS_UPLOAD_AVATAR = `${system_service}/sys/upload/avatar`;
export const API_SYS_UPLOAD_FEEDBACK = `${system_service}/sys/upload/feedback`;

//user
export const API_LOGIN = `${auth_service}/auth`;
export const API_PHONENUMBER = `${auth_service}/user/phone`;
export const API_AUTH_USER = `${auth_service}/auth/user`;
export const API_USER = `${user_service}/user`;
export const API_REFRESH_TOKEN = `${auth_service}/auth/refresh_token`;
export const API_USER_ABILITY = `${user_service}/user/ability`;
export const API_USER_ADDRESS = `${user_service}/user/address`;
export const API_USER_EXP = `${user_service}/user/exp`;
export const API_USER_IDENTITY = `${user_service}/user/identity`;

//league
export const API_LEAGUE = (id) => `${oneyuan_service}/league/${id}`;
export const API_LEAGUES = `${oneyuan_service}/league`;
export const API_LEAGUE_SERIES = `${oneyuan_service}/league`;
export const API_LEAGUE_PLAYER = `${oneyuan_service}/league/rank/player`;
export const API_LEAGUE_TEAM = `${oneyuan_service}/league/rank/team`;
export const API_LEAGUE_SERIES_LEAGUE = `${oneyuan_service}/league`;
export const API_LEAGUE_REPORT = `${oneyuan_service}/league/report`;
export const API_LEAGUE_RANK_SETTING = `${oneyuan_service}/league/rank/setting`;
export const API_LEAGUE_AD = `${oneyuan_service}/ad/league`;
export const API_LEAGUE_REGISTRATION = `${oneyuan_service}/registration/league`;
export const API_LEAGUE_REGISTRATION_TEAM = `${oneyuan_service}/registration/team`;
export const API_LEAGUE_REGISTRATION_TEAM_BY_ID = (id) => `${oneyuan_service}/registration/team/${id}`;
export const API_LEAGUE_REGISTRATION_PLAYER = `${oneyuan_service}/registration/player`;
export const API_LEAGUE_REGISTRATION_USER = `${oneyuan_service}/registration/user`;
export const API_LEAGUE_REGISTRATION_TEAM_ALL = `${oneyuan_service}/registration/team/all`;
export const API_LEAGUE_REGISTRATION_TEAM_VERIFY = `${oneyuan_service}/registration/team/verify`;
export const API_LEAGUE_REGISTRATION_TEAM_LAST_CHANCE = `${oneyuan_service}/registration/team/lastChance`;
export const API_LEAGUE_REGISTRATION_TEAM_PRE = `${oneyuan_service}/registration/team/pre`;
//match
export const API_MATCH = (id) => `${oneyuan_service}/match/${id}`;
export const API_MATCHES = `${oneyuan_service}/match`;
export const API_MATCH_STATUS = `${oneyuan_service}/timeline/statistics`;
export const API_STATISTICS_VERIFY = `${oneyuan_service}/statistics/league/verify`;
export const API_MATCH_NOOICE = `${oneyuan_service}/match/nooice`;
export const API_MATCH_COMMENT = `${chat_service}/comment`;
export const API_MATCH_COMMENT_DANMU = `${chat_service}/comment/danmu`;
export const API_MATCH_MEDIA = `${media_service}/media/match`;
export const API_MATCH_ONLINE = `${oneyuan_service}/match/online`;
export const API_MATCH_STATISTICS_TIMELINE = `${oneyuan_service}/timeline`;

//team
export const API_TEAM = (id) => `${oneyuan_service}/team/${id}`;
export const API_TEAMS = `${oneyuan_service}/teams`;

//player
export const API_PLAYER = (id) => `${oneyuan_service}/player/${id}`;
export const API_PLAYERS = `${oneyuan_service}/player`;
export const API_PLAYER_BEST = `${oneyuan_service}/player/best`;
export const API_PLAYER_MEDIA = `${media_service}/media/player`;
export const API_PLAYER_VERIFY  = `${oneyuan_service}/player/verify`;
export const API_PLAYER_VERIFY_INHERIT  = `${system_service}/person/verify/request/player/inherit`;

//live
export const API_ACTIVITY_MEDIA_LIST = (id) => `${media_service}/media/activity?activityId=${id}`;
export const API_ACTIVITY_PING = `${live_service}/activity/ping`;

//media
export const API_MEDIA = (id) => `${media_service}/media/${id}`;
export const API_MEDIA_RECOMMEND = `${media_service}/media/recommend`;
export const API_MEDIA_NOOICE = `${media_service}/media/nooice`;

//search
export const API_SEARCH = `${oneyuan_service}/search`;

//area
export const API_AREA = `${system_service}/sys/area`;

//pay
export const API_ORDER_CREATE = `${pay_service}/order/jsapi`;
export const API_ORDER_IS_NEED_BUY = `${pay_service}/order/isUserNeedByMatch`;
export const API_ORDER_QUERY = `${pay_service}/order/query`;
export const API_ORDER_USER = `${pay_service}/order/user`;

export const API_GIFT_LIST = `${pay_service}/gift/list`;
export const API_GIFT_SEND_FREE = `${pay_service}/gift/free/send`;
export const API_GIFT_SEND_FREE_LIMIT = `${pay_service}/gift/free/limit`;
export const API_GIFT_RANK_MATCH = (id) => `${pay_service}/gift/rank/match?matchId=${id}`;
export const API_GIFT_RANK_LEAGUE = (id) => `${pay_service}/gift/rank/league?leagueId=${id}`;

export const API_CHARGE_USER = `${oneyuan_service}/charge/user`;


export const API_DEPOSIT = `${pay_service}/deposit`;
export const API_DEPOSIT_LOGS = `${pay_service}/deposit/logs`;

//heat
export const API_MATCH_HEAT = `${oneyuan_service}/heat/match`;
export const API_MATCH_TEAM_HEAT = `${oneyuan_service}/heat/match/team`;
export const API_MATCH_PLAYER_HEAT = `${oneyuan_service}/heat/match/player`;
export const API_MATCH_PLAYER_HEAT_TOTAL = `${oneyuan_service}/heat/match/player/total`;
export const API_LEAUGE_HEAT = `${oneyuan_service}/heat/league`;
export const API_LEAGUE_PLAYER_HEAT = `${oneyuan_service}/heat/league/player`;
export const API_LEAGUE_PLAYER_HEAT_TOTAL = `${oneyuan_service}/heat/league/player/total`;
export const API_LEAGUE_TEAM_HEAT = `${oneyuan_service}/heat/league/team`;
export const API_LEAGUE_TEAM_HEAT_TOTAL = `${oneyuan_service}/heat/league/team/total`;

//bet
export const API_LEAGUE_BET = `${oneyuan_service}/bet/league`;
export const API_MATCH_BET = `${oneyuan_service}/bet/match`;
export const API_MATCH_USER_BET = `${oneyuan_service}/bet`;
export const API_MATCH_USER_BET_CASH = `${oneyuan_service}/bet/cash`;
export const API_BET_RANK = `${oneyuan_service}/bet/rank`;
export const API_BET_FREE = `${oneyuan_service}/bet/free`;

//league member
export const API_LEAGUE_MEMBER = `${oneyuan_service}/charge/member/league`;
export const API_USER_LEAGUE_MEMBER = `${oneyuan_service}/charge/member/user`;

//subscribe
export const API_SUBSCRIBE = `${system_service}/subscribe`;
export const API_SUBSCRIBE_REGISTRATION = `${system_service}/subscribe/registration`;
export const API_SUBSCRIBE_REGISTRATION_VERIFY = `${system_service}/subscribe/registration/verify`;

//person verify
export const API_PERSON_VERIFY_LEAGUEMEMBER = `${system_service}/person/verify/request/leagueMember`;
export const API_PERSON_VERIFY_PLAYER = `${system_service}/person/verify/request/player`;

//cash
export const API_CASH_OVERVIEW = `${oneyuan_service}/cash/overview`;
export const API_CASH_RECORD = `${oneyuan_service}/cash/record`;
export const API_CASH_USER_INFO = `${oneyuan_service}/cash/info`;
export const API_CASH_REQUEST = `${oneyuan_service}/cash/request`;

//cached
export const cached_service = `${protocol_http}qiezizhibo-1300664818.cos.ap-shanghai.myqcloud.com/cached/oneyuan`;

export const API_CACHED_CONTROLLER = `${cached_service}/controller.json`;

export const API_CACHED_HOME_LEAGUES = `${cached_service}/leagues.json`;
export const API_CACHED_LEAGUE = (leagueId) => `${cached_service}/league/${leagueId}.json`;
export const API_CACHED_LEAGUE_LEAGUE = `${cached_service}/series.json`;

export const API_CACHED_MATCHES = (leagueId, round) => `${cached_service}/league/match/${leagueId}/${round}.json`;
export const API_CACHED_MATCH = (id) => `${cached_service}/match/${id}.json`;

export const API_CACHED_LIVE_MANUAL = (id) => `${cached_service}/live/${id}.json`;

export const API_CACHED_LEAGUE_IN_SERIES_LEAGUE = (id) => `${cached_service}/inSeriesLeague/${id}.json`;
export const API_CACHED_MATCHES_FINISH = `${cached_service}/match/finish.json`;
export const API_CACHED_MATCHES_UNFINISH = `${cached_service}/match/live.json`;
