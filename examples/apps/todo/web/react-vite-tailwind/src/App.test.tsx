import App from "./App";
import { render, screen, userEvent } from "./utils/test-utils";

describe("App component", () => {
  it("should render header component", () => {
    render(<App />);
    const headerTitle = screen.getByText("All todos");
    expect(headerTitle).toBeInTheDocument();
  });

  it("should open dialog on click of Create new", async () => {
    render(<App />);
    userEvent.click(screen.getByTestId("create-new-btn"));
    expect(await screen.findAllByText(/Create A New Task/i)).toBeTruthy();
  });
});
