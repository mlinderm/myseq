import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import SourceContext from '../contexts/SourceContext';

const SourceRoute = ({ component: Component, ...rest }) => (
  <SourceContext.Consumer>
    {source => (
      <Route
        {...rest}
        render={props =>
          (source ? (
            <Component source={source} {...props} />
          ) : (
            <Redirect to={{
              pathname: '/load',
              state: { from: props.location },
            }}
            />
          ))
        }
      />
    )}
  </SourceContext.Consumer>
);

SourceRoute.propTypes = {
  component: PropTypes.func.isRequired,
  location: PropTypes.object, // eslint-disable-line
};

export default SourceRoute;
