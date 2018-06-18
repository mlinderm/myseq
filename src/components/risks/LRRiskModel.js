import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Alert } from 'reactstrap';
import { VCFSource } from 'myseq-vcf';
import { Link } from 'react-router-dom';
import { withSourceAndSettings, settingsPropType } from '../../contexts/context-helpers';

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
      const { variant: query } = riskVariant;
      return this.props.source.variant(query.ctg, query.pos, query.ref, query.alt, assumeRefRef)
        .then((variant) => {
          if (!variant) {
            return ({
              label: `${query.ctg}:${query.pos}${query.ref}>${query.alt}`,
              genotype: undefined,
              LR: undefined,
            });
          }

          const genotype = variant.genotype(sample);
          return ({
            label: variant.toString(),
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

    // TODO: Nicer format for risks (as percentages) with 100 person figures
    // TODO: Add 23&Me like descriptor of risk calculation
    // TODO: Support form for changing pre-test risk
    // TODO: Make table more compact
    // TODO: Add link to source paper (other information)

    return (
      <div>
        <h3>{ title }</h3>
        { showSettingsAlert && !settings.assumeRefRef &&
          <Alert bsStyle="info" onDismiss={this.handleAlertDismiss}>
            <h4>Nothing highlighted?</h4>
            <p>
              If you are analyzing whole genome sequencing (WGS) data consider setting MySeq to assume the genotype of missing variants. You can do so on the <Link to="/settings">settings</Link> page.
            </p>
          </Alert>
        }
        Pre-test Risk: {preTestRisk}
        Post-test Risk: {postTestRisk}
        <Table bordered size="sm">
          <thead>
            <tr><th>Variant</th><th>Genotype</th><th>LR</th></tr>
          </thead>
          <tbody>
            {riskVariants.map(variant => (
              <tr key={variant.label}>
                <td>{variant.label}</td>
                <td>{variant.genotype}</td>
                <td>{variant.LR}</td>
              </tr>
            ))}
            <tr><td><em>Total</em></td><td /><td>{cumulativeLR}</td></tr>
          </tbody>
        </Table>
        { children }
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
