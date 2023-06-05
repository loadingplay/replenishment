import { configure } from 'enzyme';
import Adapter from '@cfaester/enzyme-adapter-react-18';

global.___loader = {
  enqueue: jest.fn(),
}

configure({ adapter: new Adapter() });
