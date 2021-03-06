import { mount } from 'enzyme';
import * as React from 'react';

import SparklineChart from './sparkline';

describe('SparklineChart', () => {
  const getColumns = wrapper => wrapper.find('span.sparkline-column');
  const getBars = wrapper => wrapper.find('.sparkline-bar');

  it('renders empty figure if list is empty', () => {
    const data = [];
    const wrapper = mount(<SparklineChart data={data}/>);
    expect(getColumns(wrapper).length).toBe(0);
  });

  it('renders two columns with proportional height', () => {
    const data = [
      {
        value: 1,
        label: 'January',
      },
      {
        value: 2,
        label: 'February',
      },
    ];
    const wrapper = mount(<SparklineChart data={data}/>);
    expect(getColumns(wrapper).length).toBe(2);
    expect(getBars(wrapper).at(0).prop('style').height).toBe('50%');
    expect(getBars(wrapper).at(1).prop('style').height).toBe('100%');
  });
});
