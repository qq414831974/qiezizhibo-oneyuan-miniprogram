import {Component} from 'react'
import {ScrollView, Text, View} from '@tarojs/components'
import {AtActivityIndicator, AtList, AtTabs, AtTabsPane} from 'taro-ui'

import './index.scss'
import logo from "../../../../assets/no-person.png";
import PlayerStatistics from "../player-statistics";

type PageStateProps = {}

type PageDispatchProps = {}

type PageOwnProps = {
  leagueMatch: any;
  playerList: any;
  loading: boolean;
  visible: boolean;
  tabScrollStyle: any;
}

type PageState = {
  _playerList: any
  totalPoint: any
  threePoint: any
  twoPoint: any
  onePoint: any
  foul: any
  snatch: any
  backboard: any
  assists: any
  currentTab: any
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface LeaguePlayerTable {
  props: IProps;
}

class LeaguePlayerTable extends Component<IProps, PageState> {
  static defaultProps = {}

  constructor(props) {
    super(props)
    const {playerList} = props;
    const {totalPoint, threePoint, twoPoint, onePoint, foul, snatch, backboard, assists} = this.getStatistics(playerList);
    this.state = {
      _playerList: playerList,
      totalPoint: totalPoint,
      threePoint: threePoint,
      twoPoint: twoPoint,
      onePoint: onePoint,
      foul: foul,
      snatch: snatch,
      backboard: backboard,
      assists: assists,
      currentTab: 0,
    };
  }

  componentWillMount() {
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  componentDidShow() {
  }

  componentDidHide() {
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {playerList} = nextProps;
    if (playerList !== this.state._playerList) {
      this.setState({
        _playerList: playerList
      });
      const {totalPoint, threePoint, twoPoint, onePoint, foul, snatch, backboard, assists} = this.getStatistics(playerList);
      this.setState({totalPoint, threePoint, twoPoint, onePoint, foul, snatch, backboard, assists});
    }
  }

  getStatistics = (playerList) => {
    const totalPoint = this.getStatisticsItem(playerList, "totalPoint");
    const threePoint = this.getStatisticsItem(playerList, "threePoint");
    const twoPoint = this.getStatisticsItem(playerList, "twoPoint");
    const onePoint = this.getStatisticsItem(playerList, "onePoint");
    const foul = this.getStatisticsItem(playerList, "foul");
    const snatch = this.getStatisticsItem(playerList, "snatch");
    const backboard = this.getStatisticsItem(playerList, "backboard");
    const assists = this.getStatisticsItem(playerList, "assists");
    return {totalPoint, threePoint, twoPoint, onePoint, foul, snatch, backboard, assists}
  }
  getStatisticsItem = (playerList: Array<any> = [], key: string) => {
    if (playerList == null) {
      return [];
    }
    if (key == "totalPoint") {
      return playerList.filter(item => {
        return item.threePoint != null && item.twoPoint != null && item.onePoint != null
          && (item.threePoint + item.twoPoint + item.onePoint) > 0
      }).sort((a, b) => {
        const aPoint = a.threePoint * 3 + a.twoPoint * 2 + a.onePoint;
        const bPoint = b.threePoint * 3 + b.twoPoint * 2 + b.onePoint;
        if (bPoint - aPoint == 0) {
          return (b.threePoint - a.threePoint) || (b.twoPoint - a.twoPoint) || (b.onePoint - a.onePoint)
        }
        return bPoint - aPoint
      }).map(item => {
        item.totalPoint = item.threePoint * 3 + item.twoPoint * 2 + item.onePoint
        return item;
      });
    }
    return playerList.filter(item => item[key] != null && item[key] != 0).sort((a, b) => {
      return b[key] - a[key]
    });
  }

  getAverage = (num, totalMatch) => {
    if (totalMatch == 0) {
      return 0;
    }
    return (num / totalMatch).toFixed(1);
  }
  handleTabsClick = (value) => {
    this.setState({
      currentTab: value,
    })
  }

  render() {
    const {loading = false, visible = false} = this.props
    const {totalPoint, threePoint, twoPoint, onePoint, foul, snatch, backboard, assists} = this.state;
    if (!visible) {
      return <View/>
    }
    if (loading) {
      return <View className="qz-league-player-table__result-loading">
        <AtActivityIndicator
          mode="center"
          content="加载中..."/>
      </View>
    }
    return (
      <View className='qz-league-player-table__result' style={this.props.tabScrollStyle}>
        <AtTabs
          className="w-full"
          height={this.props.tabScrollStyle ? this.props.tabScrollStyle.height : null}
          current={this.state.currentTab}
          onClick={this.handleTabsClick}
          scroll
          tabDirection='vertical'
          tabList={[
            {title: '得分'},
            {title: '三分'},
            {title: '两分'},
            {title: '罚球'},
            {title: '犯规'},
            {title: '抢断'},
            {title: '篮板'},
            {title: '助攻'},
          ]}>
          <AtTabsPane tabDirection="vertical" current={this.state.currentTab} index={0}>
            {this.state.currentTab == 0 ? <ScrollView scrollY style={this.props.tabScrollStyle}>
              <View className='qz-league-player-table__result-header'>
                <View className="title">得分</View>
                <View>
                  <View className="title">场均</View>
                  <View className="title highlight">总计</View>
                </View>
              </View>
              <AtList hasBorder={false}>
                {totalPoint.map((player, index) => {
                  return <PlayerStatistics
                    key={`player-goal-${player.playerId}`}
                    index={index + 1}
                    playerName={player.player ? player.player.name : "无名"}
                    playerHeadImg={player.player && player.player.headImg ? player.player.headImg : logo}
                    teamName={player.team ? player.team.name : null}
                    extra={<View className="qz-league-player-table__number">
                      <Text>
                        {this.getAverage(player.totalPoint, player.totalMatch)}
                      </Text>
                      <Text>
                        {player.totalPoint ? player.totalPoint : 0}
                      </Text>
                    </View>}
                  />
                })}
              </AtList>
            </ScrollView> : null}
          </AtTabsPane>
          <AtTabsPane tabDirection="vertical" current={this.state.currentTab} index={1}>
            {this.state.currentTab == 1 ? <ScrollView scrollY style={this.props.tabScrollStyle}>
              <View className='qz-league-player-table__result-header'>
                <View className="title">三分</View>
                <View>
                  <View className="title">场均</View>
                  <View className="title highlight">总计</View>
                </View>
              </View>
              <AtList hasBorder={false}>
                {threePoint.map((player, index) => {
                  return <PlayerStatistics
                    key={`player-three-${player.playerId}`}
                    index={index + 1}
                    playerName={player.player ? player.player.name : "无名"}
                    playerHeadImg={player.player && player.player.headImg ? player.player.headImg : logo}
                    teamName={player.team ? player.team.name : null}
                    extra={<View className="qz-league-player-table__number">
                      <Text>
                        {this.getAverage(player.threePoint, player.totalMatch)}
                      </Text>
                      <Text>
                        {player.threePoint ? player.threePoint : 0}
                      </Text>
                    </View>}
                  />
                })}
              </AtList>
            </ScrollView> : null}
          </AtTabsPane>
          <AtTabsPane tabDirection="vertical" current={this.state.currentTab} index={2}>
            {this.state.currentTab == 2 ? <ScrollView scrollY style={this.props.tabScrollStyle}>
              <View className='qz-league-player-table__result-header'>
                <View className="title">两分</View>
                <View>
                  <View className="title">场均</View>
                  <View className="title highlight">总计</View>
                </View>
              </View>
              <AtList hasBorder={false}>
                {twoPoint.map((player, index) => {
                  return <PlayerStatistics
                    key={`player-two-${player.playerId}`}
                    index={index + 1}
                    playerName={player.player ? player.player.name : "无名"}
                    playerHeadImg={player.player && player.player.headImg ? player.player.headImg : logo}
                    teamName={player.team ? player.team.name : null}
                    extra={<View className="qz-league-player-table__number">
                      <Text>
                        {this.getAverage(player.twoPoint, player.totalMatch)}
                      </Text>
                      <Text>
                        {player.twoPoint ? player.twoPoint : 0}
                      </Text>
                    </View>}
                  />
                })}
              </AtList>
            </ScrollView> : null}
          </AtTabsPane>
          <AtTabsPane tabDirection="vertical" current={this.state.currentTab} index={3}>
            {this.state.currentTab == 3 ? <ScrollView scrollY style={this.props.tabScrollStyle}>
              <View className='qz-league-player-table__result-header'>
                <View className="title">罚球</View>
                <View>
                  <View className="title">场均</View>
                  <View className="title highlight">总计</View>
                </View>
              </View>
              <AtList hasBorder={false}>
                {onePoint.map((player, index) => {
                  return <PlayerStatistics
                    key={`player-one-${player.playerId}`}
                    index={index + 1}
                    playerName={player.player ? player.player.name : "无名"}
                    playerHeadImg={player.player && player.player.headImg ? player.player.headImg : logo}
                    teamName={player.team ? player.team.name : null}
                    extra={<View className="qz-league-player-table__number">
                      <Text>
                        {this.getAverage(player.onePoint, player.totalMatch)}
                      </Text>
                      <Text>
                        {player.onePoint ? player.onePoint : 0}
                      </Text>
                    </View>}
                  />
                })}
              </AtList>
            </ScrollView> : null}
          </AtTabsPane>
          <AtTabsPane tabDirection="vertical" current={this.state.currentTab} index={4}>
            {this.state.currentTab == 4 ? <ScrollView scrollY style={this.props.tabScrollStyle}>
              <View className='qz-league-player-table__result-header'>
                <View className="title">犯规</View>
                <View>
                  <View className="title">场均</View>
                  <View className="title highlight">总计</View>
                </View>
              </View>
              <AtList hasBorder={false}>
                {foul.map((player, index) => {
                  return <PlayerStatistics
                    key={`player-foul-${player.playerId}`}
                    index={index + 1}
                    playerName={player.player ? player.player.name : "无名"}
                    playerHeadImg={player.player && player.player.headImg ? player.player.headImg : logo}
                    teamName={player.team ? player.team.name : null}
                    extra={<View className="qz-league-player-table__number">
                      <Text>
                        {this.getAverage(player.foul, player.totalMatch)}
                      </Text>
                      <Text>
                        {player.foul ? player.foul : 0}
                      </Text>
                    </View>}
                  />
                })}
              </AtList>
            </ScrollView> : null}
          </AtTabsPane>
          <AtTabsPane tabDirection="vertical" current={this.state.currentTab} index={5}>
            {this.state.currentTab == 5 ? <ScrollView scrollY style={this.props.tabScrollStyle}>
              <View className='qz-league-player-table__result-header'>
                <View className="title">抢断</View>
                <View>
                  <View className="title">场均</View>
                  <View className="title highlight">总计</View>
                </View>
              </View>
              <AtList hasBorder={false}>
                {snatch.map((player, index) => {
                  return <PlayerStatistics
                    key={`player-snatch-${player.playerId}`}
                    index={index + 1}
                    playerName={player.player ? player.player.name : "无名"}
                    playerHeadImg={player.player && player.player.headImg ? player.player.headImg : logo}
                    teamName={player.team ? player.team.name : null}
                    extra={<View className="qz-league-player-table__number">
                      <Text>
                        {this.getAverage(player.snatch, player.totalMatch)}
                      </Text>
                      <Text>
                        {player.snatch ? player.snatch : 0}
                      </Text>
                    </View>}
                  />
                })}
              </AtList>
            </ScrollView> : null}
          </AtTabsPane>
          <AtTabsPane tabDirection="vertical" current={this.state.currentTab} index={6}>
            {this.state.currentTab == 6 ? <ScrollView scrollY style={this.props.tabScrollStyle}>
              <View className='qz-league-player-table__result-header'>
                <View className="title">篮板</View>
                <View>
                  <View className="title">场均</View>
                  <View className="title highlight">总计</View>
                </View>
              </View>
              <AtList hasBorder={false}>
                {backboard.map((player, index) => {
                  return <PlayerStatistics
                    key={`player-backboard${player.playerId}`}
                    index={index + 1}
                    playerName={player.player ? player.player.name : "无名"}
                    playerHeadImg={player.player && player.player.headImg ? player.player.headImg : logo}
                    teamName={player.team ? player.team.name : null}
                    extra={<View className="qz-league-player-table__number">
                      <Text>
                        {this.getAverage(player.backboard, player.totalMatch)}
                      </Text>
                      <Text>
                        {player.backboard ? player.backboard : 0}
                      </Text>
                    </View>}
                  />
                })}
              </AtList>
            </ScrollView> : null}
          </AtTabsPane>
          <AtTabsPane tabDirection="vertical" current={this.state.currentTab} index={7}>
            {this.state.currentTab == 7 ? <ScrollView scrollY style={this.props.tabScrollStyle}>
              <View className='qz-league-player-table__result-header'>
                <View className="title">助攻</View>
                <View>
                  <View className="title">场均</View>
                  <View className="title highlight">总计</View>
                </View>
              </View>
              <AtList hasBorder={false}>
                {assists.map((player, index) => {
                  return <PlayerStatistics
                    key={`player-assists-${player.playerId}`}
                    index={index + 1}
                    playerName={player.player ? player.player.name : "无名"}
                    playerHeadImg={player.player && player.player.headImg ? player.player.headImg : logo}
                    teamName={player.team ? player.team.name : null}
                    extra={<View className="qz-league-player-table__number">
                      <Text>
                        {this.getAverage(player.assists, player.totalMatch)}
                      </Text>
                      <Text>
                        {player.assists ? player.assists : 0}
                      </Text>
                    </View>}
                  />
                })}
              </AtList>
            </ScrollView> : null}
          </AtTabsPane>
        </AtTabs>
      </View>
    )
  }
}

export default LeaguePlayerTable
