import Taro, {getCurrentInstance} from '@tarojs/taro'
import {Component} from 'react'
import {Image, ScrollView, Text, Video, View} from '@tarojs/components'
import {
  AtButton,
  AtCurtain,
  AtFab,
  AtIcon,
  AtTabs,
  AtTabsPane,
  AtToast,
  AtActionSheet,
  AtActionSheetItem
} from "taro-ui"
import {connect} from 'react-redux'
import MatchUp from './components/match-up'
import NooiceBar from './components/nooice-bar'
import GiftNotify from '../../components/gift-notify'
import HeatTeam from './components/heat-team'
import RoundButton from '../../components/round-button'
import * as api from '../../constants/api'

import './live.scss'
import matchAction from "../../actions/match";
import liveAction from "../../actions/live";
import payAction from "../../actions/pay";
import depositAction from "../../actions/deposit";
import {
  clearLoginToken,
  formatTimeSecond, getExpInfoByExpValue,
  getStorage,
  getTimeDifference,
  hasLogin,
  random,
  random_weight
} from '../../utils/utils'
import {
  FootballEventType,
  GIFT_TYPE,
  HEAT_TYPE,
  LOADING_TEXT,
  MATCH_TYPE,
  ORDER_STAUTS,
  ORDER_TYPE,
  REPOST_TEXT,
  SHARE_SENTENCE_TYPE,
  TABS_TYPE,
  SUBSCRIBE_TEMPLATES,
  PAY_TYPE,
  CacheManager
} from "../../constants/global";
import defaultLogo from '../../assets/default-logo.png'
import star from '../../assets/live/star.png'
import starActive from '../../assets/live/star-active.png'
import share from '../../assets/live/share.png'
import moment from '../../assets/live/moment.png'
import headphones from '../../assets/live/headphones.png'
import views_icon from '../../assets/live/views_icon.png'
import withShare from "../../utils/withShare";
import Statistics from "./components/statistics";
import LineUp from "./components/line-up";
import ChattingRoom from "./components/chatting-room";
import LoginModal from "../../components/modal-login";
import PhoneModal from "../../components/modal-phone";
import ChargeModal from "../../components/modal-charge";
import * as error from "../../constants/error";
import userAction from "../../actions/user";
import Request from "../../utils/request";
import ModalAlbum from "../../components/modal-album";
import GiftPanel from "../../components/gift-panel";
import HeatReward from "../../components/heat-reward";
import GiftRank from "../../components/gift-rank";
import HeatPlayer from "../../components/heat-player";
import HeatLeagueTeam from "../../components/heat-league-team";
import ShareMoment from "../../components/share-moment";
import ModalPay from "../../components/modal-pay";
import MatchClip from "./components/match-clip";
import configAction from "../../actions/config";
import LevelUpModal from "../../components/modal-level-up";
import NavBar from "../../components/nav-bar";
import LeagueMember from "../../components/league-member";
import RectFab from "../../components/fab-rect";
import {crown, cash_rule, disclaimer, gift_rank, heat_reward} from "../../utils/assets";
// import withOfficalAccount from "../../utils/withOfficialAccount";
import ModalAgreement from "../../components/modal-agreement";
import CashAgreementModal from "../../components/modal-cash-agreement";

type Bulletin = {
  id: number,
  content: string,
  type: string,
  url: string
}
type MatchCharge = {
  price: number,
  monthlyPrice: number,
  type: number,
  matchId: number,
  isMonopolyCharge: boolean,
  monopolyPrice: number,
  monopolyOnly: boolean,
}
type PageStateProps = {
  match: any;
  mediaList: any;
  matchStatus: any;
  playerList: any;
  userInfo: any;
  commentList: any;
  danmuList: any;
  payEnabled: boolean;
  giftEnabled: boolean;
  shareSentence: any;
  giftList: any;
  deposit: number;
  expInfo: any;
}

type PageDispatchProps = {}

type PageOwnProps = {}

type PageState = {
  timerID_CountDown: any;
  timerID_matchStatus: any;
  timerID_socketHeartBeat: any;
  timerID_danmu: any;
  timerID_giftController: any;
  timeoutID_playCountDown: any;
  loading: boolean;
  diffDayTime: any;
  liveStatus: LiveStatus;
  currentTab: number;
  nooiceLeftMoveClass: string;
  nooiceRightMoveClass: string;
  leftNooice: number;
  rightNooice: number;
  nooiceEnabled: boolean;
  isCollect: boolean;
  chatLoading: boolean;
  commentIntoView: any;
  loginOpen: boolean;
  phoneOpen: boolean;
  payOpen: boolean;
  currentMedia: number;
  isFullScreen: boolean;
  videoShowMore: boolean;
  mediaListShowMore: boolean;
  videoTime: number;
  danmuCurrent: any;
  liveLoading: boolean;
  liveLoaded: boolean;
  tryplayed: boolean;
  firstplay: boolean;
  danmuUnable: boolean;
  needPay: boolean;
  comments: any;
  curtain: Bulletin | null;
  curtainShow: boolean,
  charge: MatchCharge | null;
  downLoading: boolean;
  permissionShow: boolean;
  sharePictureUrl: string | null;
  isIphoneX: boolean;
  heatRule: any;
  heatType: number | null;
  giftOpen: boolean;
  currentSupportTeam: any;
  currentSupportPlayer: any;
  teamHeats: any;
  playerHeats: any;
  topPlayerHeats: any;
  playerHeatTotal: any;
  leagueTeamHeats: any,
  topLeagueTeamHeats: any,
  leagueTeamHeatTotal: any,
  giftSendQueue: any;
  giftRanks: any;
  giftRanksLoading: any;
  broadcastList: any;
  leagueId: any;
  playerHeatRefreshFunc: any;
  playerHeatLoading: any;
  leagueTeamHeatRefreshFunc: any,
  leagueTeamHeatLoading: any,
  giftRanksOpen: any,
  heatRewardOpen: any,
  ping: any;
  needGiftLive: any;
  shareMomentOpen: any,
  shareMomentPoster: any,
  shareMomentLoading: any,
  heatStartTime: any,
  heatEndTime: any,
  onHandleShareSuccess: any,
  payCallback: any;
  payConfirmShow: boolean;
  currentPrice: number;
  matchClips: any;
  adAvailable: boolean;
  onLineUpClick: any;
  levelUpShow: boolean;
  currentLevel: number;
  leagueMemberRule: any;
  leagueMemberOpen: boolean;
  refreshStatisticsFunc: any;
  heatRewardScrollBottom: boolean;
  cashAvailableHeats: any,
  agreementOpen: boolean,
  cashAgreementOpen: boolean,
  currentToCashPlayer: any,
  statisticsMode: boolean,
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Live {
  props: IProps;
}

enum LiveStatus {
  FINISH,//比赛结束
  UNOPEN,//未开始
  ONTIME,//比赛时间开始了没在推流
  NOTPUSH,//比赛点了开始但没在推流
  ENABLED,//可以看
  LOADING,//加载中
}

// @withOfficalAccount()
@withShare({})
class Live extends Component<IProps, PageState> {
  navRef: any = null;
  socketTask: Taro.SocketTask | null
  videoContext: Taro.VideoContext | null
  animElemIds: any = {};
  timeout_danmu: any = {};
  timeout_gift: any = {};
  timeout_gift_show: any = {};
  danmuRow: any = [[], [], [], [], []];
  giftRows: any = {left: [{}, {}, {}, {}, {}], right: [{}, {}, {}, {}, {}], unset: []};
  isupdating: boolean = false;
  enterTime: any;

  constructor(props) {
    super(props)
    const diff = getTimeDifference(new Date());
    this.state = {
      timerID_CountDown: null,
      timerID_matchStatus: null,
      timerID_socketHeartBeat: null,
      timerID_danmu: null,
      timerID_giftController: null,
      timeoutID_playCountDown: null,
      loading: false,
      diffDayTime: diff,
      liveStatus: LiveStatus.LOADING,
      currentTab: 0,
      nooiceLeftMoveClass: '',
      nooiceRightMoveClass: '',
      leftNooice: 0,
      rightNooice: 0,
      nooiceEnabled: true,
      isCollect: false,
      chatLoading: false,
      commentIntoView: null,
      loginOpen: false,
      phoneOpen: false,
      payOpen: false,
      currentMedia: 0,
      isFullScreen: false,
      videoShowMore: true,
      mediaListShowMore: false,
      videoTime: 0,
      danmuCurrent: [],
      liveLoading: false,
      liveLoaded: false,
      tryplayed: false,
      firstplay: true,
      danmuUnable: false,
      comments: [],
      charge: null,
      needPay: false,
      curtain: null,
      curtainShow: false,
      downLoading: false,
      permissionShow: false,
      sharePictureUrl: null,
      isIphoneX: false,
      heatRule: null,
      heatType: null,
      giftOpen: false,
      currentSupportTeam: null,
      currentSupportPlayer: null,
      teamHeats: null,
      playerHeats: null,
      topPlayerHeats: null,
      playerHeatTotal: null,
      leagueTeamHeats: null,
      topLeagueTeamHeats: null,
      leagueTeamHeatTotal: null,
      giftSendQueue: [],
      giftRanks: null,
      giftRanksLoading: false,
      broadcastList: [],
      leagueId: null,
      playerHeatRefreshFunc: null,
      playerHeatLoading: false,
      leagueTeamHeatRefreshFunc: null,
      leagueTeamHeatLoading: false,
      giftRanksOpen: false,
      heatRewardOpen: false,
      ping: {isPushing: false},
      needGiftLive: false,
      shareMomentOpen: false,
      shareMomentPoster: null,
      shareMomentLoading: false,
      heatStartTime: null,
      heatEndTime: null,
      onHandleShareSuccess: null,
      payCallback: null,
      payConfirmShow: false,
      currentPrice: 0,
      matchClips: null,
      adAvailable: false,
      onLineUpClick: null,
      levelUpShow: false,
      currentLevel: 0,
      leagueMemberRule: null,
      leagueMemberOpen: false,
      refreshStatisticsFunc: null,
      heatRewardScrollBottom: false,
      cashAvailableHeats: null,
      agreementOpen: false,
      cashAgreementOpen: false,
      currentToCashPlayer: null,
      statisticsMode: false,
    }
  }

  // $setSharePath = () => `/pages/live/live?id=${this.props.match.id}`
  $setSharePath = () => `/pages/home/home?id=${this.getParamId()}&page=live`

  $setShareTitle = () => {
    const shareSentence = random_weight(this.props.shareSentence.filter(value => value.type == SHARE_SENTENCE_TYPE.match).map(value => {
      return {...value, weight: value.weight + "%"}
    }));
    if (shareSentence == null) {
      return REPOST_TEXT[random(0, REPOST_TEXT.length)]
    }
    return shareSentence.sentence;
  }

  $setShareImageUrl = () => this.state.sharePictureUrl ? this.state.sharePictureUrl : null

  $setOnShareCallback = () => {
    this.state.onHandleShareSuccess && this.state.onHandleShareSuccess();
    Taro.showToast({title: "分享成功", icon: "none"});
    if (this.state.heatType != null) {
      let freeGift: any = null;
      this.props.giftList && this.props.giftList.forEach((data: any) => {
        if (data.type == GIFT_TYPE.FREE) {
          freeGift = data;
        }
      });
      if (freeGift != null && this.props.userInfo && this.props.userInfo.userNo) {
        new Request().get(api.API_GIFT_SEND_FREE_LIMIT, {
          userNo: this.props.userInfo.userNo,
          giftId: freeGift.id,
        }).then((limit: any) => {
          if (limit < freeGift.limited * 2) {
            new Request().post(api.API_GIFT_SEND_FREE_LIMIT, {
              userNo: this.props.userInfo.userNo,
              giftId: freeGift.id,
              times: 1,
            }).then((result) => {
              if (result) {
                payAction.getGiftList();
              }
            })
          }
        });
      }
    }
  }

  onShareAppMessage() {
  }

  onShareTimeline() {
  }

  componentWillMount() {
  }

  componentDidMount() {
    // componentDidShow() {
    const {payEnabled} = this.props;
    if (!payEnabled) {
      this.initPayConfig();
    }
    this.iphoneXAdjust();
    matchAction.getMatchInfo_clear()
    matchAction.getMatchComment_clear()
    liveAction.getLiveMediaList_clear()
    if (this.props.userInfo && this.props.userInfo.userNo) {
      depositAction.getDeposit(this.props.userInfo.userNo);
    }
    Taro.showLoading({title: LOADING_TEXT})
    this.getParamId() && this.initCurtain(this.getParamId());
    this.getParamId() && this.getMatchInfo(this.getParamId()).then((data) => {
      let statisticsMode = false;
      if (data.statisticsModeAvailable) {
        statisticsMode = true;
      }
      this.setState({statisticsMode: statisticsMode})
      if (data.activityId || statisticsMode) {
        if (data.leagueId) {
          this.setState({leagueId: data.leagueId});
          if (!statisticsMode) {
            this.initLeagueMember(data.leagueId);
          }
        }
        if (!statisticsMode) {
          if (data.status && data.status.status == FootballEventType.FINISH) {
            this.getLiveMediaInfo(data.activityId)
            this.startTimer_Danmu();
            this.getMatchDanmu(data.id, this.state.currentMedia);
          } else {
            this.getLiveInfo(data.activityId, () => {
              this.getDiffTime(data)
            });
          }
        }
        this.setUpNooice(data);
        this.getMatchStatus(data.id).then(() => {
          this.startTimer_matchStatus(data.id);
        });

        this.startTimer_CountDown();
        this.getCollection(data.id);
        this.initSocket(data.id);
        if (!statisticsMode) {
        this.getUserChargeInfo(data, true);
        }
        this.getSharePicture(data);
        this.enterTime = formatTimeSecond(new Date());

        if (data.type && data.type.includes(MATCH_TYPE.chattingRoom)) {
          this.getCommentList(data.id);
        }
        this.initHeatCompetition(data);
        this.getMatchMediaClip(data.id);
        // if (data.leagueId) {
        //   this.initAd(data.leagueId)
        // }
      }
      Taro.hideLoading();
    })
    this.videoContext = Taro.createVideoContext("videoPlayer");
    Taro.getSystemInfo().then(data => {
      if (data.platform == 'android') {
        this.setState({danmuUnable: true})
      }
    })
  }

  componentWillUnmount() {
    matchAction.getMatchInfo_clear()
    liveAction.getLiveMediaList_clear()
    this.clearTimer_matchStatus();
    this.clearTimer_CountDown();
    this.clearTimer_HeartBeat();
    this.clearTimer_Danmu();
    this.socketTask && this.socketTask.close({})
    this.socketTask = null;
    this.videoContext && this.videoContext.pause();
    this.videoContext = null;
    this.clearTimer_playCountDown();
    this.clearTimer_Gift();
  }

  componentDidHide() {
    // this.clearTimer_liveInfo();
  }

  // componentDidShow() {
  //   console.log("componentDidShow")
  // }

  // componentDidHide() {
  //   // this.clearTimer_liveInfo();
  // }
  iphoneXAdjust = () => {
    let screenHeight = Taro.getSystemInfoSync().screenHeight
    let bottom = Taro.getSystemInfoSync().safeArea.bottom
    this.setState({isIphoneX: screenHeight != bottom})
  }
  initHeatCompetition = (match) => {
    const id = match.id;
    new Request().get(api.API_MATCH_HEAT, {matchId: id}).then((data: any) => {
      if (data.available) {
        let heatStartTime: any = null;
        let heatEndTime: any = null;
        if (data.type == HEAT_TYPE.LEAGUE_PLAYER_HEAT || data.type == HEAT_TYPE.LEAGUE_TEAM_HEAT) {
          heatStartTime = this.getLeagueHeatStartTime(data, match);
          heatEndTime = this.getLeagueHeatEndTime(data, match);
        } else {
          heatStartTime = this.getMatchHeatStartTime(data, match);
          heatEndTime = this.getMatchHeatEndTime(data, match);
        }
        payAction.getGiftList();
        this.setState({
          heatRule: data,
          heatType: data.type,
          heatStartTime: heatStartTime,
          heatEndTime: heatEndTime
        }, () => {
          this.getTeamHeatInfo(id, data.type);
          this.getGiftRanks(id);
        })
        this.startTimer_Gift();
      }
    })
  }
  initLeagueMember = (leagueId) => {
    new Request().get(api.API_LEAGUE_MEMBER, {
      leagueId: leagueId,
    }).then((data: any) => {
      if (data.available) {
        this.setState({leagueMemberRule: data})
      }
    });
  }
  getParamId = () => {
    let id;
    const router = getCurrentInstance().router;
    if (router && router.params != null) {
      if (router.params.id == null && router.params.scene != null) {
        id = router.params.scene
      } else if (router.params.id != null) {
        id = router.params.id
      } else {
        return null
      }
    } else {
      return null;
    }
    // return 3147;
    return id;
  }
  initCurtain = (id) => {
    new Request().get(`${api.API_CONFIG_BULLETIN_MATCH}`, {matchId: id}).then((res: Array<any>) => {
      if (res && res.length > 0) {
        const curtain = res[0];
        if (curtain.curtain) {
          this.setState({curtain: curtain, curtainShow: true})
        }
      }
    });
  }
  initAd = (leagueId) => {
    new Request().get(`${api.API_LEAGUE_AD}`, {leagueId: leagueId}).then((res: any) => {
      if (res && res.available) {
        this.setState({adAvailable: true});
      } else {
        this.setState({adAvailable: false});
      }
    });
  }
  initPayConfig = (userNo?) => {
    if (userNo == null && this.props.userInfo && this.props.userInfo.userNo) {
      userNo = this.props.userInfo.userNo;
    }
    Taro.getSystemInfo().then((systemInfo) => {
      new Request().get(api.API_SYS_PAYMENT_CONFIG, null).then((config: any) => {
        if (userNo) {
          new Request().get(api.API_USER_ABILITY, {userNo: userNo}).then((ability: any) => {
            if (ability && ability.enablePay) {
              configAction.setPayEnabled(true);
              configAction.setGiftEnabled(true);
            } else {
              if (systemInfo.platform == 'ios') {
                configAction.setPayEnabled(config && config.enablePay ? true : false);
              } else {
                configAction.setPayEnabled(true);
              }
              configAction.setGiftEnabled(config && config.enableGift ? true : false);
            }
          });
        } else {
          if (systemInfo.platform == 'ios') {
            configAction.setPayEnabled(config && config.enablePay ? true : false);
          } else {
            configAction.setPayEnabled(true);
          }
          configAction.setGiftEnabled(config && config.enableGift ? true : false);
        }
      })
    });
  }
  initSocket = async (matchId) => {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this;
    const token = await getStorage('accessToken');
    const header = token ? {'Authorization': `Bearer ${token}`} : {};
    const {match = null} = this.props;
    if (match.type && !match.type.includes(MATCH_TYPE.chattingRoom)) {
      new Request().post(api.API_MATCH_ONLINE, {matchId: match.id}).then((res: any) => {
        console.log(res);
      })
      return;
    }
    Taro.connectSocket({
      url: api.websocket(matchId),
      header: header
    }).then(task => {
      this.socketTask = task;
      task.onOpen(function () {
        context.startTimer_HeartBeat();
      })
      task.onMessage(function (res) {
        if (res.data == 'unauthenticated') {
          Taro.showToast({
            title: "登陆状态过期请重新授权",
            duration: 1000,
            icon: "none",
            complete: () => {
              context.showAuth();
            }
          });
        } else if (res.data !== 'success') {
          const comment = JSON.parse(res.data);
          if (comment && comment.isBroadcast) {
            const giftSendBroadcast = comment;
            context.addToGiftSendQueue(giftSendBroadcast);
            context.state.playerHeatRefreshFunc && context.state.playerHeatRefreshFunc();
            context.state.leagueTeamHeatRefreshFunc && context.state.leagueTeamHeatRefreshFunc();
            // let broadcastList = context.state.broadcastList;
            // let broadcastText = '';
            // if (giftOrder && giftOrder.user && giftOrder.user.name) {
            //   broadcastText = broadcastText + giftOrder.user.name + "送出";
            // }
            // if (giftOrder && giftOrder.gift && giftOrder.gift.name) {
            //   broadcastText = broadcastText + giftOrder.gift.name + giftOrder.num + "个";
            // }
            // broadcastList.push({broadcast: true, content: broadcastText, id: giftOrder.id, date: new Date()})
            // context.setState({broadcastList: broadcastList})
            context.getCommentList(context.props.match.id);
          } else {
            if (context.props.match.status && context.props.match.status.status < FootballEventType.FINISH) {
              context.sendLiveDanmu({text: comment.content, id: comment.id, user: comment.user});
            } else {
              context.getMatchDanmu(context.props.match.id, context.state.currentMedia);
            }
            context.getCommentList(context.props.match.id);
          }
        }
      })
      task.onError(function () {
        console.log('onError')
      })
      task.onClose(function (e) {
        console.log('onClose: ', e)
      })
    })
  }
  sendMessage = async (message) => {
    const token = await getStorage('accessToken');
    return new Promise((resolve, reject) => {
      if (message == null || message == '') {
        reject();
        return;
      }
      if (token == null || token == '' || this.props.userInfo.userNo == null || this.props.userInfo.userNo == '') {
        reject();
        this.showAuth();
        return;
      } else if (this.props.userInfo.phone == null || this.props.userInfo.phone == '') {
        reject();
        this.showPhone();
        return;
      }
      let params: any = {content: message, userNo: this.props.userInfo.userNo, token: token};
      const {match} = this.props;
      if (match.status && match.status.status == FootballEventType.FINISH) {
        params = {
          content: message,
          userNo: this.props.userInfo.userNo,
          token: token,
          danmuIndex: this.state.currentMedia,
          danmuSecond: this.state.videoTime + 1,
        };
      }
      new Request().post(`${api.API_SYSTEM_SECURITY_CHECK}`, message).then(res => {
        if (res == true) {
          this.socketTask && this.socketTask.send({
            data: JSON.stringify(params),
            success: () => {
              resolve(null);
            },
            fail: () => {
              reject();
              Taro.showToast({title: "发送失败", icon: "none"});
            }
          })
        } else {
          reject();
          Taro.showToast({title: "内容含有违法违规内容", icon: "none"});
        }
      });
    })
  }
  clearTimer_playCountDown = () => {
    if (this.state.timeoutID_playCountDown) {
      clearTimeout(this.state.timeoutID_playCountDown)
    }
  }
  startTimer_Danmu = () => {
    this.clearTimer_Danmu();
    const timerID_danmu = setInterval(() => {
      this.refreshDanmu();
    }, 100)
    this.setState({timerID_danmu: timerID_danmu})
  }
  clearTimer_Danmu = () => {
    if (this.state.timerID_danmu) {
      clearInterval(this.state.timerID_danmu)
      this.setState({timerID_danmu: null})
    }
  }
  startTimer_Gift = () => {
    this.clearTimer_Gift();
    const timerID_giftController = setInterval(() => {
      this.addUnsetToGiftSendQueue();
    }, 1000)
    this.setState({timerID_giftController: timerID_giftController})
  }
  clearTimer_Gift = () => {
    if (this.state.timerID_giftController) {
      clearInterval(this.state.timerID_giftController)
      this.setState({timerID_giftController: null})
    }
  }
  startTimer_HeartBeat = () => {
    this.clearTimer_HeartBeat();
    const timerID_socketHeartBeat = setInterval(() => {
      this.socketTask && this.socketTask.send({data: "success"});
    }, 5000)
    this.setState({timerID_socketHeartBeat: timerID_socketHeartBeat})
  }
  clearTimer_HeartBeat = () => {
    if (this.state.timerID_socketHeartBeat) {
      clearInterval(this.state.timerID_socketHeartBeat)
      this.setState({timerID_socketHeartBeat: null})
    }
  }
  startTimer_CountDown = () => {
    this.clearTimer_CountDown();
    const timerID_CountDown = setInterval(() => {
      this.getDiffTime()
    }, 1000)
    this.setState({timerID_CountDown: timerID_CountDown});
  }
  clearTimer_CountDown = () => {
    if (this.state.timerID_CountDown) {
      clearInterval(this.state.timerID_CountDown)
      this.setState({timerID_CountDown: null});
    }
  }
  startTimer_matchStatus = (id) => {
    this.clearTimer_matchStatus();
    const timerID_matchStatus = setInterval(() => {
      const {match} = this.props;
      this.getParamId() && this.getMatchInfo(this.getParamId()).then((data) => {
        this.setUpNooice(data);
        this.getUserChargeInfo(data, false);
        if (match.status && match.status.status != FootballEventType.FINISH && data.status.status == FootballEventType.FINISH) {
          this.getLiveMediaInfo(data.activityId)
          this.getMatchDanmu(data.id, this.state.currentMedia);
        } else {
          if (match.status && match.status.status != FootballEventType.FINISH) {
            this.getLiveInfo(data.activityId);
          }
        }
      })
      if (match.type.includes(MATCH_TYPE.timeLine)) {
        this.getMatchStatus(id);
      }
      this.getTeamHeatInfo(id, null);
      this.getGiftRanks(id);
    }, 30000)
    this.setState({timerID_matchStatus: timerID_matchStatus});
  }
  clearTimer_matchStatus = () => {
    if (this.state.timerID_matchStatus) {
      clearInterval(this.state.timerID_matchStatus)
      this.setState({timerID_matchStatus: null});
    }
  }

  // startTimer_liveInfo = (id) => {
  //   this.clearTimer_liveInfo();
  //   this.timerID_liveInfo = setInterval(() => {
  //     this.setState({liveLoading: true})
  //     this.getLiveInfo(id).then((res) => {
  //       if (res.isPushing) {
  //         this.setState({liveLoaded: true, liveLoading: false})
  //       } else {
  //         this.setState({liveLoaded: false, liveLoading: false})
  //       }
  //     });
  //   }, 60000)
  // }
  // clearTimer_liveInfo = () => {
  //   if (this.timerID_liveInfo) {
  //     clearInterval(this.timerID_liveInfo)
  //   }
  // }

  async getUserInfo(onSuccess?: Function | null) {
    if (await hasLogin()) {
      const openid = await getStorage('wechatOpenid');
      userAction.getUserInfo({openId: openid}, {
        success: (res) => {
          Taro.hideLoading()
          Taro.stopPullDownRefresh()
          if (onSuccess) {
            onSuccess(res);
          }
        }, failed: () => {
          this.clearLoginState();
          Taro.hideLoading()
          Taro.stopPullDownRefresh()
        }
      });
    } else {
      this.clearLoginState();
      Taro.hideLoading()
      Taro.stopPullDownRefresh()
    }
  }

  getMatchMediaClip = (id) => {
    new Request().get(api.API_MATCH_MEDIA, {matchId: id}, false).then((data: any) => {
      if (Array.isArray(data)) {
        this.setState({matchClips: data})
      }
    })
  }

  getMatchDanmu = (id, index) => {
    matchAction.getMatchDanmu({matchId: id, index: index});
  }
  getMatchInfo = (id) => {
    let userNo = null;
    if (this.props.userInfo && this.props.userInfo.userNo) {
      userNo = this.props.userInfo.userNo;
    }
    return matchAction.getMatchInfo({id: id, userNo: userNo})
  }
  getMatchStatus = (id) => {
    return matchAction.getMatchStatus({matchId: id}).then((data) => {
      this.state.refreshStatisticsFunc && this.state.refreshStatisticsFunc();
      return data;
    });
  }
  getLiveMediaInfo = (id) => {
    return liveAction.getLiveMediaList(id)
  }
  getLiveInfo = (id, callback?) => {
    this.setState({liveLoading: true})
    // liveAction.livePing(id).then((res) => {
    let url = api.API_ACTIVITY_PING;
    if (CacheManager.getInstance().CACHE_ENABLED) {
      url = api.API_CACHED_LIVE_MANUAL(id);
    }
    new Request().get(url, {activityId: id}, false).then((res: any) => {
      if (res.isPushing) {
        this.setState({ping: res, liveLoaded: true, liveLoading: false}, () => {
          callback && callback()
        })
      } else {
        this.setState({ping: res, liveLoaded: false, liveLoading: false}, () => {
          callback && callback()
        })
      }
    })
    // })
  }
  getUserChargeInfo = (match, showPay) => {
    new Request().get(api.API_CHARGE_USER, {matchId: match.id}, false).then((res: any) => {
      if (res) {
        this.setState({needGiftLive: res.needGiftLive})
        let needPayRecord = res.needPayRecord;
        let needPayLive = res.needPayLive;
        if (match.status && match.status.status == FootballEventType.FINISH) {
          if ((match.isRecordCharge && needPayRecord)) {
            this.setState({needPay: true})
          } else {
            this.setState({needPay: false})
          }
        } else {
          if ((match.isLiveCharge && needPayLive)) {
            this.setState({needPay: true})
          } else {
            this.setState({needPay: false})
          }
        }
        if (showPay) {
          if (match.status && match.status.status == FootballEventType.FINISH && match.isRecordCharge && needPayRecord) {
            this.showPay(this.getCharge(match, false))
          } else if (match.status && match.status.status != FootballEventType.FINISH && match.isLiveCharge && needPayLive) {
            this.showPay(this.getCharge(match, false))
          }
        }
      }
    })
  }
  getTeamHeatInfo = (id, type) => {
    let heatType = this.state.heatType;
    if (type != null) {
      heatType = type;
    }
    if (heatType == HEAT_TYPE.TEAM_HEAT) {
      new Request().get(api.API_MATCH_TEAM_HEAT, {matchId: id}).then((data: any) => {
        // let teamHeats = {};
        if (Array.isArray(data)) {
          //   for (let teamHeat of data) {
          //     teamHeats[teamHeat.teamId] = teamHeat;
          //   }
          this.setState({teamHeats: data})
        }
      })
    }
  }
  onPlayerHeatRefresh = (func) => {
    this.setState({playerHeatRefreshFunc: func});
  }
  getPlayerHeatInfo = (pageNum, pageSize, name) => {
    return new Promise((resolve) => {
      if (this.state.playerHeatLoading) {
        return;
      }
      let heatType = this.state.heatType;
      let param: any = {pageNum: pageNum, pageSize: pageSize}
      if (name) {
        param.name = name;
      }
      if (heatType == HEAT_TYPE.PLAYER_HEAT) {
        param.matchId = this.getParamId();
        this.setState({playerHeatLoading: true})
        new Request().get(api.API_MATCH_PLAYER_HEAT, param).then((data: any) => {
          this.setState({playerHeatLoading: false})
          if (name) {
            this.setState({playerHeats: data}, () => {
              resolve(data.records);
            })
          } else {
            this.setState({playerHeats: data, topPlayerHeats: this.getTopThreeHeat(data.records)}, () => {
              resolve(data.records);
            })
          }
        })
        // new Request().get(api.API_MATCH_PLAYER_HEAT_TOTAL, {matchId: this.getParamId()}).then((data: any) => {
        //   this.setState({playerHeatTotal: data})
        // })
      } else if (heatType == HEAT_TYPE.LEAGUE_PLAYER_HEAT) {
        param.leagueId = this.state.leagueId;
        this.setState({playerHeatLoading: true})
        new Request().get(api.API_LEAGUE_PLAYER_HEAT, param).then((data: any) => {
          if (this.state.heatRule != null && this.state.heatRule.cashAvailable && this.state.heatRule.cashPercentMap) {
            const cashPercentMap = this.state.heatRule.cashPercentMap;
            const keys: Array<any> = Object.keys(cashPercentMap);
            let max = 0;
            for (let key of keys) {
              if (key >= max) {
                max = key;
              }
            }
            this.setState({cashAvailableHeats: this.getTopHeat(data.records, max)})
          }
          this.setState({playerHeatLoading: false})
          if (name) {
            this.setState({playerHeats: data}, () => {
              resolve(data.records);
            })
          } else {
            this.setState({playerHeats: data, topPlayerHeats: this.getTopThreeHeat(data.records)}, () => {
              resolve(data.records);
            })
          }
        })
        // new Request().get(api.API_LEAGUE_PLAYER_HEAT_TOTAL, {leagueId: this.state.leagueId}).then((data: any) => {
        //   this.setState({playerHeatTotal: data})
        // })
      }
    });
  }
  getPlayerHeatInfoAdd = (pageNum, pageSize, name) => {
    if (this.state.playerHeatLoading) {
      return;
    }
    let heatType = this.state.heatType;
    let param: any = {pageNum: pageNum, pageSize: pageSize}
    if (name) {
      param.name = name;
    }
    if (heatType == HEAT_TYPE.PLAYER_HEAT) {
      param.matchId = this.getParamId();
      this.setState({playerHeatLoading: true})
      new Request().get(api.API_MATCH_PLAYER_HEAT, param).then((data: any) => {
        this.setState({playerHeatLoading: false})
        const playerHeats = this.state.playerHeats;
        playerHeats.records = playerHeats.records.concat(data.records);
        playerHeats.current = data.current;
        if (playerHeats.current > data.pages) {
          playerHeats.current = data.pages;
        }
        this.setState({playerHeats: playerHeats})
      })
    } else if (heatType == HEAT_TYPE.LEAGUE_PLAYER_HEAT) {
      param.leagueId = this.state.leagueId;
      this.setState({playerHeatLoading: true})
      new Request().get(api.API_LEAGUE_PLAYER_HEAT, param).then((data: any) => {
        this.setState({playerHeatLoading: false})
        const playerHeats = this.state.playerHeats;
        playerHeats.records = playerHeats.records.concat(data.records);
        playerHeats.current = data.current;
        if (playerHeats.current > data.pages) {
          playerHeats.current = data.pages;
        }
        this.setState({playerHeats: playerHeats})
      })
    }
  }
  onLeagueTeamHeatRefresh = (func) => {
    this.setState({leagueTeamHeatRefreshFunc: func});
  }
  getLeagueTeamHeatInfo = (pageNum, pageSize, name) => {
    return new Promise((resolve) => {
      if (this.state.leagueTeamHeatLoading) {
        return;
      }
      let heatType = this.state.heatType;
      let param: any = {pageNum: pageNum, pageSize: pageSize}
      if (name) {
        param.name = name;
      }
      if (heatType == HEAT_TYPE.LEAGUE_TEAM_HEAT) {
        param.leagueId = this.state.leagueId;
        this.setState({leagueTeamHeatLoading: true})
        new Request().get(api.API_LEAGUE_TEAM_HEAT, param).then((data: any) => {
          this.setState({leagueTeamHeatLoading: false})
          if (name) {
            this.setState({leagueTeamHeats: data}, () => {
              resolve(data.records);
            })
          } else {
            this.setState({leagueTeamHeats: data, topLeagueTeamHeats: this.getTopThreeHeat(data.records)}, () => {
              resolve(data.records);
            })
          }
        })
        // new Request().get(api.API_LEAGUE_TEAM_HEAT_TOTAL, {leagueId: this.state.leagueId}).then((data: any) => {
        //   this.setState({leagueTeamHeatTotal: data})
        // })
      }
    })
  }
  getLeagueTeamHeatInfoAdd = (pageNum, pageSize, name) => {
    if (this.state.leagueTeamHeatLoading) {
      return;
    }
    let heatType = this.state.heatType;
    let param: any = {pageNum: pageNum, pageSize: pageSize}
    if (name) {
      param.name = name;
    }
    if (heatType == HEAT_TYPE.LEAGUE_TEAM_HEAT) {
      param.leagueId = this.state.leagueId;
      this.setState({leagueTeamHeatLoading: true})
      new Request().get(api.API_LEAGUE_TEAM_HEAT, param).then((data: any) => {
        this.setState({leagueTeamHeatLoading: false})
        const teamHeats = this.state.leagueTeamHeats;
        teamHeats.records = teamHeats.records.concat(data.records);
        teamHeats.current = data.current;
        if (teamHeats.current > data.pages) {
          teamHeats.current = data.pages;
        }
        this.setState({leagueTeamHeats: teamHeats})
      })
    }
  }
  getTopThreeHeat = (heatObjects) => {
    let sorted: any = [];
    let index = 1;
    for (let i = 0; i < heatObjects.length; i++) {
      let heat = this.getHeat(heatObjects[i]);
      if (heat == 0) {
        continue;
      }
      if (index <= 3) {
        if (i == 0) {
          index = 1;
          heatObjects[i].index = index;
          sorted.push(heatObjects[i]);
          continue;
        }
        let heatPre = this.getHeat(heatObjects[i - 1]);
        if (heat == heatPre) {
          heatObjects[i].index = index;
          sorted.push(heatObjects[i]);
        } else {
          index = index + 1;
          if (index <= 3) {
            heatObjects[i].index = index;
            sorted.push(heatObjects[i]);
          }
        }
      }
    }
    return sorted;
  }
  getTopHeat = (heatObjects, top) => {
    let sorted: any = [];
    let index = 1;
    for (let i = 0; i < heatObjects.length; i++) {
      let heat = this.getHeat(heatObjects[i]);
      if (heat == 0) {
        continue;
      }
      if (index <= top) {
        if (i == 0) {
          index = 1;
          heatObjects[i].index = index;
          sorted.push(heatObjects[i]);
          continue;
        }
        let heatPre = this.getHeat(heatObjects[i - 1]);
        if (heat == heatPre) {
          heatObjects[i].index = index;
          sorted.push(heatObjects[i]);
        } else {
          index = index + 1;
          if (index <= top) {
            heatObjects[i].index = index;
            sorted.push(heatObjects[i]);
          }
        }
      }
    }
    return sorted;
  }
  getHeat = (heatObject) => {
    let heat = 0;
    if (heatObject.heat) {
      heat = heat + heatObject.heat;
    }
    if (heatObject.heatBase) {
      heat = heat + heatObject.heatBase;
    }
    return heat;
  }
  getCollection = async (id) => {
    const collectMatch = await getStorage('collectMatch')
    if (collectMatch == null) {
      this.setState({
        isCollect: false
      });
    } else {
      this.setState({
        isCollect: !!collectMatch[id]
      });
    }
  }
  getPlayPath = (match) => {
    if (this.state.statisticsMode) {
      return null;
    }
    if (match.status && match.status.status < FootballEventType.FINISH) {
      if (this.state.liveStatus != LiveStatus.ENABLED) {
        return null;
      }
      if (match.playPath && !match.playPath.startsWith('http')) {
        return "https://" + match.playPath;
      } else {
        return match.playPath;
      }
    } else {
      if (this.props.mediaList && this.props.mediaList.length > 0) {
        const index = this.state.currentMedia <= this.props.mediaList.length - 1 ? this.state.currentMedia : 0;
        const mediaUrl = this.props.mediaList[index].media ? this.props.mediaList[index].media.path : this.props.mediaList[index].url;
        if (!mediaUrl.startsWith('http')) {
          return "https://" + mediaUrl;
        } else {
          return mediaUrl;
        }
      }
    }
    return match.playPath;
  }
  getDiffTime = (data = null) => {
    const {match = data} = this.props;
    if (match) {
      const startTime = new Date(match.startTime);
      if (startTime) {
        const diff = getTimeDifference(startTime);
        this.setState({
          diffDayTime: diff,
        }, () => {
          this.setState({liveStatus: this.getLiveStatus()})
        });
      }
    }
  }
  getLiveStatus = () => {
    const {match = null} = this.props;
    let status = LiveStatus.ENABLED;
    if (match && match.status) {
      if (match.status.status == FootballEventType.FINISH) {
        status = LiveStatus.FINISH;
      } else {
        if (this.state.liveLoading && !this.state.liveLoaded) {
          status = LiveStatus.LOADING;
        } else if (this.state.diffDayTime != null && match.status.status == FootballEventType.UNOPEN && !this.state.ping.isPushing) {
          status = LiveStatus.UNOPEN;
        } else if (this.state.diffDayTime == null && match.status.status == FootballEventType.UNOPEN && !this.state.ping.isPushing) {
          status = LiveStatus.ONTIME;
        } else if (this.state.diffDayTime == null && match.status.status > FootballEventType.UNOPEN && !this.state.ping.isPushing) {
          status = LiveStatus.NOTPUSH;
        } else {
          status = LiveStatus.ENABLED;
        }
      }
    }
    return status;
  }
  getCommentList = (matchId) => {
    this.setState({chatLoading: true})
    matchAction.getMatchComment({
      pageNum: 1,
      pageSize: 10,
      matchId: matchId,
      // startTime: this.enterTime
      sortField: "createdAt",
      sortOrder: "desc"
    }).then(() => {
      // this.setState({commentIntoView: `message-${this.props.commentList.list.length}`})
      // const commentList: Array<any> = this.getCommentsList(this.props.commentList.records.concat(this.state.broadcastList));
      const commentList: Array<any> = this.getCommentsList(this.props.commentList.records);
      setTimeout(() => {
        if (commentList && commentList.length > 0) {
          this.setState({
            comments: commentList,
            chatLoading: false,
            commentIntoView: `message-${commentList[commentList.length - 1].id}`
          })
        } else {
          this.setState({
            comments: commentList,
            chatLoading: false,
          })
        }
      }, 2000)
    })
  }
  getCommentList_next = () => {
    const commentList: Array<any> = this.getCommentsList(this.props.commentList.records);
    return new Promise((resolve, reject) => {
      if (commentList.length >= 10) {
        resolve(null);
        return;
      }
      if (this.props.commentList.current >= this.props.commentList.pages) {
        resolve(null);
        return;
      }
      this.setState({chatLoading: true})
      matchAction.getMatchComment_add({
        pageNum: this.props.commentList.current ? this.props.commentList.current + 1 : 1,
        pageSize: 10,
        matchId: this.props.match.id,
        // startTime: this.enterTime
        sortField: "createdAt",
        sortOrder: "desc"
      }).then(() => {
        // const commentList_next: Array<any> = this.getCommentsList(this.props.commentList.records.concat(this.state.broadcastList));
        const commentList_next: Array<any> = this.getCommentsList(this.props.commentList.records);
        let index = commentList_next.indexOf(commentList[0]) - 1;
        if (index < 0) {
          index = 0
        }
        if (commentList && commentList.length > 0) {
          this.setState({
            comments: commentList_next,
            chatLoading: false,
            commentIntoView: `message-${commentList_next[index].id}`,
          })
        } else {
          this.setState({
            comments: commentList_next,
            chatLoading: false,
          })
        }
        resolve(null);
      }, () => {
        reject();
      })
    })
  }
  getCommentsList = (comments) => {
    // if (comments == null) {
    //   return null;
    // }
    // return comments.sort((item1, item2) => {
    //   const date1 = new Date(item1.date).getTime();
    //   const date2 = new Date(item2.date).getTime();
    //   return date1 > date2 ? 1 : (date1 == date2 ? 0 : -1)
    // });
    return comments;
  }
  setUpNooice = (match) => {
    const againstTeams = match.againstTeams;
    const againstTeamsNooice = match.againstTeamsNooice;
    const matchStatus = match.status;
    if (againstTeams && matchStatus && againstTeamsNooice) {
      let hostNooice = 0;
      let guestNooice = 0;
      if (againstTeamsNooice[matchStatus.againstIndex]) {
        hostNooice = againstTeamsNooice[matchStatus.againstIndex].hostNooice ? againstTeamsNooice[matchStatus.againstIndex].hostNooice : 0;
        guestNooice = againstTeamsNooice[matchStatus.againstIndex].guestNooice ? againstTeamsNooice[matchStatus.againstIndex].guestNooice : 0;
      }
      this.setState({leftNooice: hostNooice, rightNooice: guestNooice})
    } else {
      this.setState({leftNooice: 0, rightNooice: 0})
    }
  }

  isThisYear = (date: Date) => {
    const nowDate = new Date();
    if (nowDate.getFullYear() == date.getFullYear()) {
      return true;
    }
    return false;
  }
  switchTab = (tab) => {
    const {match = null} = this.props;
    let {tabs} = this.getTabsList(match);
    if (tab == tabs[TABS_TYPE.lineUp]) {
      this.state.onLineUpClick && this.state.onLineUpClick();
    }
    this.setState({
      currentTab: tab
    })
  }
  onLeagueClick = (item) => {
    if (item.isParent) {
      Taro.navigateTo({url: `../series/series?id=${item.id}`});
    } else {
      Taro.navigateTo({url: `../leagueManager/leagueManager?id=${item.id}`});
    }
  }
  addNooice = (againstIndex, teamId) => {
    matchAction.addMatchNooice({matchId: this.props.match.id, againstIndex: againstIndex, teamId: teamId})
  }
  handleLeftNooice = async () => {
    // if (!this.state.nooiceEnabled) {
    //   Taro.showToast({title: "点赞太快了,请稍后再试哦", icon: "none"})
    //   return
    // }
    if (!await this.isUserLogin()) {
      this.showAuth();
      return;
    }
    this.setState({nooiceLeftMoveClass: 'move', nooiceEnabled: false});
    setTimeout(() => {
      this.setState({
        nooiceLeftMoveClass: '',
        leftNooice: this.state.leftNooice + 1,
        nooiceEnabled: true
      });
      const {againstIndex, againstTeam} = this.getCurrentAgainstTeam();
      againstTeam && againstTeam.hostTeam && this.addNooice(againstIndex, againstTeam.hostTeam.id)
    }, 1000);
  }
  handleRightNooice = async () => {
    // if (!this.state.nooiceEnabled) {
    //   Taro.showToast({title: "点赞太快了,请稍后再试哦", icon: "none"})
    //   return
    // }
    if (!await this.isUserLogin()) {
      this.showAuth();
      return;
    }
    this.setState({nooiceRightMoveClass: 'move', nooiceEnabled: false});
    setTimeout(() => {
      this.setState({
        nooiceRightMoveClass: '',
        rightNooice: this.state.rightNooice + 1,
        nooiceEnabled: true
      });
      const {againstIndex, againstTeam} = this.getCurrentAgainstTeam();
      againstTeam && againstTeam.guestTeam && this.addNooice(againstIndex, againstTeam.guestTeam.id)
    }, 1000);
  }
  onCollectClick = async () => {
    if (!await this.isUserLogin()) {
      this.showAuth();
      return;
    }
    const collectMatch = await getStorage('collectMatch')
    let collect = {};
    if (collectMatch != null) {
      collect = collectMatch;
    }
    collect[this.props.match.id] = this.state.isCollect ? false : this.props.match

    Taro.setStorage({key: 'collectMatch', data: collect}).then(() => {
      this.setState({
        isCollect: !this.state.isCollect
      }, () => {
        if (this.state.isCollect) {
          Taro.showToast({title: "收藏成功", icon: "none"});
        } else {
          Taro.showToast({title: "取消收藏成功", icon: "none"});
        }
      });
    }, () => {
      Taro.showToast({title: "收藏失败", icon: "none"});
    });
  }

  showAuth = () => {
    this.setState({loginOpen: true});
  }

  onAuthClose = () => {
    this.setState({loginOpen: false})
  }

  onAuthCancel = () => {
    this.setState({loginOpen: false})
  }

  onAuthError = (reason) => {
    switch (reason) {
      case error.ERROR_WX_UPDATE_USER: {
        Taro.showToast({
          title: "更新用户信息失败",
          icon: 'none',
        });
        return;
      }
      case error.ERROR_WX_LOGIN: {
        Taro.showToast({
          title: "微信登录失败",
          icon: 'none',
        });
        return;
      }
      case error.ERROR_LOGIN: {
        Taro.showToast({
          title: "登录失败",
          icon: 'none',
        });
        return;
      }
    }
  }

  onAuthSuccess = () => {
    this.setState({loginOpen: false})
    this.initSocket(this.props.match.id)
    this.getUserInfo((res) => {
      const phone = res.payload.phone
      depositAction.getDeposit(res.userNo);
      if (res.payload != null && phone == null) {
        this.setState({phoneOpen: true})
      }
      this.initPayConfig(res.userNo);
    })
    this.getUserChargeInfo(this.props.match, false);
  }

  showPhone = async () => {
    const {userInfo} = this.props
    if (userInfo && userInfo.phone) {
      return;
    }
    if (!await this.isUserLogin()) {
      Taro.showToast({title: "请登录后再操作", icon: "none"});
      this.showAuth();
    } else {
      this.setState({phoneOpen: true})
    }
  }

  onPhoneClose = () => {
    this.setState({phoneOpen: false})
  }

  onPhoneCancel = () => {
    this.setState({phoneOpen: false})
  }

  onPhoneError = (reason) => {
    switch (reason) {
      case error.ERROR_WX_UPDATE_USER: {
        Taro.showToast({
          title: "更新用户信息失败",
          icon: 'none',
        });
        return;
      }
      case error.ERROR_WX_LOGIN: {
        Taro.showToast({
          title: "微信登录失败",
          icon: 'none',
        });
        return;
      }
      case error.ERROR_LOGIN: {
        Taro.showToast({
          title: "登录失败",
          icon: 'none',
        });
        return;
      }
    }
  }

  onPhoneSuccess = () => {
    this.setState({phoneOpen: false})
    this.getUserInfo()
  }
  showPay = async (charge: MatchCharge) => {
    // const {userInfo} = this.props
    // if (userInfo && userInfo.phone) {
    //   return;
    // }
    if (!await this.isUserLogin()) {
      Taro.showToast({title: "请登录后再操作", icon: "none"});
      this.showAuth();
    } else {
      this.setState({payOpen: true, charge: charge})
    }
  }

  onPayClose = () => {
    this.onPayConfirmClose();
    this.setState({payOpen: false})
  }

  onPayCancel = () => {
    this.onPayConfirmClose();
    this.setState({payOpen: false})
  }

  onPayError = (reason) => {
    this.onPayConfirmClose();
    switch (reason) {
      case error.ERROR_PAY_CANCEL: {
        Taro.showToast({
          title: "支付失败,用户取消支付",
          icon: 'none',
        });
        return;
      }
      case error.ERROR_PAY_ERROR: {
        Taro.showToast({
          title: "支付失败",
          icon: 'none',
        });
        return;
      }
    }
  }

  onPaySuccess = (orderId: string) => {
    this.onPayConfirmClose();
    this.setState({payOpen: false})
    this.getOrderStatus(orderId, null)
  }

  onGiftPayError = (reason) => {
    this.onPayConfirmClose();
    switch (reason) {
      case error.ERROR_PAY_CANCEL: {
        Taro.showToast({
          title: "支付失败,用户取消支付",
          icon: 'none',
        });
        return;
      }
      case error.ERROR_PAY_ERROR: {
        Taro.showToast({
          title: "支付失败",
          icon: 'none',
        });
        return;
      }
      case error.ERROR_SEND_GIFT_ERROR: {
        Taro.showToast({
          title: "赠送礼物失败",
          icon: 'none',
        });
        return;
      }
    }
  }

  onGiftPaySuccess = (orderId: any) => {
    this.onPayConfirmClose();
    this.setState({giftOpen: false})
    if (orderId == GIFT_TYPE.FREE) {
      this.getParamId() && this.getTeamHeatInfo(this.getParamId(), null);
      this.getParamId() && payAction.getGiftList();
      this.state.playerHeatRefreshFunc && this.state.playerHeatRefreshFunc();
      this.state.leagueTeamHeatRefreshFunc && this.state.leagueTeamHeatRefreshFunc();
      this.getUserChargeInfo(this.props.match, false);
    } else {
      this.getOrderStatus(orderId, ORDER_TYPE.gift);
    }
    Taro.showToast({
      title: "送出礼物成功",
      icon: 'none',
    });
  }

  getOrderStatus = async (orderId: string, type) => {
    new Request().get(api.API_ORDER_QUERY, {orderId: orderId}).then((res) => {
      if (res == ORDER_STAUTS.paid) {
        Taro.showToast({
          title: "支付成功",
          icon: 'none',
        });
        if (type != null && type == ORDER_TYPE.gift) {
          this.getParamId() && this.getTeamHeatInfo(this.getParamId(), null);
          this.state.playerHeatRefreshFunc && this.state.playerHeatRefreshFunc();
          this.state.leagueTeamHeatRefreshFunc && this.state.leagueTeamHeatRefreshFunc();
          this.getUserChargeInfo(this.props.match, false);
        } else if (type != null && type == ORDER_TYPE.leagueMember) {
          this.setState({needPay: false})
          this.getUserChargeInfo(this.props.match, false);
          this.getParamId() && this.getMatchStatus(this.getParamId());
        } else {
          this.setState({needPay: false})
          this.getUserChargeInfo(this.props.match, false);
        }
        // this.isUserLevelUp();
      }
    });
  }
  isUserLevelUp = () => {
    const level = getExpInfoByExpValue(this.props.expInfo, this.props.userInfo.userExp.exp).level
    this.getUserInfo((userInfo) => {
      const currentLevel = getExpInfoByExpValue(this.props.expInfo, userInfo.payload.userExp.exp).level
      if (currentLevel >= (Math.ceil(level / 10)) * 10) {
        this.setState({levelUpShow: true, currentLevel: currentLevel})
      }
    })
  }
  getCharge = (data, monopolyOnly): MatchCharge => {
    if (data.status && data.status.status == FootballEventType.FINISH) {
      return {
        price: data.recordPrice,
        type: ORDER_TYPE.record,
        monthlyPrice: data.recordMonthPrice,
        matchId: data.id,
        isMonopolyCharge: data.isMonopolyCharge,
        monopolyPrice: data.monopolyPrice,
        monopolyOnly: monopolyOnly
      }
    } else {
      return {
        price: data.livePrice,
        type: ORDER_TYPE.live,
        monthlyPrice: data.liveMonthPrice,
        matchId: data.id,
        isMonopolyCharge: data.isMonopolyCharge,
        monopolyPrice: data.monopolyPrice,
        monopolyOnly: monopolyOnly
      }
    }
  }
  isUserLogin = async () => {
    const token = await getStorage('accessToken');
    if (token == null || token == '' || this.props.userInfo.userNo == null || this.props.userInfo.userNo == '') {
      return false;
    } else {
      return true;
    }
  }
  clearLoginState = () => {
    clearLoginToken();
    userAction.clearUserInfo();
  }
  bindFullScreen = (e) => {
    const {fullScreen} = e.detail;
    this.setState({isFullScreen: fullScreen})
  }
  handleVideoArrowClick = () => {
    this.setState({videoShowMore: !this.state.videoShowMore})
  }
  handleMediaListMoreClick = () => {
    this.setState({mediaListShowMore: !this.state.mediaListShowMore})
  }
  handleMediaFragmentClick = (index) => {
    this.getMatchDanmu(this.props.match.id, index);
    this.setState({currentMedia: index})
  }
  bindPlayEnd = () => {
    const match = this.props.match;
    if (match.status && match.status.status < FootballEventType.FINISH) {
      return;
    } else {
      if (this.props.mediaList && this.props.mediaList.length > 0) {
        if (this.props.mediaList[this.state.currentMedia + 1]) {
          this.getMatchDanmu(this.props.match.id, this.state.currentMedia + 1);
          this.setState({currentMedia: this.state.currentMedia + 1})
        }
      }
    }
  }
  bindPlayStart = async () => {
    if (!this.state.firstplay) {
      if (this.state.tryplayed) {
        if (!await this.isUserLogin()) {
          this.showAuth();
          this.videoContext && this.videoContext.pause();
        }
      }
      return
    }
    setTimeout(() => {
      this.setState({videoShowMore: false})
    }, 3000)
    this.setState({firstplay: false})
    if (!await this.isUserLogin()) {
      this.clearTimer_playCountDown();
      const timeoutID_playCountDown = setTimeout(async () => {
        if (this.props.match && this.props.match.status && this.props.match.status.status == FootballEventType.FINISH) {
          if (!await this.isUserLogin()) {
            this.setState({tryplayed: true})
            Taro.showToast({
              title: "录播视频只提供10秒试看，登录后可观看完整视频。",
              duration: 2000,
              icon: "none",
            });
            this.showAuth();
            this.videoContext && this.videoContext.pause();
          }
        }
      }, 10000)
      this.setState({timeoutID_playCountDown: timeoutID_playCountDown})
    }
  }

  handleVideoTime = (e) => {
    const {danmuList = null, match = null} = this.props;
    if ((match && match.status && match.status.status == FootballEventType.FINISH)) {
      this.setState({videoTime: Math.floor(e.detail.currentTime)})
      danmuList && danmuList.map(item => {
        if (item.time == Math.floor(e.detail.currentTime) && this.animElemIds[item.id] == null) {
          // console.log("e.detail.currentTime-" + item.id)
          // console.log(e.detail.currentTime)
          this.animElemIds[item.id] = `danmu-${item.id}`;
          item.row = this.assignDanmuRow(item)
          this.state.danmuCurrent.push(item)
          this.initAnimation(item.id);
          this.setState({danmuCurrent: this.state.danmuCurrent})
        }
      })
    }
  }
  sendLiveDanmu = (item) => {
    item.row = this.assignDanmuRow(item)
    this.state.danmuCurrent.push(item)
    this.initAnimation(item.id);
    this.setState({danmuCurrent: this.state.danmuCurrent})
  }

  initAnimation(id) {
    this.timeout_danmu[id] = setTimeout(() => {
      this.timeout_danmu[id] = null
    }, 6000)
  }

  refreshDanmu = () => {
    const indexs: Array<any> = [];
    if (this.state.danmuCurrent && this.state.danmuCurrent.length > 0) {
      this.state.danmuCurrent.map((item) => {
        if (this.timeout_danmu[item.id] == null) {
          indexs.push(item);
        }
      });
    }
    if (indexs.length > 0) {
      if (this.isupdating) {
        return;
      }
      this.isupdating = true;
      indexs.map(item => {
        this.state.danmuCurrent.splice(this.state.danmuCurrent.indexOf(item), 1);
      })
      this.setState({danmuCurrent: this.state.danmuCurrent}, () => {
        indexs.map(item => {
          this.animElemIds[item.id] = null;
        })
        this.isupdating = false;
      });
    }
  }
  assignDanmuRow = (danmuItem) => {
    let rowIndex = -1;
    const isNext = (row) => {
      let next = false;
      row.map(col => {
        if (col.time == danmuItem.time) {
          next = true;
        }
      })
      return next;
    }
    let isFind = false;
    this.danmuRow.map((row, index) => {
      if (!isNext(row) && !isFind) {
        this.danmuRow[index].push(danmuItem)
        setTimeout(() => {
          this.danmuRow[index].splice(this.danmuRow[index].indexOf(danmuItem), 1);
        }, 6000)
        rowIndex = index;
        isFind = true;
      }
    })
    // console.log("this.danmuRow-" + rowIndex)
    // console.log(this.danmuRow)
    if (rowIndex == -1) {
      const danmu = danmuItem
      danmu.time = danmu.time + 3;
      return this.assignDanmuRow(danmu)
    }
    return rowIndex;
  }
  bindPlayError = (_e) => {
    // console.log("bindPlayError")
    // console.log(e)
  }
  onCurtainClose = () => {
    this.setState({curtainShow: false})
  }
  handleCurtainClick = () => {
    const curtain = this.state.curtain;
    if (curtain) {
      if (curtain.type == 'website') {
        Taro.navigateTo({url: `../webview/webview?url=${encodeURIComponent(curtain.url)}`});
      } else if (curtain.type == 'page') {
        Taro.navigateTo({url: curtain.url});
      }
    }
  }
  onPremissionClose = () => {
    this.setState({permissionShow: false})
  }
  onPremissionCancel = () => {
    this.setState({permissionShow: false})
  }
  onPremissionSuccess = () => {
    this.setState({permissionShow: false})
  }
  onShareMoment = () => {
    const {match = null} = this.props;
    this.setState({downLoading: true})
    new Request().get(api.API_GET_SHARE_MOMENT_PICTURE, {
      matchId: match.id,
      against: match.status && match.status.againstIndex ? match.status.againstIndex : 1
    }).then((imageUrl: string) => {
      if (imageUrl == null) {
        Taro.showToast({title: "获取图片失败", icon: "none"});
        this.setState({downLoading: false})
        return;
      }
      Taro.downloadFile({
        url: imageUrl,
        success: (res) => {
          if (res.statusCode === 200) {
            Taro.saveImageToPhotosAlbum({filePath: res.tempFilePath}).then(saveres => {
              console.log(saveres)
              this.showMessage("图片保存到相册成功，快去发朋友圈吧", "none")
              this.setState({downLoading: false})
            }, () => {
              this.showMessage("图片保存到相册失败", "error")
              this.setState({downLoading: false, permissionShow: true})
            })
          }
        }
      });
    })
  }
  getSharePicture = (data) => {
    new Request().get(api.API_GET_SHARE_PICTURE, {
      matchId: data.id,
      against: data.status && data.status.againstIndex ? data.status.againstIndex : 1
    }).then((imageUrl: string) => {
      if (imageUrl == null) {
        return;
      }
      this.setState({sharePictureUrl: imageUrl})
    })
  }
  showMessage = (title, type) => {
    Taro.showToast({
      'title': title,
      'icon': type,
    })
  }
  onPayClick = () => {
    const {match = null} = this.props;
    this.showPay(this.getCharge(match, false))
  }
  onMonopolyClick = () => {
    const {match = null} = this.props;
    if (!match.isMonopoly) {
      this.showPay(this.getCharge(match, true))
    }
  }
  getTabsList = (match) => {
    let tabList: any = []
    const tabs: any = {};
    let tabIndex = 0;
    //球员热度比拼
    if (this.state.heatType == HEAT_TYPE.PLAYER_HEAT) {
      tabList.push({title: '人气榜'})
      tabs[TABS_TYPE.heatPlayer] = tabIndex;
      tabIndex = tabIndex + 1;
    } else if (this.state.heatType == HEAT_TYPE.LEAGUE_PLAYER_HEAT) {
      let leaguePlayerHeatTitle = '人气PK'
      if (this.state.heatRule && this.state.heatRule.cashAvailable) {
        leaguePlayerHeatTitle = '球星夸夸榜'
      }
      tabList.push({title: leaguePlayerHeatTitle})
      tabs[TABS_TYPE.heatPlayer] = tabIndex;
      tabIndex = tabIndex + 1;
    }
    if (this.state.heatType == HEAT_TYPE.LEAGUE_TEAM_HEAT) {
      tabList.push({title: '人气榜'})
      tabs[TABS_TYPE.heatLeagueTeam] = tabIndex;
      tabIndex = tabIndex + 1;
    }
    tabList.push({title: this.state.heatType == HEAT_TYPE.TEAM_HEAT ? "有奖PK" : (match && match.type && match.type.indexOf(MATCH_TYPE.timeLine) != -1 ? "聊天" : "赛况")})
    tabs[TABS_TYPE.matchUp] = tabIndex;
    tabIndex = tabIndex + 1;
    // //开启热度比拼
    // if (this.state.heatType == HEAT_TYPE.TEAM_HEAT || this.state.heatType == HEAT_TYPE.PLAYER_HEAT || this.state.heatType == HEAT_TYPE.LEAGUE_PLAYER_HEAT) {
    //   tabList.push({title: '奖励'})
    //   tabs[TABS_TYPE.heatReward] = tabIndex;
    //   tabIndex = tabIndex + 1;
    // }
    // //开启打赏榜
    // if (this.state.heatType == HEAT_TYPE.TEAM_HEAT || this.state.heatType == HEAT_TYPE.PLAYER_HEAT || this.state.heatType == HEAT_TYPE.LEAGUE_PLAYER_HEAT) {
    //   tabList.push({title: '打赏榜'})
    //   tabs[TABS_TYPE.giftRank] = tabIndex;
    //   tabIndex = tabIndex + 1;
    // }
    //开启集锦
    if (match && match.type && match.type.indexOf(MATCH_TYPE.clip) != -1) {
      tabList.push({title: '集锦'})
      tabs[TABS_TYPE.clip] = tabIndex;
      tabIndex = tabIndex + 1;
    }
    //开启统计
    if (match && match.type && match.type.indexOf(MATCH_TYPE.timeLine) != -1) {
      tabList.push({title: '统计'})
      tabs[TABS_TYPE.statistics] = tabIndex;
      tabIndex = tabIndex + 1;
    }
    //开启名单
    if (match && match.type && match.type.indexOf(MATCH_TYPE.lineUp) != -1) {
      tabList.push({title: '名单'})
      tabs[TABS_TYPE.lineUp] = tabIndex;
      tabIndex = tabIndex + 1;
    }
    const tabKey = Object.keys(tabs).join(",");
    return {tabList, tabs, tabKey};
  }

  showGiftPanel = async () => {
    if (!await this.isUserLogin()) {
      this.showAuth();
      return;
    }
    if (this.props.userInfo && this.props.userInfo.phone == null) {
      this.setState({phoneOpen: true})
      return
    }
    this.setState({giftOpen: true})
  }
  hideGiftPanel = () => {
    this.setState({giftOpen: false})
  }
  getLeagueHeatStartTime = (heatRule, match) => {
    const {league = null} = match;
    if (league && league.dateBegin && heatRule && heatRule.startInterval) {
      let startTime = new Date(league.dateBegin)
      startTime.setMinutes(startTime.getMinutes() + heatRule.startInterval);
      return startTime;
    }
    return null
  }
  getLeagueHeatEndTime = (heatRule, match) => {
    const {league = null} = match;
    if (league && league.dateEnd && heatRule && heatRule.endInterval) {
      let endTime = new Date(league.dateEnd)
      endTime.setMinutes(endTime.getMinutes() + heatRule.endInterval);
      return endTime;
    }
    return null
  }
  getMatchHeatStartTime = (heatRule, match) => {
    if (match && match.startTime && heatRule && heatRule.startInterval) {
      let startTime = new Date(match.startTime)
      startTime.setMinutes(startTime.getMinutes() + heatRule.startInterval);
      return startTime;
    }
    return null
  }
  getMatchHeatEndTime = (heatRule, match) => {
    if (match && match.startTime && match.duration && heatRule && heatRule.endInterval) {
      let endTime = new Date(match.startTime)
      endTime.setMinutes(endTime.getMinutes() + match.duration + heatRule.endInterval);
      return endTime;
    }
    return null
  }
  handleLeftSupport = () => {
    const {match = null} = this.props;
    if (match == null || match.againstTeams == null) {
      return;
    }
    const {againstTeam} = this.getCurrentAgainstTeam();
    this.setState({currentSupportTeam: againstTeam.hostTeam})
    this.showGiftPanel();
  }
  handleRightSupport = () => {
    const {match = null} = this.props;
    if (match == null || match.againstTeams == null) {
      return;
    }
    const {againstTeam} = this.getCurrentAgainstTeam();
    this.setState({currentSupportTeam: againstTeam.guestTeam})
    this.showGiftPanel();
  }

  addUnsetToGiftSendQueue = () => {
    let unshiftIndex = -1;
    this.giftRows.unset.some((data, index) => {
      this.addToGiftSendQueue(data);
      unshiftIndex = index;
      return true;
    })
    if (unshiftIndex != -1) {
      this.giftRows.unset.splice(unshiftIndex, 1);
    }
  }

  addToGiftSendQueue = (giftBroadcast) => {
    let position = "left";
    const rand = Boolean(Math.round(Math.random()));
    if (rand) {
      position = "left";
    } else {
      position = "right";
    }

    giftBroadcast.position = position;
    const row = this.assignGiftRow(giftBroadcast, position);
    giftBroadcast.row = row;
    if (row != -1) {
      this.state.giftSendQueue.push(giftBroadcast)
      this.initGiftTimeout(giftBroadcast.id);
      this.setState({giftSendQueue: this.state.giftSendQueue})
    }
  }

  assignGiftRow = (giftBroadcast, position) => {
    let rowIndex = -1;
    let isInsert = false;
    const giftRow = this.giftRows[position];
    let giftRow_reverse = this.giftRows["position"];
    if (position == "left") {
      giftRow_reverse = this.giftRows["right"];
    } else {
      giftRow_reverse = this.giftRows["left"];
    }
    if (giftRow != null) {
      giftRow.map((row, index) => {
        if (row.id == null && giftRow_reverse[index].id == null && !isInsert) {
          giftRow[index] = giftBroadcast;
          rowIndex = index;
          isInsert = true;
        }
      })
    }
    if (rowIndex == -1) {
      this.giftRows.unset.push(giftBroadcast);
    }
    return rowIndex;
  }

  initGiftTimeout(id) {
    this.timeout_gift[id] = setTimeout(() => {
      this.timeout_gift[id] = null
      const showQueue = this.state.giftSendQueue;
      showQueue.forEach(data => {
        if (data.id == id) {
          data.active = true;
        }
      });
      this.setState({giftSendQueue: showQueue}, () => {
        this.timeout_gift_show[id] = setTimeout(() => {
          this.timeout_gift_show[id] = null
          const giftSendQueue = this.state.giftSendQueue.filter(item => item.id != id);
          this.setState({giftSendQueue: giftSendQueue});
          let giftRowsShadow = this.giftRows;
          for (let position in giftRowsShadow) {
            for (let rowKey in giftRowsShadow[position]) {
              if (giftRowsShadow[position][rowKey] != null && giftRowsShadow[position][rowKey].id == id) {
                giftRowsShadow[position][rowKey] = {};
              }
            }
          }
          this.giftRows = giftRowsShadow;
        }, 5000);
      });
    }, 300);
  }

  getGiftRanks = (id) => {
    this.setState({giftRanksLoading: true})
    let url = api.API_GIFT_RANK_MATCH(id)
    if (this.state.heatType == HEAT_TYPE.LEAGUE_PLAYER_HEAT || this.state.heatType == HEAT_TYPE.LEAGUE_TEAM_HEAT) {
      if (this.state.leagueId != null) {
        url = api.API_GIFT_RANK_LEAGUE(this.state.leagueId)
      } else {
        return;
      }
    }
    new Request().get(url, null).then((data: any) => {
      if (Array.isArray(data)) {
        data = data.filter(res => res.charge != null && res.charge != 0);
        this.setState({giftRanks: data, giftRanksLoading: false})
      }
    });
  }
  handlePlayerSupport = (player) => {
    this.setState({currentSupportPlayer: player})
    this.showGiftPanel();
  }
  handleLeagueTeamSupport = (team) => {
    this.setState({currentSupportTeam: team})
    this.showGiftPanel();
  }
  onGiftRankClick = () => {
    this.setState({giftRanksOpen: true});
  }
  onHeatRewardClick = (bottom) => {
    this.setState({heatRewardOpen: true, heatRewardScrollBottom: bottom != null ? bottom : false});
  }
  hideGfitRank = () => {
    this.setState({giftRanksOpen: false});
  }
  hideReward = () => {
    this.setState({heatRewardOpen: false, heatRewardScrollBottom: false});
  }
  showDownLoading = () => {
    this.setState({downLoading: true})
  }
  showShareMoment = (imgUrl) => {
    this.setState({downLoading: false})
    if (imgUrl) {
      this.setState({shareMomentPoster: imgUrl, shareMomentOpen: true})
    }
  }
  onShareMomentConfirm = () => {
    this.setState({shareMomentLoading: true})
    Taro.downloadFile({
      url: this.state.shareMomentPoster,
      success: (res) => {
        if (res.statusCode === 200) {
          Taro.saveImageToPhotosAlbum({filePath: res.tempFilePath}).then(saveres => {
            console.log(saveres)
            this.showMessage("图片保存到相册成功，快去发朋友圈吧", "none")
            this.setState({shareMomentLoading: false})
          }, () => {
            this.showMessage("图片保存到相册失败", "error")
            this.setState({shareMomentLoading: false, permissionShow: true})
          })
        }
      }
    });
  }
  onShareMomentCancel = () => {
    this.setState({shareMomentOpen: false})
  }
  onSubscribeClick = async () => {
    let tmplIds: any = [];
    const openid = await getStorage('wechatOpenid');
    let param: any = {
      userNo: this.props.userInfo.userNo,
      openId: openid,
      leagueId: this.state.leagueId,
    };
    if (this.props.match && this.props.match.status && this.props.match.status.status == -1) {
      tmplIds.push(SUBSCRIBE_TEMPLATES.MATCH_START);
      param.matchId = this.props.match ? this.props.match.id : null;
    }
    Taro.requestSubscribeMessage({tmplIds: tmplIds}).then((res: any) => {
      if (res.errMsg == "requestSubscribeMessage:ok") {
        delete res.errMsg
        new Request().post(api.API_SUBSCRIBE, {templateIds: res, ...param}).then((data: any) => {
          if (data) {
            Taro.showToast({title: "订阅成功", icon: "none"});
          }
        })
      }
    })
  }
  switchToGiftSend = () => {
    let {tabs} = this.getTabsList(this.props.match);
    if (this.state.heatType == HEAT_TYPE.LEAGUE_PLAYER_HEAT || this.state.heatType == HEAT_TYPE.PLAYER_HEAT) {
      this.switchTab(tabs[TABS_TYPE.heatPlayer]);
    } else if (this.state.heatType == HEAT_TYPE.LEAGUE_TEAM_HEAT) {
      this.switchTab(tabs[TABS_TYPE.heatLeagueTeam]);
    } else if (this.state.heatType == HEAT_TYPE.TEAM_HEAT) {
      this.switchTab(tabs[TABS_TYPE.matchUp]);
    }
    this.onPayCancel();
  }
  onHandleShareSuccess = (func: any) => {
    this.setState({onHandleShareSuccess: func});
  }
  onBetClick = () => {
    Taro.navigateTo({url: `../bet/bet?id=${this.getParamId()}`});
  }
  onPayConfirm = (callback, price) => {
    this.setState({payCallback: callback, payConfirmShow: true, currentPrice: price})
  }
  onPayConfirmClose = () => {
    this.setState({payConfirmShow: false})
  }
  handleWechatConfirm = () => {
    this.state.payCallback && this.state.payCallback(PAY_TYPE.ONLINE)
  }
  handleDepositConfirm = () => {
    this.state.payCallback && this.state.payCallback(PAY_TYPE.DEPOSIT)
  }
  getCurrentAgainstTeam = () => {
    const match = this.props.match;
    const matchAgainstTeams = match.againstTeams;
    const matchStatus = match.status;
    if (matchAgainstTeams && matchStatus) {
      return {againstIndex: matchStatus.againstIndex, againstTeam: matchAgainstTeams[matchStatus.againstIndex]};
    }
    return {againstIndex: 1, againstTeam: null};
  }
  bindLineUpOnClick = (onclick) => {
    this.setState({onLineUpClick: onclick})
  }
  onLevelUpConfirm = () => {
    this.setState({levelUpShow: false})
  }
  onLeagueMemberShow = () => {
    this.setState({leagueMemberOpen: true, payOpen: false})
  }
  onLeagueMemberClose = () => {
    this.setState({leagueMemberOpen: false})
  }
  onLeagueMemberPaySuccess = (orderId) => {
    this.setState({leagueMemberOpen: false})
    if (orderId) {
      this.getOrderStatus(orderId, ORDER_TYPE.leagueMember);
    }
    Taro.showToast({
      title: "开通成功",
      icon: 'none',
    });
  }
  onLeagueMemberPayError = (reason) => {
    switch (reason) {
      case error.ERROR_PAY_CANCEL: {
        Taro.showToast({
          title: "支付失败,用户取消支付",
          icon: 'none',
        });
        return;
      }
      case error.ERROR_PAY_ERROR: {
        Taro.showToast({
          title: "支付失败",
          icon: 'none',
        });
        return;
      }
    }
  }
  setRefreshStatisticsFunc = (func) => {
    this.setState({refreshStatisticsFunc: func})
  }
  onAgreementShow = () => {
    this.setState({agreementOpen: true})
  }
  onAgreementClose = () => {
    this.setState({agreementOpen: false})
  }
  onToCashClick = (player) => {
    Taro.getStorage({key: `agreement-${this.state.leagueId}`}).then(res => {
      if (res && res.data != null && res.data) {
        Taro.navigateTo({
          url: `/pages/playerVerify/playerVerify?playerId=${player.id}`,
        })
      } else {
        this.setState({cashAgreementOpen: true, currentToCashPlayer: player})
      }
    }).catch(() => {
      this.setState({cashAgreementOpen: true, currentToCashPlayer: player})
    })
  }
  onCashAgreementClose = () => {
    this.setState({cashAgreementOpen: false})
  }
  onCashAgreementConfirm = () => {
    this.setState({cashAgreementOpen: false})
    if (this.state.currentToCashPlayer != null) {
      Taro.setStorage({key: `agreement-${this.state.leagueId}`, data: true});
      Taro.navigateTo({
        url: `/pages/playerVerify/playerVerify?playerId=${this.state.currentToCashPlayer.id}`,
      })
    }
  }

  render() {
    const {match = null, payEnabled} = this.props;
    const {
      diffDayTime = {
        diffDay: "",
        diffTime: "00:00"
      }, liveStatus, leftNooice = 0, rightNooice = 0, teamHeats = null, playerHeats = null, topPlayerHeats = null
    } = this.state;
    let {tabList, tabs, tabKey} = this.getTabsList(match);

    return (
      <View className='qz-live-content'>
        <NavBar
          title='一元体育'
          back
          ref={ref => {
            this.navRef = ref;
          }}
        />
        <View className='qz-live-match__content'>
          {this.state.needPay ?
            <View className={`${this.state.statisticsMode ? "hidden" : ""} qz-live-match__video`}>
              <Image src={match.poster} className="qz-live-match__video-poster-img"/>
              {match && <AtButton onClick={this.onPayClick} type='primary'
                                  className="qz-live-match__video-poster-pay">{payEnabled ? "支付并观看" : "由于相关规范，iOS功能暂不可用"}</AtButton>}
            </View>
            :
            (payEnabled && this.state.needGiftLive && match.status && match.status.status != FootballEventType.FINISH && liveStatus != LiveStatus.UNOPEN && this.state.heatRule && this.state.heatRule.available ?
              <View className={`${this.state.statisticsMode ? "hidden" : ""} qz-live-match__video`}>
                <Image src={match.poster} className="qz-live-match__video-poster-img"/>
                {match && <AtButton type='primary' onClick={this.switchToGiftSend}
                                    className="qz-live-match__video-poster-pay">投一票 看直播</AtButton>}
              </View>
              :
              <Video
                id="videoPlayer"
                className={`${this.state.statisticsMode ? "hidden" : ""} qz-live-match__video`}
                src={this.getPlayPath(match)}
                title={match.name}
                playBtnPosition="center"
                onFullscreenChange={this.bindFullScreen}
                onEnded={this.bindPlayEnd}
                onPlay={this.bindPlayStart}
                onError={this.bindPlayError}
                show-casting-button
                autoplay
                direction={90}
                // enableDanmu
                // danmuList={danmuList}
                onTimeUpdate={this.handleVideoTime}
                // autoplay
              >
                {liveStatus != LiveStatus.FINISH && liveStatus != LiveStatus.ENABLED ?
                  <View className="qz-live-match__video-poster">
                    <Image src={match.poster} className="qz-live-match__video-poster-img"/>
                    {liveStatus == LiveStatus.UNOPEN ?
                      <View className="qz-live-match__video-poster-inner">
                        {match.isBetEnable ?
                          <View className="qz-live-match__video-poster-bet" onClick={this.onBetClick}>
                            比分竞猜
                          </View>
                          : null}
                        <View className="qz-live-match__video-poster-time" onClick={this.onSubscribeClick}>
                          <View className='qz-live-match__video-poster-time__title'>
                            <View>距比赛开始还有{diffDayTime.diffDay}</View>
                          </View>
                          <View className='qz-live-match__video-poster-time__time'>
                            <View>{diffDayTime.diffTime}</View>
                          </View>
                          <View className='qz-live-match__video-poster-time__hint'>
                            <View><View className='at-icon at-icon-bell'/>提醒我开始</View>
                          </View>
                        </View>
                      </View>
                      :
                      <View className="qz-live-match__video-poster-text">
                        <View className='qz-live-match__video-poster-text__text'>
                          {liveStatus == LiveStatus.ONTIME ? <View>比赛还未开始请耐心等待...</View> : null}
                          {liveStatus == LiveStatus.NOTPUSH ? <View>信号中断...</View> : null}
                          {liveStatus == LiveStatus.LOADING ? <View>载入中...</View> : null}
                        </View>
                      </View>
                    }
                  </View>
                  : <View
                    className={`qz-live-match__video-controllers ${this.state.danmuUnable != true ? "qz-live-match__video-controllers-full" : ""}`}>
                    {this.state.danmuUnable != true && this.state.danmuCurrent.map(item => (
                      <View
                        key={`danmu-${item.id}`}
                        className="qz-live-match__video-controllers__danmu-container"
                        style={{top: `${21 * (item.row + 1) + item.row * 8}px`}}>
                        <View className="qz-live-match__video-controllers__danmu">
                          <View className="qz-live-match__video-controllers__danmu-inner">
                            <View className="qz-live-match__video-controllers__danmu-inner-container">
                              <Image src={item.user && item.user.avatar ? item.user.avatar : defaultLogo}/>
                              <Text>{item.text}</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    ))}
                    <View className="qz-live-match__video-controllers__views">
                      <Image className="qz-live-match__video-controllers__views-img" src={views_icon}/>
                      {this.props.match.chargeTimes && ((match.status && match.status.status == FootballEventType.FINISH && match.isRecordCharge) || (match.status && match.status.status != FootballEventType.FINISH && match.isLiveCharge)) ? this.props.match.chargeTimes : (this.props.match.online ? this.props.match.online : "0")}
                    </View>
                    <View
                      className={`qz-live-match__video-controllers__right ${this.state.videoShowMore ? "qz-live-matc1h__video-controllers__right-more" : ""}`}>
                      <View
                        className={`qz-live-match__video-controllers__right-arrow ${this.state.videoShowMore ? "qz-live-match__video-controllers__right-arrow-right" : "qz-live-match__video-controllers__right-arrow-left"}`}
                        onClick={this.handleVideoArrowClick}>
                        <AtIcon value={this.state.videoShowMore ? "chevron-right" : "chevron-left"}/>
                      </View>
                      {this.state.videoShowMore ?
                        <View className="qz-live-match__video-controllers__right-item-container">
                          {this.props.mediaList && this.props.mediaList.map((item, index) => (
                            <View key={item.id}
                                  className={`qz-live-match__video-controllers__right-item ${this.state.currentMedia == index ? "qz-live-match__video-controllers__right-item-selected" : ""}`}
                                  onClick={this.handleMediaFragmentClick.bind(this, index)}>
                              <Text
                                className="qz-live-match__video-controllers__right-item-text">
                                {`片段${index + 1}`}
                              </Text>
                            </View>
                          ))}
                        </View>
                        : null
                      }
                    </View>
                  </View>
                }
              </Video>)}
          <View className='qz-live-tabs'
                style={{top: `calc(${this.state.statisticsMode ? "0px" : "9 / 16 * 100vw"} + ${this.navRef ? this.navRef.state.configStyle.navHeight : 0}px)`}}>
            <AtTabs current={this.state.currentTab}
                    className="qz-live__top-tabs__content"
                    tabList={tabList}
                    key={tabKey}
                    onClick={this.switchTab}>
              {this.state.heatType == HEAT_TYPE.PLAYER_HEAT || this.state.heatType == HEAT_TYPE.LEAGUE_PLAYER_HEAT ?
                <AtTabsPane current={this.state.currentTab} index={tabs[TABS_TYPE.heatPlayer]}>
                  <HeatPlayer
                    onToCashClick={this.onToCashClick}
                    tabContainerStyle={{height: `calc(100vh - ${this.state.statisticsMode ? "0px" : "(9 / 16 * 100vw)"} - ${this.navRef ? this.navRef.state.configStyle.navHeight : 0}px - 38px)`}}
                    tabScrollStyle={{height: `calc(100vh - ${this.state.statisticsMode ? "0px" : "(9 / 16 * 100vw)"} - ${this.navRef ? this.navRef.state.configStyle.navHeight : 0}px - 38px - 85px - 42px)`}}
                    matchId={this.getParamId()}
                    leagueId={this.state.leagueId}
                    heatType={this.state.heatType}
                    heatRule={this.state.heatRule}
                    onPlayerHeatRefresh={this.onPlayerHeatRefresh}
                    cashAvailableHeats={this.state.cashAvailableHeats}
                    // totalHeat={this.state.playerHeatTotal}
                    startTime={this.state.heatStartTime}
                    endTime={this.state.heatEndTime}
                    playerHeats={playerHeats}
                    topPlayerHeats={topPlayerHeats}
                    onHandlePlayerSupport={this.handlePlayerSupport}
                    hidden={this.state.currentTab != tabs[TABS_TYPE.heatPlayer]}
                    onGetPlayerHeatInfo={this.getPlayerHeatInfo}
                    onGetPlayerHeatInfoAdd={this.getPlayerHeatInfoAdd}
                    onPictureDownLoading={this.showDownLoading}
                    onPictureDownLoaded={this.showShareMoment}
                  />
                </AtTabsPane>
                : null}
              {this.state.heatType == HEAT_TYPE.LEAGUE_TEAM_HEAT ?
                <AtTabsPane current={this.state.currentTab} index={tabs[TABS_TYPE.heatLeagueTeam]}>
                  <HeatLeagueTeam
                    tabContainerStyle={{height: `calc(100vh - ${this.state.statisticsMode ? "0px" : "(9 / 16 * 100vw)"} - ${this.navRef ? this.navRef.state.configStyle.navHeight : 0}px - 38px)`}}
                    tabScrollStyle={{height: `calc(100vh - ${this.state.statisticsMode ? "0px" : "(9 / 16 * 100vw)"} - ${this.navRef ? this.navRef.state.configStyle.navHeight : 0}px - 38px - 85px - 42px)`}}
                    matchId={this.getParamId()}
                    leagueId={this.state.leagueId}
                    heatType={this.state.heatType}
                    onTeamHeatRefresh={this.onLeagueTeamHeatRefresh}
                    // totalHeat={this.state.leagueTeamHeatTotal}
                    topTeamHeats={this.state.topLeagueTeamHeats}
                    startTime={this.state.heatStartTime}
                    endTime={this.state.heatEndTime}
                    teamHeats={this.state.leagueTeamHeats}
                    onHandleTeamSupport={this.handleLeagueTeamSupport}
                    hidden={this.state.currentTab != tabs[TABS_TYPE.heatLeagueTeam]}
                    onGetTeamHeatInfo={this.getLeagueTeamHeatInfo}
                    onGetTeamHeatInfoAdd={this.getLeagueTeamHeatInfoAdd}
                    onPictureDownLoading={this.showDownLoading}
                    onPictureDownLoaded={this.showShareMoment}
                  />
                </AtTabsPane>
                : null}
              <AtTabsPane current={this.state.currentTab} index={tabs[TABS_TYPE.matchUp]}>
                <ScrollView
                  className="qz-live-match-up__scroll-content"
                  style={{height: `calc(100vh - ${this.state.statisticsMode ? "0px" : "(9 / 16 * 100vw)"} - ${this.navRef ? this.navRef.state.configStyle.navHeight : 0}px - 38px)`}}
                >
                  {this.state.currentTab != tabs[TABS_TYPE.matchUp] ? <View/> : (
                    <View
                      className="qz-live-match-up__content"
                      style={{height: `calc(100vh - ${this.state.statisticsMode ? "0px" : "(9 / 16 * 100vw)"} - ${this.navRef ? this.navRef.state.configStyle.navHeight : 0}px - 38px)`}}
                    >
                      <MatchUp className="qz-live-match-up__match-up" matchInfo={match}
                               matchStatus={match.status}
                               onlytime={this.isThisYear(new Date(match.startTime))}
                               onMonopolyClick={this.onMonopolyClick}/>
                      <View className="qz-live-match-up__function-bar">
                        {/*<RoundButton*/}
                        {/*  size={30}*/}
                        {/*  img={playButton}*/}
                        {/*  text={this.props.match.chargeTimes && ((match.status == FootballEventType.FINISH && match.isRecordCharge) || (match.status != FootballEventType.FINISH && match.isLiveCharge)) ? this.props.match.chargeTimes : (this.props.match.online ? this.props.match.online : "0")}*/}
                        {/*  onClick={() => {*/}
                        {/*  }}/>*/}
                        <RoundButton
                          size={30}
                          img={this.state.isCollect ? starActive : star}
                          text={this.state.isCollect ? "已收藏" : "收藏"}
                          onClick={this.onCollectClick}/>
                        <RoundButton
                          size={30}
                          img={moment}
                          text="朋友圈"
                          onClick={this.onShareMoment}/>
                        <RoundButton
                          size={30}
                          img={headphones}
                          text="客服"
                          openType="contact"
                          onClick={() => {
                          }}/>
                        <RoundButton
                          size={30}
                          img={share}
                          text="分享"
                          openType="share"
                          onClick={() => {
                          }}/>
                      </View>
                      {
                        //todo 加上多个球队的对阵热度pk
                      }
                      {match.againstTeams ?
                        (this.state.heatType == HEAT_TYPE.TEAM_HEAT && Object.keys(match.againstTeams).length == 1 ?
                            <HeatTeam
                              teamHeats={teamHeats}
                              onHandleLeftSupport={this.handleLeftSupport}
                              onHandleRightSupport={this.handleRightSupport}
                              startTime={this.state.heatStartTime}
                              endTime={this.state.heatEndTime}
                            /> : null
                        ) : null}

                      {match.againstTeams && this.state.heatType != HEAT_TYPE.TEAM_HEAT ?
                        <NooiceBar
                          percent={leftNooice == 0 && rightNooice == 0 ? 50 : (leftNooice * 100 / (leftNooice + rightNooice))}
                          leftText={`${leftNooice}`}
                          rightText={`${rightNooice}`}
                          leftMoveClass={this.state.nooiceLeftMoveClass}
                          rightMoveClass={this.state.nooiceRightMoveClass}
                          handleLeftNooice={this.handleLeftNooice}
                          handleRightNooice={this.handleRightNooice}
                        />
                        : null}
                      {match.type && match.type.indexOf(MATCH_TYPE.chattingRoom) != -1 &&
                      <ChattingRoom
                        tabContainerStyle={{height: `calc(100vh - ${this.state.statisticsMode ? "0px" : "(9 / 16 * 100vw)"} - ${this.navRef ? this.navRef.state.configStyle.navHeight : 0}px - 38px - 104px - 44px - 20px)`}}
                        tabScrollStyle={{height: `calc(100vh - ${this.state.statisticsMode ? "0px" : "(9 / 16 * 100vw)"} - ${this.navRef ? this.navRef.state.configStyle.navHeight : 0}px - 38px - 104px - 44px - 20px - 40px)`}}
                        tabContainerStyleIphoneX={{height: `calc(100vh - ${this.state.statisticsMode ? "0px" : "(9 / 16 * 100vw)"} - ${this.navRef ? this.navRef.state.configStyle.navHeight : 0}px - 38px - 104px - 44px - 20px - 34px)`}}
                        tabScrollStyleIphoneX={{height: `calc(100vh - ${this.state.statisticsMode ? "0px" : "(9 / 16 * 100vw)"} - ${this.navRef ? this.navRef.state.configStyle.navHeight : 0}px - 38px - 104px - 44px - 20px - 40px - 34px)`}}
                        isIphoneX={this.state.isIphoneX}
                        matchInfo={this.props.match}
                        userInfo={this.props.userInfo}
                        nextPage={this.getCommentList_next}
                        loading={this.state.chatLoading}
                        intoView={this.state.commentIntoView}
                        sendMessage={this.sendMessage}
                        comments={this.state.comments}
                        expInfo={this.props.expInfo}
                      />}
                    </View>
                  )}
                </ScrollView>
              </AtTabsPane>
              {match.type && match.type.indexOf(MATCH_TYPE.clip) != -1 &&
              <AtTabsPane current={this.state.currentTab} index={tabs[TABS_TYPE.clip]}>
                <MatchClip
                  hidden={this.state.currentTab != tabs[TABS_TYPE.clip]}
                  medias={this.state.matchClips}
                  needPay={this.state.needPay}
                />
              </AtTabsPane>}
              {match.type && match.type.indexOf(MATCH_TYPE.timeLine) != -1 &&
              <AtTabsPane current={this.state.currentTab} index={tabs[TABS_TYPE.statistics]}>
                <ScrollView
                  scrollY
                  className="qz-live-statistics"
                  style={{height: `calc(100vh - ${this.state.statisticsMode ? "0px" : "(9 / 16 * 100vw)"} - ${this.navRef ? this.navRef.state.configStyle.navHeight : 0}px - 38px)`}}
                >
                  {this.state.currentTab != tabs[TABS_TYPE.statistics] ? <View/>
                    :
                    (
                      <View>
                        <Statistics
                          statistics={this.props.matchStatus ? this.props.matchStatus.againstStatistics : {}}
                          refreshFunc={this.setRefreshStatisticsFunc}
                          matchInfo={this.props.match}/>
                      </View>
                    )
                  }
                </ScrollView>
              </AtTabsPane>}
              {match.type && match.type.indexOf(MATCH_TYPE.lineUp) != -1 &&
              <AtTabsPane current={this.state.currentTab} index={tabs[TABS_TYPE.lineUp]}>
                <LineUp
                  tabContainerStyle={{height: `calc(100vh - ${this.state.statisticsMode ? "0px" : "(9 / 16 * 100vw)"} - ${this.navRef ? this.navRef.state.configStyle.navHeight : 0}px - 38px)`}}
                  tabScrollStyle={{height: `calc(100vh - ${this.state.statisticsMode ? "0px" : "(9 / 16 * 100vw)"} - ${this.navRef ? this.navRef.state.configStyle.navHeight : 0}px - 38px - 5vw - 28px)`}}
                  matchInfo={this.props.match}
                  hidden={this.state.currentTab != tabs[TABS_TYPE.lineUp]}
                  bindOnClick={this.bindLineUpOnClick}
                />
              </AtTabsPane>}
            </AtTabs>
          </View>
        </View>
        <LoginModal
          isOpened={this.state.loginOpen}
          handleConfirm={this.onAuthSuccess}
          handleCancel={this.onAuthCancel}
          handleClose={this.onAuthClose}
          handleError={this.onAuthError}/>
        <PhoneModal
          isOpened={this.state.phoneOpen}
          handleConfirm={this.onPhoneSuccess}
          handleCancel={this.onPhoneCancel}
          handleClose={this.onPhoneClose}
          handleError={this.onPhoneError}/>
        <ChargeModal
          giftDiscount={match && match.giftWatchRecordEnable ? match.giftWatchRecordEternalPrice != null : false}
          giftDiscountPrice={match && match.giftWatchRecordEnable ? match.giftWatchRecordEternalPrice : null}
          charge={this.state.charge}
          isOpened={this.state.payOpen}
          handleConfirm={this.onPaySuccess}
          handleCancel={this.onPayCancel}
          handleClose={this.onPayClose}
          handleError={this.onPayError}
          handleToGiftSend={this.switchToGiftSend}
          payEnabled={payEnabled}
          onPayConfirm={this.onPayConfirm}
          onPayClose={this.onPayConfirmClose}/>
        <HeatReward
          heatRule={this.state.heatRule}
          loading={this.state.heatRule == null}
          isOpened={this.state.heatRewardOpen}
          scrollBottom={this.state.heatRewardScrollBottom}
          onClose={this.hideReward}/>
        <GiftRank
          giftRanks={this.state.giftRanks}
          loading={this.state.giftRanksLoading}
          isOpened={this.state.giftRanksOpen}
          handleCancel={this.hideGfitRank}
          expInfo={this.props.expInfo}/>
        <AtCurtain
          isOpened={this.state.curtainShow}
          onClose={this.onCurtainClose}
        >
          {this.state.curtainShow ? <Image
            mode="widthFix"
            src={this.state.curtain ? this.state.curtain.content : ""}
            onClick={this.handleCurtainClick}
          /> : null}
        </AtCurtain>
        <AtToast isOpened={this.state.downLoading} text="生成中..." status="loading"/>
        <ModalAlbum
          isOpened={this.state.permissionShow}
          handleConfirm={this.onPremissionSuccess}
          handleCancel={this.onPremissionCancel}
          handleClose={this.onPremissionClose}/>
        <GiftPanel
          onHeatRewardRuleClick={this.onHeatRewardClick}
          onCashRuleClick={this.state.heatRule && this.state.heatRule.cashAvailable ? this.onAgreementShow : null}
          title={`送给${(this.state.heatType == HEAT_TYPE.TEAM_HEAT || this.state.heatType == HEAT_TYPE.LEAGUE_TEAM_HEAT) && this.state.currentSupportTeam ? this.state.currentSupportTeam.name : ((this.state.heatType == HEAT_TYPE.PLAYER_HEAT || this.state.heatType == HEAT_TYPE.LEAGUE_PLAYER_HEAT) && this.state.currentSupportPlayer ? this.state.currentSupportPlayer.name : "")}`}
          onClose={this.hideGiftPanel}
          isOpened={this.state.giftOpen}
          giftWatchPrice={match && match.giftWatchRecordEnable && match.giftWatchRecordEternalPrice ? match.giftWatchRecordEternalPrice : null}
          giftWatchEternalPrice={match && match.giftWatchRecordEnable && match.giftWatchRecordEternalPrice ? match.giftWatchRecordEternalPrice : null}
          leagueId={this.state.leagueId}
          matchInfo={match}
          supportTeam={this.state.currentSupportTeam}
          supportPlayer={this.state.currentSupportPlayer}
          heatType={this.state.heatType}
          gifts={this.props.giftList}
          loading={this.props.giftList == null || this.props.giftList.length == 0}
          onHandlePaySuccess={this.onGiftPaySuccess}
          onHandlePayError={this.onGiftPayError}
          onHandleShareSuccess={this.onHandleShareSuccess}
          hidden={!this.state.giftOpen}
          onPayConfirm={this.onPayConfirm}
          onPayClose={this.onPayConfirmClose}
        />
        <ShareMoment
          isOpened={this.state.shareMomentOpen}
          loading={this.state.shareMomentLoading}
          poster={this.state.shareMomentPoster}
          handleConfirm={this.onShareMomentConfirm}
          handleCancel={this.onShareMomentCancel}
        />
        <ModalPay
          isOpened={this.state.payConfirmShow}
          price={this.state.currentPrice}
          onCancel={this.onPayConfirmClose}
          onWechatPay={this.handleWechatConfirm}
          onDepositPay={this.handleDepositConfirm}/>
        <LevelUpModal
          level={this.state.currentLevel}
          isOpened={this.state.levelUpShow}
          handleConfirm={this.onLevelUpConfirm}
        />
        {this.state.giftSendQueue && this.state.giftSendQueue.map((data: any) => (
          <GiftNotify
            active={data.active}
            key={data.id}
            position={data.position}
            detail={data}
            row={data.row}/>
        ))}
        {match.league ?
          <View className="qz-live-match-up__league">
            <AtFab size="small" onClick={this.onLeagueClick.bind(this, match.league)}>
              <Image className="qz-live-match-up__league-image"
                     src={match.league && match.league.headImg ? match.league.headImg : defaultLogo}
              />
            </AtFab>
          </View>
          : null
        }
        {this.state.currentTab == tabs[TABS_TYPE.heatPlayer] || this.state.currentTab == tabs[TABS_TYPE.heatLeagueTeam] || (this.state.heatType == HEAT_TYPE.TEAM_HEAT && this.state.currentTab == tabs[TABS_TYPE.matchUp]) ?
          <View>
            <View className="qz-live-fab qz-live-fab-square qz-live-fab-giftrank">
              <AtFab onClick={this.onGiftRankClick}>
                <Image className="qz-live-fab-image"
                       src={gift_rank}/>
              </AtFab>
            </View>
            <View className="qz-live-fab qz-live-fab-square qz-live-fab-heatreward">
              <AtFab onClick={this.onHeatRewardClick.bind(this, false)}>
                <Image className="qz-live-fab-image"
                       src={this.state.heatRule && this.state.heatRule.cashAvailable ? cash_rule : heat_reward}/>
              </AtFab>
            </View>
          </View>
          : null
        }
        {this.state.payOpen && this.props.payEnabled && this.state.leagueMemberRule && this.state.leagueMemberRule.available ?
          <RectFab
            className="qz-fab-rect-single-line"
            onClick={this.onLeagueMemberShow}
            background="linear-gradient(90deg,#f8e2c4,#f3bb6c);"
            top="30%"
          >
            <Image src={crown}/>
            <Text style={{color: "#754e19"}}>联赛会员，比赛随心看</Text>
          </RectFab>
          : null}
        {this.state.leagueId ?
          <LeagueMember
            league={this.props.match.league}
            isOpened={this.state.leagueMemberOpen}
            leagueMemberRule={this.state.leagueMemberRule}
            onClose={this.onLeagueMemberClose}
            onHandlePaySuccess={this.onLeagueMemberPaySuccess}
            onHandlePayError={this.onLeagueMemberPayError}
            onPayConfirm={this.onPayConfirm}
            onPayClose={this.onPayConfirmClose}
          /> : null}
        <ModalAgreement
          isOpened={this.state.agreementOpen}
          onClose={this.onAgreementClose}
          picUrl={disclaimer}
        />
        <CashAgreementModal
          isOpened={this.state.cashAgreementOpen}
          onClose={this.onCashAgreementClose}
          onConfirm={this.onCashAgreementConfirm}
          onAgreementClick={this.onAgreementShow}
          onHeatRuleClick={this.onHeatRewardClick}
          player={this.state.currentToCashPlayer}
        />
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    deposit: state.deposit.depositInfo ? state.deposit.depositInfo.deposit : 0,
    match: state.match.match,
    matchStatus: state.match.status,
    mediaList: state.live.mediaList,
    playerList: state.player.playerList.records,
    userInfo: state.user.userInfo,
    commentList: state.match.comment,
    danmuList: state.match.danmu,
    payEnabled: state.config ? state.config.payEnabled : null,
    giftEnabled: state.config ? state.config.giftEnabled : null,
    shareSentence: state.config ? state.config.shareSentence : [],
    giftList: state.pay ? state.pay.gifts : [],
    expInfo: state.config ? state.config.expInfo : [],
  }
}
export default connect(mapStateToProps)(Live)
