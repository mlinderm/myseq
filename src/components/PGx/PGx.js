import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Nav, NavItem, NavLink, Dropdown, DropdownToggle, DropdownItem, DropdownMenu } from 'reactstrap';
import SourceRoute from '../SourceRoute';

import SimvastatinDrug from './SimvastatinDrug';

/*
Add a new trait by creating the corresponding component and adding it to the
list below. Each trait component contains the variant, genotype-phenotype mapping
and a brief explanation of the trait.
*/

const drugs = [
  { title: 'Simvastatin', route: '/PGX/simvastatin', component: SimvastatinDrug },
];


class PGx extends Component {
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
    const activeDrug = drugs.find(drug => this.props.location.pathname === drug.route);

    return (
      <div>
        <Nav>
          <NavItem>
            <NavLink className="pl-0" tag={Link} to="/pgx">PGx</NavLink>
          </NavItem>
          <NavItem className="nav-link">/</NavItem>
          <Dropdown nav isOpen={this.state.dropdownOpen} toggle={this.toggleDropdown}>
            <DropdownToggle nav caret>
              {activeDrug ? activeDrug.title : 'Choose Drug'}
            </DropdownToggle>
            <DropdownMenu>
              {drugs.map(drug => (
                <DropdownItem
                  key={drug.route}
                  tag={Link}
                  to={drug.route}
                >
                  {drug.title}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </Nav>
        {drugs.map(drug => (
          <SourceRoute
            key={drug.route}
            path={drug.route}
            exact
            component={drug.component}
          />
        ))}
      </div>
    );
  }
}

PGx.propTypes = {
  location: PropTypes.shape({ pathname: PropTypes.string }).isRequired,
};


export default PGx;
