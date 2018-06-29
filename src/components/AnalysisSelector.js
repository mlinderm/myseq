import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Nav, NavItem, NavLink, Dropdown, DropdownToggle, DropdownItem, DropdownMenu } from 'reactstrap';
import SourceRoute from './SourceRoute';

class AnalysisSelector extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dropdownOpen: false,
    };

    this.toggleDropdown = this.toggleDropdown.bind(this);
  }

  toggleDropdown() {
    this.setState({ dropdownOpen: !this.state.dropdownOpen });
  }

  render() {
    const activeAnalysis = this.props.analyses.find(analysis =>
      this.props.location.pathname === analysis.route);

    return (
      <div>
        <Nav>
          <NavItem>
            <NavLink className="pl-0" tag={Link} to="/risks">Disease Risk</NavLink>
          </NavItem>
          <NavItem className="nav-link">/</NavItem>
          <Dropdown nav isOpen={this.state.dropdownOpen} toggle={this.toggleDropdown}>
            <DropdownToggle nav caret>
              {activeAnalysis ? activeAnalysis.title : this.props.dropdownText}
            </DropdownToggle>
            <DropdownMenu>
              {this.props.analyses.map(analysis => (
                <DropdownItem
                  key={analysis.route}
                  tag={Link}
                  to={analysis.route}
                >
                  {analysis.title}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </Nav>
        {this.props.analyses.map(analysis => (
          <SourceRoute
            key={analysis.route}
            path={analysis.route}
            exact
            component={analysis.component}
          />
        ))}
        { this.props.children }
      </div>
    );
  }
}

AnalysisSelector.propTypes = {
  location: PropTypes.shape({ pathname: PropTypes.string }).isRequired,
  analyses: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    route: PropTypes.string,
    component: PropTypes.node,
  })).isRequired,
  dropdownText: PropTypes.string,
  children: PropTypes.node,
};

AnalysisSelector.defaultProps = {
  dropdownText: 'Choose analysis',
  children: null,
};

export default AnalysisSelector;
