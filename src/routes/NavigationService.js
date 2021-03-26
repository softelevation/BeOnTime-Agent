import * as React from 'react';

export const navigationRef = React.createRef();

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}
export function resetNav(name, params) {
  navigationRef.current?.reset({
    routes: [{name, params}],
  });
}
