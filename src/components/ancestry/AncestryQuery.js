import React, { Component } from 'react';
import { Table, Col, Row, Input } from 'reactstrap';
import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  CustomSVGSeries,
  PolygonSeries,
} from 'react-vis';
import { BeatLoader } from 'react-spinners';
import PropTypes from 'prop-types';
import { VCFSource } from 'myseq-vcf';
import every from 'lodash/every';
import { withSourceAndSettings, settingsPropType } from '../../contexts/context-helpers';
import SettingsAlert from './SettingsAlert';
import '../../../node_modules/react-vis/dist/style.css';
import queryVariants from './popres-drineasetal.clean';

const EuropeanCourseHull = [
  {
    x: 3.914939, y: 2.138966,
  },
  // { // outlier
  //   x: 2.507552, y: 5.697582,
  // },
  {
    x: -3.017748, y: 3.426239,
  },
  {
    x: -3.805820, y: 2.890690,
  },
  {
    x: -5.645789, y: 0.806481,
  },
  {
    x: -5.864868, y: -2.668472,
  },
  {
    x: -4.33224, y: -3.743894,
  },
  {
    x: -2.962506, y: -4.525817,
  },
  {
    x: -0.689538, y: -4.395281,
  },
  // { // outlier
  //   x: -0.154069, y: 4.104127,
  // },
  {
    x: 2.994920, y: -1.918013,
  },
];
const AfAmCourseHull = [
  {
    x: -1.033673, y: 0.646794,
  },
  // { // outlier
  //   x: -3.851730, y: -1.461758,
  // },
  // { // outlier
  //   x: -3.061801, y: -2.263425,
  // },
  {
    x: 10.774242, y: -5.906333,
  },
  {
    x: 13.121441, y: -5.619658,
  },
  {
    x: 14.468734, y: -5.250108,
  },
  {
    x: 16.904555, y: -4.010556,
  },
  {
    x: 16.347028, y: -3.217133,
  },
  {
    x: 12.557934, y: 0.316651,
  },
  {
    x: 8.041965, y: 1.601434,
  },
  {
    x: 4.042408, y: 2.480701,
  },
];
const LatinoCourseHull = [
  {
    x: 4.610013, y: 4.257636,
  },
  {
    x: 2.146355, y: 8.667928,
  },
  {
    x: -0.169206, y: 6.742267,
  },
  {
    x: -1.269717, y: 5.164818,
  },
  {
    x: -2.393896, y: 1.107841,
  },
  {
    x: 1.365500, y: -0.278531,
  },
];
const SouthAsianCourseHull = [
  // { // outlier
  //   x: -1.827819, y: 3.050334,
  // },
  // { // outlier
  //   x: -1.076747, y: -1.239178,
  // },
  {
    x: 4.932366, y: 3.124910,
  },
  {
    x: 4.948124, y: 8.226731,
  },
  {
    x: 3.468338, y: 8.931658,
  },
  {
    x: 0.598147, y: 7.783064,
  },
  {
    x: 0.049454, y: 7.175774,
  },
  {
    x: -0.336803, y: 6.720488,
  },
  {
    x: -1.353051, y: 5.275963,
  },
];
const EastAsianCourseHull = [
  {
    x: 6.935497, y: 9.871727,
  },
  {
    x: 5.845939, y: 11.586370,
  },
  {
    x: 5.144031, y: 11.682549,
  },
  {
    x: 3.857850, y: 11.108422,
  },
  {
    x: 2.881433, y: 10.591011,
  },
  {
    x: 3.714674, y: 8.391783,
  },
  {
    x: 5.556027, y: 7.919534,
  },
  {
    x: 6.203472, y: 8.120435,
  },
];

const Albania = [
  {
    x: 0.271565, y: 1.659298,
  },
  {
    x: -0.423193, y: 2.387469,
  },
  {
    x: -0.008547, y: 1.884178,
  },
];
const Australia = [
  {
    x: 3.357751, y: 0.644414,
  },
  {
    x: 1.594792, y: 3.889806,
  },
  {
    x: -3.017748, y: 3.426239,
  },
  {
    x: -4.490767, y: 0.392961,
  },
  {
    x: -4.532493, y: -2.599597,
  },
  {
    x: -2.468832, y: -4.357516,
  },
  {
    x: -0.065922, y: -2.814371,
  },
];
const Austria = [
  {
    x: -0.496577, y: 0.023456,
  },
  {
    x: -1.382613, y: 1.742238,
  },
  {
    x: -2.477706, y: 1.430641,
  },
  {
    x: -3.121472, y: 1.140468,
  },
  {
    x: -3.863678, y: -0.196630,
  },
  {
    x: -2.488858, y: -1.378063,
  },
  {
    x: -0.892227, y: -1.671945,
  },
];
const Belgium = [
  {
    x: -3.019465, y: 2.165761,
  },
  {
    x: -4.588138, y: -0.486385,
  },
  {
    x: -4.097529, y: -1.548942,
  },
  {
    x: -3.576633, y: -2.337988,
  },
  {
    x: -2.328161, y: -3.133786,
  },
  {
    x: -0.361389, y: -2.588972,
  },
  {
    x: -0.718793, y: -0.578437,
  },
  {
    x: -0.989150, y: 0.163073,
  },
  {
    x: -1.206080, y: 0.528430,
  },
];
const Bosnia = [
  {
    x: -1.292131, y: 3.377805,
  },
  {
    x: -3.324618, y: 1.300220,
  },
  {
    x: -1.172939, y: -1.003832,
  },
  {
    x: 0.380666, y: 0.766479,
  },
];
const Canada = [
  {
    x: -2.053946, y: 2.369228,
  },
  {
    x: -5.574977, y: -1.270321,
  },
  {
    x: -4.001114, y: -3.298729,
  },
  {
    x: -2.923315, y: -3.754708,
  },
  {
    x: -0.152175, y: -2.565482,
  },
  {
    x: 2.985778, y: 0.658768,
  },
  {
    x: 1.366150, y: 2.573597,
  },
  {
    x: -0.075719, y: 2.628606,
  },
];
const Croatia = [
  {
    x: -2.469476, y: 3.070913,
  },
  {
    x: -3.197622, y: -0.202470,
  },
  {
    x: -1.013880, y: 0.234094,
  },
  {
    x: -0.884382, y: 0.819362,
  },
];
const Cyprus = [
  {
    x: 2.823825, y: 1.662874,
  },
  {
    x: 1.645988, y: 3.548167,
  },
  {
    x: 2.151866, y: 1.424123,
  },
];
const CzechRepublic = [
  {
    x: -2.558127, y: 1.562877,
  },
  {
    x: -5.259739, y: -0.023098,
  },
  {
    x: -2.769638, y: -1.216699,
  },
  {
    x: -0.531784, y: -1.089744,
  },
  {
    x: -1.648487, y: 1.473317,
  },
];
const France = [
  {
    x: 0.797047, y: 0.782825,
  },
  {
    x: -1.743407, y: 1.861793,
  },
  {
    x: -4.045423, y: 0.019248,
  },
  {
    x: -5.391178, y: -2.833187,
  },
  {
    x: -1.215174, y: -3.518454,
  },
  {
    x: 1.015838, y: -2.777378,
  },
  {
    x: 0.939932, y: -0.797853,
  },
];
const Germany = [
  {
    x: -4.494293, y: 1.501906,
  },
  {
    x: -4.664580, y: -2.097992,
  },
  {
    x: -2.875924, y: -3.354323,
  },
  {
    x: -2.319722, y: -3.078773,
  },
  {
    x: 0.858935, y: -1.103269,
  },
  {
    x: 0.670967, y: 0.206568,
  },
  {
    x: -1.782171, y: 2.414577,
  },
];
const Greece = [
  {
    x: 2.339255, y: 2.490826,
  },
  {
    x: -1.170816, y: 2.709432,
  },
  {
    x: -0.777233, y: 0.616809,
  },
  {
    x: 0.736584, y: 0.881352,
  },
];
const Hungary = [
  {
    x: -3.668432, y: -1.181706,
  },
  {
    x: -2.393574, y: -1.973066,
  },
  {
    x: -0.685801, y: -0.656453,
  },
  {
    x: 0.079193, y: 0.025151,
  },
  {
    x: -0.376357, y: 1.773728,
  },
  {
    x: -0.885819, y: 2.679338,
  },
  {
    x: -1.882272, y: 2.615852,
  },
  {
    x: -2.628846, y: 2.068333,
  },
];
const Ireland = [
  {
    x: -5.305465, y: -0.456930,
  },
  {
    x: -5.365703, y: -2.351909,
  },
  {
    x: -4.805441, y: -2.888809,
  },
  {
    x: -3.473505, y: -4.117584,
  },
  {
    x: -0.928629, y: -3.706735,
  },
  {
    x: -1.229938, y: -0.758039,
  },
  {
    x: -2.446949, y: 1.084678,
  },
];
const Italy = [
  {
    x: 3.914939, y: 2.138966,
  },
  {
    x: 1.684506, y: 5.326388,
  },
  {
    x: -1.898414, y: 3.820631,
  },
  {
    x: -2.997294, y: 2.438378,
  },
  {
    x: -3.656486, y: -1.241260,
  },
  {
    x: 1.137579, y: -3.066580,
  },
  {
    x: 2.820619, y: -0.926123,
  },
];
const Macedonia = [
  {
    x: -1.899379, y: 0.821876,
  },
  {
    x: -2.601933, y: -0.780975,
  },
  {
    x: -0.348825, y: 1.485115,
  },
  {
    x: -0.167305, y: 1.951931,
  },
];
const Netherlands = [
  {
    x: -0.826204, y: -1.149232,
  },
  {
    x: -2.249344, y: 2.625539,
  },
  {
    x: -4.012322, y: 0.556734,
  },
  {
    x: -4.435496, y: -2.830726,
  },
  {
    x: -2.962506, y: -4.525817,
  },
];
const Norway = [
  {
    x: -3.790403, y: -2.435526,
  },
  {
    x: -1.032444, y: 0.008635,
  },
  {
    x: -2.564920, y: -0.602131,
  },
];
const Poland = [
  {
    x: -3.805820, y: 2.890690,
  },
  {
    x: -4.656686, y: -1.637979,
  },
  {
    x: -2.622306, y: -0.982319,
  },
  {
    x: -0.063111, y: 0.779916,
  },
  {
    x: -1.459711, y: 2.024932,
  },
];
const Portugal = [
  {
    x: -3.318057, y: -2.270575,
  },
  {
    x: -0.689538, y: -4.395281,
  },
  {
    x: 0.767863, y: -3.429436,
  },
  {
    x: 2.347073, y: -1.509910,
  },
  {
    x: 1.251901, y: -0.121739,
  },
  {
    x: -1.043236, y: 1.699210,
  },
  {
    x: -2.863262, y: -0.987965,
  },
];
const Romania = [
  {
    x: -2.250624, y: -1.363143,
  },
  {
    x: -0.620108, y: -1.657407,
  },
  {
    x: 1.528372, y: 1.419777,
  },
  {
    x: 0.799316, y: 3.532207,
  },
  {
    x: -1.124995, y: 3.902360,
  },
  {
    x: -1.916610, y: 2.029713,
  },
];
const Russia = [
  {
    x: -2.929563, y: 2.015955,
  },
  {
    x: -5.645789, y: 0.806481,
  },
  {
    x: -2.775518, y: -0.333551,
  },
  {
    x: -1.806456, y: -0.337016,
  },
  {
    x: -2.382728, y: 0.905100,
  },
];
const Scotland = [
  {
    x: -5.864868, y: -2.668472,
  },
  {
    x: -3.927983, y: -3.795642,
  },
  {
    x: -2.007583, y: -0.923870,
  },
  {
    x: -2.161978, y: -0.609557,
  },
  {
    x: -4.313800, y: -0.921009,
  },
];
const Serbia = [
  {
    x: -1.284438, y: 1.232017,
  },
  {
    x: -0.497755, y: 1.731929,
  },
  {
    x: -0.785316, y: 3.695495,
  },
];
const Spain = [
  {
    x: -3.128937, y: -1.071621,
  },
  {
    x: -3.257032, y: -1.723245,
  },
  {
    x: -1.454798, y: -4.139377,
  },
  {
    x: -0.760888, y: -4.233321,
  },
  {
    x: -0.154069, y: -4.104127,
  },
  {
    x: 2.994920, y: -1.918013,
  },
  {
    x: 0.857500, y: 0.843743,
  },
  {
    x: -1.654164, y: 1.273814,
  },
];
const Sweden = [
  {
    x: 0.261650, y: 0.229333,
  },
  {
    x: -1.292053, y: 0.943602,
  },
  {
    x: -3.639869, y: -0.106994,
  },
  {
    x: -5.004645, y: -2.583457,
  },
  {
    x: -2.749752, y: -1.870251,
  },
];
const SwissFrench = [
  {
    x: -4.717953, y: -0.593363,
  },
  {
    x: -3.866336, y: -3.265778,
  },
  {
    x: -3.095848, y: -3.746892,
  },
  {
    x: -2.118814, y: -4.162975,
  },
  {
    x: -0.116562, y: -3.394014,
  },
  {
    x: 1.117850, y: -2.883467,
  },
  {
    x: 1.951262, y: -0.998734,
  },
  {
    x: 1.251946, y: 1.497424,
  },
  {
    x: -0.118951, y: 2.340054,
  },
  {
    x: -2.630632, y: 2.240970,
  },
  {
    x: -3.780499, y: 1.902082,
  },
];
const SwissGerman = [
  {
    x: 0.964278, y: -0.796554,
  },
  {
    x: -1.223767, y: 2.098841,
  },
  {
    x: -3.996143, y: 1.539677,
  },
  {
    x: -4.768240, y: 0.308857,
  },
  {
    x: -4.957158, y: -1.069278,
  },
  {
    x: -2.987301, y: -2.298295,
  },
  {
    x: -1.526524, y: -2.691553,
  },
  {
    x: -0.503989, y: -2.426145,
  },
];
const SwissItalian = [
  {
    x: -3.410679, y: -0.935617,
  },
  {
    x: -0.313685, y: -1.859413,
  },
  {
    x: 0.785649, y: -1.178756,
  },
  {
    x: 1.916573, y: 0.300041,
  },
  {
    x: 1.076132, y: 2.158879,
  },
  {
    x: 0.865760, y: 2.477404,
  },
  {
    x: -3.127087, y: 0.750600,
  },
];
const Switzerland = [
  {
    x: -3.083392, y: 1.662953,
  },
  {
    x: -4.735398, y: -0.540095,
  },
  {
    x: -4.323113, y: -1.050007,
  },
  {
    x: -3.428277, y: -2.026033,
  },
  {
    x: -2.483035, y: -2.996999,
  },
  {
    x: -0.073740, y: -3.176715,
  },
  {
    x: 1.009546, y: -1.922503,
  },
  {
    x: 0.897084, y: -0.996070,
  },
  {
    x: 0.313401, y: 1.579670,
  },
  {
    x: -1.135349, y: 1.626733,
  },
];
const Turkey = [
  {
    x: -0.646601, y: 2.787556,
  },
  {
    x: 3.138026, y: 2.406538,
  },
  {
    x: 3.103659, y: 2.549876,
  },
  {
    x: 1.343005, y: 3.930565,
  },
  {
    x: -0.082862, y: 4.484449,
  },
];
const USA = [
  {
    x: -4.774319, y: -2.368260,
  },
  {
    x: -3.186467, y: -3.974360,
  },
  {
    x: 1.051440, y: -0.587090,
  },
  {
    x: -0.801020, y: 0.613594,
  },
  {
    x: -3.109714, y: 0.383190,
  },
  {
    x: -3.828213, y: 0.070351,
  },
];
const UnitedKingdom = [
  {
    x: 2.847950, y: -0.267618,
  },
  {
    x: 2.763992, y: 4.856460,
  },
  {
    x:-3.119162, y: 2.232993,
  },
  {
    x: -4.264982, y: 1.038667,
  },
  {
    x: -4.334979, y: 0.953344,
  },
  {
    x: -4.813609, y: 0.057518,
  },
  {
    x: -4.966267, y: -0.265861,
  },
  {
    x: -5.338275, y: -1.327627,
  },
  {
    x: -5.313423, y: -1.923077,
  },
  {
    x: -5.040199, y: -3.082841,
  },
  {
    x: -4.332247, y: -3.743894,
  },
  {
    x: -3.793854, y: -4.017060,
  },
  {
    x: -2.603659, y: -4.308998,
  },
  {
    x: -1.075223, y: -3.459772,
  },
];
const Yugoslavia = [
  {
    x: -0.420563, y: 4.377116,
  },
  {
    x: -3.011733, y: 2.501788,
  },
  {
    x: -2.051840, y: -0.014413,
  },
  {
    x: -0.837723, y: -1.726686,
  },
  {
    x: 1.026449, y: 2.102265,
  },
  {
    x: 1.402686, y: 3.706864,
  },
];
const Gujarati = [
  // {
  //   x: 0.262327, y: 1.721119,
  // },
  {
    x: 4.926417, y: 4.966025,
  },
  {
    x: 3.468338, y: 8.931658,
  },
  {
    x: 1.712337, y: 6.206042,
  },
  // {
  //   x: 0.912682, y: 4.131280,
  // },
];
const Hindi = [
  {
    x: 1.149282, y: 6.488009,
  },
  {
    x: -0.695294, y: 4.564693,
  },
  {
    x: 0.637719, y: 3.235474,
  },
  {
    x: 4.467649, y: 4.499556,
  },
  {
    x: 4.216576, y: 5.217120,
  },
  {
    x: 2.410611, y: 5.994405,
  },
];
const IndianAsian = [
  {
    x: 2.296322, y: 3.234586,
  },
  {
    x: 4.566012, y: 5.172612,
  },
  {
    x: 4.211733, y: 5.713882,
  },
  {
    x: 3.257849, y: 6.309751,
  },
  {
    x: 1.646733, y: 7.257817,
  },
  {
    x: 0.940495, y: 7.078217,
  },
  {
    x: -0.336803, y: 6.720488,
  },
  {
    x: -0.145589, y: 5.017724,
  },
  {
    x: 0.865261, y: 3.643052,
  },
];
const Konkani = [
  {
    x: 3.467446, y: 6.171481,
  },
  {
    x: 1.798737, y: 6.969210,
  },
  {
    x: 2.440022, y: 4.617784,
  },
];
const Punjabi = [
  {
    x: -1.827819, y: 3.050334,
  },
  {
    x: 0.257991, y: 1.532879,
  },
  {
    x: 2.817861, y: 2.771900,
  },
  {
    x: 3.575813, y: 3.803476,
  },
  // {
  //   x: 4.948124, y: 8.226731,
  // },
  {
    x: 0.049454, y: 7.175774,
  },
  {
    x: -1.353051, y: 5.275963,
  },
];
const Urdu = [
  {
    x: -1.076747, y: -1.239178,
  },
  {
    x: 4.932366, y: 3.124910,
  },
  {
    x: 4.110252, y: 6.521630,
  },
  {
    x: 0.598147, y: 7.783064,
  },
  {
    x: -0.337446, y: 3.971708,
  },
];

const continentalView = [
  {
    className: 'East Asian',
    data: EastAsianCourseHull,
    fill: 'EF5D28',
  },
  {
    className: 'South Asian',
    data: SouthAsianCourseHull,
    fill: 'FF9833',
  },
  {
    className: 'Latino',
    data: LatinoCourseHull,
    fill: '1A3177',
  },
  {
    className: 'African American',
    data: AfAmCourseHull,
    fill: '79C7E3',
  },
  {
    className: 'European',
    data: EuropeanCourseHull,
    fill: '12939A',
  },
];
const europeanView = [
  // {
  //   className: 'Albania',
  //   data: Albania,
  //   fill: 'red',
  // },
  // {
  //   className: 'Australia',
  //   data: Australia,
  //   fill: 'orange',
  // },
  // {
  //   className: 'Austria',
  //   data: Austria,
  //   fill: 'yellow',
  // },
  // {
  //   className: 'Belgium',
  //   data: Belgium,
  //   fill: 'green',
  // },
  // {
  //   className: 'United Kingdom',
  //   data: UnitedKingdom,
  //   fill: 'EF5D28',
  // },
  {
    className: 'Bosnia-Herzegovnia',
    data: Bosnia,
    fill: 'F78860',
  },
  // {
  //   className: 'Canada',
  //   data: Canada,
  //   fill: 'purple',
  // },
  {
    className: 'Croatia',
    data: Croatia,
    fill: '1A3177',
  },
  // {
  //   className: 'Cyprus',
  //   data: Cyprus,
  //   fill: 'yellow',
  // },
  // {
  //   className: 'Czech Republic',
  //   data: CzechRepublic,
  //   fill: 'blue',
  // },
  // {
  //   className: 'France',
  //   data: France,
  //   fill: 'green',
  // },
  {
    className: 'Germany',
    data: Germany,
    fill: '79C7E3',
  },
  {
    className: 'Greece',
    data: Greece,
    fill: '12939A',
  },
  // {
  //   className: 'Hungary',
  //   data: Hungary,
  //   fill: 'purple',
  // },
  // {
  //   className: 'Ireland',
  //   data: Ireland,
  //   fill: 'purple',
  // },
  // {
  //   className: 'Italy',
  //   data: Italy,
  //   fill: 'purple',
  // },
  // {
  //   className: 'Macedonia',
  //   data: Macedonia,
  //   fill: 'purple',
  // },
  // {
  //   className: 'Netherlands',
  //   data: Netherlands,
  //   fill: 'purple',
  // },
  // {
  //   className: 'Norway',
  //   data: Norway,
  //   fill: 'purple',
  // },
  // {
  //   className: 'Poland',
  //   data: Poland,
  //   fill: 'purple',
  // },
  {
    className: 'Portugal',
    data: Portugal,
    fill: '0EA356',
  },
  // {
  //   className: 'Romania',
  //   data: Romania,
  //   fill: 'purple',
  // },
  // {
  //   className: 'Russia',
  //   data: Russia,
  //   fill: 'purple',
  // },
  {
    className: 'Scotland',
    data: Scotland,
    fill: 'E8D727',
  },
  // {
  //   className: 'Serbia',
  //   data: Serbia,
  //   fill: 'red',
  // },
  // {
  //   className: 'Spain',
  //   data: Spain,
  //   fill: 'yellow',
  // },
  // {
  //   className: 'Sweden',
  //   data: Sweden,
  //   fill: 'purple',
  // },
  // {
  //   className: 'Swiss-French',
  //   data: SwissFrench,
  //   fill: 'yellow',
  // },
  // {
  //   className: 'Swiss-German',
  //   data: SwissGerman,
  //   fill: 'yellow',
  // },
  // {
  //   className: 'Swiss-Italian',
  //   data: SwissItalian,
  //   fill: 'gray',
  // },
  // {
  //   className: 'Switzerland',
  //   data: Switzerland,
  //   fill: 'green',
  // },
  {
    className: 'Turkey',
    data: Turkey,
    fill: '965D8A',
  },
  // {
  //   className: 'USA',
  //   data: USA,
  //   fill: 'orange',
  // },
  // {
  //   className: 'Yugoslavia',
  //   data: Yugoslavia,
  //   fill: 'yellow',
  // },
];
const SouthAsianView = [
  {
    className: 'Urdu',
    data: Urdu,
    fill: 'F78860',
  },
  {
    className: 'Punjabi',
    data: Punjabi,
    fill: 'E8D727',
  },
  {
    className: 'Gujarati',
    data: Gujarati,
    fill: '0EA356',
  },
  // {
  //   className: 'Hindi',
  //   data: Hindi,
  //   fill: 'green',
  // },
  {
    className: 'Indian Asian',
    data: IndianAsian,
    fill: '79C7E3',
  },
  // {
  //   className: 'Konkani',
  //   data: Konkani,
  //   fill: 'green',
  // },
];

const backgroundMap = {
  continental: continentalView,
  european: europeanView,
  southasian: SouthAsianView,
}

class AncestryPCA extends Component {
  constructor(props) {
    super(props);

    this.state = {
      alleleCount: [],
      showSettingsAlert: false,
      isLoading: true,
      backgroundPops: 'continental',
    };

    this.handleAlertDismiss = this.handleAlertDismiss.bind(this);
    this.handleBackgroundChange = this.handleBackgroundChange.bind(this);
  }

  componentDidMount() {
    const { sample, assumeRefRef } = this.props.settings;
    const queries = queryVariants;

    Promise.all(queries.map(query => this.props.source.variant(
      query.ctg,
      query.pos,
      query.ref,
      query.alt,
      assumeRefRef,
    )))
      .then((variants) => {
        const alleleCount = variants.map((variant, idx) => {
          if (!variant) {
            return undefined;
          }
          const countMatches = variant.genotype(sample).match(new RegExp(queries[idx].counted, 'g'));
          return countMatches ? countMatches.length : 0;
        });
        this.setState({ alleleCount, isLoading: false });

        if (!assumeRefRef && !every(variants)) {
          this.setState({ showSettingsAlert: true });
        }
      });
  }

  handleAlertDismiss() {
    this.setState({ showSettingsAlert: false });
  }

  handleBackgroundChange(evt) {
    this.setState({ backgroundPops: evt.target.value });
  }

  render() {
    const { settings } = this.props;
    const {
      alleleCount,
      showSettingsAlert,
      queryCount,
      isLoading,
      backgroundPops,
    } = this.state;

    let PC1 = undefined, PC2 = undefined;
    if (alleleCount.length === queryVariants.length) {
      PC1 = 0.0;
      PC2 = 0.0;
      alleleCount.forEach((ac, idx) => {
        const {
          avg,
          denom,
          PC1: coeff1,
          PC2: coeff2,
        } = queryVariants[idx];
        const normAC = ac ? (ac - avg) / denom : 0.0;
        PC1 += normAC * coeff1;
        PC2 += normAC * coeff2;
      });
    }
    let myData = [];
    if (!(PC1 === undefined && PC2 === undefined)) {
      myData = [{
        x: PC1, y: PC2, size: 15, style: { fill: '4c4c4c' },
      }];
    }

    // Select background europeanView
    const backgroundView = backgroundMap[backgroundPops] || continentalView;

    return (
      <div>
        <SettingsAlert
          isOpen={showSettingsAlert && !settings.assumeRefRef}
          toggle={this.handleAlertDismiss}
        />
        <Row>
          <Col md={6}>
            <XYPlot
              width={600}
              height={600}
            >
              <VerticalGridLines />
              <HorizontalGridLines />
              <XAxis
                title="PC1"
                position="end"
              />
              <YAxis
                title="PC2"
                position="end"
              />
              { backgroundView.map(country => (
                <PolygonSeries
                  className={country.className}
                  data={country.data}
                  style={{
                      fill: country.fill,
                      stroke: country.fill,
                      strokeWidth: 1.5,
                      fillOpacity: 0.5,
                      strokeOpacity: 0.7,
                    }}
                />
              ))}
              <CustomSVGSeries
                customComponent="diamond"
                data={myData}
              />
              { (isLoading) && (
                <p>
                  Loading your coordinates...
                </p>
              )}
              <BeatLoader
                color="#11bc64"
                loading={isLoading}
              />
            </XYPlot>
          </Col>
          <Col>
            <Row>
              <Col md={6}>
                <Table borderless>
                  <thead>
                    <th></th>
                    <th>Legend</th>
                  </thead>
                  <tbody>
                    { backgroundView.map(country => (
                      <tr>
                        <td>
                          <svg width="15" height="15">
                            <rect
                              width="30"
                              height="30"
                              style={{ fill: country.fill }}
                            />
                          </svg>
                        </td>
                        <td>{country.className}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
            </Row>
          </Col>
          <Col>
            <Input id="backgroundView" type="select" bsSize="sm" value={backgroundPops} onChange={this.handleBackgroundChange}>
              <option key="continental" value="continental">All Continents</option>
              <option key="europe" value="european">European</option>
              <option key="southasian" value="southasian">South Asian</option>
            </Input>
          </Col>
        </Row>
      </div>
    );
  }
}

AncestryPCA.propTypes = {
  settings: settingsPropType.isRequired,
  source: PropTypes.instanceOf(VCFSource).isRequired,
  // trait: PropTypes.shape({
  //   title: PropTypes.string,
  //   variants: PropTypes.arrayOf(PropTypes.shape({ // hg19/b37 variant
  //     ctg: PropTypes.string,
  //     pos: PropTypes.number,
  //     ref: PropTypes.string,
  //     alt: PropTypes.string,
  //   })),
  //   rsId: PropTypes.arrayOf(PropTypes.string),
  //   association: PropTypes.arrayOf(PropTypes.shape({
  //     genotypes: PropTypes.arrayOf(String),
  // // allele/allele (with reference allele first), e.g. C/T
  //     phenotype: PropTypes.string,
  //   })),
  // }).isRequired,
  // children: PropTypes.node.isRequired,
};

export default withSourceAndSettings(AncestryPCA);
