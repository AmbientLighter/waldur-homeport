import * as React from 'react';
import * as Tab from 'react-bootstrap/lib/Tab';
import * as Tabs from 'react-bootstrap/lib/Tabs';

import { translate } from '@waldur/i18n';
import { Section, Offering } from '@waldur/marketplace/types';

import { AttributesTable } from './attributes/AttributesTable';
import './OfferingTabs.scss';
import { OverviewTab } from './OverviewTab';
import { ScreenshotsTab } from './ScreenshotsTab';

interface OfferingTabsProps {
  sections: Section[];
  offering: Offering;
}

const getTabs = (props: OfferingTabsProps) => {
  const attributes = props.offering.attributes;
  const filterSection = section => section.attributes.some(attr => props.offering.attributes.hasOwnProperty(attr.key));
  const sections = props.sections.filter(filterSection);

  const basicSections = sections.filter(s => s.is_standalone === false);
  const standaloneSections = sections.filter(s => s.is_standalone === true);

  let tabs = [
    {
      visible: props.offering.full_description,
      title: translate('Description'),
      component: () => <OverviewTab offering={props.offering}/>,
    },
    {
      visible: basicSections.length > 0,
      title: translate('Features'),
      component: () => <AttributesTable attributes={attributes} sections={basicSections}/>,
    },
    {
      visible: props.offering.screenshots.length > 0,
      title: translate('Screenshots'),
      component: () => <ScreenshotsTab screenshots={props.offering.screenshots}/>,
    },
  ];

  standaloneSections.forEach(section => {
    tabs.push({
      visible: true,
      title: section.title,
      component: () => <AttributesTable attributes={attributes} sections={[section]}/>,
    });
  });
  tabs = tabs.filter(tab => tab.visible);
  return tabs;
};

export const OfferingTabs = (props: OfferingTabsProps) => {
  const tabs = getTabs(props);
  if (tabs.length === 0) {
    return null;
  }
  return (
    <Tabs
      defaultActiveKey="tab-0"
      id="tabs"
      className="m-t-lg offering-tabs"
      unmountOnExit={true}
    >
      {tabs.map((tab, index) => (
        <Tab key={index} eventKey={`tab-${index}`} title={tab.title}>
          <div className="m-t-md">
            {tab.component()}
          </div>
        </Tab>
      ))}
    </Tabs>
  );
};
