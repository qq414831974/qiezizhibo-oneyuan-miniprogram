import Taro, {getCurrentInstance} from '@tarojs/taro';
import {Component} from 'react'
import {
  AtToast,
  AtActivityIndicator,
  AtModal,
  AtModalHeader,
  AtModalContent,
  AtModalAction,
  AtList,
  AtListItem
} from "taro-ui"
import {View, Text, Image, Button, Picker} from '@tarojs/components'
import {connect} from 'react-redux'

import './matchStatistics.scss'
import Request from "../../utils/request";
import * as api from "../../constants/api";
import logo from "../../assets/default-logo.png"

type PageStateProps = {
  userInfo: any;
}

type PageDispatchProps = {}

type PageOwnProps = {}

type PageState = {
  loading: boolean;
  hostLoading: boolean;
  guestLoading: boolean;
  matchInfo: any;
  againstIndex: any;
  section: any;
  hostPlayerList: any;
  guestPlayerList: any;
  currentPlayer: any;
  currentTeamisHost: any;
  matchStatistics: any;
  timeline: any;
  deleteConfirmShow: any;
  deleteId: any;
  switchSectionShow: any;
  currentEvent: any;
  iPhoneXPadding: any;
  eventOpen: boolean;
  switch_againstIndex: any;
  switch_section: any;
  changeShirtNumShow: boolean;
  shirtNumRange: any;
  shirtNum: any;
  playerShirtNum: any;
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface MatchStatistics {
  props: IProps;
}

const eventType = {
  6: "三分球",
  7: "两分球",
  8: "罚球",
  9: "犯规",
  16: "抢断",
  17: "篮板",
  18: "助攻",
};

class MatchStatistics extends Component<IProps, PageState> {
  navRef: any = null;
  matchId: any = null;

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      hostLoading: false,
      guestLoading: false,
      matchInfo: null,
      againstIndex: "1",
      section: "1",
      hostPlayerList: [],
      guestPlayerList: [],
      currentPlayer: null,
      currentTeamisHost: null,
      matchStatistics: null,
      timeline: [],
      deleteConfirmShow: false,
      deleteId: null,
      switchSectionShow: false,
      currentEvent: null,
      iPhoneXPadding: 0,
      eventOpen: false,
      switch_againstIndex: "1",
      switch_section: "1",
      changeShirtNumShow: false,
      shirtNumRange: null,
      shirtNum: [0, 0],
      playerShirtNum: 0,
    }
  }

  componentWillMount() {
    this.matchId = this.getParamId();
    let range = [];
    for (let i = 0; i <= 9; i++) {
      range.push(i);
    }
    this.setState({shirtNumRange: [range, range]});
  }

  componentDidMount() {
    this.matchId = this.getParamId();
    const key = `matchStatistics-${this.matchId}`
    Taro.getStorage({key: key}).then((res: any) => {
      const data = res.data
      let section = this.state.section;
      let againstIndex = this.state.againstIndex;
      if (data && data.section != null) {
        section = data.section;
      }
      if (data && data.againstIndex != null) {
        againstIndex = data.againstIndex;
      }
      this.setState({
        section: section,
        switch_section: section,
        againstIndex: againstIndex,
        switch_againstIndex: againstIndex
      }, () => {
        this.getMatchInfo(this.matchId)
      })
    }).catch(err => {
      console.log(err);
      this.getMatchInfo(this.matchId)
    })
  }

  componentWillUnmount() {
  }

  componentDidShow() {
    let screenHeight = Taro.getSystemInfoSync().screenHeight
    let bottom = Taro.getSystemInfoSync().safeArea.bottom
    const padding = screenHeight - bottom;
    this.setState({iPhoneXPadding: padding > 0 ? padding * 1.5 : 0})
    Taro.setKeepScreenOn({
      keepScreenOn: true
    })
  }

  componentDidHide() {
    Taro.setKeepScreenOn({
      keepScreenOn: false
    })
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
    return id;
  }
  refresh = () => {
    this.getMatchInfo(this.matchId);
  }
  getMatchInfo = (id) => {
    this.setState({loading: true})
    new Request().get(api.API_MATCH(id), null).then((data: any) => {
      let againstIndex: any = this.state.againstIndex;
      if (data != null && data.againstTeams != null && againstIndex == null) {
        againstIndex = Object.keys(data.againstTeams)[0];
      }
      if (data != null && data.againstTeams[againstIndex].hostTeam) {
        this.getHostTeamPlayerList(data.againstTeams[againstIndex].hostTeam.id)
      }
      if (data != null && data.againstTeams[againstIndex].guestTeam) {
        this.getGuestTeamPlayerList(data.againstTeams[againstIndex].guestTeam.id)
      }
      this.setState({matchInfo: data, againstIndex: againstIndex, loading: false}, () => {
        this.getMatchStatistics(this.matchId);
        this.getTimeLine(this.matchId);
      })
    })
  }
  getMatchStatistics = (id) => {
    new Request().get(api.API_MATCH_STATUS, {matchId: id}).then((data: any) => {
      if (data != null && data.againstStatistics != null) {
        this.setState({matchStatistics: data.againstStatistics[this.state.againstIndex]});
      }
    });
  }
  getTimeLine = (id) => {
    new Request().get(api.API_MATCH_STATISTICS_TIMELINE, {matchId: id, pageSize: 5, pageNum: 1}).then((data: any) => {
      if (data != null) {
        this.setState({timeline: data});
      }
    });
  }
  getHostTeamPlayerList = (teamId) => {
    this.setState({hostLoading: true})
    new Request().get(api.API_PLAYERS, {teamId: teamId, pageSize: 100, pageNum: 1}).then((data: any) => {
      if (data && data.records) {
        let players = data.records.sort((a, b) => {
          const shirtA = a.shirtNum != null ? a.shirtNum : 0
          const shirtB = b.shirtNum != null ? b.shirtNum : 0
          return shirtA - shirtB;
        });
        this.setState({hostPlayerList: players, hostLoading: false})
      }
    });
  }
  getGuestTeamPlayerList = (teamId) => {
    this.setState({guestLoading: true})
    new Request().get(api.API_PLAYERS, {teamId: teamId, pageSize: 100, pageNum: 1}).then((data: any) => {
      if (data) {
        let players = data.records.sort((a, b) => {
          const shirtA = a.shirtNum != null ? a.shirtNum : 0
          const shirtB = b.shirtNum != null ? b.shirtNum : 0
          return shirtA - shirtB;
        });
        this.setState({guestPlayerList: players, guestLoading: false})
      }
    });
  }
  getAgainstTeamInfo = () => {
    const {matchInfo, againstIndex} = this.state
    if (matchInfo != null && matchInfo.againstTeams != null && matchInfo.againstTeams[againstIndex] != null) {
      return matchInfo.againstTeams[againstIndex];
    }
    return null;
  }
  handleBackClick = () => {
    Taro.navigateBack({
      delta: 1
    });
  }
  onPlayerClick = ({player, isHost}) => {
    this.setState({currentPlayer: player, currentTeamisHost: isHost, currentEvent: null, eventOpen: true})
  }
  getHostScore = () => {
    if (this.state.matchStatistics) {
      const goalOneHost = this.state.matchStatistics.goalOneHost;
      const goalTwoHost = this.state.matchStatistics.goalTwoHost;
      const goalThreeHost = this.state.matchStatistics.goalThreeHost;
      return goalOneHost + goalTwoHost * 2 + goalThreeHost * 3;
    }
    return 0;
  }
  getGuestScore = () => {
    if (this.state.matchStatistics) {
      const goalOneGuest = this.state.matchStatistics.goalOneGuest;
      const goalTwoGuest = this.state.matchStatistics.goalTwoGuest;
      const goalThreeGuest = this.state.matchStatistics.goalThreeGuest;
      return goalOneGuest + goalTwoGuest * 2 + goalThreeGuest * 3;
    }
    return 0;
  }
  getPlayerStatisticsInfo = (playerStatistics, key, playerId) => {
    return playerStatistics && playerStatistics[playerId] && playerStatistics[playerId][key] != null ? playerStatistics[playerId][key] : 0;
  }
  getPlayerGoal = (playerStatistics, playerId) => {
    return playerStatistics && playerStatistics[playerId] ? playerStatistics[playerId].goalOne + playerStatistics[playerId].goalTwo * 2 + playerStatistics[playerId].goalThree * 3 : 0;
  }
  onDeleteTimeLineClick = (id) => {
    this.setState({deleteConfirmShow: true, deleteId: id})
  }
  handleDeleteConfirmClose = () => {
    this.setState({deleteConfirmShow: false})
  }
  handleDeleteConfirm = () => {
    if (this.state.deleteId == null) {
      return;
    }
    new Request().delete(`${api.API_MATCH_STATISTICS_TIMELINE}?id=${this.state.deleteId}`, null).then((data: any) => {
      if (data) {
        Taro.showToast({title: "删除成功", icon: "none"})
      } else {
        Taro.showToast({title: "删除失败", icon: "none"})
      }
      this.setState({deleteConfirmShow: false}, () => {
        this.refresh();
      })
    });
  }
  onSwitchSectionClick = () => {
    this.setState({switchSectionShow: true})
  }
  onSwitchSectionAgainstClose = () => {
    this.setState({switchSectionShow: false})
  }
  onSwitchSectionConfirm = (section) => {
    this.setState({switch_section: section})
  }
  onSwitchAgainstConfirm = (against) => {
    this.setState({switch_againstIndex: against})
  }
  onSwitchSectionAgainstConfirm = () => {
    const key = `matchStatistics-${this.matchId}`
    Taro.setStorage({
      key: key,
      data: {section: this.state.switch_section, againstIndex: this.state.switch_againstIndex}
    })
    this.setState({
      switchSectionShow: false,
      againstIndex: this.state.switch_againstIndex,
      section: this.state.switch_section
    }, () => {
      this.refresh()
    })
  }
  getSections = () => {
    let section = [];
    if (this.state.matchInfo && this.state.matchInfo.section) {
      for (let i = 1; i <= this.state.matchInfo.section; i++) {
        section.push(i);
      }
    }
    return section;
  }
  onEventClick = (eventtype, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (this.state.matchInfo == null || this.state.matchInfo.againsts == null || this.state.matchInfo.againsts[this.state.againstIndex] == null || this.state.currentPlayer == null || this.state.currentTeamisHost == null) {
      return;
    }
    const teamId = this.state.currentTeamisHost ? this.state.matchInfo.againsts[this.state.againstIndex].hostTeamId : this.state.matchInfo.againsts[this.state.againstIndex].guestTeamId;
    const playerId = this.state.currentPlayer.id;
    // if (eventtype == this.state.currentEvent) {
    new Request().post(`${api.API_MATCH_STATISTICS_TIMELINE}`, {
      matchId: this.matchId,
      teamId: teamId,
      playerId: playerId,
      eventType: eventtype,
      againstIndex: this.state.againstIndex,
      section: this.state.section,
    }).then((data: any) => {
      if (data) {
        Taro.showToast({title: "添加成功", icon: "none"})
      } else {
        Taro.showToast({title: "添加失败", icon: "none"})
      }
      this.refresh();
    });
    this.setState({currentEvent: null, currentPlayer: null, currentTeamisHost: null, eventOpen: false})
    // } else {
    //   this.setState({currentEvent: eventtype})
    // }
  }
  isHostTeam = (teamId) => {
    if (this.state.matchInfo == null || this.state.matchInfo.againsts == null || this.state.matchInfo.againsts[this.state.againstIndex] == null) {
      return false;
    }
    if (teamId == this.state.matchInfo.againsts[this.state.againstIndex].hostTeamId) {
      return true;
    }
  }
  onEventCancel = () => {
    this.setState({eventOpen: false})
  }
  onChangeShirtNumClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    let shirtNum = this.state.currentPlayer.shirtNum;
    if (shirtNum == null) {
      shirtNum = 0;
    }
    this.setState({changeShirtNumShow: true, shirtNum: this.getShirtNumArray(shirtNum), playerShirtNum: shirtNum})
  }
  onChangeShirtNumCancel = () => {
    this.setState({changeShirtNumShow: false, shirtNum: this.getShirtNumArray(this.state.playerShirtNum)})
  }
  onShirtNumChange = (e) => {
    this.setState({shirtNum: e.detail.value})
  }
  getShirtNumArray = (playerShirtNum) => {
    if (playerShirtNum == null) {
      playerShirtNum = 0;
    }
    return [Math.floor(playerShirtNum / 10), playerShirtNum % 10]
  }
  getShirtNumString = (shirtNumArray) => {
    if (shirtNumArray == null) {
      return 0;
    }
    if (shirtNumArray[0] == null) {
      shirtNumArray[0] = 0;
    }
    if (shirtNumArray[1] == null) {
      shirtNumArray[1] = 0;
    }
    return shirtNumArray[0] * 10 + shirtNumArray[1];
  }
  onChangeShirtNumConfirm = () => {
    const teamId = this.state.currentTeamisHost ? this.state.matchInfo.againsts[this.state.againstIndex].hostTeamId : this.state.matchInfo.againsts[this.state.againstIndex].guestTeamId;
    const playerId = this.state.currentPlayer.id;
    new Request().post(api.API_PLAYER_SHIRTNUM, {
      teamId: teamId,
      playerId: playerId,
      shirtNum: this.getShirtNumString(this.state.shirtNum),
      userNo: this.props.userInfo ? this.props.userInfo.userNo : null,
    }).then((data: any) => {
      if (data) {
        Taro.showToast({title: "修改成功", icon: "none"})
      } else {
        Taro.showToast({title: "修改失败", icon: "none"})
      }
      this.refresh();
    });
    this.setState({
      currentEvent: null,
      currentPlayer: null,
      currentTeamisHost: null,
      eventOpen: false,
      changeShirtNumShow: false
    })
  }

  render() {
    const {loading, matchInfo} = this.state

    const againstTeam = this.getAgainstTeamInfo();

    return (
      <View className='qz-match-statistics'>
        <View className='qz-match-statistics__header'>
          <View className='qz-match-statistics__header-back' onClick={this.handleBackClick}/>
          <View className='qz-match-statistics__header-status'>
            <View className='qz-match-statistics__header-status__round'>
              {matchInfo && matchInfo.round ? matchInfo.round : "未知轮次"}
            </View>
            <View className='qz-match-statistics__header-status__round'>
              {matchInfo && matchInfo.startTime ? matchInfo.startTime : "时间"}
            </View>
          </View>
        </View>
        <View className='qz-match-statistics__against'>
          <View className='qz-match-statistics__against-host'>
            <View className="team">
              <Image className="team-img"
                     src={againstTeam && againstTeam.hostTeam && againstTeam.hostTeam.headImg ? againstTeam.hostTeam.headImg : logo}/>
              <Text className="team-name">
                {againstTeam && againstTeam.hostTeam && againstTeam.hostTeam.name ? againstTeam.hostTeam.name : "主队"}
              </Text>
              <Text className="score">{this.getHostScore()}</Text>
            </View>
          </View>
          <View className='qz-match-statistics__against-switch'>
            <View>对阵{this.state.againstIndex}</View>
            <View>第{this.state.section}节</View>
          </View>
          <View className='qz-match-statistics__against-guest'>
            <View className="team">
              <Text className="score">{this.getGuestScore()}</Text>
              <Text className="team-name">
                {againstTeam && againstTeam.guestTeam && againstTeam.guestTeam.name ? againstTeam.guestTeam.name : "客队"}
              </Text>
              <Image className="team-img"
                     src={againstTeam && againstTeam.guestTeam && againstTeam.guestTeam.headImg ? againstTeam.guestTeam.headImg : logo}/>
            </View>
          </View>
        </View>
        <View className='qz-match-statistics__foul'>
          <View className='qz-match-statistics__foul-host'>
            <View className="team">
              <Text className="title">犯</Text>
              <Text className="number">
                {this.state.matchStatistics && this.state.matchStatistics.foulHost ? this.state.matchStatistics.foulHost : 0}
              </Text>
            </View>
            <View className="team">
              <Text className="title">抢</Text>
              <Text className="number">
                {this.state.matchStatistics && this.state.matchStatistics.snatchHost ? this.state.matchStatistics.snatchHost : 0}
              </Text>
            </View>
            <View className="team">
              <Text className="title">板</Text>
              <Text className="number">
                {this.state.matchStatistics && this.state.matchStatistics.backboardHost ? this.state.matchStatistics.backboardHost : 0}
              </Text>
            </View>
            <View className="team">
              <Text className="title">助</Text>
              <Text className="number">
                {this.state.matchStatistics && this.state.matchStatistics.assistsHost ? this.state.matchStatistics.assistsHost : 0}
              </Text>
            </View>
          </View>
          <View className='qz-match-statistics__foul-middle' onClick={this.onSwitchSectionClick}>
            <Text>切换小节/对阵</Text>
          </View>
          <View className='qz-match-statistics__foul-guest'>
            <View className="team">
              <Text className="title">犯</Text>
              <Text className="number">
                {this.state.matchStatistics && this.state.matchStatistics.foulGuest ? this.state.matchStatistics.foulGuest : 0}
              </Text>
            </View>
            <View className="team">
              <Text className="title">抢</Text>
              <Text className="number">
                {this.state.matchStatistics && this.state.matchStatistics.snatchGuest ? this.state.matchStatistics.snatchGuest : 0}
              </Text>
            </View>
            <View className="team">
              <Text className="title">板</Text>
              <Text className="number">
                {this.state.matchStatistics && this.state.matchStatistics.backboardGuest ? this.state.matchStatistics.backboardGuest : 0}
              </Text>
            </View>
            <View className="team">
              <Text className="title">助</Text>
              <Text className="number">
                {this.state.matchStatistics && this.state.matchStatistics.assistsGuest ? this.state.matchStatistics.assistsGuest : 0}
              </Text>
            </View>
          </View>
        </View>
        <View className='qz-match-statistics__detail' style={{padding: `0 ${this.state.iPhoneXPadding}px`}}>
          <View className='qz-match-statistics__players'>
            {this.state.hostLoading ? <View>
                <View className="qz-match-statistics__players-loading">
                  <AtActivityIndicator mode="center" content="加载中..."/>
                </View>
              </View> :
              <View className='qz-match-statistics__players__inner'>
                {this.state.hostPlayerList && this.state.hostPlayerList.map((player: any) => {
                  return <View
                    key={`host-${player.id}`}
                    className='qz-match-statistics__player'
                    onClick={this.onPlayerClick.bind(this, {player: player, isHost: true})}>
                    <View className="player-shirt">{player.shirtNum}</View>
                    <View className="player-name">{player.name}</View>
                    <View className="player-goal">
                      分{this.state.matchStatistics ? this.getPlayerGoal(this.state.matchStatistics.hostPlayerStatistics, player.id) : 0}
                    </View>
                    <View className="player-foul">
                      犯{this.state.matchStatistics ? this.getPlayerStatisticsInfo(this.state.matchStatistics.hostPlayerStatistics, "foul", player.id) : 0}
                    </View>
                  </View>
                })}
              </View>
            }
          </View>
          <View className='qz-match-statistics__timelines'>
            {this.state.timeline && this.state.timeline.map((timeline: any) => {
              return <View className='qz-match-statistics__timeline'>
                <View className={`player-shirt ${this.isHostTeam(timeline.teamId) ? "" : "player-shirt-guest"}`}>
                  {timeline && timeline.player ? timeline.player.shirtNum : 0}
                </View>
                <View className="player-detail">
                  <View className="player-name">{timeline && timeline.player ? timeline.player.name : "球员"}</View>
                  <View className="player-operation">{eventType[timeline.eventType]}</View>
                </View>
                <View className="operation-delete" onClick={this.onDeleteTimeLineClick.bind(this, timeline.id)}>
                  删除
                </View>
              </View>
            })}
          </View>
          <View className='qz-match-statistics__players qz-match-statistics__players-guest'>
            {this.state.guestLoading ? <View>
                <View className="qz-match-statistics__players-loading">
                  <AtActivityIndicator mode="center" content="加载中..."/>
                </View>
              </View> :
              <View className='qz-match-statistics__players__inner'>
                {this.state.guestPlayerList && this.state.guestPlayerList.map((player: any) => {
                  return <View
                    key={`guest-${player.id}`}
                    className='qz-match-statistics__player'
                    onClick={this.onPlayerClick.bind(this, {player: player, isHost: false})}>
                    <View className="player-shirt">{player.shirtNum}</View>
                    <View className="player-name">{player.name}</View>
                    <View className="player-goal">
                      {this.state.matchStatistics ? this.getPlayerGoal(this.state.matchStatistics.guestPlayerStatistics, player.id) : 0}
                    </View>
                    <View className="player-foul">
                      {this.state.matchStatistics ? this.getPlayerStatisticsInfo(this.state.matchStatistics.guestPlayerStatistics, "foul", player.id) : 0}
                    </View>
                  </View>
                })}
              </View>
            }
          </View>
        </View>
        <AtModal
          className="modal-landscape"
          isOpened={this.state.deleteConfirmShow}
          onClose={this.handleDeleteConfirmClose}
        >
          <AtModalHeader>确认删除</AtModalHeader>
          <AtModalContent>
            <View className="w-full center">是否确认删除事件？</View>
          </AtModalContent>
          <AtModalAction>
            <Button onClick={this.handleDeleteConfirmClose}>关闭</Button>
            <Button onClick={this.handleDeleteConfirm}>确定</Button>
          </AtModalAction>
        </AtModal>
        <AtModal
          className="modal-landscape"
          isOpened={this.state.switchSectionShow}
          onClose={this.onSwitchSectionAgainstClose}
        >
          <AtModalHeader>切换小节/对阵</AtModalHeader>
          <AtModalContent>
            <View className="qz-match-statistics__switch-section">
              {this.getSections().map((section) => {
                return <View
                  key={`section-${section}`}
                  className={this.state.switch_section == section ? "section-active" : ""}
                  onClick={this.onSwitchSectionConfirm.bind(this, section)}>
                  {section}
                </View>
              })}
            </View>
            <View className="qz-match-statistics__switch-against">
              {this.state.matchInfo && this.state.matchInfo.againstTeams && Object.keys(this.state.matchInfo.againstTeams).map((againstIndex: any) => {
                return <View key={`againstTeam-${againstIndex}`}
                             onClick={this.onSwitchAgainstConfirm.bind(this, againstIndex)}
                             className={`qz-match-statistics__switch-against__team ${againstIndex == this.state.switch_againstIndex ? "qz-match-statistics__switch-against__team-active" : ""}`}>
                  <View className="against host">
                    <Text>{this.state.matchInfo && this.state.matchInfo.againstTeams[againstIndex] && this.state.matchInfo.againstTeams[againstIndex].hostTeam ? this.state.matchInfo.againstTeams[againstIndex].hostTeam.name : `主队${againstIndex}`}</Text>
                    <Image
                      src={this.state.matchInfo && this.state.matchInfo.againstTeams[againstIndex] && this.state.matchInfo.againstTeams[againstIndex].hostTeam ? this.state.matchInfo.againstTeams[againstIndex].hostTeam.headImg : logo}/>
                  </View>
                  <Text className="vs">VS</Text>
                  <View className="against guest">
                    <Image
                      src={this.state.matchInfo && this.state.matchInfo.againstTeams[againstIndex] && this.state.matchInfo.againstTeams[againstIndex].guestTeam ? this.state.matchInfo.againstTeams[againstIndex].guestTeam.headImg : logo}/>
                    <Text>{this.state.matchInfo && this.state.matchInfo.againstTeams[againstIndex] && this.state.matchInfo.againstTeams[againstIndex].guestTeam ? this.state.matchInfo.againstTeams[againstIndex].guestTeam.name : `客队${againstIndex}`}</Text>
                  </View>
                </View>
              })}
            </View>
          </AtModalContent>
          <AtModalAction>
            <Button onClick={this.onSwitchSectionAgainstClose}>取消</Button>
            <Button onClick={this.onSwitchSectionAgainstConfirm}>确定</Button>
          </AtModalAction>
        </AtModal>
        {this.state.eventOpen ?
          <View className="qz-match-statistics__event" onClick={this.onEventCancel}>
            <View className="qz-match-statistics__event-player-info" onClick={e => {
              e.preventDefault();
              e.stopPropagation();
            }}>
              <View className="player-info">
                {`${this.state.currentPlayer && this.state.currentPlayer.name ? this.state.currentPlayer.name : "球员"}`}
                {this.state.currentPlayer && this.state.currentPlayer.shirtNum != null ? `（${this.state.currentPlayer.shirtNum}号）` : ""}
              </View>
              <View className="statistics-info">
                <Text>得分：{this.state.matchStatistics ? this.getPlayerGoal(this.state.matchStatistics.hostPlayerStatistics, this.state.currentPlayer.id) : 0}</Text>
                <Text>三分：{this.state.matchStatistics ? this.getPlayerStatisticsInfo(this.state.matchStatistics.hostPlayerStatistics, "goalThree", this.state.currentPlayer.id) : 0}</Text>
                <Text>两分：{this.state.matchStatistics ? this.getPlayerStatisticsInfo(this.state.matchStatistics.hostPlayerStatistics, "goalTwo", this.state.currentPlayer.id) : 0}</Text>
                <Text>罚球：{this.state.matchStatistics ? this.getPlayerStatisticsInfo(this.state.matchStatistics.hostPlayerStatistics, "goalOne", this.state.currentPlayer.id) : 0}</Text>
              </View>
              <View className="statistics-info">
                <Text>犯规：{this.state.matchStatistics ? this.getPlayerStatisticsInfo(this.state.matchStatistics.hostPlayerStatistics, "foul", this.state.currentPlayer.id) : 0}</Text>
                <Text>助攻：{this.state.matchStatistics ? this.getPlayerStatisticsInfo(this.state.matchStatistics.hostPlayerStatistics, "assists", this.state.currentPlayer.id) : 0}</Text>
                <Text>抢断：{this.state.matchStatistics ? this.getPlayerStatisticsInfo(this.state.matchStatistics.hostPlayerStatistics, "snatch", this.state.currentPlayer.id) : 0}</Text>
                <Text>篮板：{this.state.matchStatistics ? this.getPlayerStatisticsInfo(this.state.matchStatistics.hostPlayerStatistics, "backboard", this.state.currentPlayer.id) : 0}</Text>
              </View>
            </View>
            <View className="qz-match-statistics__event-container">
              <View>
                <Button onClick={this.onEventClick.bind(this, 6)}>三分命中</Button>
                <Button onClick={this.onEventClick.bind(this, 7)}>两分命中</Button>
                <Button onClick={this.onEventClick.bind(this, 8)}>罚球命中</Button>
              </View>
              <View>
                <Button onClick={this.onEventClick.bind(this, 18)}>助攻</Button>
              </View>
            </View>
            <View className="qz-match-statistics__event-container">
              <View/>
              <View>
                <Button className="button-change" onClick={this.onChangeShirtNumClick}>修改号码</Button>
                <Button className="button-foul" onClick={this.onEventClick.bind(this, 9)}>犯规</Button>
                <Button onClick={this.onEventClick.bind(this, 16)}>抢断</Button>
                <Button onClick={this.onEventClick.bind(this, 17)}>篮板</Button>
              </View>
            </View>
            <View className="qz-match-statistics__event-cancel">
              <Button onClick={this.onEventCancel}>取消</Button>
            </View>
          </View> : null}
        <AtToast isOpened={loading} text="加载中..." status="loading"/>
        <AtModal
          className="modal-landscape qz-match-statistics__change-shirtNum--modal"
          isOpened={this.state.changeShirtNumShow}
          onClose={this.onChangeShirtNumCancel}>
          <AtModalHeader>修改号码</AtModalHeader>
          <AtModalContent>
            <View className="w-full center">
              <Picker
                mode='multiSelector'
                value={this.state.shirtNum}
                range={this.state.shirtNumRange}
                onChange={this.onShirtNumChange}>
                <AtList>
                  <AtListItem
                    className="qz-match-statistics__change-shirtNum"
                    title='请选择号码'
                    extraText={this.getShirtNumString(this.state.shirtNum)}/>
                </AtList>
              </Picker>
            </View>
          </AtModalContent>
          <AtModalAction>
            <Button onClick={this.onChangeShirtNumCancel}>取消</Button>
            <Button onClick={this.onChangeShirtNumConfirm}>确定</Button>
          </AtModalAction>
        </AtModal>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.user.userInfo,
  }
}
export default connect(mapStateToProps)(MatchStatistics)
