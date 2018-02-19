import { ManagementRequestState } from '@waldur/ansible/common/types/ManagementRequestState';

type PythonManagementRequestStateReadabilityMap = {[key in ManagementRequestState]: string};

export const STATE_READABLE_TEXT_MAPPING: PythonManagementRequestStateReadabilityMap = Object.freeze({
  [ManagementRequestState.OK]: 'OK',
  [ManagementRequestState.ERRED]: 'Erred',
  [ManagementRequestState.CREATION_SCHEDULED]: 'Execution Scheduled',
  [ManagementRequestState.CREATING]: 'Executing',
  // currently not used states
  [ManagementRequestState.UPDATE_SCHEDULED]: 'Update Scheduled',
  [ManagementRequestState.UPDATING]: 'Updating',
  [ManagementRequestState.DELETION_SCHEDULED]: 'Deletion Scheduled',
  [ManagementRequestState.DELETING]: 'Deleting',
});
