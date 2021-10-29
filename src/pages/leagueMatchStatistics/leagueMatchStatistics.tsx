import Taro, {getCurrentInstance} from '@tarojs/taro'
import {Component} from 'react'
import {View, Image} from '@tarojs/components'
import {AtActivityIndicator} from "taro-ui"
import {connect} from 'react-redux'
import defaultLogo from '../../assets/default-logo.png'

import './leagueMatchStatistics.scss'
import LeagueManagerMatches from "./components/league-manager-matches"
import withShare from "../../utils/withShare";
import Request from "../../utils/request";
import * as api from "../../constants/api";
import NavBar from "../../components/nav-bar";
import EncryptionModal from "../../components/modal-encryption";

type PageStateProps = {
  userInfo: any;
}

type PageDispatchProps = {}

type PageOwnProps = {}

type PageState = {
  loadingmore: boolean;
  loading: boolean;
  loginOpen: any,
  phoneOpen: any,
  league: any,
  encryptionShow: boolean,
  passed: boolean,
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface LeagueMatchStatistics {
  props: IProps;
}

@withShare({})
class LeagueMatchStatistics extends Component<IProps, PageState> {
  navRef: any = null;
  leagueId: any = null;

  constructor(props) {
    super(props)
    this.state = {
      loadingmore: false,
      loading: false,
      loginOpen: false,
      phoneOpen: false,
      league: {},
      encryptionShow: true,
      passed: false,
    }
  }

  $setSharePath = () => `/pages/home/home?id=${this.leagueId}&page=leagueMatchStatistics`

  onShareAppMessage() {
  }

  onShareTimeline() {
  }

  componentWillMount() {
  }

  componentDidMount() {
    this.leagueId = this.getParamId();
    this.leagueId && this.getLeagueInfo(this.leagueId);
  }

  componentWillUnmount() {
  }

  componentDidShow() {
    this.leagueId = this.getParamId();
  }

  componentDidHide() {
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
  getLeagueInfo = (id) => {
    this.setState({loading: true})
    new Request().get(api.API_LEAGUE(id), null).then((data: any) => {
      this.setState({league: data, loading: false})
    })
  }
  verifyPassword = (password) => {
    if (password == null || password.trim() == "") {
      Taro.showToast({title: "请输入密码", icon: "none"})
      return;
    }
    this.setState({passed: false});
    new Request().post(api.API_STATISTICS_VERIFY, {
      leagueId: this.leagueId,
      passwordInput: password,
    }).then((res: any) => {
      if (res) {
        this.setState({passed: true, encryptionShow: false});
      } else {
        Taro.showToast({title: "密码错误", icon: "none"})
      }
    })
  }
  onEncryptionConfirm = (password) => {
    this.verifyPassword(password);
  }
  onEncryptionCancel = () => {
    Taro.navigateBack({
      delta: 1
    })
  }

  render() {
    const {league} = this.state

    if (this.state.loading) {
      return <View className="qz-league-match-statistics-loading"><AtActivityIndicator mode="center" content="加载中..."/></View>
    }

    return (
      <View className='qz-league-match-statistics-content'>
        <EncryptionModal
          isOpened={this.state.encryptionShow}
          handleConfirm={this.onEncryptionConfirm}
          handleCancel={this.onEncryptionCancel}/>
        <NavBar
          title='1元体育'
          back
          ref={ref => {
            this.navRef = ref;
          }}
        />
        <View className='qz-league-match-statistics-header'>
          {league &&
          <View className='qz-league-match-statistics-header-container'>
            <Image className="img img-round"
                   src={league.headImg ? league.headImg : defaultLogo}/>
            <View className='text'>{league.shortName ? league.shortName : league.name}</View>
          </View>
          }
        </View>
        {this.state.passed ? <LeagueManagerMatches
          tabScrollStyle={{height: `calc(100vh - ${this.navRef ? this.navRef.state.configStyle.navHeight : 0}px - 44px )`}}
          leagueMatch={league}
          loading={this.state.loading}/> : null}
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.user.userInfo,
  }
}
export default connect(mapStateToProps)(LeagueMatchStatistics)
