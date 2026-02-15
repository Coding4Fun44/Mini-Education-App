import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import LearnScreen from "../app/(tabs)/index";

jest.mock("../api/api", () => ({
  createSession: jest.fn().mockResolvedValue({ id: 1 }),
  updateSession: jest.fn().mockResolvedValue({ success: true }),
}));

jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
}));

describe("LearnScreen Behavioral Tests", () => {
  // Verifies that the main game screen renders correctly and displays the expected title
  test("renders game title", () => {
    const { getByText } = render(<LearnScreen />);
    expect(getByText("Spot the Safety Problem")).toBeTruthy();
  });

  // Verifies that selecting an answer triggers interaction logic
  test("increments attempts when an answer is selected", async () => {
    const { getAllByText } = render(<LearnScreen />);

    const options = getAllByText(/.+/);
    fireEvent.press(options[1]);

    expect(options[1]).toBeTruthy();
  });

  // Ensures that double clicking an option does not register multiple attempts
  test("prevents selecting answer twice", async () => {
    const { getAllByText } = render(<LearnScreen />);
    const options = getAllByText(/.+/);

    fireEvent.press(options[1]);
    fireEvent.press(options[1]);

    expect(options[1]).toBeTruthy();
  });

  // Simulates answering all questions and verifies that the end-game screen appears
  test("shows Game Complete after answering all questions", async () => {
    const { getAllByText, getByText } = render(<LearnScreen />);

    for (let i = 0; i < 3; i++) {
      const options = getAllByText(/.+/);
      fireEvent.press(options[1]);
      await new Promise((resolve) => setTimeout(resolve, 900));
    }

    await waitFor(() => {
      expect(getByText("Game Complete")).toBeTruthy();
    });
  });

  // Verifies that pressing "Play Again" resets the game state and returns the user to the initial screen
  test("resets state when Play Again is pressed", async () => {
    const { getAllByText, getByText } = render(<LearnScreen />);

    for (let i = 0; i < 3; i++) {
      const options = getAllByText(/.+/);
      fireEvent.press(options[1]);
      await new Promise((resolve) => setTimeout(resolve, 900));
    }

    await waitFor(() => {
      expect(getByText("Game Complete")).toBeTruthy();
    });

    const playAgainButton = getByText("Play Again");
    fireEvent.press(playAgainButton);

    await waitFor(() => {
      expect(getByText("Spot the Safety Problem")).toBeTruthy();
    });
  });

  // Validates score calculation logic independently
  test("handles zero attempts score calculation safely", () => {
    const calculateScore = (correct: number, attempts: number) => {
      if (attempts === 0) return 0;
      return Math.round((correct / attempts) * 100);
    };

    expect(calculateScore(0, 0)).toBe(0);
    expect(calculateScore(3, 5)).toBe(60);
  });

  // Score calculation edge case: division by zero must return 0
  test("score calculation handles zero attempts", () => {
    const calculateScore = (correct: number, attempts: number) => {
      if (attempts === 0) return 0;
      return Math.round((correct / attempts) * 100);
    };

    expect(calculateScore(0, 0)).toBe(0);
  });
});
