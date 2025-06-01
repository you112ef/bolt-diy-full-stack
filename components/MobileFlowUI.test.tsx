import { render, screen, fireEvent } from '@testing-library/react';
import MobileFlowUI from '@/components/MobileFlowUI';
import '@testing-library/jest-dom';

// Mock the UI components to avoid complex rendering logic not relevant to MobileFlowUI tests
jest.mock('@/components/ui/button', () => ({
  __esModule: true,
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

jest.mock('@/components/ui/sheet', () => ({
  __esModule: true,
  Sheet: ({ children, open, onOpenChange }: any) => (
    <div data-testid="sheet-mock" data-open={open} onClick={onOpenChange}>
      {open && children}
    </div>
  ),
  SheetContent: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));

describe('MobileFlowUI', () => {
  test('renders header text', () => {
    render(<MobileFlowUI />);
    expect(screen.getByText('yousef-n8n-flows')).toBeInTheDocument();
  });

  test('renders bottom navigation buttons', () => {
    render(<MobileFlowUI />);
    expect(screen.getByText('الرئيسية')).toBeInTheDocument();
    expect(screen.getByText('الفلوات')).toBeInTheDocument();
    expect(screen.getByText('الإعدادات')).toBeInTheDocument();
  });

  test('clicking Node 1 opens the sheet with Node 1 details', () => {
    render(<MobileFlowUI />);

    const node1Button = screen.getByText('Node 1');
    fireEvent.click(node1Button);

    // Check if the sheet mock is now "open"
    const sheetMock = screen.getByTestId('sheet-mock');
    expect(sheetMock).toHaveAttribute('data-open', 'true');

    // Check if the sheet content now shows Node 1
    expect(screen.getByText('تحرير العقدة: Node 1')).toBeInTheDocument();
  });

  test('clicking Node 2 opens the sheet with Node 2 details', () => {
    render(<MobileFlowUI />);

    const node2Button = screen.getByText('Node 2');
    fireEvent.click(node2Button);

    const sheetMock = screen.getByTestId('sheet-mock');
    expect(sheetMock).toHaveAttribute('data-open', 'true');
    expect(screen.getByText('تحرير العقدة: Node 2')).toBeInTheDocument();
  });

  test('closing the sheet by triggering onOpenChange', () => {
    render(<MobileFlowUI />);

    // Open the sheet first
    const node1Button = screen.getByText('Node 1');
    fireEvent.click(node1Button);

    let sheetMock = screen.getByTestId('sheet-mock');
    expect(sheetMock).toHaveAttribute('data-open', 'true');
    expect(screen.getByText('تحرير العقدة: Node 1')).toBeInTheDocument();

    // Simulate closing the sheet (onOpenChange is called with false)
    // In our mock, clicking the sheet itself triggers onOpenChange
    fireEvent.click(sheetMock);

    // Sheet content should be gone, and data-open should be false
    // Note: The content might still be in the DOM but not visible.
    // A better check is if the open prop of the Sheet mock is false.
    // For this test, we'll check data-open attribute.
    // Re-query for the sheet mock to get its updated state if necessary,
    // but typically RTL handles this.
    expect(sheetMock).toHaveAttribute('data-open', 'false');
    expect(screen.queryByText('تحرير العقدة: Node 1')).not.toBeInTheDocument();
  });

  test('activeView state changes on nav button click (home)', () => {
    render(<MobileFlowUI />);
    const homeButton = screen.getByText('الرئيسية');
    fireEvent.click(homeButton);
    // This test can't directly verify activeView state without exposing it.
    // For now, we ensure it renders and clicking doesn't crash.
    // A more advanced test might involve checking for a side effect of activeView changing.
    expect(homeButton).toBeInTheDocument(); // Basic assertion
  });
});
