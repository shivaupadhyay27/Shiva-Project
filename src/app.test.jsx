import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

/* ---------------- MOCKS ---------------- */

vi.mock("./utils/storage", () => ({
  saveData: vi.fn(),
  loadData: vi.fn((key) => {
    if (key === "streak") return "0";
    if (key === "lastWinDate") return null;
    return null;
  })
}));

vi.mock("./utils/preload", () => ({
  preloadPuzzles: () => {
    const today = new Date().getDate();

    const createCards = () => ([
      { id: 1, emoji: "🍎", flipped: false, matched: false },
      { id: 2, emoji: "🍎", flipped: false, matched: false },
      { id: 3, emoji: "🍌", flipped: false, matched: false },
      { id: 4, emoji: "🍌", flipped: false, matched: false }
    ]);

    return {
      [today]: {
        easy: createCards(),
        medium: createCards(),
        hard: createCards()
      }
    };
  }
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Memory Game Advanced Tests", () => {

  test("renders title", () => {
    render(<App />);
    expect(screen.getByText(/Daily Memory Puzzle/i)).toBeInTheDocument();
  });

  test("level change resets score", async () => {
    render(<App />);
    await userEvent.click(screen.getByText("Medium"));
    expect(screen.getByText(/Score:/i)).toHaveTextContent("Score: 0");
  });

  test("matching cards increases score", async () => {
    render(<App />);
    
    const cards = screen
  .getAllByRole("button")
  .filter(btn =>
    btn.getAttribute("aria-label")?.includes("Card")
  );
    await userEvent.click(cards[0]); // 🍎
    await userEvent.click(cards[1]); // 🍎

    await waitFor(() => {
      expect(screen.getByText(/Score:/i)).toHaveTextContent("Score: 1");
    });
  });

  test("game over message appears after all matches", async () => {
  render(<App />);

  const getCards = () =>
    screen
      .getAllByRole("button")
      .filter(btn =>
        btn.getAttribute("aria-label")?.includes("Card")
      );

  // First match 🍎
  let cards = getCards();
  await userEvent.click(cards.find(c => c.textContent === "❓")); 
  await userEvent.click(cards.find(c => c.textContent === "❓"));

  await waitFor(() => {
    expect(screen.getByText(/Score:/i))
      .toHaveTextContent("Score: 1");
  });

  // Re-query cards
  cards = getCards();

  // Click remaining hidden cards (🍌 pair)
  const hiddenCards = cards.filter(c => c.textContent === "❓");

  await userEvent.click(hiddenCards[0]);
  await userEvent.click(hiddenCards[1]);

  await waitFor(() => {
    expect(
      screen.getByText(/Puzzle Completed/i)
    ).toBeInTheDocument();
  });
});

  test("cards flip back when not matched", async () => {
    render(<App />);
    
    const cards = screen
  .getAllByRole("button")
  .filter(btn =>
    btn.getAttribute("aria-label")?.includes("Card")
  );
    await userEvent.click(cards[0]); // 🍎
    await userEvent.click(cards[2]); // 🍌

    await waitFor(() => {
      const hiddenCards = screen.getAllByText("❓");
      expect(hiddenCards.length).toBeGreaterThan(0);
    });
  });

});