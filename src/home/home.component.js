import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { LazyComponent } from '../shared/lazy.component';
import { StoreProvider } from '../shared/store.provider';
import Service from '../shared/service';
export class HomeComponent extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.homeStore = StoreProvider.createStore('Home', {
      processCache: {},
      studioState: "closed"
    });
    let appStore = StoreProvider.getStore('App');
    this.accountDetails = appStore.get('accountDetails');
    console.log("GET ACCOUNT DETAILS", appStore.get("accountData"));
    this.userDetails = appStore.get('userDetails');
  }

  componentWillUnmount() {
    //StoreProvider.destroy('App');
    StoreProvider.destroy('Home');
  }

  logout() {
    Service.get(`/signin/1/${this.accountDetails.id}/logout`)
      .then((data) => {
        window.location.reload();
      }).catch((err) => {
        console.log('failed to logout');
      });
  }

  render() {
    return (
      <React.Fragment>
        {
          this.props.history.location.pathname === '/' && <Redirect to={'/home'} />
        }
        <Route path={`/home`} render={(props) => {
          return (<LazyComponent component={import('./landingpage')} componentName="MainComponent"
            render={(MainComponent) => {
              return <MainComponent {...props} />;
            }}/>);
        }}/>
        <Route path={`/auth`} render={(props) => {
          return (<LazyComponent component={import('../auth/auth.component')}
            componentName="AuthComponent"
            render={(AuthComponent) => {
              return <AuthComponent {...props} />;
            }}/>);
        }}/>
        <Route path={`/setpassword`} render={(props) => {
          return (<LazyComponent
            component={import('../auth/setpassword.component')} componentName="SetPasswordComponent"
            render={(SetPasswordComponent) => {
              return <SetPasswordComponent {...props} />;
            }}/>);
        }}/>
        <Route path={`/setupaccount`} render={(props) => {
          return (<LazyComponent
            component={import('../auth/settingupyouraccount')} componentName="SettingUpAccountComponent"
            render={(SettingUpAccountComponent) => {
              return <SettingUpAccountComponent {...props} />;
            }}/>);
        }}/>
        <Route path={`/main`} render={(props) => {
          return (<LazyComponent
            component={import('../main/main')} componentName="Main"
            render={(Main) => {
              return <Main {...props} />;
            }}/>);
        }}/>
      </React.Fragment>
    );
  }
}
