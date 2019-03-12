import React, { Suspense } from 'react';
import { useActions, useMappedState } from 'typeless';
import { MainActions, ViewType } from '../interface';

const SubA = React.lazy(() => import('../../subA/module'));
const SubB = React.lazy(() => import('../../subB/module'));
const SubC = React.lazy(() => import('../../subC/module'));

export function MainView() {
  const { show } = useActions(MainActions);
  const { viewType } = useMappedState(state => state.main);

  const renderContent = () => {
    switch (viewType) {
      case 'subA': {
        return <SubA />;
      }
      case 'subB': {
        return <SubB />;
      }
      case 'subC': {
        return <SubC />;
      }
    }
  };

  return (
    <div
      style={{
        width: 400,
        height: 500,
        display: 'flex',
        flexDirection: 'column',
        alignContent: 'center',
        margin: '80px auto',
        textAlign: 'center',
      }}
    >
      Show View:{' '}
      <select
        value={viewType || ''}
        onChange={e => show(e.target.value as ViewType)}
        placeholder="---"
      >
        <option disabled value="">
          -- select --
        </option>
        <option value="subA">Module A</option>
        <option value="subB">Module B</option>
        <option value="subC">Module C</option>
      </select>
      <div style={{ padding: 15 }}>
        <Suspense fallback={<div>Loading...</div>}>{renderContent()}</Suspense>
      </div>
      <div style={{ marginTop: 120, fontSize: 12 }}>
        Open Dev Tools, and change Network speed to "Slow 3G".
        <br />
        Choose an option from the above select.
      </div>
    </div>
  );
}
