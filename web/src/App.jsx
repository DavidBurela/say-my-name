import React from 'react';
import QueryString from 'query-string';
import _ from 'lodash';
//import './App.css';
import CreateName from './CreateName.jsx';
import ViewName from './ViewName.jsx';
import { AppInsightsContext } from "@microsoft/applicationinsights-react-js";
import { reactPlugin, appInsights } from './AppInsights';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { locale: null, display: null, native: null, pronoun: null, appInsights: null };
  }

  componentDidMount() {
    const parsed = QueryString.parse(window.location.search);
    console.log(parsed);
    console.log(_.isEmpty(parsed))

    if (_.isEmpty(parsed)) {
      // Means no query params entered
    } else {
      const { locale, display, native, pronoun } = parsed;
      this.setState({ locale: locale, display: display, native: native, pronoun: pronoun });
    }

    function trackEvent() {
      appInsights.trackEvent({ name: 'create name' });
    }
  }

  render() {

    let page;
    if (this.state.locale && this.state.display && this.state.native) {
      page = <ViewName locale={this.state.locale} display={this.state.display} native={this.state.native} pronoun={this.state.pronoun} />;
    } else {
      page = <CreateName appInsights={this.state.appInsights}/>;
    }
    return (
      <AppInsightsContext.Provider value={reactPlugin}>
        <div className="App">
          {page}
        </div>
      </AppInsightsContext.Provider>
    );
  }
}

export default App;
