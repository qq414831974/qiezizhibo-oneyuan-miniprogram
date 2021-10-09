import {Component} from 'react'
import {View, ScrollView, Text, Image, Picker} from '@tarojs/components'
import {AtSegmentedControl, AtActivityIndicator} from 'taro-ui'
import './index.scss'
import noperson from '../../../../assets/no-person.png';
import shirt from '../../../../assets/live/t-shirt.png';
import Request from "../../../../utils/request";
import * as api from "../../../../constants/api";

const HOSTTEAM = 0;
const GUESTTEAM = 1;

type PageStateProps = {}

type PageDispatchProps = {}

type PageOwnProps = {
  matchInfo: any;
  hidden: any;
  bindOnClick: any;
  tabContainerStyle?: any;
  tabScrollStyle?: any;
}

type PageState = {
  current: number;
  players: [];
  loading: boolean;
  selectorValue: any;
  againstSelector: any;
  againstSelectorValue: any;
  currentAgainstIndex: any;
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface LineUp {
  props: IProps;
}

class LineUp extends Component<IProps, PageState> {
  static defaultProps = {}

  constructor(props) {
    super(props)
    this.state = {
      current: HOSTTEAM,
      players: [],
      loading: false,
      selectorValue: 0,
      againstSelector: [],
      againstSelectorValue: [],
      currentAgainstIndex: 1,
    }
  }

  componentDidMount() {
    const {matchInfo = {},bindOnClick} = this.props
    if (matchInfo && matchInfo.againstTeams) {
      bindOnClick(()=>{
        this.handleClick(HOSTTEAM);
      })
      let againstSelector: any = [];
      let againstSelectorValue: any = [];
      for (let key of Object.keys(matchInfo.againstTeams)) {
        const againstTeam = matchInfo.againstTeams[key];
        if (againstTeam && againstTeam.hostTeam && againstTeam.guestTeam) {
          againstSelector.push(`${againstTeam.hostTeam.name} VS ${againstTeam.guestTeam.name}`);
          againstSelectorValue.push(key);
        }
      }
      this.setState({againstSelector: againstSelector, againstSelectorValue: againstSelectorValue})
    }
  }

  getTeamPlayerList = (teamId) => {
    this.setState({loading: true})
    new Request().get(api.API_PLAYERS, {teamId: teamId, pageSize: 100, pageNum: 1}).then((data: any) => {
      if (data) {
        this.setState({players: data.records, loading: false})
      }
    });
  }

  handleClick = (value) => {
    this.setState({
      current: value
    }, () => {
      this.getCurrentAgainstTeamPlayers(value);
    })
  }
  onPickerChange = (e) => {
    this.setState({
      selectorValue: e.detail.value,
      currentAgainstIndex: this.state.againstSelectorValue[e.detail.value]
    }, () => {
      this.handleClick(HOSTTEAM);
    })
  }
  getCurrentAgainstTeams = () => {
    const currentAgainstIndex = this.state.currentAgainstIndex;
    let teams: Array<string> = [];
    const {matchInfo = {}} = this.props
    if (matchInfo && matchInfo.againstTeams) {
      const againstTeam = matchInfo.againstTeams[currentAgainstIndex];
      if (againstTeam && againstTeam.hostTeam) {
        teams.push(againstTeam.hostTeam.name);
      }
      if (againstTeam && againstTeam.guestTeam) {
        teams.push(againstTeam.guestTeam.name);
      }
    }
    return teams;
  }
  getCurrentAgainstTeamPlayers = (value) => {
    const currentAgainstIndex = this.state.currentAgainstIndex;
    const {matchInfo = {}} = this.props
    if (matchInfo && matchInfo.againstTeams) {
      const againstTeam = matchInfo.againstTeams[currentAgainstIndex];
      if (againstTeam && againstTeam.hostTeam && value == HOSTTEAM) {
        this.getTeamPlayerList(againstTeam.hostTeam.id)
      }
      if (againstTeam && againstTeam.guestTeam && value == GUESTTEAM) {
        this.getTeamPlayerList(againstTeam.guestTeam.id)
      }
    }
  }

  render() {
    const {hidden = false, matchInfo = {}} = this.props
    const {players = [], loading = false,} = this.state
    if (hidden) {
      return <View/>
    }
    return (
      <View className="qz-lineup" style={this.props.tabContainerStyle}>
        {matchInfo.againstTeams && Object.keys(matchInfo.againstTeams).length > 1 && <Picker
          className="center"
          mode='selector'
          range={this.state.againstSelector}
          onChange={this.onPickerChange}
          value={this.state.selectorValue}>
          <View className="qz-lineup-selector-text">
            {this.state.againstSelector[this.state.selectorValue]}
            <View className="at-icon at-icon-chevron-down qz-lineup-selector-text-chevron"/>
          </View>
        </Picker>}
        <AtSegmentedControl
          values={this.getCurrentAgainstTeams()}
          onClick={this.handleClick}
          current={this.state.current}
        />
        <ScrollView scrollY className="qz-lineup-scroll-content" style={this.props.tabScrollStyle}>
          {loading ?
            <View className="qz-lineup-content-loading"><AtActivityIndicator mode="center" content="加载中..."/></View>
            :
            players.map((item: any) => (
              <View key={item.id} className='qz-lineup-content'>
                <View className='qz-lineup-list'>
                  <View className='qz-lineup-list__item'>
                    <View className='qz-lineup-list__item-container'>
                      <View className='qz-lineup-list__item-avatar'>
                        <Image mode='scaleToFill' src={item.headImg ? item.headImg : noperson}/>
                      </View>
                      <View className='qz-lineup-list__item-content item-content'>
                        <View className='item-content__info'>
                          <View className='item-content__info-title'>{item.name}</View>
                          {/*{"11" && <View className='item-content__info-note'>{111}</View>}*/}
                        </View>
                      </View>
                      <View className='qz-lineup-list__item-extra item-extra'>
                        <View className='item-extra__image'>
                          <Image mode='aspectFit' src={shirt}/>
                          <Text>{item.shirtNum}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            ))
          }
        </ScrollView>
      </View>
    )
  }
}

export default LineUp
