import { render, screen } from '@testing-library/react-native';
import MainMenu from "./MainMenu"

describe("MainMenu page", () => {
    it("includes the appropriate buttons", () => {
        const mockNavigate = () => {};
        render(<MainMenu navigate={mockNavigate}/>);

        const buttons = screen.getAllByRole("button")
        expect(buttons.length).toBe(3);
        
        expect(screen.getByText("Flashcards")).toBeTruthy()
        expect(screen.getByText("Fidels List")).toBeTruthy()
        expect(screen.getByText("Stats")).toBeTruthy()
    });
});
