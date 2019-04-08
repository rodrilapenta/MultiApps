/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './lifx-control.css';
import axios from 'axios';

class LiFXControl extends React.Component {
  static propTypes = {
    lights: PropTypes.array.isRequired,
    lifxKey: PropTypes.string.isRequired,
  };

  state = {
    lifxKey: null,
    lights: []
  }

  componentDidMount() {
    if(this.state.lifxKey != null) {
      this.loadLights();
    }
  }

  loadLights() {
    var config = {
			headers: {'Authorization': "Bearer " + this.state.lifxKey}
    };
    
    axios.get(
      `https://api.lifx.com/v1/lights/all`,
      config)
      .then(res => {
        const lights = res.data;
        this.setState({ lights });
      })
  }

  changeLightStatus = event => {
    var config = {
			headers: {'Authorization': "Bearer " + this.state.lifxKey}
		};

		var bodyParameters = {
			power: event.target.checked ? 'on' : 'off'
    }
    
    axios.put(
			'https://api.lifx.com/v1/lights/'+ event.target.id + '/state',
			bodyParameters,
			config)
			.then(response => {
				this.loadLights()
			})
			.catch(error => {
				console.log(error);
			});
  };

  updateLifxKey = (event) => {
    this.setState({
      lifxKey: document.getElementById('lifxKey').value
    }, () => {this.loadLights();});
  }

  render() {
    if(this.state.lifxKey == null) {
      return (
        <div className={s.root}>
          <div className={s.container}>
            <h1>LiFX Control</h1>
            <div className={s.switchContainer}>
              <label>LiFX key</label>
              <input id="lifxKey" type="text" required/>
              <input type="button" value="Guardar" onClick={this.updateLifxKey}/>
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div className={s.root}>
          <div className={s.container}>
            <h1>LiFX Control</h1>
            
            {this.state.lights.map(light => (
              <div className={s.switchContainer}> 
              <label className={s.switch}>
                <input id={light.id} type="checkbox" onChange={this.changeLightStatus} checked={light.power == 'on' ? true : false}/>
                <span className={`${s.slider} ${s.round}`}></span>
              </label>
              <label className={s.switchName}>{light.label}</label>
            </div>
            ))}
  
          </div>
        </div>
      );
    }
  }
}

LiFXControl.defaultProps = {
  ldpcState: false,
  ldmhState: false
};

export default withStyles(s)(LiFXControl);
