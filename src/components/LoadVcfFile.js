import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { Col, Row, Form, FormGroup, Label, Input, FormFeedback, FormText, Button } from 'reactstrap';
import styled from 'styled-components';
import {
  LocalFileReader,
  RemoteFileReader,
  TabixIndexedFile,
  VCFSource,
  ReferenceGenome,
  b37Reference,
} from 'myseq-vcf';

const Icon = styled.i`
  font-size: 36px
`;


function VCFLink(props) {
  return (
    <a
      href={props.url}
      onClick={(evt) => {
        evt.preventDefault();
        props.setURL(props.url, props.tbi || `${props.url}.tbi`, props.reference);
      }}
    >
      {props.children}
    </a>
  );
}

VCFLink.propTypes = {
  url: PropTypes.string.isRequired,
  tbi: PropTypes.string,
  reference: PropTypes.instanceOf(ReferenceGenome),
  setURL: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

VCFLink.defaultProps = {
  tbi: undefined,
  reference: undefined,
};

class LoadVcfFile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirectToReferrer: false,
      url: '',
      fileError: false,
      fileHelpMessage: '',
      urlError: false,
      urlHelpMessage: '',
    };

    this.handleFiles = this.handleFiles.bind(this);
    this.updateURL = this.updateURL.bind(this);
    this.handleURL = this.handleURL.bind(this);
    this.updateAndHandleURL = this.updateAndHandleURL.bind(this);
  }

  setSourceFromURL(variantURL, indexURL, reference) {
    try {
      const indexedFile = new TabixIndexedFile(
        new RemoteFileReader(variantURL),
        new RemoteFileReader(indexURL),
      );
      const vcfSource = new VCFSource(indexedFile, reference);

      // Notify application of new source
      this.props.setSource(vcfSource);
      this.setState({ redirectToReferrer: true });
    } catch (err) {
      this.setState({ urlError: true, urlHelpMessage: err.message });
    }
  }

  handleFiles(evt) {
    try {
      const fileList = evt.target.files;
      if (fileList.length < 2) {
        throw new Error('Only 1 file selected. Did you select both the VCF and its index file?');
      } else if (fileList.length > 2) {
        throw new Error('Too many files selected. Only one VCF file can be loaded at a time.');
      }

      let [variantFile, indexFile] = Array.from(fileList).map(item => new LocalFileReader(item));
      if (variantFile.name().endsWith('.tbi') && !indexFile.name().endsWith('.tbi')) {
        [variantFile, indexFile] = [indexFile, variantFile];
      }

      if (!indexFile.name().endsWith('.tbi')) {
        throw new Error('Missing index file. Did you select the VCF file (".vcf.gz") and its index file (".vcf.gz.tbi")?');
      }

      // We won't know if this was a valid source until well after this function returns
      const vcfSource = new VCFSource(new TabixIndexedFile(variantFile, indexFile));

      // Notify application of new source
      this.props.setSource(vcfSource);
      this.setState({ redirectToReferrer: true });
    } catch (err) {
      this.setState({ fileError: true, fileHelpMessage: err.message });
    }
  }

  updateURL(evt) {
    this.setState({ url: evt.target.value });
  }

  handleURL(evt) {
    evt.preventDefault();
    const url = this.state.url.trim();
    this.setSourceFromURL(url, `${url}.tbi`);
  }

  updateAndHandleURL(variantURL, indexURL, reference) {
    this.setState({ url: variantURL });
    this.setSourceFromURL(variantURL, indexURL, reference);
  }

  render() {
    if (this.state.redirectToReferrer) {
      const { from } = (this.props.location.state || { from: { pathname: '/' } });
      return (<Redirect to={from} />);
    }

    return (
      <div>
        <h3>Load Your Input File in One of Three Ways</h3>
        <Form>
          <FormGroup row>
            <Col xs="auto">
              <Icon className="material-icons">folder</Icon>
            </Col>
            <Col>
              <Label for="local-file">Load variants from a local VCF file</Label>
              <Input id="local-file" type="file" multiple onChange={this.handleFiles} invalid={this.state.fileError} />
              <FormFeedback>{this.state.fileHelpMessage}</FormFeedback>
              <FormText>
                Select both the &ldquo;.vcf.gz&rdquo; and &ldquo;.vcf.gz.tbi&rdquo; files
              </FormText>
            </Col>
          </FormGroup>
        </Form>
        <Form onSubmit={this.handleURL}>
          <FormGroup row>
            <Col xs="auto">
              <Icon className="material-icons">cloud</Icon>
            </Col>
            <Col xs={8} lg={6}>
              <Label for="remote-file">Load variants from a remote VCF file</Label>
              <Row>
                <Col>
                  <Input id="remote-file" type="text" onChange={this.updateURL} invalid={this.state.urlError} />
                  <FormFeedback>{this.state.urlHelpMessage}</FormFeedback>
                </Col>
                <Col xs="auto">
                  <Button type="submit">Load File</Button>
                </Col>
              </Row>
              <FormText>
                The &ldquo;.tbi&rdquo; extension is added to obtain the URL of the index file
              </FormText>
            </Col>
          </FormGroup>
        </Form>
        <Row>
          <Col xs="auto">
            <Icon className="material-icons">public</Icon>
          </Col>
          <Col>
            <div><Label>Load publicly available VCF files</Label></div>
            <VCFLink
              url="http://www.cs.middlebury.edu/~mlinderman/myseq/NA12878_GIAB_highconf_CG-IllFB-IllGATKHC-Ion-Solid-10X_CHROM1-X_v3.3_highconf.vcf.gz"
              reference={b37Reference}
              setURL={this.updateAndHandleURL}
            >
              NA12878
            </VCFLink>
          </Col>
        </Row>
      </div>
    );
  }
}

LoadVcfFile.propTypes = {
  setSource: PropTypes.func.isRequired,
  location: PropTypes.shape({
    state: PropTypes.shape({ from: PropTypes.object }),
  }).isRequired,
};

export default LoadVcfFile;
