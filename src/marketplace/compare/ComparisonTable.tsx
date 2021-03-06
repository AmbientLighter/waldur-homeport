import * as React from 'react';

import { range } from '@waldur/core/utils';
import { ComparisonSections } from '@waldur/marketplace/compare/ComparisonSections';
import { COMPARISON_COLUMNS } from '@waldur/marketplace/compare/store/constants';

import { Offering, Section } from '../types';
import { ComparisonItem } from './ComparisonItem';
import { ComparisonItemPlaceholder } from './ComparisonItemPlaceholder';

import './ComparisonTable.scss';

interface ComparisonTableProps {
  items: Offering[];
  sections: Section[];
}

export const ComparisonTable = (props: ComparisonTableProps) => (
  <div className="h-scrollable">
    <table className="table table-bordered table-hover">
      <tbody>
        <tr>
          <td style={{minWidth: '200px'}}/>
          {props.items.map((item, index) => (
            <td key={index} style={{minWidth: '200px'}}>
              <ComparisonItem item={item}/>
            </td>
          ))}
          {props.items.length < 4 && range(COMPARISON_COLUMNS - props.items.length).map(index =>
            <ComparisonItemPlaceholder key={index}/>
          )}
        </tr>
        <ComparisonSections items={props.items}/>
      </tbody>
    </table>
  </div>
);
