import Taro, {getCurrentInstance} from '@tarojs/taro'
import {Component} from 'react'
import {View, Image} from '@tarojs/components'
import {AtActivityIndicator} from "taro-ui"
import {connect} from 'react-redux'
import defaultLogo from '../../assets/default-logo.png'

import './leagueSeriesStatistics.scss'
import LeagueItem from "../../components/league-item";
import leagueAction from "../../actions/league";
import withShare from "../../utils/withShare";
import NavBar from "../../components/nav-bar";

type PageStateProps = {
  leagueList: any;
  league: any;
  locationConfig: { city: string, province: string }
}

type PageDispatchProps = {}

type PageOwnProps = {}

type PageState = {
  searchText: string;
  loadingmore: boolean;
  loading: boolean;
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface LeagueSeriesStatistics {
  props: IProps;
}

@withShare({})
class LeagueSeriesStatistics extends Component<IProps, PageState> {
  navRef: any = null;

  constructor(props) {
    super(props)
    this.state = {
      searchText: "",
      loadingmore: false,
      loading: false,
  }
  }

  $setSharePath = () => `/pages/home/home?id=${this.getParamId()}&page=leagueSeriesStatistics`

  componentWillMount() {
  }

  componentDidMount() {
    this.getParamId() && this.getLeagueList(this.getParamId());
  }

  componentWillUnmount() {
  }

  componentDidShow() {
    console.log("componentDidShow")
  }

  componentDidHide() {
  }

  onShareAppMessage() {}

  onShareTimeline() {}

  getParamId = () => {
    let id;
    const router = getCurrentInstance().router;

    if (router && router.params) {
      if (router.params.id == null) {
        id = router.params.scene
      } else {
        id = router.params.id
      }
    } else {
      return null;
    }
    return id;
  }
  onLeagueItemClick = (item) => {
    if (item.isParent) {
      Taro.navigateTo({url: `../leagueSeriesStatistics/leagueSeriesStatistics?id=${item.id}`});
    } else {
      Taro.navigateTo({url: `../leagueMatchStatistics/leagueMatchStatistics?id=${item.id}`});
    }
  }
  getLeagueList = (id) => {
    this.setState({loading: true})
    Promise.all([
      leagueAction.getLeagueSeriesLeagues({pageNum: 1, pageSize: 100, seriesId: id}),
      leagueAction.getLeagueInfo({id: id})
    ]).then(() => {
      this.setState({loading: false})
    });
  }

  render() {
    const {leagueList, league} = this.props

    if (this.state.loading) {
      return <View className="qz-series-loading"><AtActivityIndicator mode="center" content="加载中..."/></View>
    }

    return (
      <View className='qz-series-content'>
        <NavBar
          title='一元体育'
          back
          ref={ref => {
            this.navRef = ref;
          }}
        />
        <View className='qz-series-content-header'>
          {league &&
          <View className='qz-series-content-header-container'>
            <Image className="img"
                   src={league.headImg ? league.headImg : defaultLogo}/>
            <View className='text'>{league.shortName ? league.shortName : league.name}</View>
          </View>
          }
        </View>
        {leagueList.records && leagueList.records.length > 0 ? (
          <View className='qz-series__result-content'>
            <View className='qz-series__result-content__inner'>
              {leagueList.records.map((item) => (
                <LeagueItem key={item.id} leagueInfo={item} onClick={this.onLeagueItemClick.bind(this, item)}/>
              ))}
            </View>
          </View>
        ) : null}
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    leagueList: state.league.seriesLeagues,
    league: state.league.league,
    locationConfig: state.config.locationConfig
  }
}
export default connect(mapStateToProps)(LeagueSeriesStatistics)
