import React from 'react';
import Loadable from 'react-loadable';

export function ImportComponent(component, option = {}) {
  let config = Object.assign({
    moduleName: 'default',
    loader: <div>Loading ..... </div>,
    errorLoader: <div>Failed to load. ;(. Please reload the page.</div>
  }, option);

  return Loadable({
    loader: () => component,
    loading: (props) => {
      if(props.error) {
        return config.errorLoader;
      }else {
        return props.pastDelay && config.loader;
      }
    },
    render: (loaded, props) => {
      let Component = loaded[config.moduleName];
      return <Component {...props}/>;
    },
    delay: 1000
  });
}
