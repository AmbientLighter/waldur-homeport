import * as moment from 'moment';

import { dictToList } from '@waldur/core/utils';
import { translate } from '@waldur/i18n';

import * as constants from './constants';
import { getRegisteredQuota } from './registry';

export const sortObjecstByProp =
  (propName: string) =>
    (objects: Array<{ [key: string]: string }>, locale?: string | string[], options?: { [key: string]: string | boolean }) =>
      [...objects].sort((a, b) => a[propName].localeCompare(b[propName], locale, options));

export const sortQuotasByLabel = sortObjecstByProp('label');

export const sortProjectsByName = sortObjecstByProp('name');

export const quotasRegitryFilter = quotas => quotas.filter(quota => !!getRegisteredQuota(quota.name));

export const setQuotasLabel = quotas => quotas.map(quota => ({
  ...quota,
  label: getRegisteredQuota(quota.name) ? getRegisteredQuota(quota.name).label : '',
}));

export const setHistoryQuotasName = quotas => quotas.map(quota => {
  const { data = [] } = quota;
  for (const item of data) {
    if (item.object && item.object.name) {
      return {
        ...quota,
        name: item.object.name,
      };
    }
  }
  return quota;
});

export const getPieChartsData = quotas => quotas.map(quota => ({
  id: quota.uuid[0],
  limit: quota.limit,
  label: quota.label,
  exceeds: isQuotaExceeds(quota),
  options: {
    color: [constants.chartColors.orange, constants.chartColors.blue],
    title: {
      text: quota.label,
    },
    tooltip: {},
    series: [
      {
        name: quota.label,
        type: 'pie',
        legendHoverLink: false,
        hoverAnimation: false,
        hoverOffset: 0,
        clockwise: false,
        labelLine: {
          show: false,
        },
        data: [
          {
            name: translate('Usage'),
            value: quota.usage,
          },
          {
            name: translate('Remaining limit'),
            value: quota.limit > 0 ? quota.limit - quota.usage : 0,
          },
        ],
      },
    ],
  },
}));

export const getBarChartsData = quotas => quotas.map(quota => {
  if (!quota.data) { return quota; }
  const dateData = [];
  const limitData = [];
  const usageData = [];
  for (const item of quota.data) {
    const { point, object: { limit, usage } = { limit: 0, usage: 0 } } = item;
    dateData.push(moment(point * 1000).format('Do MMMM'));
    limitData.push(limit === -1 ? 0 : limit);
    usageData.push(usage);
  }
  return {
    id: quota.uuid[0],
    label: quota.label,
    loading: quota.loading,
    erred: quota.erred,
    exceeds: isQuotaExceeds(quota.data.slice(-1)[0].object),
    options: {
      color: [constants.chartColors.orange, constants.chartColors.blue],
      title: {
        text: quota.label,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      toolbox: {
        show: true,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
          restore: { show: true },
          saveAsImage: { show: true },
        },
      },
      calculable: true,
      xAxis: [
        {
          type: 'category',
          axisTick: { show: false },
          data: dateData,
        },
      ],
      yAxis: [
        {
          type: 'value',
        },
      ],
      series: [
        {
          name: translate('Usage'),
          type: 'bar',
          barGap: 0,
          data: usageData,
        },
        {
          name: translate('Limit'),
          type: 'bar',
          barGap: 0,
          data: limitData,
        },
      ],
    },
  };
});

export const isQuotaExceeds = quota => quota.limit >= 0 && quota.limit <= quota.usage;

export const getExceededQuotas = quotas => {
  const exceededQuotas = [];
  for (const quota of quotas) {
    if (!isQuotaExceeds(quota)) { continue; }
    exceededQuotas.push(quota);
  }
  return exceededQuotas;
};

export const formatFilter = vmFilter => {
  const vmFilterCopy = { ...vmFilter };
  if (vmFilter && vmFilter.service_provider) {
    vmFilterCopy.service_provider = vmFilter.service_provider.map(provider => provider.value);
    return vmFilterCopy;
  }
  return vmFilter;
};

export const formatServiceProviders = serviceProviders => {
  return serviceProviders.map(serviceProvider => {
    return {
      value: serviceProvider.uuid,
      name: serviceProvider.name,
    };
  });
};

export const mergeQuotas = (quotaA, quotaB) => {
  if (!quotaA && !quotaB) { return null; }
  if (!quotaA) { return quotaB; }
  if (!quotaB) { return quotaA; }
  return {
    ...quotaA,
    uuid: Array.isArray(quotaA.uuid) ?
      [
        ...quotaA.uuid,
        quotaB.uuid,
      ] :
      [
        quotaA.uuid,
        quotaB.uuid,
      ],
    limit: quotaB.limit > -1 ?
      (quotaA.limit > -1 ? quotaA.limit + quotaB.limit : quotaB.limit) :
      quotaA.limit,
    usage: quotaA.usage + quotaB.usage,
  };
};

export const combineQuotas = quotas => {
  const combinedQuotas = {};
  for (const currQuotas of quotas) {
    for (const quota of currQuotas) {
      const combinedQuota = combinedQuotas[quota.name];
      if (combinedQuota) {
        combinedQuotas[quota.name] = mergeQuotas(combinedQuota, quota);
      } else {
        combinedQuotas[quota.name] = {
          ...quota,
          uuid: [quota.uuid],
        };
      }
    }
  }
  return dictToList(combinedQuotas);
};

export const combineHistoryQuotas = quotas => {
  const combinedQuotas = {};
  for (const currQuotas of dictToList(quotas)) {
    for (const quota of dictToList(currQuotas)) {
      if (!quota || !quota.name || quota.loading) { return null; }
      const combinedQuota = combinedQuotas[quota.name];
      if (combinedQuota) {
        const data = combinedQuota.data.map((timePointQuota, index) => ({
          ...timePointQuota,
          object: mergeQuotas(timePointQuota.object, quota.data[index].object),
        }));
        combinedQuotas[quota.name] = {
          ...combinedQuota,
          uuid: [
            ...combinedQuota.uuid,
            quota.uuid,
          ],
          data,
        };
      } else {
        combinedQuotas[quota.name] = {
          ...quota,
          uuid: [quota.uuid],
        };
      }
    }
  }
  return dictToList(combinedQuotas);
};
