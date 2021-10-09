import {Component} from 'react'
import {View, Text, Picker, Image, ScrollView} from '@tarojs/components'
import './index.scss'
import StatBar from '../stat-bar';
import logo from "../../../../assets/default-logo.png";

type PageStateProps = {}

type PageDispatchProps = {}

type PageOwnProps = {
  statistics: [];
  matchInfo: any;
  refreshFunc: any;
}

type PageState = {
  selectorValue: any;
  againstSelector: any;
  againstSelectorValue: any;
  currentAgainstIndex: any;
  againstStatistics: any;
  section: any;
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Statistics {
  props: IProps;
}

class Statistics extends Component<IProps, PageState> {
  static defaultProps = {}

  constructor(props) {
    super(props)
    this.state = {
      selectorValue: 0,
      againstSelector: [],
      againstSelectorValue: [],
      currentAgainstIndex: 1,
      againstStatistics: {},
      section: [],
    }
  }

  componentDidMount() {
    const {matchInfo = {}} = this.props
    if (matchInfo && matchInfo.section) {
      let section = [];
      for (let i = 1; i <= matchInfo.section; i++) {
        section.push(i);
      }
      this.setState({section: section});
    }
    if (matchInfo && matchInfo.againstTeams) {
      let againstSelector: any = [];
      let againstSelectorValue: any = [];
      for (let key of Object.keys(matchInfo.againstTeams)) {
        const againstTeam = matchInfo.againstTeams[key];
        if (againstTeam && againstTeam.hostTeam && againstTeam.guestTeam) {
          againstSelector.push(`${againstTeam.hostTeam.name} VS ${againstTeam.guestTeam.name}`);
          againstSelectorValue.push(key);
        }
      }
      this.setState({againstSelector: againstSelector, againstSelectorValue: againstSelectorValue}, () => {
        this.refresh();
      })
    }
    this.props.refreshFunc && this.props.refreshFunc(this.refresh)
  }

  refresh = () => {
    const againstStatistics = this.getStatisticsList();
    this.setState({againstStatistics: againstStatistics})
  }
  getStatisticsPrecent = (hostvalue, guestvalue): any => {
    const total = hostvalue + guestvalue;
    let precent = 0;
    if (hostvalue == guestvalue || total == 0) {
      return 50;
    }
    precent = hostvalue / (hostvalue + guestvalue) * 100;
    return precent;
  }
  getStatisticsList = () => {
    const statistics = this.props.statistics
    if (statistics == null) {
      return {}
    }
    const aganistStatistics: any = statistics[this.state.currentAgainstIndex];
    if (aganistStatistics) {
      const {
        goalOneHost = 0, goalOneGuest = 0,
        goalTwoHost = 0, goalTwoGuest = 0,
        goalThreeHost = 0, goalThreeGuest = 0,
        foulHost = 0, foulGuest = 0,
        backboardHost = 0, backboardGuest = 0,
        assistsHost = 0, assistsGuest = 0,
        snatchHost = 0, snatchGuest = 0,
      } = aganistStatistics;
      aganistStatistics.goalOnePercent = this.getStatisticsPrecent(goalOneHost, goalOneGuest);
      aganistStatistics.goalTwoPercent = this.getStatisticsPrecent(goalTwoHost, goalTwoGuest);
      aganistStatistics.goalThreePercent = this.getStatisticsPrecent(goalThreeHost, goalThreeGuest);
      aganistStatistics.foulPercent = this.getStatisticsPrecent(foulHost, foulGuest);
      aganistStatistics.backboardPercent = this.getStatisticsPrecent(backboardHost, backboardGuest);
      aganistStatistics.assistsPercent = this.getStatisticsPrecent(assistsHost, assistsGuest);
      aganistStatistics.snatchPercent = this.getStatisticsPrecent(snatchHost, snatchGuest);
      aganistStatistics.hostGoal = goalOneHost + goalTwoHost * 2 + goalThreeHost * 3;
      aganistStatistics.guestGoal = goalOneGuest + goalTwoGuest * 2 + goalThreeGuest * 3;
      let guestPlayerStatistics = aganistStatistics.guestPlayerStatistics;
      let hostPlayerStatistics = aganistStatistics.hostPlayerStatistics;
      let hostBest = null;
      let guestBest = null;
      if (hostPlayerStatistics != null) {
        let array = []
        for (let key of Object.keys(hostPlayerStatistics)) {
          let obj = hostPlayerStatistics[key]
          obj.id = key
          array.push(obj)
        }
        array.sort((a, b) => {
          return b.goalTotal - a.goalTotal;
        })
        aganistStatistics.hostPlayerStatistics = array;
        hostBest = aganistStatistics.hostPlayerStatistics[0];
      }
      if (guestPlayerStatistics != null) {
        let array = []
        for (let key of Object.keys(guestPlayerStatistics)) {
          let obj = guestPlayerStatistics[key]
          obj.id = key
          array.push(obj)
        }
        array.sort((a, b) => {
          return b.goalTotal - a.goalTotal;
        })
        aganistStatistics.guestPlayerStatistics = array;
        guestBest = aganistStatistics.guestPlayerStatistics[0];
      }
      if (hostBest != null) {
        aganistStatistics.bestHostPlayerHeadImg = hostBest.player && hostBest.player.headImg ? hostBest.player.headImg : logo;
        aganistStatistics.bestHostPlayerName = hostBest.player && hostBest.player.name ? hostBest.player.name : "球员";
        aganistStatistics.bestHostPlayerGoal = hostBest.goalTotal ? hostBest.goalTotal : 0;
      }
      if (guestBest != null) {
        aganistStatistics.bestGuestPlayerHeadImg = guestBest.player && guestBest.player.headImg ? guestBest.player.headImg : logo;
        aganistStatistics.bestGuestPlayerName = guestBest.player && guestBest.player.name ? guestBest.player.name : "球员";
        aganistStatistics.bestGuestPlayerGoal = guestBest.goalTotal ? guestBest.goalTotal : 0;
      }
      return aganistStatistics;
    }
    return {};
  }
  onPickerChange = (e) => {
    this.setState({
      selectorValue: e.detail.value,
      currentAgainstIndex: this.state.againstSelectorValue[e.detail.value]
    }, () => {
      this.refresh();
    })
  }
  getCurrentAgainst = () => {
    const {matchInfo = {}} = this.props
    const {currentAgainstIndex} = this.state
    if (matchInfo == null || matchInfo.againstTeams == null || matchInfo.againstTeams[currentAgainstIndex] == null) {
      return {};
    }
    return matchInfo.againstTeams[currentAgainstIndex];
  }

  render() {
    const {matchInfo = {}} = this.props
    const {
      goalOneHost = 0, goalOneGuest = 0,
      goalTwoHost = 0, goalTwoGuest = 0,
      goalThreeHost = 0, goalThreeGuest = 0,
      goalOnePercent = 50, goalTwoPercent = 50,
      goalThreePercent = 50, foulPercent = 50,
      backboardPercent = 50, assistsPercent = 50,
      snatchPercent = 50,
      hostGoal = 0, guestGoal = 0,
      foulHost = 0, foulGuest = 0,
      backboardHost = 0, backboardGuest = 0,
      assistsHost = 0, assistsGuest = 0,
      snatchHost = 0, snatchGuest = 0,
      sectionScore = {},
      hostPlayerStatistics = [], guestPlayerStatistics = [],
      bestHostPlayerHeadImg = logo,
      bestGuestPlayerHeadImg = logo,
      bestHostPlayerName = null,
      bestGuestPlayerName = null,
      bestHostPlayerGoal = 0,
      bestGuestPlayerGoal = 0,
    } = this.state.againstStatistics;
    const currentAgainst = this.getCurrentAgainst();

    return (
      <View className="qz-statistics">
        {matchInfo.againstTeams && Object.keys(matchInfo.againstTeams).length > 1 && <Picker
          className="center"
          mode='selector'
          range={this.state.againstSelector}
          onChange={this.onPickerChange}
          value={this.state.selectorValue}>
          <View className="qz-statistics-selector-text">
            {this.state.againstSelector[this.state.selectorValue]}
            <View className="at-icon at-icon-chevron-down qz-statistics-selector-text-chevron"/>
          </View>
        </Picker>}
        <View>
          <View className="qz-statistics-table">
            <View className="qz-statistics-table__title">
              <Text>得分总览</Text>
            </View>
            <View className="qz-statistics-table__layout">
              <View className="qz-statistics-table__header">
                <View className="qz-statistics-table__header-inner overview">
                  {this.state.section && this.state.section.map((index) => {
                    return <View className="qz-statistics-table__header-title" key={`title-section-${index}`}>第{index}节</View>
                  })}
                  <View className="qz-statistics-table__header-title">总分</View>
                </View>
              </View>
              <View className="qz-statistics-table__content">
                <View className="qz-statistics-table__item">
                  <View className="qz-statistics-table__item-inner overview">
                    <View className='qz-statistics-table__item-avatar'>
                      <Image
                        mode='scaleToFill'
                        src={currentAgainst.hostTeam && currentAgainst.hostTeam.headImg ? currentAgainst.hostTeam.headImg : logo}/>
                    </View>
                    {this.state.section && this.state.section.map((index) => {
                      return <View key={`team-host-section-${index}`} className='qz-statistics-table__item-text'>
                        {sectionScore[index] ? sectionScore[index].hostScore : 0}
                      </View>
                    })}
                    <View className='qz-statistics-table__item-text'>
                      {hostGoal ? hostGoal : 0}
                    </View>
                  </View>
                </View>
                <View className="qz-statistics-table__item">
                  <View className="qz-statistics-table__item-inner overview">
                    <View className='qz-statistics-table__item-avatar'>
                      <Image
                        mode='scaleToFill'
                        src={currentAgainst.guestTeam && currentAgainst.guestTeam.headImg ? currentAgainst.guestTeam.headImg : logo}/>
                    </View>
                    {this.state.section && this.state.section.map((index) => {
                      return <View key={`team-guest-section-${index}`} className='qz-statistics-table__item-text'>
                        {sectionScore[index] ? sectionScore[index].guestScore : 0}
                      </View>
                    })}
                    <View className='qz-statistics-table__item-text'>
                      {guestGoal ? guestGoal : 0}
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View className="qz-statistics-table">
            <View className="qz-statistics-table__title">
              <Text>本场最佳</Text>
            </View>
            <View className="qz-statistics-table__layout">
              <View className="qz-statistics-table__content">
                <View className="qz-statistics-table__item">
                  <View className="qz-statistics-table__item-inner best">
                    <View className="player-left">
                      <View className='qz-statistics-table__item-avatar'>
                        <Image
                          mode='scaleToFill'
                          src={bestHostPlayerHeadImg}/>
                      </View>
                      <View className='qz-statistics-table__item-name'>
                        {bestHostPlayerName}
                      </View>
                    </View>
                    <View className="score-center">
                      <View className={`score ${bestHostPlayerGoal >= bestGuestPlayerGoal ? "score-highlight" : ""}`}>
                        {bestHostPlayerGoal}
                      </View>
                      <View className="text">得分</View>
                      <View className={`score ${bestGuestPlayerGoal >= bestHostPlayerGoal ? "score-highlight" : ""}`}>
                        {bestGuestPlayerGoal}
                      </View>
                    </View>
                    <View className="player-right">
                      <View className='qz-statistics-table__item-name'>
                        {bestGuestPlayerName}
                      </View>
                      <View className='qz-statistics-table__item-avatar'>
                        <Image
                          mode='scaleToFill'
                          src={bestGuestPlayerHeadImg}/>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View className="qz-statistics-table">
            <View className="qz-statistics-table__title">
              <Text>{currentAgainst.hostTeam && currentAgainst.hostTeam.name ? currentAgainst.hostTeam.name : "主队"}</Text>
            </View>
            <ScrollView scrollX className="qz-statistics-table__layout">
              <View className="qz-statistics-table__header max-content">
                <View className="qz-statistics-table__header-inner player-statistics">
                  <View className="player-left">
                    <View>主队</View>
                  </View>
                  <View className="player-right">
                    <View>得分</View>
                    <View>三分</View>
                    <View>两分</View>
                    <View>罚球</View>
                    <View>犯规</View>
                    <View>篮板</View>
                    <View>助攻</View>
                    <View>抢断</View>
                  </View>
                </View>
              </View>
              <View className="qz-statistics-table__content">
                {hostPlayerStatistics && hostPlayerStatistics.map((statistics: any) => {
                  return <View className="qz-statistics-table__item max-content">
                    <View className="qz-statistics-table__item-inner player-statistics">
                      <View className="player-left">
                        <View className='qz-statistics-table__item-shirtNum'>
                          {statistics.player && statistics.player.shirtNum ? statistics.player.shirtNum : 0}
                        </View>
                        <View className='qz-statistics-table__item-player-name'>
                          {statistics.player && statistics.player.name ? statistics.player.name : "球员"}
                        </View>
                      </View>
                      <View className="player-right">
                        <View className='qz-statistics-table__item-point'>
                          {statistics.goalTotal ? statistics.goalTotal : 0}
                        </View>
                        <View className='qz-statistics-table__item-point'>
                          {statistics.goalThree ? statistics.goalThree : 0}
                        </View>
                        <View className='qz-statistics-table__item-point'>
                          {statistics.goalTwo ? statistics.goalTwo : 0}
                        </View>
                        <View className='qz-statistics-table__item-point'>
                          {statistics.goalOne ? statistics.goalOne : 0}
                        </View>
                        <View className='qz-statistics-table__item-point'>
                          {statistics.foul ? statistics.foul : 0}
                        </View>
                        <View className='qz-statistics-table__item-point'>
                          {statistics.backboard ? statistics.backboard : 0}
                        </View>
                        <View className='qz-statistics-table__item-point'>
                          {statistics.assists ? statistics.assists : 0}
                        </View>
                        <View className='qz-statistics-table__item-point'>
                          {statistics.snatch ? statistics.snatch : 0}
                        </View>
                      </View>
                    </View>
                  </View>
                })}
              </View>
              <View className="qz-statistics-table__footer">
                <View className="qz-statistics-table__footer-inner">
                  <View className="player-left">
                    <Text>总计</Text>
                  </View>
                  <View className="player-right">
                    <Text>{hostGoal}</Text>
                    <Text>{goalThreeHost}</Text>
                    <Text>{goalTwoHost}</Text>
                    <Text>{goalOneHost}</Text>
                    <Text>{foulHost}</Text>
                    <Text>{backboardHost}</Text>
                    <Text>{assistsHost}</Text>
                    <Text>{snatchHost}</Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
          <View className="qz-statistics-table">
            <View className="qz-statistics-table__title">
              <Text>{currentAgainst.guestTeam && currentAgainst.guestTeam.name ? currentAgainst.guestTeam.name : "客队"}</Text>
            </View>
            <ScrollView scrollX className="qz-statistics-table__layout">
              <View className="qz-statistics-table__header max-content">
                <View className="qz-statistics-table__header-inner player-statistics">
                  <View className="player-left">
                    <View>客队</View>
                  </View>
                  <View className="player-right">
                    <View>得分</View>
                    <View>三分</View>
                    <View>两分</View>
                    <View>罚球</View>
                    <View>犯规</View>
                    <View>篮板</View>
                    <View>助攻</View>
                    <View>抢断</View>
                  </View>
                </View>
              </View>
              <View className="qz-statistics-table__content">
                {guestPlayerStatistics && guestPlayerStatistics.map((statistics: any) => {
                  return <View className="qz-statistics-table__item max-content">
                    <View className="qz-statistics-table__item-inner player-statistics">
                      <View className="player-left">
                        <View className='qz-statistics-table__item-shirtNum'>
                          {statistics.player && statistics.player.shirtNum ? statistics.player.shirtNum : 0}
                        </View>
                        <View className='qz-statistics-table__item-player-name'>
                          {statistics.player && statistics.player.name ? statistics.player.name : "球员"}
                        </View>
                      </View>
                      <View className="player-right">
                        <View className='qz-statistics-table__item-point'>
                          {statistics.goalTotal ? statistics.goalTotal : 0}
                        </View>
                        <View className='qz-statistics-table__item-point'>
                          {statistics.goalThree ? statistics.goalThree : 0}
                        </View>
                        <View className='qz-statistics-table__item-point'>
                          {statistics.goalTwo ? statistics.goalTwo : 0}
                        </View>
                        <View className='qz-statistics-table__item-point'>
                          {statistics.goalOne ? statistics.goalOne : 0}
                        </View>
                        <View className='qz-statistics-table__item-point'>
                          {statistics.foul ? statistics.foul : 0}
                        </View>
                        <View className='qz-statistics-table__item-point'>
                          {statistics.backboard ? statistics.backboard : 0}
                        </View>
                        <View className='qz-statistics-table__item-point'>
                          {statistics.assists ? statistics.assists : 0}
                        </View>
                        <View className='qz-statistics-table__item-point'>
                          {statistics.snatch ? statistics.snatch : 0}
                        </View>
                      </View>
                    </View>
                  </View>
                })}
              </View>
              <View className="qz-statistics-table__footer">
                <View className="qz-statistics-table__footer-inner">
                  <View className="player-left">
                    <Text>总计</Text>
                  </View>
                  <View className="player-right">
                    <Text>{guestGoal}</Text>
                    <Text>{goalThreeGuest}</Text>
                    <Text>{goalTwoGuest}</Text>
                    <Text>{goalOneGuest}</Text>
                    <Text>{foulGuest}</Text>
                    <Text>{backboardGuest}</Text>
                    <Text>{assistsGuest}</Text>
                    <Text>{snatchGuest}</Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
          <View className="qz-statistics-item-container">
            <View className="qz-statistics-item">
              <View className="qz-statistics-item-text">
                <Text className="qz-statistics-item-text-title">三分</Text>
                <Text className="qz-statistics-item-text-host">{goalThreeHost}</Text>
                <Text className="qz-statistics-item-text-guest">{goalThreeGuest}</Text>
              </View>
              <View className="qz-statistics-item-stat">
                <StatBar percent={goalThreePercent}/>
              </View>
            </View>
            <View className="qz-statistics-item">
              <View className="qz-statistics-item-text">
                <Text className="qz-statistics-item-text-title">二分</Text>
                <Text className="qz-statistics-item-text-host">{goalTwoHost}</Text>
                <Text className="qz-statistics-item-text-guest">{goalTwoGuest}</Text>
              </View>
              <View className="qz-statistics-item-stat">
                <StatBar percent={goalTwoPercent}/>
              </View>
            </View>
            <View className="qz-statistics-item">
              <View className="qz-statistics-item-text">
                <Text className="qz-statistics-item-text-title">罚球</Text>
                <Text className="qz-statistics-item-text-host">{goalOneHost}</Text>
                <Text className="qz-statistics-item-text-guest">{goalOneGuest}</Text>
              </View>
              <View className="qz-statistics-item-stat">
                <StatBar percent={goalOnePercent}/>
              </View>
            </View>
            <View className="qz-statistics-item">
              <View className="qz-statistics-item-text">
                <Text className="qz-statistics-item-text-title">犯规</Text>
                <Text className="qz-statistics-item-text-host">{foulHost}</Text>
                <Text className="qz-statistics-item-text-guest">{foulGuest}</Text>
              </View>
              <View className="qz-statistics-item-stat">
                <StatBar percent={foulPercent}/>
              </View>
            </View>
            <View className="qz-statistics-item">
              <View className="qz-statistics-item-text">
                <Text className="qz-statistics-item-text-title">篮板</Text>
                <Text className="qz-statistics-item-text-host">{backboardHost}</Text>
                <Text className="qz-statistics-item-text-guest">{backboardGuest}</Text>
              </View>
              <View className="qz-statistics-item-stat">
                <StatBar percent={backboardPercent}/>
              </View>
            </View>
            <View className="qz-statistics-item">
              <View className="qz-statistics-item-text">
                <Text className="qz-statistics-item-text-title">助攻</Text>
                <Text className="qz-statistics-item-text-host">{assistsHost}</Text>
                <Text className="qz-statistics-item-text-guest">{assistsGuest}</Text>
              </View>
              <View className="qz-statistics-item-stat">
                <StatBar percent={assistsPercent}/>
              </View>
            </View>
            <View className="qz-statistics-item">
              <View className="qz-statistics-item-text">
                <Text className="qz-statistics-item-text-title">抢断</Text>
                <Text className="qz-statistics-item-text-host">{snatchHost}</Text>
                <Text className="qz-statistics-item-text-guest">{snatchGuest}</Text>
              </View>
              <View className="qz-statistics-item-stat">
                <StatBar percent={snatchPercent}/>
              </View>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

export default Statistics
