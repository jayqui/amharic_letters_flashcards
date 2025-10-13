import { render, screen, waitFor } from '@testing-library/react-native';
import MainMenu from './MainMenu';

describe('MainMenu page', () => {
  it('includes the appropriate buttons', async() => {
    const mockNavigate = () => {};

    render(<MainMenu navigate={mockNavigate}/>);

    await waitFor(() => {
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBe(3);

      expect(screen.getByText('Flashcards')).toBeTruthy();
      expect(screen.getByText('Fidels List')).toBeTruthy();
      expect(screen.getByText('Stats')).toBeTruthy();
    });
  });
});
