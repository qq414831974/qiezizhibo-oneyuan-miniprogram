import Taro, {getCurrentInstance} from '@tarojs/taro'
import {Component} from 'react'
import {View, WebView} from '@tarojs/components'
import {connect} from 'react-redux'

import {AtActivityIndicator} from 'taro-ui'

import './personVerify.scss'
import Request from "../../utils/request";
import * as api from "../../constants/api";
import {checkIdCard} from "../../utils/utils";
import IdcardVerifyModal from "./components/modal-idcard-verify";

type PageStateProps = {}

type PageDispatchProps = {}

type PageOwnProps = {}

type PageState = {
  loading: boolean;
  verifyUrl: string;
  idCardVerifyShow: boolean;
  idCard: string;
  name: string;
  idCardInput: string;
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface PersonVerify {
  props: IProps;
}

class PersonVerify extends Component<IProps, PageState> {
  type = null;

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      verifyUrl: null,
      idCardVerifyShow: false,
      idCard: null,
      name: null,
      idCardInput: null,
    }
  }

  componentWillMount() {
  }

  componentDidMount() {
    this.type = this.getParam("type");
    const playerId = this.getParam("playerId");
    new Request().get(api.API_PLAYER(playerId), null).then((data: any) => {
      if (data != null && data.id != null) {
        if (data.idCard != null) {
          this.setState({idCard: data.idCard, name: data.name, idCardVerifyShow: true})
        } else {
          // this.onVerifyIdCardSuccess();
          this.setState({idCard: null, name: data.name, idCardVerifyShow: true})
        }
      } else {
        Taro.showToast({title: "认证失败，请返回重试", icon: "none"});
      }
    })
  }

  componentWillUnmount() {
  }

  componentDidShow() {
    this.type = this.getParam("type");
  }

  componentDidHide() {
  }

  onVerifyIdCardSuccess = () => {
    if (this.type == 0) {
      const leagueId = this.getParam("leagueId");
      const playerId = this.getParam("playerId");
      const userNo = this.getParam("userNo");
      this.setState({loading: true})
      let param: any = {
        leagueId: leagueId,
        playerId: playerId,
        userNo: userNo
      };
      if (this.state.idCard == null && this.state.idCardInput != null) {
        param.name = this.state.name;
        param.idCard = this.state.idCardInput;
      }
      new Request().get(api.API_PERSON_VERIFY_LEAGUEMEMBER, param).then((data: any) => {
        if (data != null && typeof data == "string") {
          this.setState({verifyUrl: data, loading: false})
        } else {
          Taro.showToast({title: "认证失败，请返回重试", icon: "none"});
        }
      })
    } else if (this.type == 1) {
      const playerId = this.getParam("playerId");
      const userNo = this.getParam("userNo");
      this.setState({loading: true})
      let param: any = {
        playerId: playerId,
        userNo: userNo
      };
      if (this.state.idCard == null && this.state.idCardInput != null) {
        param.name = this.state.name;
        param.idCard = this.state.idCardInput;
      }
      new Request().get(api.API_PERSON_VERIFY_PLAYER, param).then((data: any) => {
        if (data != null && typeof data == "string") {
          this.setState({verifyUrl: data, loading: false})
        } else {
          Taro.showToast({title: "认证失败，请返回重试", icon: "none"});
        }
      })
    }
  }
  getParam = (name) => {
    const router = getCurrentInstance().router;
    if (router && router.params != null && router.params[name] != null) {
      return router.params[name]
    } else {
      return null;
    }
  }
  onIdCardVerifyConfirm = (idcard) => {
    if (this.state.idCard == null) {
      if (checkIdCard(idcard)) {
        this.setState({idCardVerifyShow: false, idCardInput: idcard}, () => {
          this.onVerifyIdCardSuccess();
        })
      } else {
        Taro.showToast({title: "身份证错误", icon: "none"})
      }
    } else {
      if (typeof idcard == "string" && idcard.trim() == this.state.idCard) {
        this.setState({idCardVerifyShow: false}, () => {
          this.onVerifyIdCardSuccess();
        })
      } else {
        Taro.showToast({title: "身份证错误", icon: "none"})
      }
    }
  }
  onIdCardVerifyCancel = () => {
    Taro.navigateBack({
      delta: 1
    })
  }

  render() {
    if (this.state.loading) {
      return <View className="qz-person-verify-loading">
        <AtActivityIndicator
          mode="center"
          content="加载中..."/>
      </View>
    }
    return (
      <View className='qz-person-verify-container'>
        {this.state.verifyUrl ?
          <WebView src={this.state.verifyUrl}/> : null}
        <IdcardVerifyModal
          name={this.state.name}
          isOpened={this.state.idCardVerifyShow}
          handleConfirm={this.onIdCardVerifyConfirm}
          handleCancel={this.onIdCardVerifyCancel}/>
      </View>
    )
  }
}

const mapStateToProps = () => {
  return {}
}
export default connect(mapStateToProps)(PersonVerify)
