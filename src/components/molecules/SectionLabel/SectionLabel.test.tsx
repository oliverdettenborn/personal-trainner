import { render } from '@testing-library/react-native';
import React from 'react';

import { SectionLabel } from './SectionLabel';

describe('SectionLabel', () => {
  it('renders the children text', () => {
    const { getByText } = render(<SectionLabel>Test Section</SectionLabel>);
    expect(getByText('Test Section')).toBeTruthy();
  });
});
