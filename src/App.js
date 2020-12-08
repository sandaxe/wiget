import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import { ModalContainer } from 'react-router-modal';
import { ToastContainer } from 'react-toastify';
import { Logger } from './shared/logger';
import { MainService } from './main/main.service';
import 'react-toastify/dist/ReactToastify.css';
import 'react-virtualized/styles.css';
import 'react-multi-carousel/lib/styles.css';
import ReactGA from 'react-ga';
import { detectmobilebrowser } from "./shared/detectmobilebrowser.js";
import { LazyComponent } from './shared/lazy.component';
import { StoreProvider } from './shared/store.provider';
import { checkAuth } from "./shared/authrules/utils";
import { getAuthTokens } from './shared/utils';
let ls = require('local-storage');
let host = window.location.hostname;
if(host === "localhost" || host === "dev.oicapps.com") {
  ReactGA.initialize('UA-142700827-1');
  ReactGA.pageview(window.location.pathname);
} else if(host === "app.oicapps.com") {
  ReactGA.initialize('UA-142675663-1');
  ReactGA.pageview(window.location.pathname);
}
window.scroll(0, 0);
const Authenticate = (WrapperComponent) => {
  class AuthRoute extends Component {
    static propTypes = {
      match: PropTypes.object.isRequired,
      history: PropTypes.object.isRequired,
      location: PropTypes.object.isRequired
    };

    constructor(props) {
      super(props);
      if (detectmobilebrowser() && !navigator.userAgent.match(/ip(hone|od)/gi)) {
        window.location.href = `https://play.google.com/store/apps/details?id=com.oicapps.oicmarketplace&hl=en`;
      }
      this.appStore = StoreProvider.getStore('App');
      this.state = {
        isAuthenticated: false
      };
      this.getQuery();
      this.doAuth();
    }
    getQuery() {
      let number = this.props.history.location.search;
      let resPhone = number.slice(3).trim();
      if(resPhone.length === 10) {
        this.setState({ phoneNumber: parseInt(resPhone, 10) });
        this.appStore.update('phoneNumberFromQuery', resPhone);
      }
    }
    async doAuth() {
      let authTokens = getAuthTokens();
      if(authTokens) {
        StoreProvider.createStore('Tokens', authTokens);
        this.setState({ isAuthenticated: true });
        let url = null;
        if(this.props.location.pathname === '/') {
          url = '/main';
        }
        if(url) {
          this.props.history.push(url);
        }else{
          this.props.history.push(this.props.location.pathname);
        }
      } else {
        this.setState({ isAuthenticated: false });
        this.props.history.push('/home');
      }
    }

    render() {
      return (
        <React.Fragment>
          {
            <WrapperComponent {...this.props} />
          }
        </React.Fragment>
      );
    }
  }

  return AuthRoute;
};

const routes = [
  {
    path: "/",
    component: Authenticate((props) => (<LazyComponent
      componentName="HomeComponent" component={import('./home/home.component')}
      render={(HomeComponent) => <HomeComponent {...props}/>} />))
    }
];

class App extends Component {
  constructor(props) {
    super(props);
    console.log("APP PROPS", this.props);
    this.state = {
      language: "en",
      languageData: {},
      loaded: false
    };

    this.appStore = StoreProvider.createStore('App', {
      accountDetails: {},
      userDetails: {},
      cartDetails: { itemsInCart: 0 },
      customerMode: true,
      brandIndex: -1,
      brandName: { property: '', value: '' },
      brandIsSelected: false,
      phoneNumberFromQuery: "",
      filterData: {},
      rf: {},
      currentlySelectedShape: {},
      currentlySelectedBrands: {},
      currentlySelectedPriceRange: -1,
      currentlySelectedGender: {},
      currentlySelectedAffordableBrands: {},
      currentlySelectedRimColor: -1,
      currentlySelectedRimType: -1,
      currentlySelectedTempleColor: -1,
      totalSelectedRimTypes: 0
    });
    this.appStore.observe('changeLanguage', this.changeLanguage);
  }

  componentDidMount() {
    this.getAccountDetail();
    // this.getUserDetail();
    //console.log('this is app data', this.appStore.state['accountData']);
  }

  componentDidCatch(errInfo, source) {
    Logger.error(errInfo, source);
  }

  getUserDetail() {
    const acountBody = { ...data };
    delete acountBody["users"];
    AccountService.editAccount(id, acountBody)
      .then(result => {
        const data = result["data"]["data"];
        console.log(data, "Time Update");
      })
      .catch(error => {
        console.log("Unable to get Details", error);
      });
  }

  getAccountDetail() {
    MainService.getBuisnessSettings().then((result) => {
      let accountDetails = result['data']['data'][0];
      let t = checkAuth(accountDetails && accountDetails['buisnessCategory'], 2, 'dashboard:inventories');
      console.log("CHECK AUTH: APP", t);
      let appearance = accountDetails['appearance'];
      root.style.setProperty('--customBg', appearance['bgcolor']);
      root.style.setProperty('--customFg', appearance['fgcolor']);
      root.style.setProperty('--light-color', appearance['shadeColor']);
      this.appStore.update('appearance', accountDetails['appearance']);
      this.appStore.update('accountData', accountDetails);
    });
  }

  render() {
    // eslint-disable-next-line react/prop-types
    let pathName = window.location.pathname;
    console.log("PATHNAME", pathName === "/view/social");
    return (
      <BrowserRouter basename="/view">
        <div style={{ overflow: pathName && "auto" }} className="rootContainer">
          <Switch>
            {
              routes.map((route, i) => {
                return (
                  <Route key={i} path={route.path} render={(props) => {
                    let Component = route.component;
                    return <Component {...props}/>;
                  }}/>
                );
              })
            }
          </Switch>
          <ModalContainer />
          <ToastContainer />
        </div>
      </BrowserRouter>
    );
  }
}
export default App;
