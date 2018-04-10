import { ResourceAction, ActionField } from '@waldur/resource/actions/types';

function createMap(items: ActionField[]) {
  return items.reduce((map, item) => ({...map, [item.key]: item}), {});
}

function mergeFields(xs: ActionField[], ys: ActionField[]): ActionField[] {
  if (!ys || !xs) {
    return ys || xs;
  }

  const xmap = createMap(xs);
  const ymap = createMap(ys);

  return [
    ...xs.map(item => ymap[item.key] || item),
    ...ys.filter(item => !xmap[item.key]),
  ];
}

export function mergeActions(xs: ResourceAction, ys: any): ResourceAction {
  const fields = mergeFields(xs.fields, ys.fields);
  return {...xs, ...ys, fields };
}
