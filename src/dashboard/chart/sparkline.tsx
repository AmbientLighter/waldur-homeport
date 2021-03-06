import * as React from 'react';

import { Tooltip } from '@waldur/core/Tooltip';

import './sparkline.scss';
import { ChartData } from './types';

interface Props {
  data: ChartData;
}

const normalizeData = items => {
  const max = Math.max.apply(null, items.map(item => item.value || 1));
  return items.map(item => ({
    label: item.label,
    value: Math.round(item.value * 100 / max),
  }));
};

const SparklineChart = ({ data }: Props) => (
  <figure className="sparkline">
    {normalizeData(data).map((item, index) =>
      <Tooltip key={index} label={item.label} id="sparkline" className="sparkline-column">
        <div className="sparkline-bar" style={{height: `${item.value}%`}}/>
      </Tooltip>
    )}
  </figure>
);

export default SparklineChart;
