/* eslint-disable max-len */
import React from 'react';
import { Route, Redirect, Link, Switch } from 'react-router-dom';
import { Alert, Row, Col, Nav, NavLink } from 'reactstrap';
import styled from 'styled-components';
import { ExternalLink, PubMed } from '../util/links';

function About() {
  return (
    <div>
      <p>
        MySeq a single-page web application for privacy-protecting personal genome analysis developed at Middlebury College by <ExternalLink href="https://go.middlebury.edu/linderman">Michael Linderman</ExternalLink> and Middlebury students Leo McElroy and Laura Chang. MySeq was inspired by <PubMed pubmedId={22174289}>Interpretome</PubMed> and <PubMed pubmedId={28334237}>DNA.LAND Compass</PubMed>.
      </p>
      <p>
        MySeq does not upload your data to an external server. All analyses are performed locally on your computer. MySeq can query external services to obtain more information about variants, genes and other identifiers, but MySeq <b>never</b> sends the genotype to an external service (that is how many copies of a variant), only the variant description (that is the &ldquo;edit&rdquo; to the reference genome). However, a combination of rare variants, even without genoytpes, may still be identifiable. You can disable external queries via the <Link to="/settings">Settings</Link>.
      </p>
      <p>
        MySeq is open-source software available on <ExternalLink href="https://github.com/mlinderm/myseq">GitHub</ExternalLink> under an Apache-2.0 license.
      </p>
    </div>
  );
}

function Data() {
  return (
    <div>
      <p>
        MySeq is designed to analyzed the VCF files produced by genome analysis pipelines. VCF, or Variant Call Format, files describe genetic variants and the corresponding genotypes (how many copies of a variant) for any number of individuals. Whole genome sequencing typically identifies 4-5 million variants in an individual and thus VCF files can be very large (100s of MB), too large to analyze within the browser unless the file is specially compressed and indexed.
      </p>
      <p>
        MySeq requires that the VCF file is BGZip-compressed and Tabix-indexed. This is the typical way to prepare and distribute VCF files and so it is likely that your VCF file is ready for use with MySeq without any further preparation. Note, that MySeq requires both the VCF file and the index file. When loading locally-stored files make sure to select both files (which must be in the same folder). You can select multiple files in the &ldquo;File Chooser&rdquo; by holding the <kbd>Shift ⇧</kbd> or <kbd>Command ⌘</kbd> on your keyboard.
      </p>
      <p>
        If your VCF file is not BGZip-compressed and Tabix-indexed, you will need to prepare the file with the freely-available <ExternalLink href="https://www.htslib.org/doc/bgzip.html">bgzip</ExternalLink> and <ExternalLink href="https://www.htslib.org/doc/tabix.html">Tabix</ExternalLink> tools. MySeq is most effective when the VCF file has been normalized (so that the variant descriptions consistent with the available databases). The MySeq respository includes a <ExternalLink href="https://github.com/mlinderm/myseq/blob/master/scripts/normalize">script</ExternalLink> for normalizing (and compressing and indexing) a VCF file.
      </p>
    </div>
  );
}

function Acknowledgements() {
  return (
    <div>
      <p>
        The MySeq <ExternalLink href="https://github.com/mlinderm/myseq">README</ExternalLink> lists relevant attributions.
      </p>
      <p>
        Variant annotations in the <Link to="/query">query</Link> interface are provided by the <ExternalLink href="https://myvariant.info">MyVariant.info</ExternalLink> service. Many of the annotations are governed by their own specific licensing terms:
      </p>
      <ul className="list-unstyled">
        <li><ExternalLink href="https://www.ncbi.nlm.nih.gov/clinvar/intro/">ClinVar</ExternalLink></li>
        <li><ExternalLink href="https://sites.google.com/site/jpopgen/dbNSFP">dbNSFP</ExternalLink></li>
        <li><ExternalLink href="http://gnomad.broadinstitute.org/terms">gnomAD</ExternalLink></li>
        <li><ExternalLink href="http://snpeff.sourceforge.net/download.html">SnpEff</ExternalLink></li>
      </ul>
    </div>
  );
}

const NavLinkSidebar = styled(NavLink)`
  padding-top: 0;
  padding-bottom: 0;
`;

function Help() {
  return (
    <div>
      <h3>MySeq Help</h3>
      <Alert color="warning">
        MySeq is for educational and research use <b>only</b>. MySeq is not intended for diagnostic use or medical decision-making. If you have any questions about the results obtained via this tool, please consult a health care professional.
      </Alert>
      <Row>
        <Col md={3}>
          <b>Help Topic</b>
          <Nav vertical>
            <NavLinkSidebar tag={Link} to="/help/about">About</NavLinkSidebar>
            <NavLinkSidebar tag={Link} to="/help/data">Data Preparation</NavLinkSidebar>
            <NavLinkSidebar tag={Link} to="/help/acknowledgements">Acknowledgements</NavLinkSidebar>
          </Nav>
        </Col>
        <Col md={9}>
          <Switch>
            <Route path="/help/about" exact component={About} />
            <Route path="/help/data" exact component={Data} />
            <Route path="/help/acknowledgements" exact component={Acknowledgements} />
            <Redirect exact from="/help" to="/help/about" />
          </Switch>
        </Col>
      </Row>
    </div>
  );
}

export default Help;
