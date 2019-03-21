import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  Row,
  Col,
  Card,
  CardText,
  CardHeader,
  CardBody
} from 'reactstrap';
import { VCFSource } from 'myseq-vcf';
import every from 'lodash/every';
import range from 'lodash/range';
import {
  withSourceAndSettings,
  settingsPropType
} from '../../contexts/context-helpers';
import SettingsAlert from './SettingsAlert';
import ReferenceAlert from './ReferenceAlert';
import { DbSnp } from '../util/links';
import { refAwareVariantQuery, variantPropType } from '../util/query';

// https://fontawesome.com/license/free
// Creative Commons Attribution 4.0 International license

function HundredPersonFigure(props) {
  const maxColorIdx = props.count;
  return (
    <svg width="140px" height="240px">
      <defs>
        <g id="Outline" transform="scale(0.0390625)">
          <path d="M96 0c35.346 0 64 28.654 64 64s-28.654 64-64 64-64-28.654-64-64S60.654 0 96 0m48 144h-11.36c-22.711 10.443-49.59 10.894-73.28 0H48c-26.51 0-48 21.49-48 48v136c0 13.255 10.745 24 24 24h16v136c0 13.255 10.745 24 24 24h64c13.255 0 24-10.745 24-24V352h16c13.255 0 24-10.745 24-24V192c0-26.51-21.49-48-48-48z" />
        </g>
      </defs>
      {range(100).map(idx => {
        const row = 9 - Math.floor(idx / 10);
        const col = idx % 10;
        return (
          <use
            key={idx}
            xlinkHref="#Outline"
            x={col * 14}
            y={row * 24}
            style={{ fill: idx < maxColorIdx ? props.color : 'grey' }}
          />
        );
      })}
    </svg>
  );
}

HundredPersonFigure.propTypes = {
  count: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired
};

function RiskCard(props) {
  const count = Math.round(props.risk * 100);
  return (
    <Col md={3}>
      <Card className="text-center">
        <CardHeader tag="h5">{props.title}</CardHeader>
        <CardBody>
          <HundredPersonFigure count={count} color={props.color} />
          <CardText className="text-left">
            {count} of 100 (
            <span className="risk-pct">
              {props.risk.toLocaleString(undefined, {
                style: 'percent',
                maximumFractionDigits: 1
              })}
            </span>
            ) people {props.modifier} will develop {props.disease} in their
            lifetime
          </CardText>
        </CardBody>
      </Card>
    </Col>
  );
}

RiskCard.propTypes = {
  risk: PropTypes.number.isRequired,
  title: PropTypes.node.isRequired,
  modifier: PropTypes.node,
  disease: PropTypes.string.isRequired,
  color: PropTypes.string
};

RiskCard.defaultProps = {
  modifier: null,
  color: 'blue'
};

class LRRiskModel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showSettingsAlert: false,
      showReferenceAlert: false,
      preTestRisk: props.preTestRisk,
      cumulativeLR: 1.0,
      riskVariants: []
    };
  }

  componentDidMount() {
    const { sample, assumeRefRef } = this.props.settings;
    Promise.all(
      this.props.riskVariants.map(riskVariant => {
        const { variant: query, rsId } = riskVariant;
        return refAwareVariantQuery(
          this.props.source,
          query,
          assumeRefRef
        ).then(variant => {
          if (!variant) {
            return {
              label: `${query.ctg}:${query.pos}${query.ref}>${query.alt}`,
              rsId,
              genotype: undefined,
              LR: undefined
            };
          }

          const genotype = variant.genotype(sample);
          return {
            label: variant.toString(),
            rsId,
            genotype,
            LR: riskVariant.LR[genotype]
          };
        });
      })
    )
      .then(riskVariants => {
        // Compute cumulative LR and update the risk fields
        let cumulativeLR = 1.0;
        riskVariants.forEach(riskVariant => {
          const { LR } = riskVariant;
          if (LR) {
            cumulativeLR *= LR;
          }
        });
        this.setState({ cumulativeLR, riskVariants });

        // Show RefRef notice if missing entries
        if (
          !assumeRefRef &&
          !every(riskVariants.map(variant => variant.genotype))
        ) {
          this.setState({ showSettingsAlert: true });
        }
      })
      .catch(() => {
        // TODO: Differentiate error types
        this.setState({ showReferenceAlert: true });
      });
  }

  render() {
    const { settings, title, children } = this.props;
    const {
      preTestRisk,
      cumulativeLR,
      riskVariants,
      showSettingsAlert,
      showReferenceAlert
    } = this.state;

    const preTestOdds = preTestRisk / (1 - preTestRisk);
    const postTestOdds = preTestOdds * cumulativeLR;
    const postTestRisk = postTestOdds / (1 + postTestOdds);

    // TODO: Add 23&Me like descriptor of risk calculation
    // TODO: Support form for changing pre-test risk
    // TODO: Add link to source paper (other information)

    return (
      <div>
        <h3>{title}</h3>
        <ReferenceAlert isOpen={showReferenceAlert} />
        <SettingsAlert
          isOpen={showSettingsAlert && !settings.assumeRefRef}
          toggle={() => this.setState({ showSettingsAlert: false })}
        />
        <Row className="mb-3">
          <RiskCard risk={preTestRisk} title="Average Risk" disease={title} />
          <RiskCard
            risk={postTestRisk}
            title="Risk with Genome"
            disease={title}
            modifier="with the same genetic makeup"
            color="limegreen"
          />
        </Row>
        <Row>
          <Col md={6}>
            <Table bordered size="sm">
              <thead>
                <tr>
                  <th>Variant</th>
                  <th>Genotype</th>
                  <th>LR</th>
                </tr>
              </thead>
              <tbody>
                {riskVariants.map(variant => (
                  <tr key={variant.label}>
                    <td>
                      <DbSnp rsId={variant.rsId} />
                    </td>
                    <td>{variant.genotype}</td>
                    <td>{variant.LR && variant.LR.toLocaleString(3)}</td>
                  </tr>
                ))}
                <tr>
                  <td>
                    <strong>Total</strong>
                  </td>
                  <td />
                  <td>
                    <strong>{cumulativeLR.toLocaleString(3)}</strong>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Col>
          <Col md={6}>{children}</Col>
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
  riskVariants: PropTypes.arrayOf(
    PropTypes.shape({
      variant: variantPropType,
      rsId: PropTypes.string,
      LR: PropTypes.object
    })
  ).isRequired,
  children: PropTypes.node.isRequired
};

export { LRRiskModel as LRRiskModelImpl };
export default withSourceAndSettings(LRRiskModel);
