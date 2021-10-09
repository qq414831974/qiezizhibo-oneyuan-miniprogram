import {Component} from 'react'
import {View, ScrollView} from '@tarojs/components'
import {connect} from 'react-redux'
import {AtSearchBar} from 'taro-ui'

import './leagueStatistics.scss'
import searchAction from "../../actions/search";
import SearchLeague from "./components/search-league";
import withShare from "../../utils/withShare";
import NavBar from "../../components/nav-bar";

type PageStateProps = {
  league: any;
  match: any;
}

type PageDispatchProps = {}

type PageOwnProps = {}

type PageState = {
  searchText: string;
  isBeenSearch: boolean;
  loading: boolean;
  loadingmore: boolean;
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface LeagueStatistics {
  props: IProps;
}

@withShare({})
class LeagueStatistics extends Component<IProps, PageState> {
  static defaultProps = {}
  // tabsY: number;
  scrollTop: number;
  navRef: any = null;

  constructor(props) {
    super(props)
    this.state = {
      searchText: "",
      isBeenSearch: false,
      loading: false,
      loadingmore: false,
    }
  }

  $setSharePath = () => `/pages/home/home?page=leagueStatistics`

  componentWillMount() {
  }

  componentDidMount() {
    this.onSearch()
  }

  componentWillUnmount() {
    searchAction.search_clear_all();
  }

  componentDidShow() {
  }

  componentDidHide() {
  }

  onShareAppMessage() {
  }

  onShareTimeline() {
  }

  onSearchChange = (value) => {
    this.setState({
      searchText: value,
    })
  }
  onSearch = () => {
    this.setState({isBeenSearch: true, loading: true})
    Promise.all([searchAction.search_league({
      name: this.state.searchText,
      pageSize: 5,
      pageNum: 1,
    })]).then(() => {
      this.setState({loading: false})
    })
  }

  nextPage = () => {
    this.setState({isBeenSearch: true, loadingmore: true})
    searchAction.search_league_add({
      name: this.state.searchText,
      pageSize: 5,
      pageNum: this.props.league.current + 1,
    }).then(() => {
      this.setState({loadingmore: false})
    })
  }

  // 小程序上拉加载
  onScrollToBottom = () => {
    this.nextPage();
  }


  render() {
    const {league} = this.props
    const timestamp = new Date().getTime();

    return (
      <ScrollView scrollY onScrollToLower={this.onScrollToBottom}
                  className='qz-search-scroll-content'>
        <NavBar
          title='一元体育'
          back
          ref={ref => {
            this.navRef = ref;
          }}
        />
        <View className='qz-search-content'>
          <View className='qz-search__top-search-bar__content'>
            <AtSearchBar
              value={this.state.searchText}
              onChange={this.onSearchChange}
              onActionClick={this.onSearch}
              onConfirm={this.onSearch}
              className='qz-search__top-search-bar'
              focus
            />
          </View>
          <View className='qz-search-tabs'>
            <SearchLeague
              nextPage={this.nextPage}
              league={{...league, timestamp: timestamp}}
              searchKey={this.state.searchText}
              onSearch={this.onSearch}
              loading={this.state.loading}
              loadingmore={this.state.loadingmore}
              isBeenSearch={this.state.isBeenSearch}/>
          </View>
        </View>
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    league: state.search.league,
    match: state.search.match,
    locationConfig: state.config.locationConfig
    // player: state.search.player ? state.search.player : {},
  }
}
export default connect(mapStateToProps)(LeagueStatistics)
