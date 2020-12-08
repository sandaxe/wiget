import React from 'react';
import PropTypes from 'prop-types';
import Loadable from 'react-loadable';

export class LazyComponent extends React.Component {
  componentWillMount() {
    const componentName = this.props.componentName;
    this.LoadingComponent = Loadable({
      loader: () => this.props.component,
      render: (loaded, loadedProps) => {
        const LoadedComponent = componentName ? loaded[componentName] : loaded.default;
        return <LoadedComponent {...loadedProps} />;
      },
      loading: (props) => {
        if(props.error) {
          console.error('Failed to load component', componentName, props);
          return (props.errorLoader || <div>Failed to load. ;(. Please reload the page.</div>);
        }else {
          return props.pastDelay && (props.loader || <div style={{ visibility: "hidden" }}>Loading ..... </div>);
        }
      },
      delay: 1000
    });
  }

  componentDidCatch(errInfo, source) {
  }

  render() {
    return this.props.render(this.LoadingComponent);
  }
}

LazyComponent.propTypes = {
  render: PropTypes.func.isRequired,
  component: PropTypes.object.isRequired,
  componentName: PropTypes.string,
  cache: PropTypes.bool,
  loader: PropTypes.node
};


