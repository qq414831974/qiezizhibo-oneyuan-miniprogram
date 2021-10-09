import {Component} from 'react'
import {connect} from 'react-redux'
import {View, Text, Image} from '@tarojs/components'
import defaultLogo from '../../assets/default-logo.png'
import './index.scss'
import {formatTime, formatDayTime, formatMonthDay} from "../../utils/utils";

const eventType: { [key: number]: { text: string, color: string }; } = {}
eventType[-1] = {text: "未开始", color: "unopen"};
eventType[0] = {text: "比赛中", color: "live"};
eventType[11] = {text: "加时", color: "live"};
eventType[12] = {text: "点球大战", color: "live"};
eventType[13] = {text: "伤停", color: "live"};
eventType[14] = {text: "中场", color: "live"};
eventType[15] = {text: "下半场", color: "live"};
eventType[16] = {text: "暂停", color: "live"};
eventType[21] = {text: "比赛结束", color: "finish"};

type PageStateProps = {
  payEnabled?: boolean;
}

type PageDispatchProps = {}

type PageOwnProps = {
  matchInfo: any;
  onClick: any | null;
  onBetClick?: any | null;
  className?: string | null;
  onlytime?: boolean | null;
  showRound?: boolean;
  showCharge?: boolean;
  showBet?: boolean;
  forceClick?: boolean;
}

type PageState = {}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface MatchItem {
  props: IProps;
}

class MatchItem extends Component<IProps, PageState> {
  static defaultProps = {}

  constructor(props) {
    super(props)
    this.state = {}
  }

  onItemClick = () => {
    if (this.props.matchInfo.available || this.props.forceClick) {
      this.props.onClick && this.props.onClick();
    }
  }
  onBetClick = (e) => {
    e.stopPropagation();
    this.props.onBetClick && this.props.onBetClick();
  }

  render() {
    const {matchInfo, className = "", onlytime = false, showRound = true, showCharge = true, payEnabled, showBet = true} = this.props
    if (matchInfo == null) {
      return <View/>
    }
    // matchInfo.isBetEnable = true
    const againstTeam = matchInfo.againstTeams != null && Object.keys(matchInfo.againstTeams).length == 1 ? matchInfo.againstTeams[Object.keys(matchInfo.againstTeams)[0]] : null;
    return (
      <View
        className={`qz-match-item ${payEnabled && matchInfo.isBetEnable && showBet ? "qz-match-item-big" : ""} ${className}`}
        onClick={this.onItemClick}>
        {matchInfo.againstTeams != null && Object.keys(matchInfo.againstTeams).length == 1 ?
          (<View
            className={`qz-match-item-content ${payEnabled && matchInfo.isBetEnable && showBet ? "qz-match-item-content-big" : ""}`}>
            {((matchInfo.status && matchInfo.status.status == 21 && matchInfo.isRecordCharge) || (matchInfo.status && matchInfo.status.status < 21 && matchInfo.isLiveCharge)) && payEnabled && showCharge ?
              <View className="qz-match-item__charge">
                {matchInfo.isMonopoly ?
                  (matchInfo.monopolyUser ?
                      <View className="qz-match-item__charge-user">
                        <Image className='avatar'
                               src={matchInfo.monopolyUser.avatar ? matchInfo.monopolyUser.avatar : defaultLogo}/>
                        {matchInfo.monopolyUser.name}
                        请大家围观
                      </View>
                      : "匿名用户请大家围观"
                  ) : (matchInfo.chargeTimes ? `付费 ${matchInfo.chargeTimes}人已观看` : "付费")}
              </View>
              : null
            }
            {payEnabled && matchInfo.isBetEnable && showBet ?
              <View className="qz-match-item-top-skewed" onClick={this.onBetClick}>
                <View className="qz-match-item-top-skewed-center-text">
                  比分竞猜
                </View>
              </View>
              : null}
            <View className='qz-match-item__team'>
              <View className="qz-match-item__team-avatar">
                <Image
                  src={againstTeam.hostTeam && againstTeam.hostTeam.headImg ? againstTeam.hostTeam.headImg : defaultLogo}/>
              </View>
              <Text
                className="qz-match-item__team-name">
                {againstTeam.hostTeam ? againstTeam.hostTeam.name : ""}
              </Text>
            </View>
            <View className='qz-match-item__vs'>
              <View className='qz-match-item__vs-content'>
                {matchInfo.league != null ?
                  <Text className="qz-match-item__vs-league-name">
                    {matchInfo.league.shortName ? matchInfo.league.shortName : matchInfo.league.name}
                  </Text> : <View/>}
                {matchInfo.round != null && showRound ?
                  <Text className="qz-match-item__vs-match-round">
                    {matchInfo.round}
                  </Text> : <View/>}
                <Text
                  className="qz-match-item__vs-match-score">
                  {matchInfo.status && matchInfo.status.status == -1 ? "VS" : (matchInfo.status ? matchInfo.status.score[Object.keys(matchInfo.againstTeams)[0]] : "0-0")}
                </Text>
                <View className="qz-match-item__vs-match-status">
                  <View className="status-box">
                    <View
                      className={`background ${matchInfo.activityId == null || !matchInfo.available ? "" : eventType[matchInfo.status.status].color}`}>
                      <Text className={matchInfo.activityId == null || !matchInfo.available ? "text-disabled" : "text"}>
                        {matchInfo.statisticsModeAvailable ? "数据统计-" : ""}
                        {eventType[matchInfo.status.status].text}
                      </Text>
                      <View
                        className={`status-icon ${matchInfo.activityId == null || !matchInfo.available ? "none" : eventType[matchInfo.status.status].color}`}>
                        <View
                          className={`icon ${matchInfo.activityId == null || !matchInfo.available ? "none" : eventType[matchInfo.status.status].color}`}/>
                      </View>
                    </View>
                  </View>
                </View>
                <Text className="qz-match-item__vs-match-time">
                  {onlytime ? formatDayTime(new Date(matchInfo.startTime)) : formatTime(new Date(matchInfo.startTime))}
                </Text>
              </View>
            </View>
            <View className='qz-match-item__team'>
              <View className="qz-match-item__team-avatar">
                <Image
                  src={againstTeam.guestTeam && againstTeam.guestTeam.headImg ? againstTeam.guestTeam.headImg : defaultLogo}/>
              </View>
              <Text
                className="qz-match-item__team-name">
                {againstTeam.guestTeam ? againstTeam.guestTeam.name : ""}
              </Text>
            </View>
          </View>)
          : (
            matchInfo.againstTeams != null && Object.keys(matchInfo.againstTeams).length > 1 ?
              (<View
                className={`qz-match-item-content ${payEnabled && matchInfo.isBetEnable && showBet ? "qz-match-item-content-big" : ""}`}>
                {((matchInfo.status && matchInfo.status.status == 21 && matchInfo.isRecordCharge) || (matchInfo.status && matchInfo.status.status < 21 && matchInfo.isLiveCharge)) && payEnabled && showCharge ?
                  <View className="qz-match-item__charge">
                    {matchInfo.isMonopoly ?
                      (matchInfo.monopolyUser ?
                          <View className="qz-match-item__charge-user">
                            <Image className='avatar'
                                   src={matchInfo.monopolyUser.avatar ? matchInfo.monopolyUser.avatar : defaultLogo}/>
                            {matchInfo.monopolyUser.name}
                            请大家围观
                          </View>
                          : "匿名用户请大家围观"
                      ) : (matchInfo.chargeTimes ? `付费 ${matchInfo.chargeTimes}人已观看` : "付费")}
                  </View>
                  : null
                }
                {payEnabled && matchInfo.isBetEnable && showBet ?
                  <View className="qz-match-item-top-skewed" onClick={this.onBetClick}>
                    <View className="qz-match-item-top-skewed-center-text">
                      比分竞猜
                    </View>
                  </View>
                  : null}
                <View className='qz-match-item__vs-against'>
                  <View className='qz-match-item__vs-against-content'>
                    {matchInfo.league != null ?
                      <View>
                        <Image className="qz-match-item__vs-against-league-img"
                               src={matchInfo.league && matchInfo.league.headImg ? matchInfo.league.headImg : defaultLogo}/>
                        <Text className="qz-match-item__vs-against-league-name">
                          {matchInfo.league.shortName ? matchInfo.league.shortName : matchInfo.league.name}
                        </Text>
                      </View> : <View/>}
                    {matchInfo.round != null && showRound ?
                      <Text className="qz-match-item__vs-against-match-round">
                        {matchInfo.round}
                      </Text> : <View/>}
                    {onlytime ? null : <Text className="qz-match-item__vs-against-match-time">
                      {formatMonthDay(new Date(matchInfo.startTime))}
                    </Text>}
                    <Text className="qz-match-item__vs-against-match-time">
                      {formatDayTime(new Date(matchInfo.startTime))}
                    </Text>
                    <View className="qz-match-item__vs-against-match-status">
                      <View className="status-box">
                        <View
                          className={`background ${matchInfo.activityId == null || !matchInfo.available ? "" : eventType[matchInfo.status.status].color}`}>
                          <Text
                            className={matchInfo.activityId == null || !matchInfo.available ? "text-disabled" : "text"}>
                            {matchInfo.statisticsModeAvailable ? "数据统计-" : ""}
                            {eventType[matchInfo.status.status].text}
                          </Text>
                          <View
                            className={`status-icon ${matchInfo.activityId == null || !matchInfo.available ? "none" : eventType[matchInfo.status.status].color}`}>
                            <View
                              className={`icon ${matchInfo.activityId == null || !matchInfo.available ? "none" : eventType[matchInfo.status.status].color}`}/>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View className='qz-match-item__vs-against-divider'>
                  </View>
                </View>
                <View className='qz-match-item-against__teams'>
                  {
                    matchInfo.againstTeams && Object.keys(matchInfo.againstTeams).map((key: any) => {
                      return <View key={`against-${key}`} className='qz-match-item-against__team-against'>
                        <View className="qz-match-item-against__team">
                          <View className="qz-match-item-against__team-avatar">
                            <Image
                              src={matchInfo.againstTeams[key].hostTeam && matchInfo.againstTeams[key].hostTeam.headImg ? matchInfo.againstTeams[key].hostTeam.headImg : defaultLogo}/>
                          </View>
                          <Text
                            className="qz-match-item-against__team-name">
                            {matchInfo.againstTeams[key].hostTeam ? matchInfo.againstTeams[key].hostTeam.name : ""}
                          </Text>
                        </View>
                        <Text
                          className="qz-match-item-against__score">
                          {matchInfo.status && matchInfo.status.status == -1 ? "VS" : (matchInfo.status ? matchInfo.status.score[key] : "0-0")}
                        </Text>
                        <View className="qz-match-item-against__team">
                          <View className="qz-match-item-against__team-avatar">
                            <Image
                              src={matchInfo.againstTeams[key].guestTeam && matchInfo.againstTeams[key].guestTeam.headImg ? matchInfo.againstTeams[key].guestTeam.headImg : defaultLogo}/>
                          </View>
                          <Text
                            className="qz-match-item-against__team-name">
                            {matchInfo.againstTeams[key].guestTeam ? matchInfo.againstTeams[key].guestTeam.name : ""}
                          </Text>
                        </View>
                      </View>
                    })
                  }
                </View>
              </View>)
              :
              <View className="qz-match-item-content">
                <View className='qz-match-item__vs qz-match-item__vs-full'>
                  <View className='qz-match-item__vs-content'>
                    {matchInfo.league != null ?
                      <Text className="qz-match-item__vs-league-name">
                        {matchInfo.league.shortName ? matchInfo.league.shortName : matchInfo.league.name}
                      </Text> : <View/>}
                    {matchInfo.round != null && showRound ?
                      <Text className="qz-match-item__vs-match-round">
                        {matchInfo.round}
                      </Text> : <View/>}
                    <Text className="qz-match-item__vs-match-name">
                      {matchInfo.name}
                    </Text>
                    <View className="qz-match-item__vs-match-status">
                      <View className="status-box">
                        <View
                          className={`background ${matchInfo.activityId == null || !matchInfo.available ? "" : eventType[matchInfo.status.status].color}`}>
                          <Text
                            className={matchInfo.activityId == null || !matchInfo.available ? "text-disabled" : "text"}>
                            {eventType[matchInfo.status.status].text}
                          </Text>
                          <View
                            className={`status-icon ${matchInfo.activityId == null || !matchInfo.available ? "none" : eventType[matchInfo.status.status].color}`}>
                            <View
                              className={`icon ${matchInfo.activityId == null || !matchInfo.available ? "none" : eventType[matchInfo.status.status].color}`}/>
                          </View>
                        </View>
                      </View>
                    </View>
                    <Text className="qz-match-item__vs-match-time">
                      {onlytime ? formatDayTime(new Date(matchInfo.startTime)) : formatTime(new Date(matchInfo.startTime))}
                    </Text>
                  </View>
                </View>
              </View>
          )}
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    payEnabled: state.config ? state.config.payEnabled : null,
  }
}
export default connect(mapStateToProps)(MatchItem)
