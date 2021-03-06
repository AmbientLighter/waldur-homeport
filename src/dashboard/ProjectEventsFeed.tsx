import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { $state } from '@waldur/core/services';
import { showEventTypes, showEventDetails } from '@waldur/events/actions';
import { fetchEvents } from '@waldur/events/api';
import { TranslateProps } from '@waldur/i18n';
import { connectTable, TableState } from '@waldur/table-react';
import { getProject } from '@waldur/workspace/selectors';

import { DashboardFeed } from './DashboardFeed';
import { Project } from './types';

interface OwnProps {
  project: Project;
}

interface DispatchProps {
  showTypes(): void;
  showDetails(event: object): void;
}

interface ProjectEventsFeedProps extends OwnProps, DispatchProps, TranslateProps, TableState {
  fetch: () => void;
  rows: any[];
}

class PureProjectEventsFeed extends React.Component<ProjectEventsFeedProps> {
  componentDidMount() {
    this.props.fetch();
  }

  componentDidUpdate(prevProps: ProjectEventsFeedProps) {
    if (this.props.project !== prevProps.project) {
      this.props.fetch();
    }
  }

  render() {
    const { props } = this;
    return (
      <DashboardFeed
        translate={props.translate}
        title={props.translate('Events')}
        typesTitle={props.translate('Event types')}
        emptyText={props.translate('No events yet.')}
        listLink={$state.href('project.events', { uuid: props.project.uuid })}
        loading={props.loading}
        items={props.rows}
        showTypes={props.showTypes}
        showDetails={props.showDetails}
      />
    );
  }
}

const TableOptions = {
  table: 'projectEvents',
  fetchData: fetchEvents,
  getDefaultFilter: state => ({
    exclude_extra: true,
    scope: getProject(state).url,
  }),
};

const mapDispatchToProps = dispatch => ({
  showTypes: () => dispatch(showEventTypes()),
  showDetails: event => dispatch(showEventDetails(event)),
});

export const ProjectEventsFeed = compose(
  connect<{}, DispatchProps, OwnProps>(null, mapDispatchToProps),
  connectTable(TableOptions),
)(PureProjectEventsFeed);
