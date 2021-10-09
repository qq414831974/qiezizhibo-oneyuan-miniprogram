import {Component} from 'react';
import classNames from 'classnames';
import {Image, View} from '@tarojs/components';
import "./index.scss"

type PageStateProps = {}

type PageDispatchProps = {}

type PageOwnProps = {
  index: any,
  teamName: any,
  playerName: any,
  playerHeadImg: any,
  extra: any,
  disabled?: any,
  hasBorder?: any,
  onClick?: any,
}

type PageState = {}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface PlayerStatistics {
  props: IProps;
}

class PlayerStatistics extends Component<IProps, PageState> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleClick = (event) => {
    if (typeof this.props.onClick === 'function' && !this.props.disabled) {
      this.props.onClick(event);
    }
  };

  render() {
    const {index, teamName, playerHeadImg, disabled, hasBorder = true} = this.props;
    let {extra, playerName} = this.props;
    playerName = String(playerName);
    const rootClass = classNames('player-statistics__item', {
      'player-statistics__item--thumb': playerHeadImg,
      'player-statistics__item--multiple': teamName,
      'player-statistics__item--disabled': disabled,
      'player-statistics__item--no-border': !hasBorder
    }, this.props.className);

    return <View className={rootClass} onClick={this.handleClick}>
      <View className="player-statistics__item-container">
        {index ? <View className="player-statistics__item-index item-index">
          {index}
        </View> : null}
        {playerHeadImg ? <View className="player-statistics__item--thumb item-thumb">
          <Image src={playerHeadImg} className="item-thumb__info" mode="scaleToFill"/>
        </View> : null}
        <View className="player-statistics__item-container">
          <View className="player-statistics__item-content item-content">
            <View className="item-content__info">
              <View className="item-content__info-title">
                {playerName}
              </View>
              {teamName ? <View className="item-content__info-note">
                {teamName}
              </View> : null}
            </View>
          </View>
          {extra ? <View className="player-statistics__item-extra item-extra">
            <View className="item-extra__info">
              {extra}
            </View>
          </View> : null}
        </View>
      </View>
    </View>
  }
}

export default PlayerStatistics
