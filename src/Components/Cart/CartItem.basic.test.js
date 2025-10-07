import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CartItem from './CartItem';

const mockProps = {
  price: 12.99,
  name: 'Test Item',
  amount: 2,
  description: 'Test description',
  onRemove: jest.fn(),
  onAdd: jest.fn(),
};

describe('CartItem Basic Tests', () => {
  it('renders without crashing', () => {
    render(<CartItem {...mockProps} />);
    expect(screen.getByText('Test Item')).toBeInTheDocument();
  });

  it('displays price correctly', () => {
    render(<CartItem {...mockProps} />);
    expect(screen.getByText('$12.99 each')).toBeInTheDocument();
  });

  it('displays total price correctly', () => {
    render(<CartItem {...mockProps} />);
    expect(screen.getByText('$25.98')).toBeInTheDocument();
  });

  it('displays quantity correctly', () => {
    render(<CartItem {...mockProps} />);
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});