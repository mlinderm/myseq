import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Alert, Row, Col, Card, CardText, CardHeader, CardBody } from 'reactstrap';
import { VCFSource } from 'myseq-vcf';
import { Link } from 'react-router-dom';
import every from 'lodash/every';
import { withSourceAndSettings, settingsPropType } from '../../contexts/context-helpers';
import { DbSnp } from '../util/links';

class LRRiskModel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showSettingsAlert: false,
      preTestRisk: props.preTestRisk,
      cumulativeLR: 1.0,
      riskVariants: [],
    };

    this.handleAlertDismiss = this.handleAlertDismiss.bind(this);
  }

  componentDidMount() {
    const { sample, assumeRefRef } = this.props.settings;
    Promise.all(this.props.riskVariants.map((riskVariant) => {
      const { variant: query, rsId } = riskVariant;
      return this.props.source.variant(query.ctg, query.pos, query.ref, query.alt, assumeRefRef)
        .then((variant) => {
          if (!variant) {
            return ({
              label: `${query.ctg}:${query.pos}${query.ref}>${query.alt}`,
              rsId,
              genotype: undefined,
              LR: undefined,
            });
          }

          const genotype = variant.genotype(sample);
          return ({
            label: variant.toString(),
            rsId,
            genotype,
            LR: riskVariant.LR[genotype],
          });
        });
    })).then((riskVariants) => {
      // Compute cumulative LR and update the risk fields
      let cumulativeLR = 1.0;
      riskVariants.forEach((riskVariant) => {
        const { LR } = riskVariant;
        if (LR) {
          cumulativeLR *= LR;
        }
      });
      this.setState({ cumulativeLR, riskVariants });

      // Show RefRef notice if missing entries
      if (!assumeRefRef && !every(riskVariants.map(variant => variant.genotype))) {
        this.setState({ showSettingsAlert: true });
      }
    });
  }

  handleAlertDismiss() {
    this.setState({ showSettingsAlert: false });
  }

  render() {
    const { settings, title, children } = this.props;
    const {
      preTestRisk, cumulativeLR, riskVariants, showSettingsAlert,
    } = this.state;

    const preTestOdds = preTestRisk / (1 - preTestRisk);
    const postTestOdds = preTestOdds * cumulativeLR;
    const postTestRisk = postTestOdds / (1 + postTestOdds);

    // TODO: 100 person figures for risk
    // TODO: Add 23&Me like descriptor of risk calculation
    // TODO: Support form for changing pre-test risk
    // TODO: Add link to source paper (other information)

    return (
      <div>
        <h3>{ title }</h3>
        { showSettingsAlert && !settings.assumeRefRef &&
          <Alert color="info" isOpen={this.state.showSettingsAlert} toggle={this.handleAlertDismiss}>
            <h4>Missing entries?</h4>
            <p>
              If you are analyzing whole genome sequencing (WGS) data consider setting MySeq to assume the genotype of missing variants. You can do so on the <Link to="/settings">settings</Link> page.
            </p>
          </Alert>
        }
        <Row className="mb-3">
          <Col md={3}>
            <Card className="text-center">
              <CardHeader tag="h5">Average Risk</CardHeader>
              <CardBody>
                <CardText>{preTestRisk.toLocaleString(undefined, { style: 'percent' })}</CardText>
              </CardBody>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <CardHeader tag="h5">Risk with Genome</CardHeader>
              <CardBody>
                <CardText>{postTestRisk.toLocaleString(undefined, { style: 'percent' })}</CardText>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Table bordered size="sm">
              <thead>
                <tr><th>Variant</th><th>Genotype</th><th>LR</th></tr>
              </thead>
              <tbody>
                {riskVariants.map(variant => (
                  <tr key={variant.label}>
                    <td><DbSnp rsId={variant.rsId} /></td>
                    <td>{variant.genotype}</td>
                    <td>{variant.LR && variant.LR.toLocaleString(3)}</td>
                  </tr>
                ))}
                <tr>
                  <td><strong>Total</strong></td>
                  <td />
                  <td><strong>{cumulativeLR.toLocaleString(3)}</strong></td>
                </tr>
              </tbody>
            </Table>
          </Col>
          <Col md={6}>
            { children }
          </Col>
        </Row>
      </div>
    );
  }
}


LRRiskModel.propTypes = {
  settings: settingsPropType.isRequired,
  source: PropTypes.instanceOf(VCFSource).isRequired,
  title: PropTypes.string.isRequired,
  preTestRisk: PropTypes.number.isRequired,
  riskVariants: PropTypes.arrayOf(PropTypes.shape({
    variant: PropTypes.shape({ // hg19/b37 variant with VCF ctg, pos, ref, alt fields
      ctg: PropTypes.string,
      pos: PropTypes.number,
      ref: PropTypes.string,
      alt: PropTypes.string,
    }),
    rsId: PropTypes.string,
    LR: PropTypes.object,
  })).isRequired,
  children: PropTypes.node.isRequired,
};

export default withSourceAndSettings(LRRiskModel);
