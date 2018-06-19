import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Nav, NavItem, NavLink, Dropdown, DropdownToggle, DropdownItem, DropdownMenu } from 'reactstrap';
import SourceRoute from '../SourceRoute';

import Type2DiabetesRisk from './Type2DiabetesRisk';
import AlzheimersRisk from './AlzheimersRisk';

const analyses = [
  { title: 'Type 2 Diabetes', route: '/risks/t2d', component: Type2DiabetesRisk },
  { title: "Alzheimer's Disease", route: '/risks/alzheimers', component: AlzheimersRisk },
];

class Risks extends Component {
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
    const activeAnalysis = analyses.find(analysis =>
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
              {activeAnalysis ? activeAnalysis.title : 'Choose Disease'}
            </DropdownToggle>
            <DropdownMenu>
              {analyses.map(analysis => (
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
        {analyses.map(analysis => (
          <SourceRoute
            key={analysis.route}
            path={analysis.route}
            exact
            component={analysis.component}
          />
        ))}
      </div>
    );
  }
}

Risks.propTypes = {
  location: PropTypes.shape({ pathname: PropTypes.string }).isRequired,
};


export default Risks;
