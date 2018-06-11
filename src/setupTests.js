import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// TODO: Remove enzyme-context-patch when update Enzyme adapter
// is available with Context support, per https://github.com/airbnb/enzyme/pull/1513
configure({ adapter: new Adapter() });
