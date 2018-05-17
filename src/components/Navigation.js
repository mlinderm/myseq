import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Form,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';

const Icon = styled.i`
  font-size: 24px
`;


class Navigation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
    };

    this.handleMenuToggle = this.handleMenuToggle.bind(this);
    this.handleSampleChang = this.handleSampleChange.bind(this);
  }

  handleMenuToggle() {
    this.setState({ isOpen: !this.state.isOpen });
  }

  handleSampleChange(evt) {
    this.props.updateSettings({ sample: evt.target.value });
  }

  render() {
    const { samples, settings } = this.props;
    const { isOpen } = this.state;

    return (
      <Navbar color="light" light expand="md">
        <NavbarBrand tag={Link} to="/">MySeq</NavbarBrand>
        <NavbarToggler onClick={this.handleMenuToggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <NavLink tag={Link} to="/load">New VCF</NavLink>
            </NavItem>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>Analyses</DropdownToggle>
              <DropdownMenu right>
                <DropdownItem tag={Link} to="/query">Query Variants</DropdownItem>
              </DropdownMenu>
              <DropdownMenu right>
                <DropdownItem tag={Link} to="/traits">Physical Traits</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
          { samples.length > 0 &&
            <Form inline className="mr-sm-2">
              <FormGroup>
                <Label for="sample" className="mr-sm-2">Sample</Label>
                <Input id="sample" type="select" bsSize="sm" value={settings.sample || samples[0]} onChange={this.handleSampleChange}>
                  {samples.map(sample => (<option key={sample} value={sample}>{sample}</option>))}
                </Input>
              </FormGroup>
            </Form>
          }
          <Nav navbar>
            <NavItem>
              <NavLink tag={Link} to="/help"><Icon className="material-icons">help</Icon></NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} to="/settings"><Icon className="material-icons">settings</Icon></NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}

Navigation.propTypes = {
  samples: PropTypes.arrayOf(PropTypes.string).isRequired,
  settings: PropTypes.shape({
    sample: PropTypes.string,
  }).isRequired,
  updateSettings: PropTypes.func.isRequired,
};

export default Navigation;
