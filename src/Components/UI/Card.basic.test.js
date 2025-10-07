import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Card from './Card';

describe('Card Basic Tests', () => {
  it('renders without crashing', () => {
    render(<Card>Test Content</Card>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies default card class', () => {
    render(<Card>Test Content</Card>);
    const cardElement = screen.getByTestId('card');
    expect(cardElement).toHaveClass('card');
  });

  it('handles additional className prop', () => {
    render(<Card className="custom-class">Test Content</Card>);
    const cardElement = screen.getByTestId('card');
    expect(cardElement).toHaveClass('card');
    expect(cardElement).toHaveClass('custom-class');
  });

  it('forwards additional props', () => {
    render(<Card id="test-id">Test Content</Card>);
    const cardElement = screen.getByTestId('card');
    expect(cardElement).toHaveAttribute('id', 'test-id');
  });
});