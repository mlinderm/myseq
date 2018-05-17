import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Nav, NavItem, NavLink, Dropdown, DropdownToggle, DropdownItem, DropdownMenu } from 'reactstrap';
import SourceRoute from '../SourceRoute';

import EarwaxTrait from './EarwaxTrait';

const traits = [
  { title: 'Earwax Consistency', route: '/traits/earwax', component: EarwaxTrait },
];


class Traits extends Component {
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
    const activeTrait = traits.find(trait => this.props.location.pathname === trait.route);

    return (
      <div>
        <Nav>
          <NavItem>
            <NavLink className="pl-0" tag={Link} to="/traits">Traits</NavLink>
          </NavItem>
          <NavItem className="nav-link">/</NavItem>
          <Dropdown nav isOpen={this.state.dropdownOpen} toggle={this.toggleDropdown}>
            <DropdownToggle nav caret>
              {activeTrait ? activeTrait.title : 'Choose Trait'}
            </DropdownToggle>
            <DropdownMenu>
              {traits.map(trait => (
                <DropdownItem
                  key={trait.route}
                  tag={Link}
                  to={trait.route}
                >
                  {trait.title}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </Nav>
        {traits.map(trait => (
          <SourceRoute
            key={trait.route}
            path={trait.route}
            exact
            component={trait.component}
          />
        ))}
      </div>
    );
  }
}

Traits.propTypes = {
  location: PropTypes.shape({ pathname: PropTypes.string }).isRequired,
};


export default Traits;